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
exports.wsServer = void 0;
exports.broadcastAll = broadcastAll;
const ws_1 = __importStar(require("ws"));
const server_1 = require("./server");
const dcc_1 = require("../../common/src/dcc");
const commandcenters_1 = require("./commandcenters");
const fs = __importStar(require("fs"));
const utility_1 = require("./utility");
const fastClock_1 = require("./fastClock");
exports.wsServer = new ws_1.WebSocketServer({ server: server_1.server, path: "/ws" });
function broadcastAll(msg) {
    exports.wsServer.clients.forEach(client => {
        // && client !== sender
        if (client.readyState === ws_1.default.OPEN) {
            client.send(JSON.stringify(msg));
        }
    });
}
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
                // case ApiCommands.configLoad:
                //     configLoad(ws)
                //     break;
                // case ApiCommands.configSave:
                //     configSave(data)
                //     break;
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
                case dcc_1.ApiCommands.saveCommandCenter:
                    try {
                        fs.writeFileSync(server_1.COMMANDCENTER_SETTING_FILE, JSON.stringify(data), 'utf8');
                        commandcenters_1.commandCenters.load();
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
                case dcc_1.ApiCommands.setBlock:
                    const sb = data;
                    if (!sb.blockName) {
                        (0, utility_1.logError)("Error: Invalid block name received!", sb);
                        break;
                    }
                    for (const k of Object.keys(dcc_1.blocks)) {
                        if (dcc_1.blocks[k].locoAddress == sb.locoAddress) {
                            dcc_1.blocks[k].locoAddress = 0;
                        }
                    }
                    (0, utility_1.log)("BEFORE BROADCAST BLOCKS");
                    try {
                        dcc_1.blocks[sb.blockName] = { blockName: sb.blockName, locoAddress: sb.locoAddress };
                    }
                    catch (error) {
                        (0, utility_1.logError)(error);
                    }
                    (0, utility_1.log)("BROADCAST BLOCKS", dcc_1.blocks);
                    broadcastAll({ type: dcc_1.ApiCommands.blockInfo, data: { blocks: dcc_1.blocks } });
                    break;
                case dcc_1.ApiCommands.setTimeSettings:
                    const ts = data;
                    fastClock_1.FastClock.setFastClockFactor(ts.scale);
                    break;
                case dcc_1.ApiCommands.saveCommandCenter:
                    const cc = data;
                    try {
                        utility_1.File.write(server_1.COMMANDCENTER_SETTING_FILE, JSON.stringify(data));
                    }
                    catch (error) {
                        (0, utility_1.logError)("ApiCommands.saveCommandCenter");
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
// function configLoad(ws: WebSocket) {
//     // Fájl beolvasása
//     fs.readFile(CONFIG_FILE, "utf8", (err, data) => {
//         if (err) {
//             console.error("Hiba a fájl olvasásakor:", err);
//         } else {
//             const deserialized: Element[] = JSON.parse(data);
//             log("Beolvasott elemek:", deserialized);
//             //ws.send(JSON.stringify({ type: ApiCommands.configLoaded, data: deserialized } as iData))
//             // DeviceManager.connections.commandcenters.forEach(cc => {
//             //     if (cc instanceof Z21) {
//             //         cc.LAN_RMBUS_GETDATA()
//             //         console.log("io sent LAN_RMBUS_GETDATA()")
//             //         cc.EMIT_TURNOUT_STATES()
//             //         //cc.EMIT_RBUS_STATES()
//             //     }
//             // });
//         }
//     });
// }
// function configSave(data: any) {
//     const serialized = JSON.stringify(data, null, 2); // Formázott JSON
//     fs.writeFile(CONFIG_FILE, serialized, (err) => {
//         if (err) {
//             logError("Hiba a fájl írásakor:", err);
//         } else {
//             log(`Az adatok kiírva a ${CONFIG_FILE} fájlba.`);
//         }
//     });
// }
//# sourceMappingURL=ws.js.map