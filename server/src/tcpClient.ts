import * as net from "net";
import { log, logError } from "./utility";

export class TCPClient {
    socket: net.Socket | null = null;
    private isStopped: boolean = true;
    reconnectTimer: NodeJS.Timeout | undefined;

    constructor(
        private host: string,
        private port: number,
        private reconnectDelay: number = 5000,
        private onConnected: () => void,
        private onData: (data: any) => void,
        private onError: (error: Error) => void
    ) { }

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
        if (this.socket && !this.socket.destroyed && !this.socket.closed) {
            if (!message.startsWith('<#')) {
                log(`TCP sending: ${message}`);
            }
            //this.client.write(message + "\n");
            this.socket.write(message);
        } else {
            logError("Nincs aktív kapcsolat, nem lehet üzenetet küldeni.");
        }
    }

    private connectToServer() {
        log("tcpClient.connectToServer()");
        clearTimeout(this.reconnectTimer)
        this.socket = new net.Socket();
        this.socket.setKeepAlive(true, 10000)
        this.socket.setTimeout(6000)
        this.socket.connect(this.port, this.host, () => {
            this.socket!.setTimeout(6000)

            log(`tcpClient Connected: ${this.host}:${this.port}`);
            //this.startKeepAlive();
            if (this.onConnected) {
                this.onConnected()
            }
        });

        this.socket.on('timeout', () => {
            log('socket timeout');
            this.reconnect()
            // if(this.socket) {
            //     this.socket.end();
            // }
        });

        this.socket.on('end', () => {
            log('socket timeout');
            this.reconnect()
        });

        this.socket.on("data", (data) => {
            const message = data.toString().trim();
            this.onData(message);
        });

        this.socket.on("error", (err) => {
            logError("tcpClient error:", err.message);
            this.onError(err);
            this.reconnect();
        });

        this.socket.on("close", () => {
            log("tcpClient close");

            this.reconnect();
        });
    }

    private reconnect() {
        if (this.isStopped) {
            return
        }

        if (!this.reconnectTimer) {
            this.reconnectTimer = setTimeout(() => {
                log("tcpClient.reconnect()");
                this.socket!.removeAllListeners()
                this.connectToServer();
            }, this.reconnectDelay);
        }
    }

    private cleanup() {
        log("tcpClient.cleanup()");
        if (this.socket) {
            this.socket.destroy();
            this.socket = null;
            log("tcpClient.destroy()");
        } else {
            log("tcpClient.cleanup() socket doesn't exists!");
        }

    }
}
