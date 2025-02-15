"use strict";
// import * as net from 'net';
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
// export class TCPClient {
//     private client: net.Socket;
//     private receivedCallback: (data: Buffer) => void;
//     host: string;
//     port: number;
//     stopped: boolean = false;
//     constructor(host: string, port: number, receivedCallback: (data: any) => void) {
//         this.receivedCallback = receivedCallback;
//         this.host = host
//         this.port = port
//         this.client = new net.Socket();
//         this.client.setTimeout(1000);
//         // Csatlakozás a szerverhez
//         // Adat fogadása
//         this.client.on('data', (data) => {
//             this.receivedCallback(data);
//         });
//         // Hibakezelés
//         this.client.on('error', (err) => {
//             console.error('Hiba történt:', err.message);
//             this.connect()
//         });
//         // Kapcsolat bezárása
//         this.client.on('close', () => {
//             console.log('Kapcsolat bezárva');
//             this.connect()
//         });
//     }
//     // Adat küldése
//     public send(data: string, callback: (error: Error) => void): void {
//         this.client.write(data, (err?: Error) => {
//             if (err && callback) {
//                 callback(err)
//                 this.connect()
//             }
//         });
//     }
//     // Kapcsolat bezárása
//     public connect() {
//         if (!this.stopped && this.client.closed) {
//             this.client.connect(this.port, this.host, () => {
//                 console.log(`Csatlakozva a szerverhez: ${this.host}:${this.port}`);
//             });
//         } else {
//             console.log(`Stopped a szerverhez: ${this.host}:${this.port}`);
//         }
//     }
//     public close(): void {
//         if (!this.client.closed) {
//             //this.client.destroy();
//         }
//     }
//     start() {
//         this.stopped = false
//         this.connect()
//     }
//     stop() {
//         this.stopped = true;
//         this.close();
//     }
// }
// // // Példa használat
// // const host = '127.0.0.1'; // Szerver IP címe
// // const port = 12345;       // Szerver portja
// // // A received metódus, amit megadhatsz
// // const receivedCallback = (data: Buffer) => {
// //     console.log('Fogadott adat:', data.toString());
// // };
// // // TCP kliens létrehozása
// // const client = new TCPClient(host, port, receivedCallback);
// // // Adat küldése
// // client.send('Hello, szerver!');
// // // Kapcsolat bezárása (opcionális)
// // setTimeout(() => {
// //     client.close();
// // }, 5000);
const net = __importStar(require("net"));
class TCPClient {
    constructor(host, port, reconnectDelay = 3000, keepAliveIntervalMs = 5000, onConnected, onData, onError) {
        this.host = host;
        this.port = port;
        this.reconnectDelay = reconnectDelay;
        this.keepAliveIntervalMs = keepAliveIntervalMs;
        this.onConnected = onConnected;
        this.onData = onData;
        this.onError = onError;
        this.client = null;
        this.keepAliveInterval = null;
        this.isRunning = false;
    }
    start() {
        if (this.isRunning) {
            console.warn("A kliens már fut.");
            return;
        }
        this.isRunning = true;
        this.connectToServer();
    }
    stop() {
        this.isRunning = false;
        this.cleanup();
        console.log("A kliens leállt.");
    }
    send(message, callback) {
        if (this.client && !this.client.destroyed) {
            console.log(`Küldés: ${message}`);
            this.client.write(message + "\n");
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
            this.startKeepAlive();
            if (this.onConnected) {
                this.onConnected();
            }
        });
        this.client.on("data", (data) => {
            const message = data.toString().trim();
            //console.log("Fogadott adat:", message);
            this.onData(message); // Callback hívása
        });
        this.client.on("error", (err) => {
            console.error("Hiba történt:", err.message);
            this.onError(err); // Hiba callback hívása
            this.reconnect();
        });
        this.client.on("close", () => {
            console.warn("Kapcsolat lezárult.");
            this.reconnect();
        });
    }
    startKeepAlive() {
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval);
        }
        this.keepAliveInterval = setInterval(() => {
            if (this.client && !this.client.destroyed) {
                console.log("Keep-alive küldése: <#>");
                this.client.write("<#>\n");
            }
        }, this.keepAliveIntervalMs);
    }
    reconnect() {
        if (!this.isRunning)
            return; // Ha a kliens le van állítva, ne próbáljon újracsatlakozni
        this.cleanup();
        setTimeout(() => {
            console.log("Újracsatlakozás próbálkozás...");
            this.connectToServer();
        }, this.reconnectDelay);
    }
    cleanup() {
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval);
            this.keepAliveInterval = null;
        }
        if (this.client) {
            this.client.destroy();
            this.client = null;
        }
    }
}
exports.TCPClient = TCPClient;
// // Használat
// const client = new TCPClient(
//     "127.0.0.1",
//     1234,
//     3000, // Újracsatlakozás késleltetése (ms)
//     5000, // Keep-alive intervallum (ms)
//     (data) => console.log("📩 Callback - Fogadott adat:", data), // Adat fogadás
//     (error) => console.error("❌ Callback - Hiba történt:", error.message) // Hiba kezelése
// );
// client.start();
// // Példa üzenet küldésére 3 másodperc múlva
// setTimeout(() => {
//     client.send("Hello, Server!");
// }, 3000);
// // Példa: 30 másodperc múlva állítsuk le
// setTimeout(() => {
//     client.stop();
// }, 30000);
//# sourceMappingURL=tcpClient.js.map