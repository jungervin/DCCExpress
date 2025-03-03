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
import * as fs from "fs";
import { defaultSettings, iSettings } from "../../common/src/dcc";
import { commandCenters } from "./commandcenters";
import { COMMANDCENTER_SETTING_FILE, CONFIG_FILE, DISPATCHER_FILE, LOCOS_FILE, PORT, server, SETTINGS_FILE } from "./server";
import { Locomanager } from "./locomanager";
import { wsServer } from "./ws";
import { log } from "./utility";
import { FastClock } from "./fastClock";
import { logError } from "./utility";

process.on('uncaughtException', function (err) {
  log('uncaughtException: ', err)
});

function checkFile(fn: string) {
  if (fs.existsSync(fn)) {
    log(`${fn} OK.`);
  } else {
    log(`${fn} NOK.`);
  }
}

log("==========================================")
log("                FILES")
log("==========================================")
checkFile(CONFIG_FILE)
checkFile(LOCOS_FILE)
checkFile(SETTINGS_FILE)
checkFile(DISPATCHER_FILE)
checkFile(COMMANDCENTER_SETTING_FILE)
log("------------------------------------------")

let sigint = false
process.on('SIGINT', () => {
  if (!sigint) {
    log("SIGINT")
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
    defaultSettings.EditorSettings.fastClockFactor = settings.EditorSettings.fastClockFactor
    FastClock.setFastClockFactor(defaultSettings.EditorSettings.fastClockFactor)
    // FastClock.start()
  }
} catch (error) {
  log("Setting Error:", error)
}

commandCenters.load()

if (wsServer) {
  log("WS running")
} else {
  logError("WS not running")
}

server.listen(PORT, () => {
  log("🚀 Server started on:");
  log("===============================");

  // Lekérdezzük a hálózati interfészeket
  const interfaces = os.networkInterfaces();
  Object.keys(interfaces).forEach((iface) => {
    interfaces[iface]?.forEach((details) => {
      if (details.family === "IPv4" && !details.internal) {
        log(`🌍 Accessible at: http://${details.address}:${PORT}`);
      }
    });
  });

  log("===============================");
});

