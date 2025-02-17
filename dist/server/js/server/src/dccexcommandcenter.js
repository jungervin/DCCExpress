"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DCCExCommandCenter = void 0;
const dcc_1 = require("../../common/src/dcc");
const commandcenter_1 = require("./commandcenter");
const utility_1 = require("./utility");
const ws_1 = require("./ws");
class DCCExCommandCenter extends commandcenter_1.CommandCenter {
    constructor(name) {
        super(name);
        this.buffer = [];
        this.power = false;
        this._data = "";
        this.powerInfo = {
            info: 0b00000010,
            emergencyStop: false,
            trackVoltageOff: true,
            shortCircuit: false,
            programmingModeActive: false,
            //cc: z21
        };
    }
    put(msg) {
        // Mutex??
        (0, utility_1.log)(`DCCEx ${this.name} put: ${msg}`);
        this.buffer.push(msg);
    }
    getConnectionString() {
        throw new Error("Method not implemented.");
    }
    // locos: { [address: number]: number; };
    // turnouts: { [address: number]: iTurnoutInfo; };
    trackPower(on) {
        (0, utility_1.log)("DCCEx ", `trackPower(${on})`);
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
        this.powerInfo.info = this.power ? 0b00000001 : 0b00000000;
        this.powerInfo.trackVoltageOff = !this.power;
        (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.powerInfo, data: this.powerInfo });
    }
    getLoco(address) {
        // <t cab>
        this.put(`<t ${address}>`);
    }
    setLoco(address, speed, direction) {
        // <t cab speed dir>
        if (speed > 126) {
            speed = 126;
        }
        this.put(`<t ${address} ${speed} ${direction}>`);
    }
    start() {
        this._data = "";
    }
    stop() {
        //throw new Error("Method not implemented.");
    }
    setTurnout(address, closed) {
        this.put(`<T ${address} ${closed ? dcc_1.DCCExTurnout.closed : dcc_1.DCCExTurnout.open}>`);
    }
    getTurnout(address) {
        this.put(`<T ${address} X>`);
    }
    // 'a': // ACCESSORY <a ADDRESS SUBADDRESS ACTIVATE [ONOFF]> or <a LINEARADDRESS ACTIVATE>
    setAccessoryDecoder(address, on) {
        dcc_1.accessories[address] = { address: address, value: on };
        var msg = `<a ${address} ${(on ? 1 : 0)}>`;
        this.put(msg);
        // Accessory
        const turnoutInfo = { address: address, isClosed: on };
        (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.turnoutInfo, data: turnoutInfo });
        (0, utility_1.log)('setAccessoryDecoder() BROADCAST ', turnoutInfo);
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
            // const sysdata: iSystemStatus = {
            //     MainCurrent: 0,
            //     ProgCurrent: 0,
            //     FilteredMainCurrent: 0,
            //     Temperature: 0,
            //     SupplyVoltage: 0,
            //     VCCVoltage: 0,
            //     CentralState: 0b0010_1111,
            //     CentralStateEx: 0,
            //     Reserved: 0,
            //     Capabilities: 0,
            // }
            // broadcastAll({ type: ApiCommands.systemInfo, data: sysdata } as iData)
            this.powerInfo.info = 0b00000001;
            this.powerInfo.trackVoltageOff = false;
            //const pi: iPowerInfo = { info: data.readUInt8(5), cc: commandCenters.getDevice(this.uuid) }
            (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.powerInfo, data: this.powerInfo });
        }
        else if (data.startsWith('p0')) {
            this.power = false;
            this.powerInfo.info = 0b00000000;
            this.powerInfo.trackVoltageOff = true;
            (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.powerInfo, data: this.powerInfo });
            // const sysdata: iSystemStatus = {
            //     MainCurrent: 0,
            //     ProgCurrent: 0,
            //     FilteredMainCurrent: 0,
            //     Temperature: 0,
            //     SupplyVoltage: 0,
            //     VCCVoltage: 0,
            //     CentralState: 0,
            //     CentralStateEx: 0,
            //     Reserved: 0,
            //     Capabilities: 0,
            // }
            // broadcastAll({ type: ApiCommands.systemInfo, data: sysdata } as iData)
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
                (0, utility_1.log)("BROADCAST DCC-EX LOCO INFO:", loco);
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
        this.put('<T>');
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