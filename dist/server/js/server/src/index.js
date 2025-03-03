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
// import http from "http";
const fs = __importStar(require("fs"));
// import path from "path";
// import { v4 as uuidv4 } from 'uuid';
// import express, { Request, Response } from 'express';
// import { Server as IOServer } from 'socket.io';
// import { Z21 } from "./z21";
const dcc_1 = require("../../common/src/dcc");
const commandcenters_1 = require("./commandcenters");
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import multer, { StorageEngine } from "multer";
const server_1 = require("./server");
const locomanager_1 = require("./locomanager");
const ws_1 = require("./ws");
const fastClock_1 = require("./fastClock");
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
let sigint = false;
process.on('SIGINT', () => {
    if (!sigint) {
        console.log("SIGINT");
        commandcenters_1.commandCenters.stop();
        setTimeout(() => {
            process.exit(0);
        }, 500);
    }
    sigint = true;
});
locomanager_1.Locomanager.init();
try {
    const settings = JSON.parse(fs.readFileSync(server_1.SETTINGS_FILE, 'utf8'));
    if (settings) {
        dcc_1.defaultSettings.EditorSettings.fastClockFactor = settings.EditorSettings.fastClockFactor;
        fastClock_1.FastClock.setFastClockFactor(dcc_1.defaultSettings.EditorSettings.fastClockFactor);
        // FastClock.start()
    }
    //   const ccSettings = JSON.parse(fs.readFileSync(COMMANDCENTER_SETTING_FILE, 'utf8')) as iCommandCenter;
    //   if (ccSettings.type == CommandCenterTypes.Z21) {
    //     const z21 = ccSettings.commandCenter as iZ21CommandCenter
    //     commandCenters.cc = new Z21CommandCenter("z21", z21.ip, z21.port)
    //     commandCenters.cc.TURNOUT_WAIT_TIME = z21.turnoutActiveTime
    //     commandCenters.cc.BASICACCESSORY_WAIT_TIME = z21.basicAccessoryDecoderActiveTime
    //     console.log("Z21 Command Center Registered!")
    //     console.log("IP:", z21.ip)
    //     console.log("Port:", z21.port)
    //     commandCenters.start()
    //   }
    //   else if (ccSettings.type == CommandCenterTypes.DCCExTCP) {
    //     const dccextcp = ccSettings.commandCenter as iDCCExTcp
    //     commandCenters.cc = new DCCExTCPCommandCenter("dcc-ex-tcp", dccextcp.ip, dccextcp.port)
    //     commandCenters.cc.TURNOUT_WAIT_TIME = 0 //dccextcp.turnoutActiveTime
    //     commandCenters.cc.BASICACCESSORY_WAIT_TIME = 0 //dccextcp.basicAccessoryDecoderActiveTime
    //     console.log("DCCEx TCP Command Center Registered!")
    //     console.log("IP:", dccextcp.ip)
    //     console.log("Port:", dccextcp.port)
    //     commandCenters.start()
    //   }
    //   else if (ccSettings.type == CommandCenterTypes.DCCExSerial) {
    //     const dccexserial = ccSettings.commandCenter as iDCCExSerial
    //     commandCenters.cc = new DccExSerialCommandCenter("dcc-ex-serial", dccexserial.port, 115200)
    //     commandCenters.cc.TURNOUT_WAIT_TIME = 0 //dccextcp.turnoutActiveTime
    //     commandCenters.cc.BASICACCESSORY_WAIT_TIME = 0 //dccextcp.basicAccessoryDecoderActiveTime
    //     console.log("DCCEx Serial Command Center Registered!")
    //     console.log("Port:", dccexserial.port)
    //     commandCenters.start()
    //   }
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