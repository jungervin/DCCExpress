"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DCCEx = void 0;
const dcc_1 = require("../../common/src/dcc");
class DCCEx {
    constructor(uuid, name) {
        this.buffer = [];
        this.uuid = uuid;
        this.name = name;
    }
    start() {
        throw new Error("Method not implemented.");
    }
    stop() {
        throw new Error("Method not implemented.");
    }
    setTurnout(address, closed) {
        // <T id state>
        this.buffer.push(`<t ${address} ${closed ? dcc_1.DCCExTurnout.closed : dcc_1.DCCExTurnout.open}>`);
    }
    getTurnout(address) {
        // <H id state>
        throw new Error("Method not implemented.");
        this.buffer.push(`<t ${address} ${closed ? dcc_1.DCCExTurnout.closed : dcc_1.DCCExTurnout.open}>`);
    }
    setAccessoryDecoder(address, on) {
        throw new Error("Method not implemented.");
        this.buffer.push(`<t ${address} ${closed ? dcc_1.DCCExTurnout.closed : dcc_1.DCCExTurnout.open}>`);
    }
    getAccessoryDecoder(address) {
        throw new Error("Method not implemented.");
        this.buffer.push(`<t ${address} ${closed ? dcc_1.DCCExTurnout.closed : dcc_1.DCCExTurnout.open}>`);
    }
    getRBusInfo() {
        throw new Error("Method not implemented.");
        //        this.buffer.push(`<t ${address} ${closed ? DCCExTurnout.closed : DCCExTurnout.open}>`)
    }
    getSystemState() {
        throw new Error("Method not implemented.");
        //      this.buffer.push(`<t ${address} ${closed ? DCCExTurnout.closed : DCCExTurnout.open}>`)
    }
}
exports.DCCEx = DCCEx;
//# sourceMappingURL=dccex.js.map