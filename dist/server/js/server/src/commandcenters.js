"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandCenters = exports.CommandCenters = void 0;
const console_1 = require("console");
class CommandCenters {
    constructor() {
        this.cc = undefined;
    }
    getSystemState() {
        if (this.cc) {
            this.cc.getSystemState();
        }
    }
    start() {
        (0, console_1.log)("Command Centers Start");
        if (this.cc) {
            this.cc.start();
            (0, console_1.log)(this.cc.name + "Command Center Started!");
        }
        else {
            (0, console_1.log)("Command Center doesn't exists!");
        }
    }
    stop() {
        console.log("Command Centers Stopping...");
        if (this.cc) {
            this.cc.stop();
            console.log("Command Centers Stopped");
        }
        else {
            (0, console_1.log)("Command Center doesn't exists!");
        }
    }
    clientConnected() {
        if (this.cc) {
            this.cc.clientConnected();
        }
        else {
            (0, console_1.log)("Command Center doesn't exists!");
        }
    }
    setBasicAccessory(a) {
        if (this.cc) {
            this.cc.setAccessoryDecoder(a.address, a.value);
        }
        else {
            (0, console_1.log)("Command Center doesn't exists!");
        }
    }
    getBasicAccessory(a) {
        if (this.cc) {
            this.cc.getAccessoryDecoder(a.address);
        }
        else {
            (0, console_1.log)("Command Center doesn't exists!");
        }
    }
    getTurnout(t) {
        if (this.cc) {
            this.cc.getTurnout(t.address);
        }
        else {
            (0, console_1.log)("Command Center doesn't exists!");
        }
    }
    setTurnout(t) {
        if (this.cc) {
            this.cc.setTurnout(t.address, t.isClosed);
        }
        else {
            (0, console_1.log)("Command Center doesn't exists!");
        }
    }
    getRBusInfo() {
        if (this.cc) {
            this.cc.getRBusInfo();
        }
        else {
            (0, console_1.log)("Command Center doesn't exists!");
        }
    }
    getLoco(loco) {
        if (this.cc) {
            this.cc.getLoco(loco.address);
        }
        else {
            (0, console_1.log)("Command Center doesn't exists!");
        }
    }
    setLoco(loco) {
        if (this.cc) {
            this.cc.setLoco(loco.address, loco.speed, loco.direction);
        }
        else {
            (0, console_1.log)("Command Center doesn't exists!");
        }
    }
    setLocoFunction(loco) {
        if (this.cc) {
            this.cc.setLocoFunction(loco.address, loco.id, loco.isOn);
        }
        else {
            (0, console_1.log)("Command Center doesn't exists!");
        }
    }
    setPower(data) {
        if (this.cc) {
            this.cc.trackPower(data.on);
        }
        else {
            (0, console_1.log)("Command Center doesn't exists!");
        }
    }
    emergencyStop() {
        if (this.cc) {
            this.cc.emergenyStop(true);
        }
        else {
            (0, console_1.log)("Command Center doesn't exists!");
        }
    }
}
exports.CommandCenters = CommandCenters;
(0, console_1.log)("COMMAND CENTERS");
exports.commandCenters = new CommandCenters();
//# sourceMappingURL=commandcenters.js.map