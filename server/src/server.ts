import http from "http";
import * as fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import express, { Request, Response } from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import multer, { StorageEngine } from "multer";
import { log, logError } from "./utility";


export const app = express();
app.set("ipaddr", "0.0.0.0");
app.set("port", 3000);
app.use(bodyParser.json());
app.use(cors());

export const server = http.createServer(app);


export const PORT = 3000;


// Statikus fájlok kiszolgálása
//export const rootFolder = "/home/junge/dev/DCCExpress"
export const rootFolder = process.cwd(); // "./"
export const distFolder = path.resolve(rootFolder, "./")
export const modulesFolder = path.resolve(distFolder, "node_modules")
export const CONFIG_FILE = path.resolve(distFolder, "config.json");
export const DEVICES_FILE = path.resolve(distFolder, "devices.json");
export const LOCOS_FILE = path.resolve(distFolder, 'locos.json');
export const CC_FILE = path.resolve(distFolder, 'cc.json');
export const SETTINGS_FILE = path.resolve(distFolder, 'settings.json');
export const COMMANDCENTER_SETTING_FILE = path.resolve(distFolder, 'commandcentersettings.json');
export const DISPATCHER_FILE = path.resolve(distFolder, 'dispatcher.js');
export const uploadDir = path.resolve(distFolder, "uploads");
app.use("/uploads", express.static(path.resolve(distFolder, "uploads")));

log("==========================================")
log("               DIRECTORIES")
log("==========================================")
log(" RootDir:   ", __dirname)
log(" StaticDir: ", distFolder)
log(" Modules:   ", modulesFolder)
log("------------------------------------------")
log('')

app.use(express.static(distFolder));

app.get("/", (req: any, res: { sendFile: (arg0: string) => void; }) => {
  res.sendFile(path.resolve(distFolder, "index.html"));
});

app.get("/require.js", (req: any, res: { sendFile: (arg0: string) => void; }) => {
  var nm = path.resolve(modulesFolder, "requirejs/require.js")
  log("Get Requirejs:", nm)
  res.sendFile(nm);
});

// Bootstrap CSS kiszolgálása
app.get("/bootstrap.css", (req, res) => {
  res.sendFile(path.resolve(modulesFolder, "bootstrap/dist/css/bootstrap.min.css"));
});

// Bootstrap JS kiszolgálása
app.get("/bootstrap.js", (req, res) => {
  res.sendFile(path.resolve(modulesFolder, "bootstrap/dist/js/bootstrap.bundle.min.js"));
});

app.post("/save", async (req: any, res: any) => {
  try {
    const { fileName, data } = req.body;

    if (!fileName || !data) {
      log('app.post /save: ', 400);
      res.status(400).json({ success: false, message: "Missing fileName or data" });
      return
    }

    //const filePath = path.join(__dirname, fileName);
    const filePath = path.join(distFolder, fileName);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf8");

    log('app.post /save: ', `JSON saved as ${fileName}`);
    res.json({ success: true, message: `JSON saved as ${fileName}` });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
    logError('app.post /save: 500', error);
  }
});




// Multer konfiguráció
const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
export const upload = multer({ storage });


// Szerver indítása


