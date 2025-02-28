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
exports.Locomanager = void 0;
const server_1 = require("./server");
const fs = __importStar(require("fs"));
const uuid_1 = require("uuid");
class Locomanager {
    static init2(appl) {
        appl.post('/', (req, res) => {
        });
    }
    static init() {
        server_1.app.post("/upload", server_1.upload.single("image"), (req, res) => {
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            //const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
            const fileUrl = `/uploads/${req.file.filename}`;
            res.json({ url: fileUrl });
        });
        const readLocosFile = () => {
            try {
                if (!fs.existsSync(server_1.LOCOS_FILE)) {
                    fs.writeFileSync(server_1.LOCOS_FILE, JSON.stringify([], null, 2), 'utf8'); // Létrehozza az üres locos.json-t
                }
                const data = fs.readFileSync(server_1.LOCOS_FILE, 'utf8');
                return JSON.parse(data);
            }
            catch (error) {
                console.error("Error reading locos.json:", error);
                return [];
            }
        };
        const writeLocosFile = (locomotives) => {
            try {
                fs.writeFileSync(server_1.LOCOS_FILE, JSON.stringify(locomotives, null, 2), 'utf8');
            }
            catch (error) {
                console.error("Error writing to locos.json:", error);
            }
        };
        // Endpoints
        // Get all locomotives
        server_1.app.get("/locomotives", (req, res) => {
            const locomotives = readLocosFile();
            res.json(locomotives);
        });
        // Get a single locomotive by ID
        server_1.app.get("/locomotives/:id", (req, res) => {
            const { id } = req.params;
            const locomotives = readLocosFile();
            const locomotive = locomotives.find((loco) => loco.id === id);
            if (locomotive) {
                res.json(locomotive);
            }
            else {
                res.status(404).json({ error: "Locomotive not found" });
            }
        });
        // Add a new locomotive
        server_1.app.post("/locomotives", (req, res) => {
            const { name, address, imageUrl, speedMode, functions } = req.body;
            const locomotives = readLocosFile();
            const newLocomotive = {
                id: (0, uuid_1.v4)(),
                name,
                address,
                imageUrl,
                speedMode,
                functions,
            };
            locomotives.push(newLocomotive);
            writeLocosFile(locomotives);
            res.status(201).json(newLocomotive);
        });
        // Update an existing locomotive
        server_1.app.put("/locomotives/:id", (req, res) => {
            const { id } = req.params;
            const { name, address, imageUrl, speedMode, functions } = req.body;
            const locomotives = readLocosFile();
            const locomotiveIndex = locomotives.findIndex((loco) => loco.id === id);
            if (locomotiveIndex !== -1) {
                locomotives[locomotiveIndex] = Object.assign(Object.assign({}, locomotives[locomotiveIndex]), { name,
                    address,
                    imageUrl,
                    speedMode,
                    functions });
                writeLocosFile(locomotives);
                res.json(locomotives[locomotiveIndex]);
            }
            else {
                res.status(404).json({ error: "Locomotive not found" });
            }
        });
        // Delete a locomotive
        server_1.app.delete("/locomotives/:id", (req, res) => {
            const { id } = req.params;
            const locomotives = readLocosFile();
            const initialLength = locomotives.length;
            const updatedLocomotives = locomotives.filter((loco) => loco.id !== id);
            if (updatedLocomotives.length < initialLength) {
                writeLocosFile(updatedLocomotives);
                res.status(204).send();
            }
            else {
                res.status(404).json({ error: "Locomotive not found" });
            }
        });
    }
}
exports.Locomanager = Locomanager;
//# sourceMappingURL=locomanager.js.map