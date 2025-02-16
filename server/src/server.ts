import http from "http";
import * as fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import express, { Request, Response } from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import multer, { StorageEngine } from "multer";


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
export const DISPATCHER_FILE = path.resolve(distFolder, 'dispatcher.js');
export const uploadDir = path.resolve(distFolder, "uploads");
app.use("/uploads", express.static(path.resolve(distFolder, "uploads")));

console.log("==========================================")
console.log("               DIRECTORIES")
console.log("==========================================")
console.log(" RootDir:   ", __dirname)
console.log(" StaticDir: ", distFolder)
console.log(" Modules:   ", modulesFolder)
console.log("------------------------------------------")
console.log('')

app.use(express.static(distFolder));

app.get("/", (req: any, res: { sendFile: (arg0: string) => void; }) => {
  res.sendFile(path.resolve(distFolder, "index.html"));
});

app.get("/require.js", (req: any, res: { sendFile: (arg0: string) => void; }) => {
  var nm = path.resolve(modulesFolder, "requirejs/require.js")
  console.log("Get Requirejs:", nm)
  res.sendFile(nm);
});
app.get("/socketio.js", (req: any, res: { sendFile: (arg0: string) => void; }) => {
  var nm = path.resolve(modulesFolder, "socket.io/client-dist/socket.io.js")
  console.log("Get Requirejs:", nm)
  res.sendFile(nm);
});
// app.get("/js/lodash.js", (req: any, res: { sendFile: (arg0: string) => void; }) => {
//   var nm = path.join(modulesFolder, "lodash/cloneDeep.js")
//   console.log("Get lodash:", nm)
//   res.sendFile(nm);
// });


// Bootstrap CSS kiszolgálása
app.get("/bootstrap.css", (req, res) => {
  res.sendFile(path.resolve(modulesFolder, "bootstrap/dist/css/bootstrap.min.css"));
});

// Bootstrap JS kiszolgálása
app.get("/bootstrap.js", (req, res) => {
  res.sendFile(path.resolve(modulesFolder, "bootstrap/dist/js/bootstrap.bundle.min.js"));
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


