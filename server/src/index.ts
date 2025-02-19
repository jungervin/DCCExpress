console.log("\x1b[2J");

console.log('██████   ██████  ██████ ███████ ██   ██ ██████  ██████  ███████ ███████ ███████ ');
console.log('██   ██ ██      ██      ██       ██ ██  ██   ██ ██   ██ ██      ██      ██      ');
console.log('██   ██ ██      ██      █████     ███   ██████  ██████  █████   ███████ ███████ ');
console.log('██   ██ ██      ██      ██       ██ ██  ██      ██   ██ ██           ██      ██ ');
console.log('██████   ██████  ██████ ███████ ██   ██ ██      ██   ██ ███████ ███████ ███████ ');
console.log('');
console.log('2025.02.03  v.0.1')
console.log('');



import http from "http";
import * as fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import express, { Request, Response } from 'express';
import { Server as IOServer } from 'socket.io';
// import { Z21 } from "./z21";
import { ApiCommands, CommandCenterTypes, defaultSettings, iSettings } from "../../common/src/dcc";
import { commandCenters, CommandCenters } from "./commandcenters";
import bodyParser from 'body-parser';
import cors from 'cors';
import multer, { StorageEngine } from "multer";
import { app, CC_FILE, CONFIG_FILE, DEVICES_FILE, DISPATCHER_FILE, distFolder, LOCOS_FILE, modulesFolder, PORT, rootFolder, server, SETTINGS_FILE, upload } from "./server";
// import { io } from "./io";
import { Locomanager } from "./locomanager";
// import { DeviceManager, DEVICES_FILE } from "./devicemanager";
import { wsServer } from "./ws";
import { Z21CommandCenter } from "./z21commandcenter";
import { File, logError } from "./utility";
// import { DeviceManager } from "./devicemanager";
import { DCCExTCPCommancenter as DCCExTCPCommandCenter } from "./dccExTCPCommandCenter";
import { log } from "console";
import { exit } from "process";

//  PARAMS:
//    cc Command Center
//    ip
//    port
//    config

// const args = process.argv;
// console.log(args)
// function getPrm(key: string): string {
//   for (const a of args) {
//     if(a.includes(key+"=")) {
//       console.log("ARG:", a, 'POS:', a.includes(key+"="))
//       console.log("SPLIT:", a.split("=")[1])
//       return a.split("=")[1]
//     }
//   }
//   return "NA"
// }

// const cc2 = getPrm("cc")
// console.log("COMMAND CENTER:", cc2)

process.on('uncaughtException', function (err) {
  console.log('uncaughtException: ', err)
});

function checkFile(fn: string) {
  if (fs.existsSync(fn)) {
    console.log(`${fn} OK.`);
  } else {
    console.log(`${fn} NOK.`);
  }
}

console.log("==========================================")
console.log("                FILES")
console.log("==========================================")
checkFile(CONFIG_FILE)
checkFile(LOCOS_FILE)
checkFile(SETTINGS_FILE)
checkFile(DISPATCHER_FILE)
checkFile(CC_FILE)
console.log("------------------------------------------")

process.on('SIGINT', () => {
  console.log("SIGINT")
  commandCenters.stop()
  setTimeout(() => {
    process.exit(0);
  }, 500);
});


Locomanager.init()

try {

  const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8')) as iSettings;
  if (settings) {
    defaultSettings.CommandCenter.type = settings.CommandCenter.type as CommandCenterTypes;
    defaultSettings.CommandCenter.ip = settings.CommandCenter.ip;
    defaultSettings.CommandCenter.port = settings.CommandCenter.port;
    defaultSettings.CommandCenter.serialPort = settings.CommandCenter.serialPort;
    defaultSettings.CommandCenter.turnoutActiveTime = settings.CommandCenter.turnoutActiveTime
    defaultSettings.CommandCenter.basicAccessoryDecoderActiveTime = settings.CommandCenter.basicAccessoryDecoderActiveTime
  }

  if (defaultSettings.CommandCenter.type == CommandCenterTypes.Z21) {
    
    commandCenters.cc = new Z21CommandCenter("z21", defaultSettings.CommandCenter.ip, defaultSettings.CommandCenter.port)
    commandCenters.cc.TURNOUT_WAIT_TIME = defaultSettings.CommandCenter.turnoutActiveTime
    commandCenters.cc.BASICACCESSORY_WAIT_TIME = defaultSettings.CommandCenter.basicAccessoryDecoderActiveTime
    console.log("Z21 Command Center Registered!")
    console.log("IP:", defaultSettings.CommandCenter.ip)
    console.log("Port:", defaultSettings.CommandCenter.port)
    commandCenters.start()
  }
  else if(defaultSettings.CommandCenter.type == CommandCenterTypes.DCCExTCP) {
    commandCenters.cc = new DCCExTCPCommandCenter("dcc-ex-tcp", defaultSettings.CommandCenter.ip, defaultSettings.CommandCenter.port)
    commandCenters.cc.TURNOUT_WAIT_TIME = defaultSettings.CommandCenter.turnoutActiveTime
    commandCenters.cc.BASICACCESSORY_WAIT_TIME = defaultSettings.CommandCenter.basicAccessoryDecoderActiveTime
    console.log("ECCEx TCP Command Center Registered!")
    console.log("IP:", defaultSettings.CommandCenter.ip)
    console.log("Port:", defaultSettings.CommandCenter.port)
    commandCenters.start()
  }

} catch (error) {
  console.log("ServerSetting Error:", error)
}


if (wsServer) {
  console.log("WS running")
} else {
  console.log("WS not running")
}

server.listen(PORT, () => {
  console.log(`Szerver fut a http://localhost:${PORT} címen`);
});









// Minden egyéb útvonal

// Socket.IO események kezelése

//=========================================
// LOCO EDTOR
//=========================================
{

  // // Multer konfiguráció
  // const storage: StorageEngine = multer.diskStorage({
  //   destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {

  //       if (!fs.existsSync(uploadDir)) {
  //           fs.mkdirSync(uploadDir);
  //       }
  //       cb(null, uploadDir);
  //   },
  //   filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
  //       cb(null, `${Date.now()}-${file.originalname}`);
  //   },
  // });
  // const upload = multer({ storage });


}





// // Szerver indítása
// server.listen(PORT, () => {
//   console.log(`Szerver fut a http://localhost:${PORT} címen`);
// });
