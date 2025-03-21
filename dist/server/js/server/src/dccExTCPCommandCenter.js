"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DCCExTCPCommandCenter = void 0;
const dcc_1 = require("../../common/src/dcc");
const dccExCommandCenter_1 = require("./dccExCommandCenter");
const tcpClient_1 = require("./tcpClient");
const ws_1 = require("./ws");
class DCCExTCPCommandCenter extends dccExCommandCenter_1.DCCExCommandCenter {
    constructor(name, ip, port, init) {
        super(name, init);
        this.lastSentTime = 0;
        this.MAIN_TASK_INTERVAL = 50;
        this.ip = ip;
        this.port = port;
        this.tcpClient = new tcpClient_1.TCPClient(ip, port, 5000, this.connected.bind(this), this.received.bind(this), this.error.bind(this));
    }
    getConnectionString() {
        return "tcp://" + this.ip + ":" + this.port;
    }
    processBuffer() {
        if (this.tcpClient) {
            if (this.buffer.length > 0) {
                var data = "";
                var i = 0;
                while (this.buffer.length > 0 && i < 25) {
                    data += this.buffer.shift();
                    i++;
                }
                //data += this.buffer.shift()
                this.tcpClient.send(data, (err) => {
                    if (err) {
                        console.log("tcpClient.write Error:", err);
                        (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.UnsuccessfulOperation, data: "DCCEx TCP processBuffer()" });
                    }
                    else {
                    }
                });
                this.lastSentTime = performance.now();
            }
        }
    }
    error(err) {
        console.log("DCCEx TCP Error:", err);
    }
    // put(msg: string) {
    //   this.buffer.push(msg)
    // }
    start() {
        this.stop();
        if (this.tcpClient) {
            this.tcpClient.start();
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
        if (this.tcpClient) {
            this.tcpClient.stop();
        }
    }
}
exports.DCCExTCPCommandCenter = DCCExTCPCommandCenter;
//# sourceMappingURL=dccExTCPCommandCenter.js.map