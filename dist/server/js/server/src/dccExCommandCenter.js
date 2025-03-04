"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DCCExCommandCenter = void 0;
const dcc_1 = require("../../common/src/dcc");
const commandcenter_1 = require("./commandcenter");
const utility_1 = require("./utility");
const ws_1 = require("./ws");
// Configure myAutomation.h - DCC Turnouts/Points
// https://dcc-ex.com/exrail/creating-elements.html#configure-myautomation-h-dcc-turnouts-pointshttps://dcc-ex.com/exrail/creating-elements.html#configure-myautomation-h-dcc-turnouts-points
// TURNOUT( id, addr, sub_addr [, "description"] )
// https://dcc-ex.com/exrail/exrail-command-reference.html#objects-definition-and-control
class DCCExCommandCenter extends commandcenter_1.CommandCenter {
    constructor(name) {
        super(name);
        this.buffer = [];
        this._data = "";
    }
    put(msg) {
        // Mutex??
        (0, utility_1.log)(`DCCEx ${this.name} put: ${msg}`);
        this.buffer.push(msg);
    }
    getConnectionString() {
        throw new Error("Method not implemented.");
    }
    trackPower(on) {
        (0, utility_1.log)("DCCEx ", `trackPower(${on})`);
        this.put(on ? '<1>' : '<0>');
    }
    emergenyStop(stop) {
        this.put('<!>');
        this.powerInfo.emergencyStop = true;
        (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.powerInfo, data: this.powerInfo });
    }
    setLocoFunction(address, fn, on) {
        // <F cab funct state> - Turn loco decoder functions ON or OFF
        // 6 Response: <l cab reg speedByte functMap>
        //throw new Error("Method not implemented.");
        this.put(`<F ${address} ${fn} ${on ? 1 : 0}`);
    }
    clientConnected() {
        (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.powerInfo, data: this.powerInfo });
        this.put("<T>");
        this.put("<Q>");
        this.put("<Z>");
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
        // Clear&Send EmergencyStop
        this.powerInfo.emergencyStop = false;
        (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.powerInfo, data: this.powerInfo });
    }
    start() {
        this._data = "";
    }
    stop() {
        //throw new Error("Method not implemented.");
    }
    setTurnout(address, closed) {
        this.put(`<T ${address} ${closed ? dcc_1.DCCExTurnout.closed : dcc_1.DCCExTurnout.open}>`);
        this.getTurnout(address);
    }
    getTurnout(address) {
        this.put(`<JT ${address}>`);
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
    getSensorInfo(address) {
        this.put(`<Q ${address}>`);
    }
    getSystemState() {
        //throw new Error("Method not implemented.");
    }
    parse(data) {
        if (data == "# 50") {
            //log('tcpClient Data: ', data);
            return;
        }
        //log("DCCEx Parse:", data)
        if (data.startsWith('p1')) {
            this.powerInfo.info = 0b00000001;
            this.powerInfo.trackVoltageOn = true;
            (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.powerInfo, data: this.powerInfo });
        }
        else if (data.startsWith('p0')) {
            this.powerInfo.info = 0b00000000;
            this.powerInfo.trackVoltageOn = false;
            (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.powerInfo, data: this.powerInfo });
        }
        else if (data.startsWith("Q ")) {
            const params = data.split(" ");
            const si = { address: parseInt(params[1]), on: true };
            (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.sensorInfo, data: si });
        }
        else if (data.startsWith("q ")) {
            const params = data.split(" ");
            const si = { address: parseInt(params[1]), on: false };
            (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.sensorInfo, data: si });
        }
        else if (data.startsWith('l')) {
            console.log("TCP Rec:", data);
            var items = data.split(" ");
            var address = parseInt(items[1]);
            var speedByte = parseInt(items[3]);
            var funcMap = parseInt(items[4]);
            var direction = dcc_1.DCCExDirections.forward;
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
                var loco = { address: address, speed: newSpeed, direction: direction, funcMap: funcMap };
                (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.locoInfo, data: loco });
                (0, utility_1.log)("BROADCAST DCC-EX LOCO INFO:", loco);
                // if(this.powerInfo.emergencyStop && newSpeed > 0) {
                //     this.powerInfo.emergencyStop = false;
                //     broadcastAll({type: ApiCommands.powerInfo, data: this.powerInfo})
                // }
            }
        }
        else if (data.startsWith('H')) {
            var items = data.split(" ");
            var address = parseInt(items[1]);
            var t = { address: address, isClosed: parseInt(items[2]) == 0 };
            (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.turnoutInfo, data: t });
        }
        else if (data.startsWith("jT")) {
            var items = data.split(" ");
            var address = parseInt(items[1]);
            var t = { address: address, isClosed: items[2] == 'C' };
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
        this.put('<Q>');
    }
    received(buffer) {
        var msg = buffer.toString();
        (0, utility_1.log)("TCP RECEIVED:", msg);
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