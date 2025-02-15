// import { CommandCenter } from "./commandcenter"
// // import { DCCExTCPCommandCenter } from "./dccexcommandcenter"
// // import { Z21CommandCenter } from "./z21commandcenter"

import { log } from "console";
import { CommandCenterTypes, iSetBasicAccessory, iSetTurnout, iGetTurnout, iLoco, iSetLocoFunction, iSetPower } from "../../common/src/dcc";
import { CommandCenter } from "./commandcenter";
import { DCCExTCPCommancenter } from "./dccExTCPCommandCenter";
import { Z21CommandCenter } from "./z21commandcenter";
// import { DeviceManager } from "./devicemanager";

//==================================================
// Start:
//      Stop all devices
//      Read devices from devices.json
//      Start devices
// Tehát meg kell nézni, hogy futnak e kapcsolatok, ezeket le kell állítani
// Ezután beolvasni az eszközöket
// És el kell indítani
//

export class CommandCenters {

    cc?: CommandCenter = undefined;

    getSystemState() {
        if(this.cc) {
            this.cc.getSystemState()
        }
    }

    start() {
        log("Command Centers Start")
        if (this.cc) {
            this.cc.start()
            log(this.cc.name + "Command Center Started!")
        }
    }

    stop() {
        console.log("Command Centers Stopping...")

        if(this.cc) {
            this.cc.stop()
            console.log("Command Centers Stopped")
        }
    }


    clientConnected() {
        // if (this.items) {
        //     for (const [key, cc] of Object.entries(this.items)) {
        //         this.items[key].clientConnected()
        //     }
        // }
    }

    setBasicAccessory(a: iSetBasicAccessory) {
        // const cc = this.items![a.cc.uuid!]
        if (this.cc) {
            this.cc.setAccessoryDecoder(a.address, a.value)
        } else {
            console.log("Command Center doesnt exists:")
        }
        //this.fieldCC!.setAccessoryDecoder(a.address, a.value)
    }

    getBasicAccessory(a: iSetBasicAccessory) {
        // const cc = this.items![a.cc.uuid!]
        if (this.cc) {
            this.cc.getAccessoryDecoder(a.address)
        } else {
            console.log("Command Center doesnt exists:")
        }
        //this.fieldCC!.getAccessoryDecoder(a.address)
    }


    getTurnout(t: iGetTurnout) {
        // const cc = this.items![t.cc.uuid!]
        if (this.cc) {
            this.cc.getTurnout(t.address)
        } else {
            console.log("Command Center doesnt exists:")
        }
        //this.fieldCC!.getTurnout(t.address)
    }


    setTurnout(t: iSetTurnout) {
        // const cc = this.items![0]
        if (this.cc) {
            this.cc.setTurnout(t.address, t.isClosed)
        } else {
            console.log("Command Center doesnt exists:")
            console.log("setTurnout:", t)
        }
        //this.fieldCC!.setTurnout(t.address, t.isClosed)
    }

    getRBusInfo() {
        // const cc = this.items![r.cc.uuid!]
        if (this.cc) {
            this.cc.getRBusInfo()
        } else {
            console.log("Command Center doesnt exists:")
            console.log("getRBusInfo:")
        }
        //this.fieldCC!.getRBusInfo()
    }

    getLoco(loco: iLoco) {
        //z21cc.getLoco(loco.address)
        // if (this.items) {
        //     for (const [key, cc] of Object.entries(this.items)) {
        //         this.items[key].getLoco(loco.address)
        //     }
        // }
        this.cc!.getLoco(loco.address)
    }
    setLoco(loco: iLoco) {
        // z21cc.setLoco(loco.address, loco.speed, loco.direction)
        // if (this.items) {
        //     for (const [key, cc] of Object.entries(this.items)) {
        //         this.items[key].setLoco(loco.address, loco.speed, loco.direction)
        //     }
        // }
        this.cc!.setLoco(loco.address, loco.speed, loco.direction)
    }
    setLocoFunction(loco: iSetLocoFunction) {
        // z21cc.setLocoFunction(loco.address, loco.id, loco.isOn)
        // if (this.items) {
        //     for (const [key, cc] of Object.entries(this.items)) {
        //         this.items[key].setLocoFunction(loco.address, loco.id, loco.isOn)
        //     }
        // }
        this.cc!.setLocoFunction(loco.address, loco.id, loco.isOn)
    }

    setPower(data: iSetPower) {
        // z21cc.trackPower(data.on)
        // if (this.items) {
        //     for (const [key, cc] of Object.entries(this.items)) {
        //         this.items[key].trackPower(data.on)
        //     }
        // }
        this.cc!.trackPower(data.on)
    }
    emergencyStop() {
        // z21cc.emergenyStop(true)
        // if (this.items) {
        //     for (const [key, cc] of Object.entries(this.items)) {
        //         this.items[key].emergenyStop(true)
        //     }
        // }
        this.cc!.emergenyStop(true)
        //this.fieldCC!.emergenyStop(true)
    }
}

log("COMMAND CENTERS")
export const commandCenters = new CommandCenters()
