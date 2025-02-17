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
class TCPClient {
    constructor(host, port, reconnectDelay = 3000, onConnected, onData, onError) {
        this.host = host;
        this.port = port;
        this.reconnectDelay = reconnectDelay;
        this.onConnected = onConnected;
        this.onData = onData;
        this.onError = onError;
        this.client = null;
        this.isStopped = true;
    }
    start() {
        if (!this.isStopped) {
            console.warn("A kliens már fut.");
            return;
        }
        this.isStopped = false;
        this.connectToServer();
    }
    stop() {
        this.isStopped = true;
        this.cleanup();
        console.log("A kliens leállt.");
    }
    send(message, callback) {
        if (this.client && !this.client.destroyed) {
            console.log(`TCP Küldés: ${message}`);
            //this.client.write(message + "\n");
            this.client.write(message);
        }
        else {
            console.warn("Nincs aktív kapcsolat, nem lehet üzenetet küldeni.");
        }
    }
    connectToServer() {
        console.log("Csatlakozás a szerverhez...");
        this.client = new net.Socket();
        this.client.connect(this.port, this.host, () => {
            console.log(`Kapcsolat létrejött: ${this.host}:${this.port}`);
            //this.startKeepAlive();
            if (this.onConnected) {
                this.onConnected();
            }
        });
        this.client.on("data", (data) => {
            const message = data.toString().trim();
            this.onData(message);
        });
        this.client.on("error", (err) => {
            console.error("Hiba történt:", err.message);
            this.onError(err);
            this.reconnect();
        });
        this.client.on("close", () => {
            console.warn("Kapcsolat lezárult.");
            this.reconnect();
        });
    }
    reconnect() {
        if (this.isStopped) {
            return;
        }
        this.cleanup();
        setTimeout(() => {
            console.log("Újracsatlakozás próbálkozás...");
            this.connectToServer();
        }, this.reconnectDelay);
    }
    cleanup() {
        if (this.client) {
            this.client.destroy();
            this.client = null;
        }
    }
}
exports.TCPClient = TCPClient;
//# sourceMappingURL=tcpClient.js.map