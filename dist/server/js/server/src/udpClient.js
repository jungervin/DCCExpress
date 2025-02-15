"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UDPClient = void 0;
const dgram_1 = __importDefault(require("dgram"));
const utility_1 = require("./utility");
class UDPClient {
    constructor(name, ip, port, callback) {
        this.name = "udp client";
        this.ip = "";
        this.port = 21105;
        this.name = name;
        this.ip = ip;
        this.port = port;
        this.client = dgram_1.default.createSocket('udp4');
        //this.client.bind(21105)
        this.client.on("listening", () => {
            (0, utility_1.log)(`UDPClient listening: ${this.client.address().address}:${this.client.address().port}`);
            (0, utility_1.log)('Receive Buffer Size:', this.client.getRecvBufferSize());
            (0, utility_1.log)('Send Buffer Size:', this.client.getSendBufferSize());
        });
        this.client.on("message", (data, rinfo) => {
            if (callback) {
                callback(data, rinfo);
            }
        });
    }
    send(data, callback) {
        this.client.send(data, this.port, this.ip, (error, bytes) => {
            callback(error, bytes);
        });
    }
}
exports.UDPClient = UDPClient;
//# sourceMappingURL=udpClient.js.map