import { log } from "console";
import { iSetBasicAccessory, iSetTurnout, iGetTurnout, iLoco, iSetLocoFunction, iSetPower, CommandCenterTypes, iZ21CommandCenter, iCommandCenter, iDCCExTcp, iDCCExSerial } from "../../common/src/dcc";
import { CommandCenter } from "./commandcenter";
import { COMMANDCENTER_SETTING_FILE } from "./server";
import * as fs from "fs";
import { Z21CommandCenter } from "./z21commandcenter";
import { DCCExTCPCommandCenter } from "./dccExTCPCommandCenter";
import { DccExSerialCommandCenter } from "./dccExSerialCommandCenter";

export class CommandCenters {
    cc?: CommandCenter = undefined;

    getSystemState() {
        if (this.cc) {
            this.cc.getSystemState()
        }
    }

    start() {
        log("Command Centers Start")
        if (this.cc) {
            this.cc.start()
            log(this.cc.name + "Command Center Started!")
        } else {
            log("Command Center doesn't exists!")
        }
    }

    stop() {
        console.log("Command Centers Stopping...")
        if (this.cc) {
            this.cc.stop()
            console.log("Command Centers Stopped")
        } else {
            log("Command Center doesn't exists!")
        }
    }


    clientConnected() {
        if (this.cc) {
            this.cc.clientConnected()
        } else {
            log("Command Center doesn't exists!")
        }
    }

    setBasicAccessory(a: iSetBasicAccessory) {
        if (this.cc) {
            this.cc.setAccessoryDecoder(a.address, a.value)
        } else {
            log("Command Center doesn't exists!")
        }
    }

    getBasicAccessory(a: iSetBasicAccessory) {
        if (this.cc) {
            this.cc.getAccessoryDecoder(a.address)
        } else {
            log("Command Center doesn't exists!")
        }
    }

    getTurnout(t: iGetTurnout) {
        if (this.cc) {
            this.cc.getTurnout(t.address)
        } else {
            log("Command Center doesn't exists!")
        }
    }

    setTurnout(t: iSetTurnout) {
        if (this.cc) {
            this.cc.setTurnout(t.address, t.isClosed)
        } else {
            log("Command Center doesn't exists!")
        }
    }

    getRBusInfo() {
        if (this.cc) {
            this.cc.getRBusInfo()
        } else {
            log("Command Center doesn't exists!")
        }
    }

    getLoco(loco: iLoco) {
        if (this.cc) {
            this.cc!.getLoco(loco.address)
        } else {
            log("Command Center doesn't exists!")
        }
    }
    setLoco(loco: iLoco) {
        if (this.cc) {
            this.cc!.setLoco(loco.address, loco.speed, loco.direction)
        } else {
            log("Command Center doesn't exists!")
        }
    }
    setLocoFunction(loco: iSetLocoFunction) {
        if (this.cc) {
            this.cc!.setLocoFunction(loco.address, loco.id, loco.isOn)
        } else {
            log("Command Center doesn't exists!")

        }
    }

    setPower(data: iSetPower) {
        if (this.cc) {
            this.cc!.trackPower(data.on)
        } else {
            log("Command Center doesn't exists!")
        }
    }
    emergencyStop() {
        if (this.cc) {
            this.cc!.emergenyStop(true)
        } else {
            log("Command Center doesn't exists!")
        }
    }

    load() {
        log("CommandCenters.load()")
        if (this.cc) {
            this.cc.stop()
        }

        try {
            const ccSettings = JSON.parse(fs.readFileSync(COMMANDCENTER_SETTING_FILE, 'utf8')) as iCommandCenter;
            if (ccSettings.type == CommandCenterTypes.Z21) {
                const z21 = ccSettings.commandCenter as iZ21CommandCenter
                commandCenters.cc = new Z21CommandCenter("z21", z21.ip, z21.port)
                commandCenters.cc.TURNOUT_WAIT_TIME = z21.turnoutActiveTime
                commandCenters.cc.BASICACCESSORY_WAIT_TIME = z21.basicAccessoryDecoderActiveTime
                console.log("Z21 Command Center Registered!")
                console.log("IP:", z21.ip)
                console.log("Port:", z21.port)
                commandCenters.start()
            }
            else if (ccSettings.type == CommandCenterTypes.DCCExTCP) {
                const dccextcp = ccSettings.commandCenter as iDCCExTcp
                commandCenters.cc = new DCCExTCPCommandCenter("dcc-ex-tcp", dccextcp.ip, dccextcp.port)
                commandCenters.cc.TURNOUT_WAIT_TIME = 0 //dccextcp.turnoutActiveTime
                commandCenters.cc.BASICACCESSORY_WAIT_TIME = 0 //dccextcp.basicAccessoryDecoderActiveTime
                console.log("DCCEx TCP Command Center Registered!")
                console.log("IP:", dccextcp.ip)
                console.log("Port:", dccextcp.port)
                commandCenters.start()
            }
            else if (ccSettings.type == CommandCenterTypes.DCCExSerial) {
                const dccexserial = ccSettings.commandCenter as iDCCExSerial
                commandCenters.cc = new DccExSerialCommandCenter("dcc-ex-serial", dccexserial.port, 115200)
                commandCenters.cc.TURNOUT_WAIT_TIME = 0 //dccextcp.turnoutActiveTime
                commandCenters.cc.BASICACCESSORY_WAIT_TIME = 0 //dccextcp.basicAccessoryDecoderActiveTime
                console.log("DCCEx Serial Command Center Registered!")
                console.log("Port:", dccexserial.port)
                commandCenters.start()
            }

        } catch (error) {
            console.log("ServerSetting Error:", error)
        }


    }
}

log("COMMAND CENTERS")
export const commandCenters = new CommandCenters()
