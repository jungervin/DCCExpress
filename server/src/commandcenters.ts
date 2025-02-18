import { log } from "console";
import { iSetBasicAccessory, iSetTurnout, iGetTurnout, iLoco, iSetLocoFunction, iSetPower } from "../../common/src/dcc";
import { CommandCenter } from "./commandcenter";

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
        if(this.cc) {
            this.cc.clientConnected()   
        }else {
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
}

log("COMMAND CENTERS")
export const commandCenters = new CommandCenters()
