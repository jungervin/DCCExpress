import WebSocket, { WebSocketServer } from "ws";
import { COMMANDCENTER_SETTING_FILE, CONFIG_FILE, server, SETTINGS_FILE } from "./server";
import { ApiCommands, blocks, iBlockInfo, iCommandCenter, iData, iGetSensor, iLoco, iLocoData, iSensorInfo, iSetBlock, iSetTimeSettings, iTimeInfo, locos } from "../../common/src/dcc";
import { commandCenters } from "./commandcenters";
import * as fs from "fs";
import { config } from "process";
import { log, logError, File } from "./utility";
import { FastClock } from "./fastClock";

export const wsServer = new WebSocketServer({ server, path: "/ws" });


export function broadcastAll(msg: iData) {
    wsServer.clients.forEach(client => {
        // && client !== sender
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(msg));
        }
    });
}

function send(s: WebSocket, msg: iData) {
    //s.send(JSON.stringify({ type: type, data: data } as iData))
    s.send(JSON.stringify(msg));
}

wsServer.on("connection", (ws, req) => {
    const ip = req.socket.remoteAddress;
    const port = req.socket.remotePort;
    log('[WebSocket] Új kliens csatlakozott:', ip, port);

    commandCenters.clientConnected()

    ws.on("message", (message) => {
        try {
            log('WS Server got onMessage:', message.toString())
            const parsedMessage = JSON.parse(message.toString());
            const { type, data } = parsedMessage;
            // log('WS Server got onMessage:', type, data)
            switch (type) {

                case ApiCommands.setLoco:
                    commandCenters.setLoco(data)
                    break;
                case ApiCommands.getLoco:
                    commandCenters.getLoco(data)
                    break;
                case ApiCommands.setLocoFunction:
                    commandCenters.setLocoFunction(data)
                    break;

                case ApiCommands.emergencyStop:
                    commandCenters.emergencyStop()
                    break;

                case ApiCommands.setTrackPower:
                    commandCenters.setTrackPower(data)
                    break;
                case ApiCommands.setProgPower:
                    commandCenters.setProgPower(data)
                    break;

                case ApiCommands.writeDccExDirectCommand:
                    commandCenters.writeDirectCommand(data)
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

                case ApiCommands.setTurnout:
                    commandCenters.setTurnout(data)
                    //broadcastAll({ type: ApiCommands.response, data: "setTurnout executed" })
                    break;
                case ApiCommands.getTurnout:
                    commandCenters.getTurnout(data)
                    //broadcastAll({ type: ApiCommands.response, data: "getTurnout executed" })
                    break;

                case ApiCommands.setBasicAccessory:
                    commandCenters.setBasicAccessory(data)
                    break;
                case ApiCommands.getBasicAcessory:
                    commandCenters.getBasicAccessory(data)
                    break;

                case ApiCommands.setOutput:
                    commandCenters.setOutput(data)
                    break;
                case ApiCommands.getOutput:
                    commandCenters.getOutput(data)
                    break;

                case ApiCommands.getRBusInfo:
                    try {
                        commandCenters.getRBusInfo()
                    } catch (error) {
                        log("WS ApiCommands.getRBusInfo:", error)
                    }
                    break;
                case ApiCommands.getSensor:
                    try {
                        commandCenters.getSensor(data as iGetSensor)
                    } catch (error) {
                        log("WS ApiCommands.getRBusInfo:", error)
                    }
                    break;
                case ApiCommands.wsSensorInfo:
                    try {
                        const si = data as iSensorInfo
                        broadcastAll({ type: ApiCommands.sensorInfo, data: si } as iData)
                    } catch (error) {
                        log("WS ApiCommands.getRBusInfo:", error)
                    }
                    break;

                case ApiCommands.saveCommandCenter:
                    try {
                        fs.writeFileSync(COMMANDCENTER_SETTING_FILE, JSON.stringify(data), 'utf8');
                        commandCenters.load()
                    } catch (error) {
                        log("WS ApiCommands.saveSettings:", error)
                    }
                    break;
                case ApiCommands.getSettings:
                    try {
                        const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
                        broadcastAll({ type: ApiCommands.settingsInfo, data: settings })
                    } catch (error) {
                        log("WS ApiCommands.saveSettings:", error)
                    }
                    break;

                case ApiCommands.setBlock:

                    const sb = data as iSetBlock

                    if (!sb.blockName) {
                        logError("Error: Invalid block name received!", sb);
                        break;
                    }
                    for (const k of Object.keys(blocks)) {
                        if (blocks[k].locoAddress == sb.locoAddress) {
                            blocks[k].locoAddress = 0;
                        }
                    }

                    log("BEFORE BROADCAST BLOCKS")
                    try {
                        blocks[sb.blockName] = { blockName: sb.blockName, locoAddress: sb.locoAddress }
                    } catch (error) {
                        logError(error)
                    }


                    log("BROADCAST BLOCKS", blocks)
                    broadcastAll({ type: ApiCommands.blockInfo, data: { blocks } } as iData)
                    break;

                case ApiCommands.fetchBlocks:
                    broadcastAll({ type: ApiCommands.blockInfo, data: { blocks } } as iData)
                    break;

                case ApiCommands.setTimeSettings:
                    const ts = data as iSetTimeSettings
                    FastClock.setFastClockFactor(ts.scale)
                    break;
                case ApiCommands.saveCommandCenter:
                    const cc = data as iCommandCenter
                    try {
                        File.write(COMMANDCENTER_SETTING_FILE, JSON.stringify(data))
                    } catch (error) {
                        logError("ApiCommands.saveCommandCenter")
                    }
                    break;
                default:
                    log("WS Unknown command:", type);
                    ws.send(JSON.stringify({ type: "error", data: "Unknown command" }));
                    break;
            }
        } catch (err) {
            log("Invalid message format:", message);
            ws.send(JSON.stringify({ type: "error", data: "Invalid message format" }));
        }
    });

    ws.on("close", () => {
        log("WebSocket client disconnected.");
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