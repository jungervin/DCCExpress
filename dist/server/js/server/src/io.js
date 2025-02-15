"use strict";
// import * as fs from "fs";
// import { ApiCommands, iBasicAccessory, iTurnout, TURNOUT_WAIT_TIME } from "../../common/src/dcc";
// import { Server as IOServer } from 'socket.io';
// import { configFile, server } from "./server";
// import { Z21 } from "./z21";
// import { DeviceManager } from "./devicemanager";
// export const io = new IOServer(server, {
//     cors: {
//         origin: "*", // Engedélyezz minden kapcsolatot
//     },
// });
// io.emit("topic", { data: "OK" })
// io.on("connection", (socket) => {
//     console.log(`Felhasználó csatlakozott: ${socket.id}`);
//     // Üzenet fogadása
//     socket.on("message", (data) => {
//         console.log(`Üzenet érkezett: ${data}`);
//         io.emit("message", `Válasz: ${data}`); // Üzenet küldése minden kliensnek
//         DeviceManager.connections.commandcenters.forEach(cc => {
//             if (cc instanceof Z21) {
//                 cc.LAN_RMBUS_GETDATA()
//                 console.log("io sent LAN_RMBUS_GETDATA()")
//                 cc.EMIT_TURNOUT_STATES()
//                 //cc.EMIT_RBUS_STATES()
//             }
//         });
//         // if (z21) {
//         //     z21.LAN_RMBUS_GETDATA()
//         // }
//     });
//     socket.on(ApiCommands.turnoutClicked, (data: iTurnout) => {
//         console.log(ApiCommands.turnoutClicked + ` üzenet érkezett:`);
//         console.log(`Addr: ${data.address}`);
//         console.log(`IsClosed: ${data.isClosed}`);
//         console.log(`CommandCenter: ${data.device.name}`);
//         console.log(`CommandCenterId: ${data.device.id}`);
//         // if (z21) {
//         //     z21.LAN_X_SET_TURNOUT(data.address, data.isClosed, TURNOUT_WAIT_TIME)
//         // }
//         DeviceManager.connections.commandcenters.forEach(cc => {
//             if (cc.uuid == data.device.id) {
//                 (cc as Z21).LAN_X_SET_TURNOUT(data.address, data.isClosed, 10)
//                 console.log("io sent to z21.LAN_X_SET_TURNOUT")
//             }
//         });
//         //io.emit("turnoutState", data); // Üzenet küldése minden kliensnek
//     });
//     socket.on(ApiCommands.getTurnout, (data: number) => {
//         DeviceManager.connections.commandcenters.forEach(cc => {
//             if (cc instanceof Z21) {
//                 //cc.LAN_X_SET_TURNOUT(data.address, data.isClosed, TURNOUT_WAIT_TIME)
//                 cc.LAN_X_GET_TURNOUT_INFO(data)
//                 //console.log("io sent to z21.LAN_RMBUS_GETDATA()")
//             }
//         });
//     });
//     socket.on(ApiCommands.setDecoder, (data: iBasicAccessory) => {
//         console.log("ApiCommands.setDecoder:", data.address, data.value, data.device)
//         DeviceManager.connections.commandcenters.forEach(cc => {
//             if (cc instanceof Z21) {
//                 (cc as Z21).LAN_X_SET_BASICDECODER(data.address, data.value, 50)
//                 console.log("io sent to z21.LAN_X_SET_TURNOUT as BasicDecoder")
//             }
//         });
//     })
//     socket.on("btnFunction", (data) => {
//         console.log(`btnFunction üzenet érkezett:`);
//         console.log(`Addr: ${data.address}`);
//         console.log(`Fn: ${data.fn}`);
//         console.log(`On: ${data.on}`);
//         console.log(`On: ${data.delay}`);
//         DeviceManager.connections.commandcenters.forEach(cc => {
//             if (cc instanceof Z21) {
//                 if (data.delay > 0) {
//                     cc.LAN_X_SET_LOCO_FUNCTION(data.address, data.fn, true)
//                     setTimeout(() => {
//                         cc.LAN_X_SET_LOCO_FUNCTION(data.address, data.fn, false)
//                     }, data.delay)
//                 } else {
//                     cc.LAN_X_SET_LOCO_FUNCTION(data.address, data.fn, data.on)
//                 }
//             }
//         })
//     })
//     socket.on(ApiCommands.getLoco, (data) => {
//     })
//     socket.on(ApiCommands.getRbusStates, () => {
//         DeviceManager.connections.commandcenters.forEach(cc => {
//             if (cc instanceof Z21) {
//                 //cc.LAN_X_SET_LOCO_DRIVE(data.address, data.speedMode, data.forward, data.speed)
//                 cc.EMIT_RBUS_STATES()
//             }
//         })
//         // if (z21) {
//         // }
//     })
//     // LAN_X_SET_LOCO_DRIVE(addr: number, speedMode: number, forward: boolean, speed: number )
//     socket.on("locoDrive", (data) => {
//         console.log(`locoDrive üzenet érkezett:`);
//         console.log(`Addr: ${data.address}`);
//         console.log(`speedMode: ${data.speedMode}`);
//         console.log(`forward: ${data.forward}`);
//         console.log(`speed: ${data.speed}`);
//         DeviceManager.connections.commandcenters.forEach(cc => {
//             if (cc instanceof Z21) {
//                 cc.LAN_X_SET_LOCO_DRIVE(data.address, data.speedMode, data.forward, data.speed)
//             }
//         })
//     })
//     socket.on("configSave", (data) => {
//         const serialized = JSON.stringify(data, null, 2); // Formázott JSON
//         fs.writeFile(configFile, serialized, (err) => {
//             if (err) {
//                 console.error("Hiba a fájl írásakor:", err);
//             } else {
//                 console.log(`Az adatok kiírva a ${configFile} fájlba.`);
//             }
//         });
//     })
//     socket.on(ApiCommands.configLoad, (data) => {
//         // Fájl beolvasása
//         fs.readFile(configFile, "utf8", (err, data) => {
//             if (err) {
//                 console.error("Hiba a fájl olvasásakor:", err);
//             } else {
//                 const deserialized: Element[] = JSON.parse(data);
//                 console.log("Beolvasott elemek:", deserialized);
//                 io.emit("configLoaded", deserialized)
//                 DeviceManager.connections.commandcenters.forEach(cc => {
//                     if (cc instanceof Z21) {
//                         cc.LAN_RMBUS_GETDATA()
//                         console.log("io sent LAN_RMBUS_GETDATA()")
//                         cc.EMIT_TURNOUT_STATES()
//                         //cc.EMIT_RBUS_STATES()
//                     }
//                 });
//             }
//         });
//     })
//     // Felhasználó leválása
//     socket.on("disconnect", () => {
//         console.log(`Felhasználó lecsatlakozott: ${socket.id}`);
//     });
//     socket.on(ApiCommands.getCommandCenters, () => {
//         console.log("ApiCommands.getCommandCenters")
//         var data = DeviceManager.readDevicesFile()
//         socket.emit(ApiCommands.commandCenters, data)
//         console.log("ApiCommands.commandCenters", data)
//     })
// });
//# sourceMappingURL=io.js.map