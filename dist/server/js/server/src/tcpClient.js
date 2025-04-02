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
exports.TCPClient = void 0;
const net = __importStar(require("net"));
const utility_1 = require("./utility");
class TCPClient {
    constructor(host, port, reconnectDelay = 5000, onConnected, onData, onError) {
        this.host = host;
        this.port = port;
        this.reconnectDelay = reconnectDelay;
        this.onConnected = onConnected;
        this.onData = onData;
        this.onError = onError;
        this.socket = null;
        this.isStopped = true;
        this.lastRecTime = 0;
    }
    start() {
        if (!this.isStopped) {
            (0, utility_1.log)("tcpClient.start() already stopped!");
            return;
        }
        this.isStopped = false;
        this.connectToServer();
    }
    stop() {
        this.isStopped = true;
        this.cleanup();
        (0, utility_1.log)("tcpClient.stop()");
    }
    send(message, callback) {
        if (this.socket && !this.socket.destroyed && !this.socket.closed) {
            if (!message.startsWith('<#')) {
                (0, utility_1.log)(`TCP sending: ${message}`);
            }
            //this.client.write(message + "\n");
            this.socket.write(message);
        }
        else {
            (0, utility_1.logError)("Nincs aktív kapcsolat, nem lehet üzenetet küldeni.");
        }
    }
    stopWatchdog() {
        if (this.watchdog) {
            clearInterval(this.watchdog);
            this.watchdog = undefined;
        }
    }
    connectToServer() {
        if (this.isStopped) {
            (0, utility_1.log)("Could not connect because is stopped!");
            return;
        }
        (0, utility_1.log)("tcpClient.connectToServer()");
        this.socket = new net.Socket();
        this.socket.connect(this.port, this.host, () => {
            (0, utility_1.log)(`tcpClient Connected: ${this.host}:${this.port}`);
            if (this.onConnected) {
                this.onConnected();
            }
        });
        // this.stopWatchdog()
        // this.lastRecTime = performance.now()
        // this.watchdog = setInterval(() => {
        //     if((performance.now() - this.lastRecTime) > 6000) {
        //         console.log("TCPClient Timeout")
        //         if(this.socket) 
        //         {
        //             this.socket.removeAllListeners()
        //             this.socket.destroy()
        //             this.stopWatchdog()
        //             this.connectToServer()
        //         }
        //     }
        // }, 1000)
        this.socket.on("data", (data) => {
            this.lastRecTime = performance.now();
            const message = data.toString().trim();
            this.onData(message);
        });
        this.socket.on("error", (err) => {
            (0, utility_1.logError)("tcpClient onerror:", err.message);
            this.onError(err);
            this.socket.destroy();
        });
        this.socket.on("close", () => {
            (0, utility_1.log)("tcpClient onclose");
            setTimeout(() => this.connectToServer(), 3000);
        });
    }
    cleanup() {
        (0, utility_1.log)("tcpClient.cleanup()");
        if (this.socket) {
            this.stopWatchdog();
            this.socket.removeAllListeners();
            this.socket.destroy();
            this.socket = null;
        }
        else {
            (0, utility_1.log)("tcpClient.cleanup() socket doesn't exists!");
        }
    }
}
exports.TCPClient = TCPClient;
//# sourceMappingURL=tcpClient.js.map