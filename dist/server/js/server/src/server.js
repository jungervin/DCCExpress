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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.uploadDir = exports.DISPATCHER_FILE = exports.COMMANDCENTER_SETTING_FILE = exports.SETTINGS_FILE = exports.CC_FILE = exports.LOCOS_FILE = exports.DEVICES_FILE = exports.CONFIG_FILE = exports.modulesFolder = exports.distFolder = exports.rootFolder = exports.PORT = exports.server = exports.app = void 0;
const http_1 = __importDefault(require("http"));
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const utility_1 = require("./utility");
exports.app = (0, express_1.default)();
exports.app.set("ipaddr", "0.0.0.0");
exports.app.set("port", 3000);
exports.app.use(body_parser_1.default.json());
exports.app.use((0, cors_1.default)());
exports.server = http_1.default.createServer(exports.app);
exports.PORT = 3000;
// Statikus fájlok kiszolgálása
//export const rootFolder = "/home/junge/dev/DCCExpress"
exports.rootFolder = process.cwd(); // "./"
exports.distFolder = path_1.default.resolve(exports.rootFolder, "./");
exports.modulesFolder = path_1.default.resolve(exports.distFolder, "node_modules");
exports.CONFIG_FILE = path_1.default.resolve(exports.distFolder, "config.json");
exports.DEVICES_FILE = path_1.default.resolve(exports.distFolder, "devices.json");
exports.LOCOS_FILE = path_1.default.resolve(exports.distFolder, 'locos.json');
exports.CC_FILE = path_1.default.resolve(exports.distFolder, 'cc.json');
exports.SETTINGS_FILE = path_1.default.resolve(exports.distFolder, 'settings.json');
exports.COMMANDCENTER_SETTING_FILE = path_1.default.resolve(exports.distFolder, 'commandcentersettings.json');
exports.DISPATCHER_FILE = path_1.default.resolve(exports.distFolder, 'dispatcher.js');
exports.uploadDir = path_1.default.resolve(exports.distFolder, "uploads");
exports.app.use("/uploads", express_1.default.static(path_1.default.resolve(exports.distFolder, "uploads")));
console.log("==========================================");
console.log("               DIRECTORIES");
console.log("==========================================");
console.log(" RootDir:   ", __dirname);
console.log(" StaticDir: ", exports.distFolder);
console.log(" Modules:   ", exports.modulesFolder);
console.log("------------------------------------------");
console.log('');
exports.app.use(express_1.default.static(exports.distFolder));
exports.app.get("/", (req, res) => {
    res.sendFile(path_1.default.resolve(exports.distFolder, "index.html"));
});
exports.app.get("/require.js", (req, res) => {
    var nm = path_1.default.resolve(exports.modulesFolder, "requirejs/require.js");
    console.log("Get Requirejs:", nm);
    res.sendFile(nm);
});
exports.app.get("/socketio.js", (req, res) => {
    var nm = path_1.default.resolve(exports.modulesFolder, "socket.io/client-dist/socket.io.js");
    console.log("Get Requirejs:", nm);
    res.sendFile(nm);
});
// app.get("/js/lodash.js", (req: any, res: { sendFile: (arg0: string) => void; }) => {
//   var nm = path.join(modulesFolder, "lodash/cloneDeep.js")
//   console.log("Get lodash:", nm)
//   res.sendFile(nm);
// });
// Bootstrap CSS kiszolgálása
exports.app.get("/bootstrap.css", (req, res) => {
    res.sendFile(path_1.default.resolve(exports.modulesFolder, "bootstrap/dist/css/bootstrap.min.css"));
});
// Bootstrap JS kiszolgálása
exports.app.get("/bootstrap.js", (req, res) => {
    res.sendFile(path_1.default.resolve(exports.modulesFolder, "bootstrap/dist/js/bootstrap.bundle.min.js"));
});
exports.app.post("/save", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileName, data } = req.body;
        if (!fileName || !data) {
            (0, utility_1.log)('app.post /save: ', 400);
            res.status(400).json({ success: false, message: "Missing fileName or data" });
            return;
        }
        //const filePath = path.join(__dirname, fileName);
        const filePath = path_1.default.join(exports.distFolder, fileName);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf8");
        (0, utility_1.log)('app.post /save: ', `JSON saved as ${fileName}`);
        res.json({ success: true, message: `JSON saved as ${fileName}` });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error });
        (0, utility_1.logError)('app.post /save: 500', error);
    }
}));
// Multer konfiguráció
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(exports.uploadDir)) {
            fs.mkdirSync(exports.uploadDir);
        }
        cb(null, exports.uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
exports.upload = (0, multer_1.default)({ storage });
// Szerver indítása
//# sourceMappingURL=server.js.map