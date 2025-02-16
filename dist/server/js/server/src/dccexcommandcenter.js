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
    getConnectionString() {
        throw new Error("Method not implemented.");
    }
    // locos: { [address: number]: number; };
    // turnouts: { [address: number]: iTurnoutInfo; };
    trackPower(on) {
        (0, console_1.log)("DCCEx ", `trackPower(${on})`);
        this.buffer.push('<p>');
    }
    emergenyStop(stop) {
        (0, console_1.log)("DCCEx ", `emergenyStop(${stop})`);
        this.buffer.push('<p>');
    }
    setLocoFunction(address, fn, on) {
        // <F cab funct state> - Turn loco decoder functions ON or OFF
        // 6 Response: <l cab reg speedByte functMap>
        //throw new Error("Method not implemented.");
    }
    clientConnected() {
        //throw new Error("Method not implemented.");
    }
    getLoco(address) {
        // <t cab>
        this.buffer.push(`<t ${address}>`);
    }
    setLoco(address, speed, direction) {
        // <t cab speed dir>
        this.buffer.push(`<t ${address} ${speed} ${direction}>`);
    }
    start() {
        this._data = "";
    }
    stop() {
        //throw new Error("Method not implemented.");
    }
    setTurnout(address, closed) {
        // <T id state>
        var msg = `<T ${address} ${closed ? dcc_1.DCCExTurnout.closed : dcc_1.DCCExTurnout.open}>`;
        console.log("DCCEx setTurnout:", msg);
        this.buffer.push(msg);
    }
    getTurnout(address) {
        // <H id state>
        //throw new Error("Method not implemented.");
        //this.buffer.push(`<t ${address} ${closed ? DCCExTurnout.closed : DCCExTurnout.open}>`)
    }
    setAccessoryDecoder(address, on) {
        dcc_1.accessories[address] = { address: address, value: on };
        var msg = `<a ${address} ${on ? 1 : 0}>`;
        console.log("setAccessoryDecoder:", msg);
        this.buffer.push(msg);
    }
    getAccessoryDecoder(address) {
        const a = dcc_1.accessories[address];
        //throw new Error("Method not implemented.");
        this.buffer.push(`<t ${address} ${closed ? dcc_1.DCCExTurnout.closed : dcc_1.DCCExTurnout.open}>`);
    }
    getRBusInfo() {
        //throw new Error("Method not implemented.");
        //        this.buffer.push(`<t ${address} ${closed ? DCCExTurnout.closed : DCCExTurnout.open}>`)
    }
    getSystemState() {
        //throw new Error("Method not implemented.");
        //      this.buffer.push(`<t ${address} ${closed ? DCCExTurnout.closed : DCCExTurnout.open}>`)
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
            var addr = parseInt(params[1]);
        }
        else if (data.startsWith("q ")) {
            var params = data.replace(">", "").split(" ");
            var addr = parseInt(params[1]);
            //processSensor(addr);
            //var sensor = getSensor(addr)
        }
        else if (data.startsWith('l')) {
            console.log("TCP Rec:", data);
            var items = data.split(" ");
            var addr = parseInt(items[1]);
            var speedByte = parseInt(items[3]);
            var funcMap = parseInt(items[4]);
            var loco = dcc_1.locos[addr]; // this.getLoco(addr)
            if (loco) {
                var newSpeed = 0;
                loco.funcMap = funcMap;
                if ((speedByte >= 2) && (speedByte <= 127)) {
                    newSpeed = speedByte - 1;
                    loco.direction = dcc_1.DCCExDirections.reverse;
                }
                else if ((speedByte >= 130) && (speedByte <= 255)) {
                    newSpeed = speedByte - 129;
                    loco.direction = dcc_1.DCCExDirections.forward;
                }
                else if (speedByte == 0) {
                    newSpeed = 0;
                    loco.direction = dcc_1.DCCExDirections.reverse;
                }
                else if (speedByte == 128) {
                    newSpeed = 0;
                    loco.direction = dcc_1.DCCExDirections.forward;
                }
                else {
                    //loco.speed = 0;
                }
                loco.speed = newSpeed;
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
            var addr = parseInt(items[1]);
            var closed = parseInt(items[2]);
            var t = { address: addr, isClosed: closed == 0 };
            (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.turnoutInfo, data: t });
            // var lines = data.split("\n")
            // lines.forEach((item) => {
            //     var items = item.trim().replace(">", "").split(" ")
            //     var addr = parseInt(items[1])
            //     var closed = parseInt(items[2])
            //     var to = turnouts[addr] // this.getTurnout(addr)
            //     if (to) {
            //         to.isClosed = closed == 0
            //         //console.log("EMIT turnoutEvent:", to)
            //         //io.emit("turnoutEvent", to)
            //     }
            // })
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