"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialClient = void 0;
const serialport_1 = require("serialport");
const utility_1 = require("./utility");
const node_process_1 = require("node:process");
class SerialClient {
    constructor(portName, baudRate, onConnected, onDataReceived, onError) {
        this.port = null;
        this.reconnectDelay = 5000; // 5 seconds
        this.portName = portName;
        this.baudRate = baudRate;
        this.onConnected = onConnected;
        this.onDataReceived = onDataReceived;
        this.onError = onError;
        // this.connect();
    }
    stop() {
        if (this.port && this.port.isOpen) {
            this.port.close();
            this.port.destroy();
            this.port = null;
        }
    }
    connect() {
        (0, utility_1.log)(`Attempting to connect to ${this.portName}...`);
        if (this.port) {
            (0, utility_1.logError)("port is defined");
            (0, node_process_1.exit)(1);
        }
        this.port = new serialport_1.SerialPort({
            path: this.portName,
            baudRate: this.baudRate,
            autoOpen: false,
            rtscts: false
        }, (err) => {
            if (err) {
                this.onError(new Error(`SerialPort error: ${err.message}`));
            }
        });
        this.port.set({ rts: false, dtr: false }, (err) => {
            if (err) {
                console.error('Error setting DTR/RTS:', err.message);
            }
            else {
                console.log('DTR and RTS disabled.');
            }
        });
        this.port.on("open", () => {
            (0, utility_1.log)(`Port Open:  ${this.portName} at ${this.baudRate} baud.`);
            // RTS és DTR 
            this.port.set({ rts: false, dtr: false }, (err) => {
                if (err) {
                    console.error('Error setting DTR/RTS:', err.message);
                }
                else {
                    console.log('DTR and RTS disabled.');
                }
            });
        });
        this.port.on("error", (err) => {
            this.onError(new Error(`Serial error: ${err.message}`));
        });
        this.port.on("close", () => {
            (0, utility_1.logError)(`Connection to ${this.portName} lost. Reconnecting...`);
        });
        this.port.on("data", (data) => {
            (0, utility_1.log)("SERIAL.DATA", data.toString());
            this.onDataReceived(data.toString());
        });
    }
    send(data) {
        (0, utility_1.log)("SERIAL SEND()", data);
        if (this.port) {
            if (!this.port.isOpen) {
                (0, utility_1.logError)("Serial port is not open. Try to open.");
                this.port.open();
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
            (0, utility_1.logError)("Port undefined!");
        }
    }
}
exports.SerialClient = SerialClient;
//# sourceMappingURL=serialClient.js.map