console.log("\x1b[2J");

console.log('██████   ██████  ██████ ███████ ██   ██ ██████  ██████  ███████ ███████ ███████ ');
console.log('██   ██ ██      ██      ██       ██ ██  ██   ██ ██   ██ ██      ██      ██      ');
console.log('██   ██ ██      ██      █████     ███   ██████  ██████  █████   ███████ ███████ ');
console.log('██   ██ ██      ██      ██       ██ ██  ██      ██   ██ ██           ██      ██ ');
console.log('██████   ██████  ██████ ███████ ██   ██ ██      ██   ██ ███████ ███████ ███████ ');
console.log('');
console.log('2025.02.03  v.0.1')
console.log('');


import os from "os";
// import http from "http";
import * as fs from "fs";
// import path from "path";
// import { v4 as uuidv4 } from 'uuid';
// import express, { Request, Response } from 'express';
// import { Server as IOServer } from 'socket.io';
// import { Z21 } from "./z21";
import { ApiCommands, CommandCenterTypes, defaultSettings, iSettings, iTimeInfo } from "../../common/src/dcc";
import { commandCenters, CommandCenters } from "./commandcenters";
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import multer, { StorageEngine } from "multer";
import { app, CC_FILE, CONFIG_FILE, DEVICES_FILE, DISPATCHER_FILE, distFolder, LOCOS_FILE, modulesFolder, PORT, rootFolder, server, SETTINGS_FILE, upload } from "./server";
import { Locomanager } from "./locomanager";
import { wsServer } from "./ws";
import { Z21CommandCenter } from "./z21commandcenter";
// import { File, logError } from "./utility";
// import { DeviceManager } from "./devicemanager";
import { DCCExTCPCommancenter as DCCExTCPCommandCenter } from "./dccExTCPCommandCenter";
import { log } from "console";
import { exit } from "process";
import { FastClock } from "./fastClock";

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

let sigint = false
process.on('SIGINT', () => {
  if (!sigint) {
    console.log("SIGINT")
    commandCenters.stop()
    setTimeout(() => {
      process.exit(0);
    }, 500);
  }
  sigint = true
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
    defaultSettings.EditorSettings.fastClockFactor = settings.EditorSettings.fastClockFactor
    FastClock.setFastClockFactor(defaultSettings.EditorSettings.fastClockFactor)
    // FastClock.start()
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
  else if (defaultSettings.CommandCenter.type == CommandCenterTypes.DCCExTCP) {
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
  console.log("🚀 Server started on:");
  console.log("===============================");

  // Lekérdezzük a hálózati interfészeket
  const interfaces = os.networkInterfaces();
  Object.keys(interfaces).forEach((iface) => {
    interfaces[iface]?.forEach((details) => {
      if (details.family === "IPv4" && !details.internal) {
        console.log(`🌍 Accessible at: http://${details.address}:${PORT}`);
      }
    });
  });

  console.log("===============================");
});

