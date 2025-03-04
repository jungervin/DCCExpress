"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandCenters = exports.CommandCenters = void 0;
const dcc_1 = require("../../common/src/dcc");
const server_1 = require("./server");
const fs = __importStar(require("fs"));
const z21commandcenter_1 = require("./z21commandcenter");
const dccExTCPCommandCenter_1 = require("./dccExTCPCommandCenter");
const dccExSerialCommandCenter_1 = require("./dccExSerialCommandCenter");
const utility_1 = require("./utility");
class CommandCenters {
    constructor() {
        this.cc = undefined;
    }
    getSystemState() {
        if (this.cc) {
            this.cc.getSystemState();
        }
    }
    start() {
        (0, utility_1.log)("Command Centers Start");
        if (this.cc) {
            this.cc.start();
            (0, utility_1.log)(this.cc.name + "Command Center Started!");
        }
        else {
            (0, utility_1.log)("Command Center doesn't exists!");
        }
    }
    stop() {
        (0, utility_1.log)("Command Centers Stopping...");
        if (this.cc) {
            this.cc.stop();
            (0, utility_1.log)("Command Centers Stopped");
        }
        else {
            (0, utility_1.log)("Command Center doesn't exists!");
        }
    }
    clientConnected() {
        if (this.cc) {
            this.cc.clientConnected();
        }
        else {
            (0, utility_1.log)("Command Center doesn't exists!");
        }
    }
    setBasicAccessory(a) {
        if (this.cc) {
            this.cc.setAccessoryDecoder(a.address, a.value);
        }
        else {
            (0, utility_1.log)("Command Center doesn't exists!");
        }
    }
    getBasicAccessory(a) {
        if (this.cc) {
            this.cc.getAccessoryDecoder(a.address);
        }
        else {
            (0, utility_1.log)("Command Center doesn't exists!");
        }
    }
    getTurnout(t) {
        if (this.cc) {
            this.cc.getTurnout(t.address);
        }
        else {
            (0, utility_1.log)("Command Center doesn't exists!");
        }
    }
    setTurnout(t) {
        if (this.cc) {
            this.cc.setTurnout(t.address, t.isClosed);
        }
        else {
            (0, utility_1.log)("Command Center doesn't exists!");
        }
    }
    getRBusInfo() {
        if (this.cc) {
            this.cc.getRBusInfo();
        }
        else {
            (0, utility_1.log)("Command Center doesn't exists!");
        }
    }
    getSensor(sensor) {
        if (this.cc) {
            this.cc.getSensorInfo(sensor.address);
        }
        else {
            (0, utility_1.log)("Command Center doesn't exists!");
        }
    }
    getLoco(loco) {
        if (this.cc) {
            this.cc.getLoco(loco.address);
        }
        else {
            (0, utility_1.log)("Command Center doesn't exists!");
        }
    }
    setLoco(loco) {
        if (this.cc) {
            this.cc.setLoco(loco.address, loco.speed, loco.direction);
        }
        else {
            (0, utility_1.log)("Command Center doesn't exists!");
        }
    }
    setLocoFunction(loco) {
        if (this.cc) {
            this.cc.setLocoFunction(loco.address, loco.id, loco.isOn);
        }
        else {
            (0, utility_1.log)("Command Center doesn't exists!");
        }
    }
    setPower(data) {
        if (this.cc) {
            this.cc.trackPower(data.on);
        }
        else {
            (0, utility_1.log)("Command Center doesn't exists!");
        }
    }
    emergencyStop() {
        if (this.cc) {
            this.cc.emergenyStop(true);
        }
        else {
            (0, utility_1.log)("Command Center doesn't exists!");
        }
    }
    load() {
        (0, utility_1.log)("CommandCenters.load()");
        if (this.cc) {
            this.cc.stop();
        }
        try {
            const ccSettings = JSON.parse(fs.readFileSync(server_1.COMMANDCENTER_SETTING_FILE, 'utf8'));
            if (ccSettings.type == dcc_1.CommandCenterTypes.Z21) {
                const z21 = ccSettings.commandCenter;
                exports.commandCenters.cc = new z21commandcenter_1.Z21CommandCenter("z21", z21.ip, z21.port);
                exports.commandCenters.cc.TURNOUT_WAIT_TIME = z21.turnoutActiveTime;
                exports.commandCenters.cc.BASICACCESSORY_WAIT_TIME = z21.basicAccessoryDecoderActiveTime;
                (0, utility_1.log)("Z21 Command Center Registered!");
                (0, utility_1.log)("IP:", z21.ip);
                (0, utility_1.log)("Port:", z21.port);
                exports.commandCenters.start();
            }
            else if (ccSettings.type == dcc_1.CommandCenterTypes.DCCExTCP) {
                const dccextcp = ccSettings.commandCenter;
                exports.commandCenters.cc = new dccExTCPCommandCenter_1.DCCExTCPCommandCenter("dcc-ex-tcp", dccextcp.ip, dccextcp.port);
                exports.commandCenters.cc.TURNOUT_WAIT_TIME = 0; //dccextcp.turnoutActiveTime
                exports.commandCenters.cc.BASICACCESSORY_WAIT_TIME = 0; //dccextcp.basicAccessoryDecoderActiveTime
                (0, utility_1.log)("DCCEx TCP Command Center Registered!");
                (0, utility_1.log)("IP:", dccextcp.ip);
                (0, utility_1.log)("Port:", dccextcp.port);
                exports.commandCenters.start();
            }
            else if (ccSettings.type == dcc_1.CommandCenterTypes.DCCExSerial) {
                const dccexserial = ccSettings.commandCenter;
                exports.commandCenters.cc = new dccExSerialCommandCenter_1.DccExSerialCommandCenter("dcc-ex-serial", dccexserial.port, 115200);
                exports.commandCenters.cc.TURNOUT_WAIT_TIME = 0; //dccextcp.turnoutActiveTime
                exports.commandCenters.cc.BASICACCESSORY_WAIT_TIME = 0; //dccextcp.basicAccessoryDecoderActiveTime
                (0, utility_1.log)("DCCEx Serial Command Center Registered!");
                (0, utility_1.log)("Port:", dccexserial.port);
                exports.commandCenters.start();
            }
        }
        catch (error) {
            (0, utility_1.logError)("ServerSetting Error:", error);
        }
    }
}
exports.CommandCenters = CommandCenters;
exports.commandCenters = new CommandCenters();
//# sourceMappingURL=commandcenters.js.map