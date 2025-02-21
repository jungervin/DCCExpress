import { CustomCanvas, drawModes } from "./editor/editor";
import { Toolbar } from "./editor/toolbar";
import { TurnoutDoubleElement, TurnoutElement, TurnoutLeftElement, TurnoutRightElement } from "./editor/turnout";
import { Signal1Element } from "./editor/signals";
import { RailView } from "./editor/view";
import { Locos } from "./editor/loco";
import { ApiCommands, iData, iGetTurnout, iLoco, iPowerInfo, iRBus, iSettings, iSetPower, iSetTurnout, iSystemStatus, setDecoder, Z21Directions, Z21POWERINFO, defaultSettings, iLocomotive } from "../../common/src/dcc";
import { Globals } from "./helpers/globals";
import { Dialog } from "./controls/dialog";
import { wsClient } from "./helpers/ws";
import { toastManager, ToastManager } from "./controls/toastManager";
import { Dispatcher } from "./editor/dispatcher";
import { LocoControlPanel } from "./components/controlPanel";
import { audioManager, AudioManager } from "./editor/audioButton";
import { AccessoryDecoderElement } from "./editor/button";
import { Api } from "./helpers/api";

console.log(Dispatcher)
console.log(ApiCommands)
console.log(Dialog)
console.log(ToastManager)
console.log(LocoControlPanel)

export class App {
    editor: CustomCanvas;
    toolbar: Toolbar;
    //locos: Locos | undefined;
    locos: iLocomotive[] = []
    sensors: { [key: number]: boolean } = {}
    decoders: { [key: number]: boolean } = {}
    locoControlPanel: LocoControlPanel;
    powerInfo: iPowerInfo = {
        info: undefined,
        current: undefined,
        trackVoltageOn: undefined,
        emergencyStop: undefined,
        programmingModeActive: undefined,
        shortCircuit: undefined,
    }
    audioManager: AudioManager;


    saveCanvasState() {
        const state = {
            originX: this.editor.originX,
            originY: this.editor.originY,
            scale: this.editor.scale,
        };
        localStorage.setItem("canvasState", JSON.stringify(state));
        console.log("Canvas state saved!", state);
    }
    loadCanvasState() {
        const savedState = localStorage.getItem("canvasState");
        if (savedState) {
            const state = JSON.parse(savedState);
            this.editor.originX = state.originX;
            this.editor.originY = state.originY;
            this.editor.scale = state.scale;
            console.log("Canvas state loaded!", state);
        }
    }

