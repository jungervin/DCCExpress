"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DccExSerialCommandCenter = void 0;
const dccExCommandCenter_1 = require("./dccExCommandCenter");
const serialClient_1 = require("./serialClient");
class DccExSerialCommandCenter extends dccExCommandCenter_1.DCCExCommandCenter {
    constructor(name, portName, baudRate) {
        super(name);
        this.lastSentTime = 0;
        this.MAIN_TASK_INTERVAL = 50;
        this.serialClient = new serialClient_1.SerialClient(portName, baudRate, this.connected.bind(this), this.received.bind(this), this.error.bind(this));
    }
    processBuffer() {
        if (this.serialClient) {
            if (this.buffer.length > 0) {
                var data = "";
                var i = 0;
                while (this.buffer.length > 0 && i < 5) {
                    data += this.buffer.shift();
                    i++;
                }
                this.serialClient.send(data);
                this.lastSentTime = performance.now();
            }
        }
    }
    error(err) {
        console.log("DCCEx Serial Error:", err);
    }
    start() {
        this.stop();
        if (this.serialClient) {
            this.serialClient.connect();
        }
        this.mainTask = setInterval(() => {
            this.processBuffer();
            if ((performance.now() - this.lastSentTime) > 5000) {
                this.put("<#>");
            }
        }, this.MAIN_TASK_INTERVAL);
    }
    stop() {
        if (this.mainTask) {
            clearInterval(this.mainTask);
            this.mainTask = undefined;
        }
        if (this.serialClient) {
            this.serialClient.stop();
        }
    }
}
exports.DccExSerialCommandCenter = DccExSerialCommandCenter;
//# sourceMappingURL=dccExSerialCommandCenter.js.map