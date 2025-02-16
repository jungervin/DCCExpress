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
exports.broadcastAll = exports.wsServer = void 0;
const ws_1 = __importStar(require("ws"));
const server_1 = require("./server");
const dcc_1 = require("../../common/src/dcc");
const commandcenters_1 = require("./commandcenters");
const fs = __importStar(require("fs"));
const utility_1 = require("./utility");
exports.wsServer = new ws_1.WebSocketServer({ server: server_1.server, path: "/ws" });
// export class WSConn {
//     ws: WebSocketServer;
//     constructor(ws: WebSocketServer) {
//         this.ws = ws
//         this.ws.on("connection", (ws) => {
//             console.log("WebSocket client connected.");
//             ws.on("message", (message) => {
//                 try {
//                     // Üzenet JSON formátumú feldolgozása
//                     const parsedMessage = JSON.parse(message.toString());
//                     const { type, data } = parsedMessage;
//                     // Események kezelése
//                     switch (type) {
//                         case "command1":
//                             console.log("Command1 received:", data);
//                             // Példa: Válasz küldése
//                             ws.send(JSON.stringify({ type: "response", data: "Command1 executed" }));
//                             break;
//                         case "command2":
//                             console.log("Command2 received:", data);
//                             ws.send(JSON.stringify({ type: "response", data: "Command2 executed" }));
//                             break;
//                         default:
//                             console.log("Unknown command:", type);
//                             ws.send(JSON.stringify({ type: "error", data: "Unknown command" }));
//                             break;
//                     }
//                 } catch (err) {
//                     console.error("Invalid message format:", message);
//                     ws.send(JSON.stringify({ type: "error", data: "Invalid message format" }));
//                 }
//             });
//             ws.on("close", () => {
//                 console.log("WebSocket client disconnected.");
//             });
//         });
//     }
//     getLoco(addr: number) {
//         var l = locos[addr]
//         var d: iLocoData = {type: ApiCommands.getLoco, data: l}
//         this.ws.emit(JSON.stringify(d))
//     }
//     setLoco(l: iLoco) {
//     }
// }
function broadcastAll(msg) {
    exports.wsServer.clients.forEach(client => {
        // && client !== sender
        if (client.readyState === ws_1.default.OPEN) {
            client.send(JSON.stringify(msg));
        }
    });
}
exports.broadcastAll = broadcastAll;
function send(s, type, data) {
    s.send(JSON.stringify({ type: type, data: data }));
}
exports.wsServer.on("connection", (ws, req) => {
    const ip = req.socket.remoteAddress;
    const port = req.socket.remotePort;
    (0, utility_1.log)('[WebSocket] Új kliens csatlakozott:', ip, port);
    commandcenters_1.commandCenters.clientConnected();
    ws.on("message", (message) => {
        try {
            (0, utility_1.log)('WS Server got onMessage:', message.toString());
            const parsedMessage = JSON.parse(message.toString());
            const { type, data } = parsedMessage;
            // log('WS Server got onMessage:', type, data)
            switch (type) {
                case dcc_1.ApiCommands.setLoco:
                    commandcenters_1.commandCenters.setLoco(data);
                    break;
                case dcc_1.ApiCommands.getLoco:
                    commandcenters_1.commandCenters.getLoco(data);
                    break;
                case dcc_1.ApiCommands.setLocoFunction:
                    commandcenters_1.commandCenters.setLocoFunction(data);
                    break;
                case dcc_1.ApiCommands.emergencyStop:
                    commandcenters_1.commandCenters.emergencyStop();
                    break;
                case dcc_1.ApiCommands.setPower:
                    commandcenters_1.commandCenters.setPower(data);
                    break;
                // case ApiCommands.getCommandCenters:
                //     var cc: iCommandCenter[] = commandCenters.getDevices()
                //     const commandcenters = { type: ApiCommands.commandCenterInfos, data: cc } as iData
                //     log("Command Centers sent:", commandcenters)
                //     ws.send(JSON.stringify(commandcenters))
                //     commandCenters.getSystemState()
                //     break;
                case dcc_1.ApiCommands.configLoad:
                    configLoad(ws);
                    break;
                case dcc_1.ApiCommands.configSave:
                    configSave(data);
                    break;
                case dcc_1.ApiCommands.setTurnout:
                    commandcenters_1.commandCenters.setTurnout(data);
                    //broadcastAll({ type: ApiCommands.response, data: "setTurnout executed" })
                    break;
                case dcc_1.ApiCommands.getTurnout:
                    commandcenters_1.commandCenters.getTurnout(data);
                    //broadcastAll({ type: ApiCommands.response, data: "getTurnout executed" })
                    break;
                case dcc_1.ApiCommands.setBasicAccessory:
                    commandcenters_1.commandCenters.setBasicAccessory(data);
                    break;
                case dcc_1.ApiCommands.getBasicAcessory:
                    commandcenters_1.commandCenters.getBasicAccessory(data);
                    break;
                case dcc_1.ApiCommands.getRBusInfo:
                    try {
                        commandcenters_1.commandCenters.getRBusInfo();
                    }
                    catch (error) {
                        (0, utility_1.log)("WS ApiCommands.getRBusInfo:", error);
                    }
                    break;
                case dcc_1.ApiCommands.saveSettings:
                    try {
                        fs.writeFileSync(server_1.SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf8');
                    }
                    catch (error) {
                        (0, utility_1.log)("WS ApiCommands.saveSettings:", error);
                    }
                    break;
                case dcc_1.ApiCommands.getSettings:
                    try {
                        const settings = JSON.parse(fs.readFileSync(server_1.SETTINGS_FILE, 'utf8'));
                        broadcastAll({ type: dcc_1.ApiCommands.settingsInfo, data: settings });
                    }
                    catch (error) {
                        (0, utility_1.log)("WS ApiCommands.saveSettings:", error);
                    }
                    break;
                default:
                    (0, utility_1.log)("WS Unknown command:", type);
                    ws.send(JSON.stringify({ type: "error", data: "Unknown command" }));
                    break;
            }
        }
        catch (err) {
            (0, utility_1.log)("Invalid message format:", message);
            ws.send(JSON.stringify({ type: "error", data: "Invalid message format" }));
        }
    });
    ws.on("close", () => {
        (0, utility_1.log)("WebSocket client disconnected.");
    });
});
function configLoad(ws) {
    // Fájl beolvasása
    fs.readFile(server_1.CONFIG_FILE, "utf8", (err, data) => {
        if (err) {
            console.error("Hiba a fájl olvasásakor:", err);
        }
        else {
            const deserialized = JSON.parse(data);
            (0, utility_1.log)("Beolvasott elemek:", deserialized);
            ws.send(JSON.stringify({ type: dcc_1.ApiCommands.configLoaded, data: deserialized }));
            // DeviceManager.connections.commandcenters.forEach(cc => {
            //     if (cc instanceof Z21) {
            //         cc.LAN_RMBUS_GETDATA()
            //         console.log("io sent LAN_RMBUS_GETDATA()")
            //         cc.EMIT_TURNOUT_STATES()
            //         //cc.EMIT_RBUS_STATES()
            //     }
            // });
        }
    });
}
function configSave(data) {
    const serialized = JSON.stringify(data, null, 2); // Formázott JSON
    fs.writeFile(server_1.CONFIG_FILE, serialized, (err) => {
        if (err) {
            (0, utility_1.logError)("Hiba a fájl írásakor:", err);
        }
        else {
            (0, utility_1.log)(`Az adatok kiírva a ${server_1.CONFIG_FILE} fájlba.`);
        }
    });
}
//# sourceMappingURL=ws.js.map