    constructor() {

        this.loadCanvasState(); 

        window.addEventListener("beforeunload", this.saveCanvasState);

        this.audioManager = audioManager

        this.toolbar = document.getElementById("toolbar") as Toolbar
        this.editor = document.getElementById("editorCanvas") as CustomCanvas
        this.editor.toolbar = this.toolbar
        this.toolbar.canvas = this.editor
        this.toolbar.canvas.drawMode = drawModes.pointer

        this.toolbar!.btnPower!.onclick = (e: MouseEvent) => {
            const p: iSetPower = { on: !this.powerInfo.trackVoltageOn }
            wsClient.send({ type: ApiCommands.setPower, data: p } as iData)
        }

        this.toolbar!.btnEmergencyStop!.onclick = (e: MouseEvent) => {
            wsClient.send({ type: ApiCommands.emergencyStop, data: "" } as iData)
        }

        window.addEventListener("resize", (ev) => {
            this.editor.canvas.width = window.innerWidth;
            this.editor.canvas.height = window.innerHeight;
            this.editor.draw()
        })

        this.editor.init()

        wsClient.connect()

        Globals.fetchJsonData("/settings.json").then((data: any) => {
            const s = data as iSettings
            Globals.Settings = data as iSettings
            Globals.Settings.CommandCenter = s.CommandCenter ?? defaultSettings.CommandCenter
            Globals.Settings.CommandCenterZ21 = s.CommandCenterZ21 ?? defaultSettings.CommandCenterZ21
            Globals.Settings.CommandCenterDCCExTcp = s.CommandCenterDCCExTcp ?? defaultSettings.CommandCenterDCCExTcp
            Globals.Settings.CommandCenterDCCExSerial = s.CommandCenterDCCExSerial ?? defaultSettings.CommandCenterDCCExSerial
            Globals.Settings.Dispacher = s.Dispacher ?? defaultSettings.Dispacher
            Globals.Settings.EditorSettings = s.EditorSettings ?? defaultSettings.EditorSettings

            
            this.editor.fastClock!.setScaleFactor(Globals.Settings.EditorSettings.fastClockFactor)
            this.editor.fastClock!.visible = Globals.Settings.EditorSettings.ShowClock

            Globals.fetchJsonData('/config.json').then((conf: any) => {
                this.configLoaded(conf)
                wsClient.send({ type: ApiCommands.getRBusInfo, data: "" })                
            }).catch((reason) => {
                alert("Config Error:\n" + reason)
            })

        }).catch((reason: any) => {
            alert("Settings Error:\n" + reason)
        }).finally(() => {
        })

        wsClient.onConnected = () => {
            this.toolbar.wsStatus!.classList.remove("error")
            this.toolbar.wsStatus!.classList.add("success")
            
            this.locoControlPanel.init()

        }
        wsClient.onError = () => {
            this.toolbar.wsStatus!.classList.remove("success")
            this.toolbar.wsStatus!.classList.add("error")
        }

        wsClient.onMessage = (msg: iData) => {
            switch (msg.type) {

                case ApiCommands.locoInfo:
                    if (this.locoControlPanel) {
                        this.locoControlPanel.processMessage(msg.data as iLoco)
                    }
                    break
                // case ApiCommands.commandCenterInfos:
                //     Globals.devices = msg.data as iCommandCenter[]
                //     break;

                case ApiCommands.turnoutInfo:
                    const t = msg.data as iSetTurnout
                    this.turnoutInfo(t)
                    const turnout = this.editor.views.getTurnout(t.address)
                    if (turnout) {
                        this.execDispatcher()
                    }
                    break;

                case ApiCommands.rbusInfo:
                    this.rbusInfo(msg.data as iRBus)
                    this.execDispatcher()
                    break;

                // case ApiCommands.configLoaded:
                //     // this.configLoaded(msg.data)
                //     break;

                case ApiCommands.settingsInfo:
                    //setSettings(msg.data)
                    const d = msg.data as iSettings;
                    //console.log(d)
                    if (d.CommandCenter && d.Dispacher) {
                        Globals.Settings = d
                    }
                    break;

                case ApiCommands.systemInfo:
                    this.systemInfo(msg.data as iSystemStatus)
                    break;
                case ApiCommands.powerInfo:
                    this.procPowerInfo(msg.data as iPowerInfo)
                    break;
                case ApiCommands.UnsuccessfulOperation:
                    toastManager.showToast("UnsuccessfulOperation")
                    break;
                default: console.log("Unknow WS message:", msg)
                    break;
            }
        }



        // A settings betöltése után

        this.locoControlPanel = document.getElementById("locoControlPanel") as LocoControlPanel
        this.locos = this.locoControlPanel.locomotives
        Dispatcher.App = this
        Api.app = this
    }
    execDispatcher() {
        return;
        var t10 = this.editor.views.getTurnout(10)
        const signal55 = this.editor.views.getSignal(55);
        const signal50 = this.editor.views.getSignal(50);

        if (this.sensors[12]) {
            signal55?.sendRed()
        } else {
            signal55?.sendGreen()
        }

        if (this.sensors[12] == false) {
            if (t10?.t1Closed) {
                signal50?.sendGreen()
            } else {
                signal50?.sendYellow()
            }
        } else {
            signal50?.sendRed()
        }


    }
    systemInfo(ss: iSystemStatus) {
        // //Bitmask for CentralState:
        // const csEmergencyStop = 0x01 // The emergency stop is switched on
        // const csTrackVoltageOff = 0x02 // The track voltage is switched off
        // const csShortCircuit = 0x04 // Short-circuit
        // const csProgrammingModeActive = 0x20 // The programming mode is active
        // //Bitmask for CentralStateEx:
        // const cseHighTemperature = 0x01 // temperature too high
        // const csePowerLost = 0x02 // Input voltage too low
        // const cseShortCircuitExternal = 0x04 // S.C. at the external booster output
        // const cseShortCircuitInternal = 0x08 // S.C. at the main track or programming track
        // //From Z21 FW Version 1.42:
        // const cseRCN213 = 0x20 // turnout addresses according to RCN-213
        // //From Z21 FW Version 1.42:
        // //Bitmask for Capabilities:
        // const capDCC = 0x01 // capable of DCC
        // const capMM = 0x02 // capable of MM
        // //#define capReserved 0x04 // reserved for future development
        // const capRailCom = 0x08 // RailCom is activated
        // const capLocoCmds = 0x10 // accepts LAN commands for locomotive decoders
        // const capAccessoryCmds = 0x20 // accepts LAN commands for accessory decoders
        // const capDetectorCmds = 0x40 // accepts LAN commands for detectors
        // const capNeedsUnlockCode = 0x80 // device needs activate code (z21start)

        // if ((ss.CentralState & 0b0010_1111) > 0) {
        //     this.toolbar.btnPower!.classList.remove("success")
        //     this.toolbar.btnPower!.classList.add("error")
        //     this.powerOn = false
        // } else {
        //     this.toolbar.btnPower!.classList.add("success")
        //     this.toolbar.btnPower!.classList.remove("error")
        //     this.powerOn = true
        // }

        // if (this.prevPower != this.powerOn) {
        //     window.powerChanged(this.powerOn)
        //     this.prevPower = this.powerOn;
        // }

    }
    configLoaded(config: any) {
        this.editor.load(config)
        //this.locos!.load(config)

        var turnouts = this.editor.views.getTurnoutElements()
        turnouts.forEach((t) => {
            //IOConn.socket.emit(ApiCommands.getTurnout, t.address)
            wsClient.send({ type: ApiCommands.getTurnout, data: { address: t.address } as iGetTurnout } as iData)
            if (Object.getPrototypeOf(t) == TurnoutDoubleElement.prototype) {
                const t2 = t as TurnoutDoubleElement
                wsClient.send({ type: ApiCommands.getTurnout, data: { address: t2.address2 } as iGetTurnout } as iData)
            }
        })

        var signals = this.editor.views.getSignalElements()
        signals.forEach((s) => {
            for (var i = 0; i < s.addressLength; i++) {
                wsClient.send({ type: ApiCommands.getTurnout, data: { address: s.address + i } as iGetTurnout } as iData)
                //wsClient.send(ApiCommands.getTurnout, s.address + i)
            }
        })

        var accessories = this.editor.views.getAccessoryElements()
        accessories.forEach((s) => {
                wsClient.send({ type: ApiCommands.getTurnout, data: { address: s.address} as iGetTurnout } as iData)
        })

    }
    turnoutInfo(data: iSetTurnout) {
        //console.log("turnout", data)
        this.decoders[data.address] = data.isClosed
        var redraw = false

        this.editor.views.getSignalElements().forEach((elem: Signal1Element) => {
            // if (data.cc && elem.cc && elem.cc!.uuid == data.cc.uuid)
            {
                elem.setValue(data.address, data.isClosed)
                redraw = true
            }
        })

        const turnouts = this.editor.views.getTurnoutElements()
        turnouts.forEach((elem: any) => {
            if (Object.getPrototypeOf(elem) == TurnoutRightElement.prototype) {
                var a = elem as TurnoutRightElement
                if (a.address == data.address) {
                    a.t1Closed = data.isClosed == a.t1ClosedValue;// : a.t1OpenValue
                    redraw = true
                }
            }
            else if (Object.getPrototypeOf(elem) == TurnoutLeftElement.prototype) {
                var la = elem as TurnoutLeftElement
                if (la.address == data.address) {
                    la.t1Closed = data.isClosed == la.t1ClosedValue; // : la.t1OpenValue
                    redraw = true
                }
            }
            else if (Object.getPrototypeOf(elem) == TurnoutDoubleElement.prototype) {
                var td = elem as TurnoutDoubleElement
                if (td.address == data.address) {
                    td.t1Closed = data.isClosed == td.t1ClosedValue; // : td.t1OpenValue
                    redraw = true
                }
                if (td.address2 == data.address) {
                    td.t2Closed = data.isClosed == td.t2ClosedValue; // : td.t2OpenValue
                    redraw = true
                }
            }
        })
        
        const accessories = this.editor.views.getAccessoryElements()
        accessories.forEach((elem: AccessoryDecoderElement) => {
            if (elem.address == data.address) {
                elem.on = data.isClosed ? elem.valueOn : elem.valueOff
                redraw = true
            }
        })

        if (redraw) {

            var items = this.editor.views.getRailElements()
            items.forEach((e) => {
                e.isVisited = false;
                e.isRoute = false;
            })

            var routes = this.editor.views.getRouteSwitchElements()
            routes.forEach((r) => {
                r.active = false
                if (r.isActive(turnouts)) {
                    r.active = true
                    console.log("ROUTE IS ACTIVE:", r.name)
                    if (r.turnouts.length > 0) {
                        var to = r.turnouts[0];
                        var tt = this.editor.views.getTurnoutElements().find((t: TurnoutElement) => {
                            return t.address == to.address
                        })
                        var obj = this.editor.views.getObjectXy(tt!.pos) as RailView
                        this.editor.views.startWalk(obj)
                    }
                }

            })
            this.editor.draw()
        }
    }
    rbusInfo(data: iRBus) {
        var g = data.group * 100;
        for (var i = 0; i < data.bytes.length; i++) {
            var byte = data.bytes[i]
            for (var j = 0; j <= 7; j++) {
                var bit = (byte & (1 << j)) > 0
                var addr = g + (i + 1) * 10 + j + 1
                var on = (byte & (1 << j)) > 0
                this.sensors[addr] = on;
                this.editor.views.elements.forEach(elem => {
                    if (elem instanceof RailView) {
                        if (elem.rbusAddress == addr) {
                            elem.occupied = on
                        }
                    }
                });
            }
        }
        this.editor.draw()
    }
    procPowerInfo(pi: iPowerInfo) {

        if (this.powerInfo.emergencyStop != pi.emergencyStop) {
            window.powerChanged(pi)
            if (pi.emergencyStop) {
                this.toolbar.btnEmergencyStop!.classList.add("error")
            } else {
                this.toolbar.btnEmergencyStop!.classList.remove("error")
            }
        }

        if (this.powerInfo.trackVoltageOn != pi.trackVoltageOn) {
            window.powerChanged(pi)
            if (pi.trackVoltageOn) {
                this.toolbar.btnPower!.classList.add("success")
            } else {
                this.toolbar.btnPower!.classList.remove("success")
            }
        }

        this.powerInfo = pi;


        // switch (pi.info) {
        //     case Z21POWERINFO.poweroff:
        //         this.toolbar.btnPower!.classList.remove("sucess")
        //         this.toolbar.btnPower!.classList.add("error")
        //         this.powerOn = false
        //         break;

        //     case Z21POWERINFO.poweron:
        //         this.toolbar.btnPower!.classList.remove("error")
        //         this.toolbar.btnPower!.classList.add("success")
        //         this.powerOn = true
        //         break;

        //     case Z21POWERINFO.programmingmode:
        //         break;

        //     case Z21POWERINFO.shortcircuit:
        //         this.toolbar.btnPower!.classList.remove("sucess")
        //         this.toolbar.btnPower!.classList.add("error")
        //         break;
        // }

        // if (this.prevPower != this.powerOn) {
        //     window.powerChanged(this.powerOn)
        //     this.prevPower = this.powerOn;
        // }


    }

    getLoco(addr    : number) {
        if(this.locoControlPanel.locomotives) {
        return this.locoControlPanel.locomotives.find((l) => l.address == addr)
        }
        return undefined
    }
}
