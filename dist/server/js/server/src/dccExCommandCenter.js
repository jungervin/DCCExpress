"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DCCExCommandCenter = void 0;
const console_1 = require("console");
const dcc_1 = require("../../common/src/dcc");
const commandcenter_1 = require("./commandcenter");
const ws_1 = require("./ws");
class DCCExCommandCenter extends commandcenter_1.CommandCenter {
    constructor(name) {
        super(name);
        // type: CommandCenterTypes | undefined;
        this.buffer = [];
        this.power = false;
        this._data = "";
    }
    put(msg) {
        // Mutex??
        (0, console_1.log)(`DCCEx ${this.name} put: ${msg}`);
        this.buffer.push(msg);
    }
    getConnectionString() {
        throw new Error("Method not implemented.");
    }
    // locos: { [address: number]: number; };
    // turnouts: { [address: number]: iTurnoutInfo; };
    trackPower(on) {
        (0, console_1.log)("DCCEx ", `trackPower(${on})`);
        this.put(on ? '<1>' : '<0>');
    }
    emergenyStop(stop) {
        this.put('<!>');
    }
    setLocoFunction(address, fn, on) {
        // <F cab funct state> - Turn loco decoder functions ON or OFF
        // 6 Response: <l cab reg speedByte functMap>
        //throw new Error("Method not implemented.");
        this.put(`<F ${address} ${fn} ${on ? 1 : 0}`);
    }
    clientConnected() {
        //throw new Error("Method not implemented.");
    }
    getLoco(address) {
        // <t cab>
        this.put(`<t ${address}>`);
    }
    setLoco(address, speed, direction) {
        // <t cab speed dir>
        this.put(`<t ${address} ${speed} ${direction}>`);
    }
    start() {
        this._data = "";
    }
    stop() {
        //throw new Error("Method not implemented.");
    }
    setTurnout(address, closed) {
        // <T id state>
        this.put(`<T ${address} ${closed ? dcc_1.DCCExTurnout.closed : dcc_1.DCCExTurnout.open}>`);
    }
    getTurnout(address) {
        // <H id state>
        //throw new Error("Method not implemented.");
        //this.buffer.push(`<t ${address} ${closed ? DCCExTurnout.closed : DCCExTurnout.open}>`)
    }
    // 'a': // ACCESSORY <a ADDRESS SUBADDRESS ACTIVATE [ONOFF]> or <a LINEARADDRESS ACTIVATE>
    setAccessoryDecoder(address, on) {
        dcc_1.accessories[address] = { address: address, value: on };
        var msg = `<a ${address} ${on ? 1 : 0}>`;
        this.buffer.push(msg);
        // Accessory
        const turnoutInfo = { address: address, isClosed: on };
        (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.turnoutInfo, data: turnoutInfo });
    }
    getAccessoryDecoder(address) {
        const a = dcc_1.accessories[address];
    }
    getRBusInfo() {
        //throw new Error("Method not implemented.");
    }
    getSystemState() {
        //throw new Error("Method not implemented.");
    }
    parse(data) {
        console.log("DCCEx Parse:", data);
        if (data != "# 50") {
            console.log('tcpClient Data: ', data);
        }
        if (data.startsWith('p1')) {
            this.power = true;
            //io.emit("resPower", true)
        }
        else if (data.startsWith('p0')) {
            this.power = false;
            //io.emit("resPower", false)
        }
        else if (data.startsWith("Q ")) {
            var params = data.replace(">", "").split(" ");
            console.log('tcpClient Data: processSensor');
            var address = parseInt(params[1]);
        }
        else if (data.startsWith("q ")) {
            var params = data.replace(">", "").split(" ");
            var address = parseInt(params[1]);
            //processSensor(addr);
            //var sensor = getSensor(addr)
        }
        else if (data.startsWith('l')) {
            console.log("TCP Rec:", data);
            var items = data.split(" ");
            var address = parseInt(items[1]);
            var speedByte = parseInt(items[3]);
            var funcMap = parseInt(items[4]);
            var direction = dcc_1.DCCExDirections.forward;
            //var loco = locos[address] // this.getLoco(addr)
            //if (loco) 
            {
                var newSpeed = 0;
                //loco.funcMap = funcMap
                if ((speedByte >= 2) && (speedByte <= 127)) {
                    newSpeed = speedByte - 1;
                    direction = dcc_1.DCCExDirections.reverse;
                }
                else if ((speedByte >= 130) && (speedByte <= 255)) {
                    newSpeed = speedByte - 129;
                    direction = dcc_1.DCCExDirections.forward;
                }
                else if (speedByte == 0) {
                    newSpeed = 0;
                    direction = dcc_1.DCCExDirections.reverse;
                }
                else if (speedByte == 128) {
                    newSpeed = 0;
                    direction = dcc_1.DCCExDirections.forward;
                }
                else {
                    //loco.speed = 0;
                }
                //loco.speed = newSpeed
                var loco = { address: address, speed: newSpeed, direction: direction, funcMap: funcMap };
                (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.locoInfo, data: loco });
                (0, console_1.log)("BROADCAST Z21 LOCO INFO:", loco);
                // for (var i = 0; i <= 28; i++) {
                //     var func = loco.functions.find(f => f.index == i)
                //     if (func) {
                //         func.isOn = ((loco.funcMap >> i) & 0x1) > 0;
                //     }
                // }
            }
        }
        else if (data.startsWith('H')) {
            var items = data.split(" ");
            var address = parseInt(items[1]);
            var closed = parseInt(items[2]);
            var t = { address: address, isClosed: closed == 0 };
            (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.turnoutInfo, data: t });
        }
        else if (data == "X") {
            console.log("A művelet nem sikerült!");
            var d = { type: dcc_1.ApiCommands.UnsuccessfulOperation, data: "DCCEx Unsuccessful Operation!" };
            (0, ws_1.broadcastAll)(d);
        }
    }
    connected() {
        this.buffer.push('<T>');
    }
    received(buffer) {
        var msg = buffer.toString();
        console.log("TCP RECEIVED:", msg);
        for (var i = 0; i < msg.length; i++) {
            var c = msg[i];
            if (c == ">") {
                this.parse(this._data);
                this._data = "";
            }
            else if (c == "<" || c == "\n" || c == "\r") {
                this._data = "";
                continue;
            }
            else {
                this._data += c;
            }
        }
    }
}
exports.DCCExCommandCenter = DCCExCommandCenter;
//# sourceMappingURL=dccExCommandCenter.js.map