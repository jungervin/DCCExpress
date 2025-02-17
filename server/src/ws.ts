import WebSocket, { WebSocketServer } from "ws";
import { CONFIG_FILE, server, SETTINGS_FILE } from "./server";
import { ApiCommands, iData, iLoco, iLocoData, locos } from "../../common/src/dcc";
import { commandCenters } from "./commandcenters";
import * as fs from "fs";
import { config } from "process";
import { log, logError } from "./utility";
export const wsServer = new WebSocketServer({ server, path: "/ws" });

export function broadcastAll(msg: iData) {
    wsServer.clients.forEach(client => {
        // && client !== sender
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(msg));
        }
    });
}

function send(s: WebSocket, type: ApiCommands, data: any) {
    s.send(JSON.stringify({ type: type, data: data } as iData))
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

                case ApiCommands.setPower:
                    commandCenters.setPower(data)
                    break;


                // case ApiCommands.getCommandCenters:
                //     var cc: iCommandCenter[] = commandCenters.getDevices()
                //     const commandcenters = { type: ApiCommands.commandCenterInfos, data: cc } as iData
                //     log("Command Centers sent:", commandcenters)
                //     ws.send(JSON.stringify(commandcenters))
                //     commandCenters.getSystemState()
                //     break;

                case ApiCommands.configLoad:
                    configLoad(ws)
                    break;
                case ApiCommands.configSave:
                    configSave(data)
                    break;

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

                case ApiCommands.getRBusInfo:
                    try {
                        commandCenters.getRBusInfo()
                    } catch (error) {
                        log("WS ApiCommands.getRBusInfo:", error)
                    }
                    break;

                case ApiCommands.saveSettings:
                    try {
                        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf8');
                    } catch (error) {
                        log("WS ApiCommands.saveSettings:", error)
                    }
                    break;
                case ApiCommands.getSettings:
                    try {
                        const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
                        broadcastAll({type: ApiCommands.settingsInfo, data: settings})
                    } catch (error) {
                        log("WS ApiCommands.saveSettings:", error)
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

function configLoad(ws: WebSocket) {
    // Fájl beolvasása
    fs.readFile(CONFIG_FILE, "utf8", (err, data) => {
        if (err) {
            console.error("Hiba a fájl olvasásakor:", err);
        } else {
            const deserialized: Element[] = JSON.parse(data);
            log("Beolvasott elemek:", deserialized);
            ws.send(JSON.stringify({ type: ApiCommands.configLoaded, data: deserialized } as iData))

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

function configSave(data: any) {
    const serialized = JSON.stringify(data, null, 2); // Formázott JSON
    fs.writeFile(CONFIG_FILE, serialized, (err) => {
        if (err) {
            logError("Hiba a fájl írásakor:", err);
        } else {
            log(`Az adatok kiírva a ${CONFIG_FILE} fájlba.`);
        }
    });
}