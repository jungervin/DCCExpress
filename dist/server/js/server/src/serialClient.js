"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialClient = void 0;
const serialport_1 = require("serialport");
const utility_1 = require("./utility");
class SerialClient {
    constructor(portName, baudRate, onConnected, onDataReceived, onError) {
        this.port = null;
        this.reconnectInterval = null;
        this.reconnectDelay = 5000; // 5 seconds
        this.portName = portName;
        this.baudRate = baudRate;
        this.onConnected = onConnected;
        this.onDataReceived = onDataReceived;
        this.onError = onError;
        this.connect();
    }
    connect() {
        (0, utility_1.log)(`Attempting to connect to ${this.portName}...`);
        if (this.reconnectInterval) {
            clearTimeout(this.reconnectInterval);
            this.reconnectInterval = null;
        }
        this.port = new serialport_1.SerialPort({
            path: this.portName,
            baudRate: this.baudRate,
            autoOpen: false,
        }, (err) => {
            if (err) {
                this.onError(new Error(`SerialPort error: ${err.message}`));
                this.reconnect();
            }
        });
        this.port.on("open", () => {
            (0, utility_1.log)(`Connected to ${this.portName} at ${this.baudRate} baud.`);
            if (this.reconnectInterval) {
                clearTimeout(this.reconnectInterval);
                this.reconnectInterval = null;
            }
            this.onConnected();
        });
        this.port.on("error", (err) => {
            this.onError(new Error(`Serial error: ${err.message}`));
            this.reconnect();
        });
        this.port.on("close", () => {
            (0, utility_1.logError)(`Connection to ${this.portName} lost. Reconnecting...`);
            this.reconnect();
        });
        this.port.on("data", (data) => {
            this.onDataReceived(data.toString());
        });
        this.port.open((err) => {
            if (err) {
                (0, utility_1.logError)(`Failed to open serial port: ${err.message}`);
                this.reconnect();
            }
        });
    }
    reconnect() {
        if (!this.reconnectInterval) {
            (0, utility_1.log)(`Reconnecting in ${this.reconnectDelay / 1000} seconds...`);
            this.reconnectInterval = setTimeout(() => this.connect(), this.reconnectDelay);
        }
    }
    send(data) {
        if (this.port && this.port.isOpen) {
            this.port.write(data, (err) => {
                if (err) {
                    this.onError(new Error(`Write error: ${err.message}`));
                }
            });
        }
        else {
            (0, utility_1.logError)("Serial port is not open. Cannot send data.");
        }
    }
}
exports.SerialClient = SerialClient;
//# sourceMappingURL=serialClient.js.map