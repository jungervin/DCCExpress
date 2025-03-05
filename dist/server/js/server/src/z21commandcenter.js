"use strict";
// import { CommandCenter } from "./commandcenter"
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Z21CommandCenter = void 0;
const dcc_1 = require("../../common/src/dcc");
const commandcenter_1 = require("./commandcenter");
// import dgram from "dgram";
const ws_1 = require("./ws");
const utility_1 = require("./utility");
const udpClient_1 = require("./udpClient");
const cLAN_X_TURNOUT_INFO0x43 = 0x43;
const cLAN_SYSTEMSTATE_DATACHANGED0x84 = 0x84;
class Z21CommandCenter extends commandcenter_1.CommandCenter {
    //private mutex = new Mutex();
    trackPower(on) {
        if (on) {
            this.LAN_X_SET_TRACK_POWER_ON();
        }
        else {
            if (this.powerInfo.emergencyStop) {
                this.LAN_X_SET_TRACK_POWER_ON();
            }
            else {
                this.LAN_X_SET_TRACK_POWER_OFF();
            }
        }
    }
    emergenyStop(stop) {
        if (this.powerInfo.emergencyStop) {
            this.LAN_X_SET_TRACK_POWER_ON();
        }
        else {
            this.LAN_X_SET_STOP();
        }
    }
    constructor(name, ip, port) {
        super(name);
        this.ip = "";
        this.port = 21105;
        this.lastMessageReceivedTime = 0;
        this.taskId = undefined;
        this.buffer = [];
        this.type = dcc_1.CommandCenterTypes.Z21;
        this.ip = ip;
        this.port = port;
        this.udpClient = new udpClient_1.UDPClient(this.name, this.ip, this.port, (buffer, rinfo) => {
            const length = buffer.readUInt16LE(0);
            var i = 0;
            while (i < buffer.length) {
                var len = buffer.readUInt16LE(i);
                var data = buffer.slice(i, i + len);
                i += len;
                this.parse(data);
            }
            if (i != rinfo.size) {
                (0, utility_1.logError)("Z21 on message: eltérő méretek!");
                (0, utility_1.logError)("rinfo.size:", rinfo.size);
                (0, utility_1.logError)("payload:", i);
                (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.alert, data: "Z21 on message: eltérő méretek!" });
            }
        });
    }
    getConnectionString() {
        return "udp4://" + this.ip + ":" + this.port;
    }
    parse(data) {
        //this.lastMessageReceivedTime = performance.now()
        var len = data.readUInt16LE(0);
        var header = data.readUInt16LE(2);
        if (header == 0x40) {
            var xheader = data.readUInt8(4);
            //========================================
            // LAN_X_TURNOUT_INFO
            //========================================
            if (len == 0x09 && xheader == cLAN_X_TURNOUT_INFO0x43) {
                var msb = data.readUInt8(5);
                var lsb = data.readUInt8(6);
                var zz = data.readUInt8(7);
                var xor = data.readUInt8(8);
                var valid = (xheader ^ msb ^ lsb ^ zz) == xor;
                var closed = false;
                var address = (msb << 8) + lsb;
                zz = data.readUInt8(7) & 0x03;
                var state = "NA";
                switch (zz) {
                    case 0:
                        state = "Turnout not switched yet";
                        break;
                    case 1:
                        state = "pos: P0";
                        closed = false;
                        break;
                    case 2:
                        state = "pos: P1";
                        closed = true;
                        break;
                    case 3:
                        state = "Invalid";
                        break;
                }
                //const cc: iCommandCenter = commandCenters.getDevice(this.uuid)
                const turnoutInfo = { address: address + 1, isClosed: closed };
                (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.turnoutInfo, data: turnoutInfo });
                //accessories[address] = { address: address + 1, value: closed, device: this.device }
                //var device: iCommandCenter = {id: this.uuid, name: this.name, type: CommandCenterTypes.Z21}
                this.turnouts[address] = turnoutInfo;
                (0, utility_1.log)("BROADCAST LAN_X_TURNOUT_INFO:", { address: address + 1, isClosed: closed });
            }
            //========================================
            // LAN_X_LOCO_INFO
            //========================================
            else if (xheader == 0xef && data.length >= 10) {
                var db0 = data.readUInt8(5);
                var db1 = data.readUInt8(6);
                var db2 = data.readUInt8(7);
                var db3 = data.readUInt8(8);
                var db4 = data.readUInt8(9);
                var db5 = data.readUInt8(10);
                var db6 = data.readUInt8(11);
                var db7 = data.readUInt8(12);
                var db8 = data.readUInt8(13);
                //var address = ((db0 & 0x3F) << 8) | db1
                var address = data.readInt16BE(5) & 0x3fff;
                var busy = (db2 & 8) > 0;
                var speedsteps = (db2 & 7);
                var direction = (db3 & 128) > 0 ? dcc_1.Z21Directions.forward : dcc_1.Z21Directions.reverse;
                var speed = (db3 & 127);
                var f0 = ((db4 & 16) >> 4) | ((db4 & 15) << 1);
                var f = (db8 << 29) | (db7 << 21) | (db6 << 13) | (db5 << 5) | f0;
                var loco = { address: address, speed: speed, direction: direction, funcMap: f };
                (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.locoInfo, data: loco });
                (0, utility_1.log)("BROADCAST Z21 LOCO INFO:", loco);
            }
            //========================================
            // LAN_X_STATUS_CHANGED 
            //========================================
            else if (len == 0x07 && xheader == 0x61) {
                const info = data.readUInt8(5);
                this.powerInfo.emergencyStop = (info & 0x01) == 0x01;
                this.powerInfo.trackVoltageOn = (info & 0x02) == 0x02;
                this.powerInfo.shortCircuit = (info & 0x04) == 0x04;
                this.powerInfo.programmingModeActive = (info & 0x20) == 0x20;
                //const pi: iPowerInfo = { info: data.readUInt8(5), cc: commandCenters.getDevice(this.uuid) }
                //broadcastAll({ type: ApiCommands.powerInfo, data: this.powerInfo } as iData)
            }
            //========================================
            // POWER INFO
            //========================================
            else if (len == 0x07 && xheader == 0x61) {
                // const info = data.readUInt8(5)
                // this.powerInfo!.emergencyStop = (info & 0x01) == 0x01
                // this.powerInfo!.trackVoltageOff = (info & 0x02) == 0x02
                // this.powerInfo!.shortCircuit = (info & 0x04) == 0x04
                // this.powerInfo!.programmingModeActive = (info & 0x20) == 0x20
                //broadcastAll({ type: ApiCommands.powerInfo, data: pi } as iData)
            }
        }
        //========================================
        // LAN_RMBUS_DATACHANGED
        //========================================
        else if (header == 0x80 && data.length >= 10) {
            const length = data.readUInt16LE(0);
            const header = data.readUInt16LE(2);
            if (header == 0x80) {
                const group = data.readUInt8(4);
                var b1 = data.readUInt8(5);
                var b2 = data.readUInt8(6);
                const now = Date.now();
                var bytes = Array.from(data);
                // for(var i = 5; i < 13; i++) {
                //     bytes.push(data.readUInt8(i))
                // }
                var rbus = { group: group, bytes: bytes.slice(5, 15) };
                (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.rbusInfo, data: rbus });
                (0, utility_1.log)('LAN_RMBUS_DATACHANGED');
            }
        }
        else if (len == 0x14 && header == cLAN_SYSTEMSTATE_DATACHANGED0x84) {
            const sysdata = {
                MainCurrent: data.readUInt16LE(4),
                ProgCurrent: data.readUInt16LE(6),
                FilteredMainCurrent: data.readUInt16LE(8),
                Temperature: data.readUInt16LE(10),
                SupplyVoltage: data.readUInt16LE(12),
                VCCVoltage: data.readUInt16LE(14),
                CentralState: data.readUInt8(16),
                CentralStateEx: data.readUInt8(17),
                Reserved: data.readUInt8(18),
                Capabilities: data.readUInt8(19),
            };
            const info = data.readUInt8(16);
            this.powerInfo.emergencyStop = (info & 0x01) == 0x01;
            this.powerInfo.trackVoltageOn = (info & 0x02) == 0x00;
            this.powerInfo.shortCircuit = (info & 0x04) == 0x04;
            this.powerInfo.programmingModeActive = (info & 0x20) == 0x20;
            //const pi: iPowerInfo = { info: data.readUInt8(5), cc: commandCenters.getDevice(this.uuid) }
            (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.systemInfo, data: sysdata });
            (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.powerInfo, data: this.powerInfo });
        }
        else if (len == 0x08 && header == 0x10) {
            const snr = data.readUInt32LE(4);
            (0, utility_1.log)('Z21 SERIAL NUMBER:', snr);
        }
        else {
            (0, utility_1.log)(`Válasz érkezett a z21-től: ${data.toString("hex")}`);
        }
    }
    LAN_X_SET_TRACK_POWER_OFF() {
        this.put([0x07, 0x00, 0x40, 0x00, 0x21, 0x80, 0xa1]);
        (0, utility_1.log)("LAN_X_SET_TRACK_POWER_OFF()");
    }
    LAN_X_SET_TRACK_POWER_ON() {
        this.put([0x07, 0x00, 0x40, 0x00, 0x21, 0x81, 0xa0]);
        (0, utility_1.log)("Z21 LAN_X_SET_TRACK_POWER_ON()");
    }
    LAN_X_SET_STOP() {
        this.put([0x06, 0x00, 0x40, 0x00, 0x80, 0x80]);
        (0, utility_1.log)("Z21 LAN_X_SET_STOP()");
    }
    LAN_GET_SERIAL_NUMBER() {
        (0, utility_1.log)("Z21 LAN_GET_SERIAL_NUMBER()");
        this.put([0x04, 0x00, 0x10, 0x00]);
    }
    LAN_SYSTEMSTATE_GETDATA() {
        this.put([0x04, 0x00, 0x85, 0x00]);
        (0, utility_1.log)("Z21 LAN_SYSTEMSTATE_GETDATA()");
    }
    LAN_SET_BROADCASTFLAGS() {
        this.put([0x08, 0x00, 0x50, 0x00, 0x03, 0x01, 0x00, 0x00]);
        (0, utility_1.log)("Z21 LAN_SET_BROADCASTFLAGS()");
    }
    EMIT_RBUS_STATES() {
        (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.rbusInfo, data: dcc_1.rbus });
    }
    LAN_X_SET_TURNOUT_WITH_Q(addr, activate, on) {
        (0, utility_1.log)(`LAN_X_SET_TURNOUT_WITH_Q(addr: ${addr}, activate: ${activate}, on: ${on}) `);
        addr--;
        if (addr > 0) {
            const xheader = 0x53;
            const msb = addr >> 8;
            const lsb = addr & 0xff;
            // 10Q0_A00P 
            var db2 = 160;
            db2 = db2 | (activate ? 8 : 0);
            db2 = db2 | (on ? 1 : 0);
            var xor = xheader ^ msb ^ lsb ^ db2;
            this.put([0x09, 0x00, 0x40, 0x00, xheader, msb, lsb, db2, xor]);
            //this.put([0x09, 0x00, 0x40, 0x00, xheader, msb, lsb, db2, xor])
        }
        else {
            (0, utility_1.log)("LAN_X_SET_TURNOUT invalid Address: ", addr);
        }
    }
    LAN_X_GET_TURNOUT_INFO(addr) {
        (0, utility_1.log)(`LAN_X_GET_TURNOUT_INFO(addr: ${addr})`);
        addr--;
        if (addr > 0) {
            var xheader = 0x43;
            var msb = addr >> 8;
            var lsb = addr & 0xff;
            var xor = (xheader ^ msb ^ lsb);
            this.put([0x08, 0x00, 0x40, 0x00, xheader, msb, lsb, xor]);
        }
    }
    LAN_X_SET_LOCO_FUNCTION(addr, fn, on) {
        //0x0A 0x00 0x40 0x00   X-Header    DB0     DB1     DB2     DB3     XOR-Byte
        //                      0xE4        0xF8    Adr_MSB Adr_LSB TTNN NNNN XOR-Byte
        var xheader = 0xe4;
        var db0 = 0xf8;
        var msb = (addr & 0x3f) >> 8;
        var lsb = addr & 0xff;
        //fn |= 0b10000000 // on ? fn | 0b0100_0000 : fn & 0b0011_1111
        fn |= on ? fn | 64 : fn & 63;
        var xor = (xheader ^ db0 ^ msb ^ lsb ^ fn);
        this.put([0x0a, 0x00, 0x40, 0x00, xheader, db0, msb, lsb, fn, xor]);
        //this.put([0x0a, 0x00, 0x40, 0x00, xheader, db0, msb, lsb, fn, xor])
        this.LAN_X_GET_LOCO_INFO(addr);
    }
    LAN_X_SET_LOCO_DRIVE(addr, speedMode, forward, speed) {
        (0, utility_1.log)(`LAN_X_SET_LOCO_DRIVE(addr: ${addr}, speedMode: ${speedMode}, forward: ${forward}, speed: ${speed})`);
        var xheader = 0xe4;
        var db0 = 0x13; // 0x10 | speedMode
        var msb = (addr & 0x3f) >> 8;
        var lsb = addr & 0xff;
        var db3 = forward ? 128 : 0;
        db3 |= speed & 127;
        var xor = (xheader ^ db0 ^ msb ^ lsb ^ db3);
        this.put([0x0a, 0x00, 0x40, 0x00, xheader, db0, msb, lsb, db3, xor]);
        //this.put([0x0a, 0x00, 0x40, 0x00, xheader, db0, msb, lsb, db3, xor])
        // if (!this.locos[addr]) {
        //     this.locos[addr] == addr
        // setTimeout(() => {
        //     this.LAN_SET_BROADCASTFLAGS()
        //     this.LAN_X_GET_LOCO_INFO(addr)
        // }, 10)
        // }
    }
    LAN_X_GET_LOCO_INFO(addr) {
        (0, utility_1.log)(`LAN_X_GET_LOCO_INFO(addr: ${addr})`);
        // For locomotive addresses ≥ 128, the two highest bits in DB1 must be set to 1:
        // DB1 = (0xC0 | Adr_MSB). For locomotive addresses < 128, these two highest bits have no meaning.
        this.locos[addr] = addr;
        var xheader = 0xe3;
        var db0 = 0xf0;
        var msb = (addr | 0xc0) >> 8; // DB1
        var lsb = addr & 0xff; // DB2
        var xor = (xheader ^ db0 ^ msb ^ lsb);
        this.put([0x09, 0x00, 0x40, 0x00, xheader, db0, msb, lsb, xor]);
    }
    LAN_RMBUS_GETDATA() {
        (0, utility_1.log)(`LAN_RMBUS_GETDATA()`);
        this.put([0x05, 0x00, 0x81, 0x00, 0x00]);
        this.put([0x05, 0x00, 0x81, 0x00, 0x01]);
    }
    LAN_LOGOFF() {
        (0, utility_1.log)(`LAN_LOGOFF()`);
        this.udpClient.send(Buffer.from([0x04, 0x00, 0x30, 0x00]), (err) => {
            if (err) {
                (0, utility_1.log)("Z21 LOG_OFF nem sikerült :", err);
            }
            else {
                (0, utility_1.log)("Z21 LOG_OFF elküldve");
            }
        });
    }
    getSystemState() {
        this.LAN_SYSTEMSTATE_GETDATA();
    }
    setTurnout(address, closed) {
        this.accessories[address] = { address: address, cc: undefined, value: closed };
        this.LAN_X_SET_TURNOUT_WITH_Q(address, true, closed);
        setTimeout(() => {
            this.LAN_X_SET_TURNOUT_WITH_Q(address, false, closed);
        }, this.TURNOUT_WAIT_TIME);
    }
    getTurnout(address) {
        this.LAN_X_GET_TURNOUT_INFO(address);
    }
    setAccessoryDecoder(address, on) {
        this.LAN_X_SET_TURNOUT_WITH_Q(address, true, on);
        setTimeout(() => {
            this.LAN_X_SET_TURNOUT_WITH_Q(address, false, on);
            //this.LAN_X_GET_TURNOUT_INFO(address)
        }, this.BASICACCESSORY_WAIT_TIME);
    }
    getAccessoryDecoder(address) {
        this.LAN_X_GET_TURNOUT_INFO(address);
    }
    setOutput(address, on) {
    }
    getOutput(address) {
    }
    getRBusInfo() {
        this.LAN_RMBUS_GETDATA();
    }
    getSensorInfo(address) {
        //throw new Error("Method not implemented.");
    }
    put(data) {
        return __awaiter(this, void 0, void 0, function* () {
            //await this.mutex.lock()
            this.buffer.push(data);
            //this.mutex.unlock()
        });
    }
    getLoco(address) {
        this.LAN_X_GET_LOCO_INFO(address);
    }
    setLoco(address, speed, direction) {
        this.LAN_X_SET_LOCO_DRIVE(address, dcc_1.SpeedModes.S128, direction == dcc_1.Z21Directions.forward, speed);
    }
    setLocoFunction(address, fn, on) {
        this.LAN_X_SET_LOCO_FUNCTION(address, fn, on);
        //this.getLoco(address)
    }
    clientConnected() {
        // log("clientConnected() => broadcast")
        // for( const [k,v] of Object.entries(this.turnouts)) {
        //     broadcastAll({ type: ApiCommands.turnoutInfo, data: v} as iData )
        // }
        // for( const [k,v] of Object.entries(this.locos)) {
        //     broadcastAll({ type: ApiCommands.locoInfo, data: v} as iData )
        // }
    }
    processBuffer() {
        //async processBuffer() {
        //await this.mutex.lock()
        if (this.buffer.length > 0) {
            (0, utility_1.log)('Z21 Task Üzenet start');
            var data = [];
            while (this.buffer.length > 0 && data.length < 1024) {
                const row = this.buffer.shift();
                (0, utility_1.log)('Z21 SendMessageTask: ' + (0, utility_1.arrayToHex)(row));
                data = data.concat(row);
            }
            this.udpClient.send(Buffer.from(data), (err, bytes) => {
                if (err) {
                    (0, utility_1.logError)("Z21 Hiba az üzenet küldésekor:", err);
                }
                else {
                    (0, utility_1.log)('Z21 Task Üzenet elküldve:', bytes);
                    this.lastMessageReceivedTime = performance.now();
                }
            });
        }
        if (performance.now() - this.lastMessageReceivedTime > 55000) {
            this.LAN_GET_SERIAL_NUMBER();
        }
        //this.mutex.unlock()
    }
    start() {
        (0, utility_1.log)("Z21 start()");
        (0, utility_1.log)("=========================================================");
        (0, utility_1.log)("TURNOUT_WAIT_TIME:", this.TURNOUT_WAIT_TIME);
        (0, utility_1.log)("BASICACCESSORY_WAIT_TIME:", this.BASICACCESSORY_WAIT_TIME);
        (0, utility_1.log)("=========================================================");
        if (!this.taskId) {
            (0, utility_1.log)("Z21 Task started!");
            try {
                this.LAN_SET_BROADCASTFLAGS();
                this.LAN_SYSTEMSTATE_GETDATA();
            }
            catch (error) {
                (0, utility_1.log)("Z21 Start()", error);
            }
            this.taskId = setInterval(() => {
                this.processBuffer();
            }, 10);
        }
        else {
            (0, utility_1.log)("Z21 Task already started!");
        }
    }
    stop() {
        //this.LAN_LOGOFF()
        (0, utility_1.log)("Z21 Task stopping!");
        if (this.taskId) {
            clearInterval(this.taskId);
            setTimeout(() => {
                this.udpClient.send(Buffer.from([0x04, 0x00, 0x30, 0x00]), (err) => {
                    if (err) {
                        (0, utility_1.log)("Z21 LOG_OFF nem sikerült :", err);
                    }
                    else {
                        (0, utility_1.log)("Z21 LOG_OFF elküldve");
                    }
                });
                this.udpClient.client.close();
                (0, utility_1.log)("Z21 Task stopped!");
                // } else {
                //     log("Z21 Task already stopped!")
                // }
            }, 100);
        }
    }
}
exports.Z21CommandCenter = Z21CommandCenter;
//# sourceMappingURL=z21commandcenter.js.map