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
console.log("\x1b[2J");
console.log('██████   ██████  ██████ ███████ ██   ██ ██████  ██████  ███████ ███████ ███████ ');
console.log('██   ██ ██      ██      ██       ██ ██  ██   ██ ██   ██ ██      ██      ██      ');
console.log('██   ██ ██      ██      █████     ███   ██████  ██████  █████   ███████ ███████ ');
console.log('██   ██ ██      ██      ██       ██ ██  ██      ██   ██ ██           ██      ██ ');
console.log('██████   ██████  ██████ ███████ ██   ██ ██      ██   ██ ███████ ███████ ███████ ');
console.log('');
console.log('2025.02.03  v.0.1');
console.log('');
const os_1 = __importDefault(require("os"));
const fs = __importStar(require("fs"));
const dcc_1 = require("../../common/src/dcc");
const commandcenters_1 = require("./commandcenters");
const server_1 = require("./server");
const locomanager_1 = require("./locomanager");
const ws_1 = require("./ws");
const utility_1 = require("./utility");
const fastClock_1 = require("./fastClock");
const utility_2 = require("./utility");
process.on('uncaughtException', function (err) {
    (0, utility_1.log)('uncaughtException: ', err);
});
function checkFile(fn) {
    if (fs.existsSync(fn)) {
        (0, utility_1.log)(`${fn} OK.`);
    }
    else {
        (0, utility_1.log)(`${fn} NOK.`);
    }
}
(0, utility_1.log)("==========================================");
(0, utility_1.log)("                FILES");
(0, utility_1.log)("==========================================");
checkFile(server_1.CONFIG_FILE);
checkFile(server_1.LOCOS_FILE);
checkFile(server_1.SETTINGS_FILE);
checkFile(server_1.DISPATCHER_FILE);
checkFile(server_1.COMMANDCENTER_SETTING_FILE);
(0, utility_1.log)("------------------------------------------");
let sigint = false;
process.on('SIGINT', () => {
    if (!sigint) {
        (0, utility_1.log)("SIGINT");
        commandcenters_1.commandCenters.stop();
        setTimeout(() => {
            process.exit(0);
        }, 500);
    }
    sigint = true;
});
locomanager_1.Locomanager.init();
try {
    const settings = JSON.parse(fs.readFileSync(server_1.SETTINGS_FILE, 'utf8'));
    if (settings) {
        dcc_1.defaultSettings.EditorSettings.fastClockFactor = settings.EditorSettings.fastClockFactor;
        fastClock_1.FastClock.setFastClockFactor(dcc_1.defaultSettings.EditorSettings.fastClockFactor);
        // FastClock.start()
    }
}
catch (error) {
    (0, utility_1.log)("Setting Error:", error);
}
commandcenters_1.commandCenters.load();
if (ws_1.wsServer) {
    (0, utility_1.log)("WS running");
}
else {
    (0, utility_2.logError)("WS not running");
}
server_1.server.listen(server_1.PORT, () => {
    (0, utility_1.log)("🚀 Server started on:");
    (0, utility_1.log)("===============================");
    // Lekérdezzük a hálózati interfészeket
    const interfaces = os_1.default.networkInterfaces();
    Object.keys(interfaces).forEach((iface) => {
        var _a;
        (_a = interfaces[iface]) === null || _a === void 0 ? void 0 : _a.forEach((details) => {
            if (details.family === "IPv4" && !details.internal) {
                (0, utility_1.log)(`🌍 Accessible at: http://${details.address}:${server_1.PORT}`);
            }
        });
    });
    (0, utility_1.log)("===============================");
});
//# sourceMappingURL=index.js.map