"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DCCExTCPCommancenter = void 0;
const dccExCommandCenter_1 = require("./dccExCommandCenter");
const tcpClient_1 = require("./tcpClient");
class DCCExTCPCommancenter extends dccExCommandCenter_1.DCCExCommandCenter {
    constructor(name, ip, port) {
        super(name);
        this.lastSentTime = 0;
        this.ip = ip;
        this.port = port;
        this.tcpClient = new tcpClient_1.TCPClient(ip, port, 5000, 5000, this.connected.bind(this), this.received.bind(this), this.error.bind(this));
    }
    getConnectionString() {
        return "tcp://" + this.ip + ":" + this.port;
    }
    send(msg) {
        if (this.buffer.length < 100) {
            this.buffer.push(msg);
        }
        else {
            console.log("DCCEx TCP Command Center Buffer is Full! size:", this.buffer.length);
        }
    }
    write() {
        if (this.tcpClient) {
            if (this.buffer.length > 0) {
                const msg = this.buffer.shift();
                this.tcpClient.send(msg, (err) => {
                    if (err) {
                        console.log("tcpClient.write Error:", err);
                    }
                });
                this.lastSentTime = performance.now();
            }
        }
    }
    error(err) {
        console.log("DCCEx TCP Error:", err);
    }
    start() {
        this.stop();
        if (this.tcpClient) {
            this.tcpClient.start();
        }
        this.mainTask = setInterval(() => {
            this.write();
            if (performance.now() - this.lastSentTime > 5000) {
                this.lastSentTime = performance.now();
                this.send("<#>");
            }
        }, 100);
    }
    stop() {
        if (this.mainTask) {
            clearInterval(this.mainTask);
            this.mainTask = undefined;
        }
        if (this.aliveTask) {
            clearInterval(this.aliveTask);
            this.aliveTask = undefined;
        }
        if (this.tcpClient) {
            this.tcpClient.stop();
        }
    }
}
exports.DCCExTCPCommancenter = DCCExTCPCommancenter;
//# sourceMappingURL=dccExTCPCommandCenter.js.map