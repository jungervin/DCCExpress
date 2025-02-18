import { SerialPort } from "serialport";
import { log, logError } from "./utility";

export class SerialClient {
    private port: SerialPort | null = null;
    private readonly portName: string;
    private readonly baudRate: number;
    private reconnectInterval: NodeJS.Timeout | null = null;
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
        this.connect();
    }

    public connect() {
        log(`Attempting to connect to ${this.portName}...`);

        if (this.reconnectInterval) {
            clearTimeout(this.reconnectInterval); 
            this.reconnectInterval = null;
        }

        this.port = new SerialPort(
            {
                path: this.portName,
                baudRate: this.baudRate,
                autoOpen: false,
            },
            (err) => {
                if (err) {
                    this.onError(new Error(`SerialPort error: ${err.message}`));
                    this.reconnect();
                }
            }
        );

        this.port.on("open", () => {
            log(`Connected to ${this.portName} at ${this.baudRate} baud.`);
            if (this.reconnectInterval) {
                clearTimeout(this.reconnectInterval);
                this.reconnectInterval = null;
            }
            this.onConnected()
        });

        this.port.on("error", (err) => {
            this.onError(new Error(`Serial error: ${err.message}`));
            this.reconnect();
        });

        this.port.on("close", () => {
            logError(`Connection to ${this.portName} lost. Reconnecting...`);
            this.reconnect();
        });

        this.port.on("data", (data) => {
            this.onDataReceived(data.toString());
        });

        this.port.open((err) => {
            if (err) {
                logError(`Failed to open serial port: ${err.message}`);
                this.reconnect();
            }
        });
    }

    private reconnect() {
        if (!this.reconnectInterval) {
            log(`Reconnecting in ${this.reconnectDelay / 1000} seconds...`);
            this.reconnectInterval = setTimeout(() => this.connect(), this.reconnectDelay);
        }
    }

    public send(data: string) {
        if (this.port && this.port.isOpen) {
            this.port.write(data, (err) => {
                if (err) {
                    this.onError(new Error(`Write error: ${err.message}`));
                }
            });
        } else {
            logError("Serial port is not open. Cannot send data.");
        }
    }
}


