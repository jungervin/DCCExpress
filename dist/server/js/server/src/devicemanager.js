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
exports.DeviceManager = exports.DEVICES_FILE = void 0;
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const uuid_1 = require("uuid");
const server_1 = require("./server");
const dcc_1 = require("../../common/src/dcc");
// import { CommandCenter } from "./commandcenter";
// import { CommandCenters } from "./commandcenters";
// import { Z21 } from "./z21";
// import { io } from "./io";
// import { Z21CommandCenter } from "./z21commandcenter";
exports.DEVICES_FILE = path_1.default.resolve(server_1.distFolder, 'devices.json');
server_1.app.get("/devices", (req, res) => {
    const devices = DeviceManager.readDevicesFile();
    res.json(devices);
});
server_1.app.get("/devices/:id", (req, res) => {
    const { id } = req.params;
    const devices = DeviceManager.readDevicesFile();
    const device = devices.find((d) => d.uuid === id);
    if (device) {
        res.json(device);
    }
    else {
        res.status(404).json({ error: "Device not found" });
    }
});
// Add a new device
server_1.app.post("/devices", (req, res) => {
    const { name, type } = req.body;
    const devices = DeviceManager.readDevicesFile();
    const newDevice = {
        uuid: (0, uuid_1.v4)(),
        name,
        type,
    };
    switch (type) {
        case dcc_1.CommandCenterTypes.Z21:
            const { ip, port } = req.body;
            if (!ip || !port) {
                res.status(400).json({ error: "IP address and port are required for type Z21." });
                return;
            }
            newDevice.ip = ip;
            newDevice.port = port;
            break;
    }
    devices.push(newDevice);
    DeviceManager.writeDevicesFile(devices);
    res.status(201).json(newDevice);
});
// Update an existing device
server_1.app.put("/devices/:id", (req, res) => {
    const { id } = req.params;
    const { name, type } = req.body;
    const devices = DeviceManager.readDevicesFile();
    //const deviceIndex = devices.findIndex((d) => d.id === id);
    const device = devices.find((d) => d.uuid === id);
    if (device) {
        const { name, type } = req.body;
        switch (type) {
            case dcc_1.CommandCenterTypes.Z21:
                const { ip, port } = req.body;
                if (!ip || !port) {
                    res.status(400).json({ error: "IP address and port are required for type Z21." });
                    return;
                }
                device.name = name;
                device.ip = ip;
                device.port = port;
                DeviceManager.writeDevicesFile(devices);
                break;
        }
        res.json(device);
    }
    else {
        res.status(404).json({ error: "Device not found" });
    }
});
// Delete a device
server_1.app.delete("/devices/:id", (req, res) => {
    const { id } = req.params;
    const devices = DeviceManager.readDevicesFile();
    const initialLength = devices.length;
    const updatedDevices = devices.filter((d) => d.uuid !== id);
    if (updatedDevices.length < initialLength) {
        DeviceManager.writeDevicesFile(updatedDevices);
        res.status(204).send();
    }
    else {
        res.status(404).json({ error: "Device not found" });
    }
});
class DeviceManager {
    static init() {
        DeviceManager.readDevicesFile();
    }
}
exports.DeviceManager = DeviceManager;
// static connections: CommandCenters = new CommandCenters()
// static getCC(device: iCommandCenter) : CommandCenter | undefined {
//     var d = DeviceManager.connections.commandcenters.find((cc) => {
//         return device.uuid == cc.uuid
//     })
//     return d
// }
// static setTurnout(turnout: iTurnout) {
//     const cc = DeviceManager.getCC(turnout.device)
//     if(cc) {
//         cc.setTurnout(turnout)
//     }
// }
// static setBasicDecoder(decoder: iBasicAccessory) {
//     const cc = DeviceManager.getCC(decoder.device)
//     if(cc) {
//         cc.setBasicDecoder(decoder)
//     }
// }
DeviceManager.readDevicesFile = () => {
    try {
        if (!fs.existsSync(exports.DEVICES_FILE)) {
            fs.writeFileSync(exports.DEVICES_FILE, JSON.stringify([], null, 2), 'utf8'); // Létrehozza az üres locos.json-t
        }
        const data = fs.readFileSync(exports.DEVICES_FILE, 'utf8');
        const json = JSON.parse(data);
        //this.connections.commandcenters = json;
        json.forEach((c) => {
            if (c.type == dcc_1.CommandCenterTypes.Z21) {
                //DeviceManager.connections.disconnect()
                // if (!DeviceManager.connections.isExists(c.uuid!)) {
                //     var cc = c as iZ21CommandCenter
                //     const z21 = new Z21(cc.uuid!, cc.name, cc.ip, cc.port, io)
                //     DeviceManager.connections.add(z21)
                //     console.log('Z21 registered: ', z21.toString())
                // } else {
                //     console.log("Z21 already registered", c.uuid)
                // }
            }
        });
        return JSON.parse(data);
    }
    catch (error) {
        console.error("Error reading locos.json:", error);
        return [];
    }
};
DeviceManager.writeDevicesFile = (locomotives) => {
    try {
        fs.writeFileSync(exports.DEVICES_FILE, JSON.stringify(locomotives, null, 2), 'utf8');
    }
    catch (error) {
        console.error("Error writing to locos.json:", error);
    }
};
//# sourceMappingURL=devicemanager.js.map