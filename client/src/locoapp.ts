import { ApiCommands, iData, iLoco, iPowerInfo, iSystemStatus } from "../../common/src/dcc";
import { Globals } from "./helpers/globals";
import { wsClient } from "./helpers/ws";
import { LocoControlPanel } from "./components/controlPanel";


console.log(ApiCommands)
console.log(LocoControlPanel)

export class LocoApp {
    cp: LocoControlPanel;
    // powerOn: boolean = false;
    // prevPower?: boolean = undefined;

    constructor() {

        wsClient.onConnected = () => {
            this.cp.init()
        }
        wsClient.onError = () => {
            //this.toolbar.wsStatus?.setAttribute("fill", "red")
        }

        wsClient.onMessage = (msg: iData) => {
            switch (msg.type) {
                case ApiCommands.locoInfo:
                    this.cp.processMessage(msg.data as iLoco)
                    break;
                // case ApiCommands.systemInfo:
                //     this.systemInfo(msg.data as iSystemStatus)
                //     break;
                case ApiCommands.powerInfo:
                    this.procPowerInfo(msg.data as iPowerInfo)
                    break;
            }
        }

        this.cp = document.createElement('loco-control-panel') as LocoControlPanel
        document.body.appendChild(this.cp)

        window.powerChanged = (power) => {
            this.cp!.power = power
        }

        wsClient.connect()
    }

    // systemInfo(ss: iSystemStatus) {
    //     //Bitmask for CentralState:
    //     const csEmergencyStop = 0x01 // The emergency stop is switched on
    //     const csTrackVoltageOff = 0x02 // The track voltage is switched off
    //     const csShortCircuit = 0x04 // Short-circuit
    //     const csProgrammingModeActive = 0x20 // The programming mode is active
    //     //Bitmask for CentralStateEx:
    //     const cseHighTemperature = 0x01 // temperature too high
    //     const csePowerLost = 0x02 // Input voltage too low
    //     const cseShortCircuitExternal = 0x04 // S.C. at the external booster output
    //     const cseShortCircuitInternal = 0x08 // S.C. at the main track or programming track
    //     //From Z21 FW Version 1.42:
    //     const cseRCN213 = 0x20 // turnout addresses according to RCN-213
    //     //From Z21 FW Version 1.42:
    //     //Bitmask for Capabilities:
    //     const capDCC = 0x01 // capable of DCC
    //     const capMM = 0x02 // capable of MM
    //     //#define capReserved 0x04 // reserved for future development
    //     const capRailCom = 0x08 // RailCom is activated
    //     const capLocoCmds = 0x10 // accepts LAN commands for locomotive decoders
    //     const capAccessoryCmds = 0x20 // accepts LAN commands for accessory decoders
    //     const capDetectorCmds = 0x40 // accepts LAN commands for detectors
    //     const capNeedsUnlockCode = 0x80 // device needs activate code (z21start)

    //     if ((ss.CentralState & 0b0010_1111) > 0) {
    //         // this.toolbar.btnPower!.classList.remove("success")
    //         // this.toolbar.btnPower!.classList.add("error")
    //         this.powerOn = false
    //     } else {
    //         // this.toolbar.btnPower!.classList.add("success")
    //         // this.toolbar.btnPower!.classList.remove("error")
    //         this.powerOn = true
    //     }

    //     if (this.prevPower != this.powerOn) {
    //         window.powerChanged(this.powerOn)
    //         this.prevPower = this.powerOn;
    //     }
    // }

    procPowerInfo(pi: iPowerInfo) {
        if (pi.emergencyStop) {
            this.cp.btnEmergency!.classList.add("error")
        } else {
            this.cp.btnEmergency!.classList.remove("error")
        }
    }


}

const App = new LocoApp()
