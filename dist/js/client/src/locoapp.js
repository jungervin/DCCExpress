define(["require", "exports", "../../common/src/dcc", "./helpers/ws", "./components/controlPanel"], function (require, exports, dcc_1, ws_1, controlPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LocoApp = void 0;
    console.log(dcc_1.ApiCommands);
    console.log(controlPanel_1.LocoControlPanel);
    class LocoApp {
        constructor() {
            this.powerOn = false;
            this.prevPower = undefined;
            ws_1.wsClient.onConnected = () => {
                this.cp.init();
            };
            ws_1.wsClient.onError = () => {
                //this.toolbar.wsStatus?.setAttribute("fill", "red")
            };
            ws_1.wsClient.onMessage = (msg) => {
                switch (msg.type) {
                    case dcc_1.ApiCommands.locoInfo:
                        this.cp.processMessage(msg.data);
                        break;
                    case dcc_1.ApiCommands.systemInfo:
                        this.systemInfo(msg.data);
                        break;
                    case dcc_1.ApiCommands.powerInfo:
                        this.powerInfo(msg.data);
                        break;
                }
            };
            this.cp = document.createElement('loco-control-panel');
            document.body.appendChild(this.cp);
            window.powerChanged = (power) => {
                this.cp.power = power;
            };
            ws_1.wsClient.connect();
        }
        systemInfo(ss) {
            //Bitmask for CentralState:
            const csEmergencyStop = 0x01; // The emergency stop is switched on
            const csTrackVoltageOff = 0x02; // The track voltage is switched off
            const csShortCircuit = 0x04; // Short-circuit
            const csProgrammingModeActive = 0x20; // The programming mode is active
            //Bitmask for CentralStateEx:
            const cseHighTemperature = 0x01; // temperature too high
            const csePowerLost = 0x02; // Input voltage too low
            const cseShortCircuitExternal = 0x04; // S.C. at the external booster output
            const cseShortCircuitInternal = 0x08; // S.C. at the main track or programming track
            //From Z21 FW Version 1.42:
            const cseRCN213 = 0x20; // turnout addresses according to RCN-213
            //From Z21 FW Version 1.42:
            //Bitmask for Capabilities:
            const capDCC = 0x01; // capable of DCC
            const capMM = 0x02; // capable of MM
            //#define capReserved 0x04 // reserved for future development
            const capRailCom = 0x08; // RailCom is activated
            const capLocoCmds = 0x10; // accepts LAN commands for locomotive decoders
            const capAccessoryCmds = 0x20; // accepts LAN commands for accessory decoders
            const capDetectorCmds = 0x40; // accepts LAN commands for detectors
            const capNeedsUnlockCode = 0x80; // device needs activate code (z21start)
            if ((ss.CentralState & 47) > 0) {
                // this.toolbar.btnPower!.classList.remove("success")
                // this.toolbar.btnPower!.classList.add("error")
                this.powerOn = false;
            }
            else {
                // this.toolbar.btnPower!.classList.add("success")
                // this.toolbar.btnPower!.classList.remove("error")
                this.powerOn = true;
            }
            if (this.prevPower != this.powerOn) {
                window.powerChanged(this.powerOn);
                this.prevPower = this.powerOn;
            }
        }
        powerInfo(pi) {
            if (pi.emergencyStop) {
                this.cp.btnEmergency.classList.add("error");
            }
            else {
                this.cp.btnEmergency.classList.remove("error");
            }
            // switch (pi.info) {
            //     case Z21POWERINFO.poweroff:
            //         this.toolbar.btnPower!.classList.remove("sucess")
            //         this.toolbar.btnPower!.classList.add("error")
            //         break;
            //     case Z21POWERINFO.poweron:
            //         this.toolbar.btnPower!.classList.remove("error")
            //         this.toolbar.btnPower!.classList.add("success")
            //         break;
            //     case Z21POWERINFO.programmingmode:
            //         break;
            //     case Z21POWERINFO.shortcircuit:
            //         this.toolbar.btnPower!.classList.remove("sucess")
            //         this.toolbar.btnPower!.classList.add("error")
            //         break;
            // }
        }
    }
    exports.LocoApp = LocoApp;
    const App = new LocoApp();
});
