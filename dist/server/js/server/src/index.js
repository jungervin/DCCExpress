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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("\x1b[2J");
console.log('██████   ██████  ██████ ███████ ██   ██ ██████  ██████  ███████ ███████ ███████ ');
console.log('██   ██ ██      ██      ██       ██ ██  ██   ██ ██   ██ ██      ██      ██      ');
console.log('██   ██ ██      ██      █████     ███   ██████  ██████  █████   ███████ ███████ ');
console.log('██   ██ ██      ██      ██       ██ ██  ██      ██   ██ ██           ██      ██ ');
console.log('██████   ██████  ██████ ███████ ██   ██ ██      ██   ██ ███████ ███████ ███████ ');
console.log('');
console.log('2025.02.03  v.0.1');
console.log('');
const os_1 = __importDefault(require("os"));
const fs = __importStar(require("fs"));
// import { Z21 } from "./z21";
const dcc_1 = require("../../common/src/dcc");
const commandcenters_1 = require("./commandcenters");
const server_1 = require("./server");
// import { io } from "./io";
const locomanager_1 = require("./locomanager");
// import { DeviceManager, DEVICES_FILE } from "./devicemanager";
const ws_1 = require("./ws");
const z21commandcenter_1 = require("./z21commandcenter");
// import { DeviceManager } from "./devicemanager";
const dccExTCPCommandCenter_1 = require("./dccExTCPCommandCenter");
//  PARAMS:
//    cc Command Center
//    ip
//    port
//    config
// const args = process.argv;
// console.log(args)
// function getPrm(key: string): string {
//   for (const a of args) {
//     if(a.includes(key+"=")) {
//       console.log("ARG:", a, 'POS:', a.includes(key+"="))
//       console.log("SPLIT:", a.split("=")[1])
//       return a.split("=")[1]
//     }
//   }
//   return "NA"
// }
// const cc2 = getPrm("cc")
// console.log("COMMAND CENTER:", cc2)
process.on('uncaughtException', function (err) {
    console.log('uncaughtException: ', err);
});
function checkFile(fn) {
    if (fs.existsSync(fn)) {
        console.log(`${fn} OK.`);
    }
    else {
        console.log(`${fn} NOK.`);
    }
}
console.log("==========================================");
console.log("                FILES");
console.log("==========================================");
checkFile(server_1.CONFIG_FILE);
checkFile(server_1.LOCOS_FILE);
checkFile(server_1.SETTINGS_FILE);
checkFile(server_1.DISPATCHER_FILE);
checkFile(server_1.CC_FILE);
console.log("------------------------------------------");
process.on('SIGINT', () => {
    console.log("SIGINT");
    commandcenters_1.commandCenters.stop();
    setTimeout(() => {
        process.exit(0);
    }, 500);
});
locomanager_1.Locomanager.init();
try {
    const settings = JSON.parse(fs.readFileSync(server_1.SETTINGS_FILE, 'utf8'));
    if (settings) {
        dcc_1.defaultSettings.CommandCenter.type = settings.CommandCenter.type;
        dcc_1.defaultSettings.CommandCenter.ip = settings.CommandCenter.ip;
        dcc_1.defaultSettings.CommandCenter.port = settings.CommandCenter.port;
        dcc_1.defaultSettings.CommandCenter.serialPort = settings.CommandCenter.serialPort;
        dcc_1.defaultSettings.CommandCenter.turnoutActiveTime = settings.CommandCenter.turnoutActiveTime;
        dcc_1.defaultSettings.CommandCenter.basicAccessoryDecoderActiveTime = settings.CommandCenter.basicAccessoryDecoderActiveTime;
    }
    if (dcc_1.defaultSettings.CommandCenter.type == dcc_1.CommandCenterTypes.Z21) {
        commandcenters_1.commandCenters.cc = new z21commandcenter_1.Z21CommandCenter("z21", dcc_1.defaultSettings.CommandCenter.ip, dcc_1.defaultSettings.CommandCenter.port);
        commandcenters_1.commandCenters.cc.TURNOUT_WAIT_TIME = dcc_1.defaultSettings.CommandCenter.turnoutActiveTime;
        commandcenters_1.commandCenters.cc.BASICACCESSORY_WAIT_TIME = dcc_1.defaultSettings.CommandCenter.basicAccessoryDecoderActiveTime;
        console.log("Z21 Command Center Registered!");
        console.log("IP:", dcc_1.defaultSettings.CommandCenter.ip);
        console.log("Port:", dcc_1.defaultSettings.CommandCenter.port);
        commandcenters_1.commandCenters.start();
    }
    else if (dcc_1.defaultSettings.CommandCenter.type == dcc_1.CommandCenterTypes.DCCExTCP) {
        commandcenters_1.commandCenters.cc = new dccExTCPCommandCenter_1.DCCExTCPCommancenter("dcc-ex-tcp", dcc_1.defaultSettings.CommandCenter.ip, dcc_1.defaultSettings.CommandCenter.port);
        commandcenters_1.commandCenters.cc.TURNOUT_WAIT_TIME = dcc_1.defaultSettings.CommandCenter.turnoutActiveTime;
        commandcenters_1.commandCenters.cc.BASICACCESSORY_WAIT_TIME = dcc_1.defaultSettings.CommandCenter.basicAccessoryDecoderActiveTime;
        console.log("ECCEx TCP Command Center Registered!");
        console.log("IP:", dcc_1.defaultSettings.CommandCenter.ip);
        console.log("Port:", dcc_1.defaultSettings.CommandCenter.port);
        commandcenters_1.commandCenters.start();
    }
}
catch (error) {
    console.log("ServerSetting Error:", error);
}
if (ws_1.wsServer) {
    console.log("WS running");
}
else {
    console.log("WS not running");
}
server_1.server.listen(server_1.PORT, () => {
    console.log("🚀 Server started on:");
    console.log("===============================");
    // Lekérdezzük a hálózati interfészeket
    const interfaces = os_1.default.networkInterfaces();
    Object.keys(interfaces).forEach((iface) => {
        var _a;
        (_a = interfaces[iface]) === null || _a === void 0 ? void 0 : _a.forEach((details) => {
            if (details.family === "IPv4" && !details.internal) {
                console.log(`🌍 Accessible at: http://${details.address}:${server_1.PORT}`);
            }
        });
    });
    console.log("===============================");
});
//# sourceMappingURL=index.js.map