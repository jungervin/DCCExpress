// import * as net from 'net';

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


import * as net from "net";

export class TCPClient {
    private client: net.Socket | null = null;
    private keepAliveInterval: NodeJS.Timeout | null = null;
    private isRunning: boolean = false;

    constructor(
        private host: string,
        private port: number,
        private reconnectDelay: number = 3000,
        private keepAliveIntervalMs: number = 5000,
        private onConnected: () => void,
        private onData: (data: any) => void ,
        private onError: (error: Error) => void
    ) {}

    public start() {
        if (this.isRunning) {
            console.warn("A kliens már fut.");
            return;
        }
        this.isRunning = true;
        this.connectToServer();
    }

    public stop() {
        this.isRunning = false;
        this.cleanup();
        console.log("A kliens leállt.");
    }

    public send(message: string, callback: (err?: Error) => void) {
        if (this.client && !this.client.destroyed) {
            console.log(`Küldés: ${message}`);
            this.client.write(message + "\n");
        } else {
            console.warn("Nincs aktív kapcsolat, nem lehet üzenetet küldeni.");
        }
    }

    private connectToServer() {
        console.log("Csatlakozás a szerverhez...");

        this.client = new net.Socket();

        this.client.connect(this.port, this.host, () => {
            console.log(`Kapcsolat létrejött: ${this.host}:${this.port}`);
            this.startKeepAlive();
            if(this.onConnected) {
                this.onConnected()
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

    private startKeepAlive() {
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

    private reconnect() {
        if (!this.isRunning) return; // Ha a kliens le van állítva, ne próbáljon újracsatlakozni

        this.cleanup();

        setTimeout(() => {
            console.log("Újracsatlakozás próbálkozás...");
            this.connectToServer();
        }, this.reconnectDelay);
    }

    private cleanup() {
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
