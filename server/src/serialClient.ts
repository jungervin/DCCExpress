import { SerialPort } from "serialport";
import { log, logError } from "./utility";
import { exit } from "node:process";

export class SerialClient {
    private port: SerialPort | null = null;
    private readonly portName: string;
    private readonly baudRate: number;
    private reconnectInterval: NodeJS.Timeout | undefined;
    private readonly reconnectDelay = 5000; // 5 seconds

    // Callbacks
    private onConnected: () => void;
    private onDataReceived: (data: string) => void;
    private onError: (err: Error) => void;

    constructor(
        portName: string,
        baudRate: number,
        onConnected: () => void,
        onDataReceived: (data: string) => void,
        onError: (err: Error) => void
    ) {
        this.portName = portName;
        this.baudRate = baudRate;
        this.onConnected = onConnected;
        this.onDataReceived = onDataReceived;
        this.onError = onError;
        // this.connect();
    }

    stop() {
        if (this.port && this.port.isOpen) {
            this.port.close()
            this.port.destroy()
            this.port = null
        }
    }

    public connect() {
        log(`Attempting to connect to ${this.portName}...`);

        if (this.port) {
            logError("port is defined")
            exit(1)
        }

        this.port = new SerialPort(
            {
                path: this.portName,
                baudRate: this.baudRate,
                autoOpen: false,
                rtscts: false
            },
            (err) => {
                if (err) {
                    this.onError(new Error(`SerialPort error: ${err.message}`));
                }
            }
        );

        this.port!.set({ rts: false, dtr: false }, (err) => {
            if (err) {
                console.error('Error setting DTR/RTS:', err.message);
            } else {
                console.log('DTR and RTS disabled.');
            }
        })


        this.port.on("open", () => {
            log(`Port Open:  ${this.portName} at ${this.baudRate} baud.`);

            // RTS és DTR 
            this.port!.set({ rts: false, dtr: false }, (err) => {
                if (err) {
                    console.error('Error setting DTR/RTS:', err.message);
                } else {
                    console.log('DTR and RTS disabled.');
                }
            })
    
        });

        this.port.on("error", (err) => {
            this.onError(new Error(`Serial error: ${err.message}`));
        });

        this.port.on("close", () => {
            logError(`Connection to ${this.portName} lost. Reconnecting...`);
        });

        this.port.on("data", (data) => {
            log("SERIAL.DATA", data.toString())
            this.onDataReceived(data.toString());
        });

    }


    public send(data: string) {
        log("SERIAL SEND()", data)
        if (this.port) {
            if (!this.port.isOpen) {
                logError("Serial port is not open. Try to open.");
                this.port.open()
            }

            if (this.port.isOpen) {
                this.port.write(data, (err) => {
                    if (err) {
                        this.onError(new Error(`Write error: ${err.message}`));
                    }
                });

            }
        }
        else {
            logError("Port undefined!")
        }
    }
}

