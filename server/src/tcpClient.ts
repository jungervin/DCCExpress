import * as net from "net";
import { log, logError } from "./utility";

export class TCPClient {
    private client: net.Socket | null = null;
    private isStopped: boolean = true;

    constructor(
        private host: string,
        private port: number,
        private reconnectDelay: number = 5000,
        private onConnected: () => void,
        private onData: (data: any) => void ,
        private onError: (error: Error) => void
    ) {}

    public start() {
        if (!this.isStopped) {
            log("tcpClient.start() already stopped!");
            return;
        }
        this.isStopped = false;
        this.connectToServer();
    }

    public stop() {
        this.isStopped = true;
        this.cleanup();
        log("tcpClient.stop()");
    }

    public send(message: string, callback: (err?: Error) => void) {
        if (this.client && !this.client.destroyed) {
            log(`TCP Küldés: ${message}`);
            //this.client.write(message + "\n");
            this.client.write(message);
        } else {
            logError("Nincs aktív kapcsolat, nem lehet üzenetet küldeni.");
        }
    }

    private connectToServer() {
        log("tcpClient.connectToServer()");

        this.client = new net.Socket();

        this.client.connect(this.port, this.host, () => {
            log(`tcpClient Connected: ${this.host}:${this.port}`);
            //this.startKeepAlive();
            if(this.onConnected) {
                this.onConnected()
            }
        });

        this.client.on("data", (data) => {
            const message = data.toString().trim();
            this.onData(message); 
        });

        this.client.on("error", (err) => {
            logError("tcpClient error:", err.message);
            this.onError(err); 
            this.reconnect();
        });

        this.client.on("close", () => {
            log("tcpClient close");
            this.reconnect();
        });
    }

    private reconnect() {
        if (this.isStopped) {
            return
        }

        this.cleanup();

        setTimeout(() => {
            log("tcpClient.reconnect()");
            this.connectToServer();
        }, this.reconnectDelay);
    }

    private cleanup() {
        log("tcpClient.cleanup()");
        if (this.client) {
            this.client.destroy();
            this.client = null;
            log("tcpClient.destroy()");
        } else {
            log("tcpClient.cleanup() socket doesn't exists!");
        }

    }
}
