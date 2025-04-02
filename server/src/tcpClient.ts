import * as net from "net";
import { log, logError } from "./utility";

export class TCPClient {
    socket: net.Socket | null = null;
    private isStopped: boolean = true;
    private lastRecTime: number = 0;
    private watchdog?: NodeJS.Timeout | undefined;

    constructor(
        private host: string,
        private port: number,
        private reconnectDelay: number = 5000,
        private onConnected: () => void,
        private onData: (data: any) => void,
        private onError: (error: Error) => void
    ) {
    }

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

    private stopWatchdog() {
        if (this.watchdog) {
            clearInterval(this.watchdog);
            this.watchdog = undefined;
        }
    }

    connectToServer() {
        if(this.isStopped) {
            log("Could not connect because is stopped!")
            return;
        }

        log("tcpClient.connectToServer()");
        this.socket = new net.Socket();

        this.socket.connect(this.port, this.host, () => {
            log(`tcpClient Connected: ${this.host}:${this.port}`);
            if (this.onConnected) {
                this.onConnected()
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
            this.lastRecTime = performance.now()
            const message = data.toString().trim();
            this.onData(message);
        });

        this.socket.on("error", (err) => {
            logError("tcpClient onerror:", err.message);
            this.onError(err);
            this.socket!.destroy()
        });

        this.socket.on("close", () => {
            log("tcpClient onclose");
            setTimeout(() => this.connectToServer(), 3000)
        });
    }

    private cleanup() {
        log("tcpClient.cleanup()");
        if (this.socket) {
            this.stopWatchdog()
            this.socket.removeAllListeners()
            this.socket.destroy();
            this.socket = null;

        } else {
            log("tcpClient.cleanup() socket doesn't exists!");
        }

    }
}
