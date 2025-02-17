import * as net from "net";

export class TCPClient {
    private client: net.Socket | null = null;
    private isStopped: boolean = true;

    constructor(
        private host: string,
        private port: number,
        private reconnectDelay: number = 3000,
        private onConnected: () => void,
        private onData: (data: any) => void ,
        private onError: (error: Error) => void
    ) {}

    public start() {
        if (!this.isStopped) {
            console.warn("A kliens már fut.");
            return;
        }
        this.isStopped = false;
        this.connectToServer();
    }

    public stop() {
        this.isStopped = true;
        this.cleanup();
        console.log("A kliens leállt.");
    }

    public send(message: string, callback: (err?: Error) => void) {
        if (this.client && !this.client.destroyed) {
            console.log(`TCP Küldés: ${message}`);
            //this.client.write(message + "\n");
            this.client.write(message);
        } else {
            console.warn("Nincs aktív kapcsolat, nem lehet üzenetet küldeni.");
        }
    }

    private connectToServer() {
        console.log("Csatlakozás a szerverhez...");

        this.client = new net.Socket();

        this.client.connect(this.port, this.host, () => {
            console.log(`Kapcsolat létrejött: ${this.host}:${this.port}`);
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
            console.error("Hiba történt:", err.message);
            this.onError(err); 
            this.reconnect();
        });

        this.client.on("close", () => {
            console.warn("Kapcsolat lezárult.");
            this.reconnect();
        });
    }

    private reconnect() {
        if (this.isStopped) {
            return
        }

        this.cleanup();

        setTimeout(() => {
            console.log("Újracsatlakozás próbálkozás...");
            this.connectToServer();
        }, this.reconnectDelay);
    }

    private cleanup() {
        if (this.client) {
            this.client.destroy();
            this.client = null;
        }

    }
}
