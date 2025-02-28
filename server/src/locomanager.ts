import { Application } from "express-serve-static-core";
import { app, LOCOS_FILE, upload } from "./server";
import * as fs from "fs";
import { v4 as uuidv4 } from 'uuid';


export class Locomanager {

    static init2(appl: Application) {
        appl.post('/', (req,res)=> {

        })
    }

    static init() {

        

        app.post("/upload", upload.single("image"), (req: any, res: any) => {
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            //const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
            const fileUrl = `/uploads/${req.file.filename}`;
            res.json({ url: fileUrl });
        });

        const readLocosFile = (): any[] => {
            try {
                if (!fs.existsSync(LOCOS_FILE)) {
                    fs.writeFileSync(LOCOS_FILE, JSON.stringify([], null, 2), 'utf8'); // Létrehozza az üres locos.json-t
                }
                const data = fs.readFileSync(LOCOS_FILE, 'utf8');
                return JSON.parse(data);
            } catch (error) {
                console.error("Error reading locos.json:", error);
                return [];
            }
        };

        const writeLocosFile = (locomotives: any[]) => {
            try {
                fs.writeFileSync(LOCOS_FILE, JSON.stringify(locomotives, null, 2), 'utf8');
            } catch (error) {
                console.error("Error writing to locos.json:", error);
            }
        };


        // Endpoints

        // Get all locomotives
        app.get("/locomotives", (req, res) => {
            const locomotives = readLocosFile();
            res.json(locomotives);
        });

        // Get a single locomotive by ID
        app.get("/locomotives/:id", (req, res) => {
            const { id } = req.params;
            const locomotives = readLocosFile();
            const locomotive = locomotives.find((loco) => loco.id === id);
            if (locomotive) {
                res.json(locomotive);
            } else {
                res.status(404).json({ error: "Locomotive not found" });
            }
        });

        // Add a new locomotive
        app.post("/locomotives", (req, res) => {
            const { name, address, imageUrl, speedMode, functions } = req.body;
            const locomotives = readLocosFile();
            const newLocomotive = {
                id: uuidv4(),
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
        app.put("/locomotives/:id", (req, res) => {
            const { id } = req.params;
            const { name, address, imageUrl, speedMode, functions } = req.body;
            const locomotives = readLocosFile();
            const locomotiveIndex = locomotives.findIndex((loco) => loco.id === id);
            if (locomotiveIndex !== -1) {
                locomotives[locomotiveIndex] = {
                    ...locomotives[locomotiveIndex],
                    name,
                    address,
                    imageUrl,
                    speedMode,
                    functions
                };
                writeLocosFile(locomotives);
                res.json(locomotives[locomotiveIndex]);
            } else {
                res.status(404).json({ error: "Locomotive not found" });
            }
        });

        // Delete a locomotive
        app.delete("/locomotives/:id", (req, res) => {
            const { id } = req.params;
            const locomotives = readLocosFile();
            const initialLength = locomotives.length;
            const updatedLocomotives = locomotives.filter((loco) => loco.id !== id);
            if (updatedLocomotives.length < initialLength) {
                writeLocosFile(updatedLocomotives);
                res.status(204).send();
            } else {
                res.status(404).json({ error: "Locomotive not found" });
            }
        });
    }
}