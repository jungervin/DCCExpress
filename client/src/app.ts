import { CustomCanvas, drawModes } from "./editor/editor";
import { Toolbar } from "./editor/toolbar";
import { TurnoutDoubleElement, TurnoutElement, TurnoutLeftElement, TurnoutRightElement } from "./editor/turnout";
import { Signal1Element } from "./editor/signals";
import { RailView } from "./editor/view";
import { Locos } from "./editor/loco";
import { ApiCommands, iData, iGetTurnout, iLoco, iPowerInfo, iRBus, iServerSettings, iSetPower, iSetTurnout, iSystemStatus, setDecoder, Z21Directions, Z21POWERINFO } from "../../common/src/dcc";
import { Globals } from "./helpers/globals";
import { Dialog } from "./controls/dialog";
import { wsClient } from "./helpers/ws";
import { toastManager, ToastManager } from "./controls/toastManager";
import { Dispatcher } from "./editor/dispatcher";
import { LocoControlPanel } from "./components/controlPanel";

console.log(Dispatcher)
console.log(ApiCommands)
console.log(Dialog)
console.log(ToastManager)
console.log(LocoControlPanel)

export class App {
    editor: CustomCanvas;
    toolbar: Toolbar;

    locos: Locos | undefined;
    sensors: { [key: number]: boolean } = {}
    decoders: { [key: number]: boolean } = {}
    locoControlPanel: LocoControlPanel;
    powerOn: boolean = false;
    prevPower?: boolean = undefined;
    //static wsClient: WebSocket

    //commandCenters: iCommandCenter[] = []
    constructor() {
        //Dispatcher.intervalTime = 111
        this.toolbar = document.getElementById("toolbar") as Toolbar

        this.editor = document.getElementById("editorCanvas") as CustomCanvas
        this.editor.toolbar = this.toolbar
        this.toolbar.canvas = this.editor
        this.toolbar.canvas.drawMode = drawModes.pointer

        this.toolbar!.btnPower!.onclick = (e: MouseEvent) => {
            const p: iSetPower = { on: !this.powerOn }
            wsClient.send({ type: ApiCommands.setPower, data: p } as iData)
        }

        this.toolbar!.btnEmergencyStop!.onclick = (e: MouseEvent) => { 
            //wsClient.send({ type: ApiCommands.emergencyStop, data: "" } as iData)

            if (this.powerOn) {
                wsClient.send({ type: ApiCommands.emergencyStop, data: "" } as iData)
            } else {
                wsClient.send({ type: ApiCommands.setPower, data: { on: true } as iSetPower } as iData)
            }


    }

        //IOConn.initialize(document.location.origin)

        // this.canvas.socket = IOConn.socket
        // this.canvas.views.socket = IOConn.socket;

        this.editor.init()

        wsClient.onConnected = () => {
            this.toolbar.wsStatus!.classList.remove("error")
            this.toolbar.wsStatus!.classList.add("success")
            wsClient.send({ type: ApiCommands.getSettings, data: "" })
            // wsClient.send({ type: ApiCommands.getCommandCenters, data: "" })
            wsClient.send({ type: ApiCommands.configLoad, data: "" })
            this.locoControlPanel.init()
            wsClient.send({ type: ApiCommands.getRBusInfo, data: "" })

        }
        wsClient.onError = () => {
            this.toolbar.wsStatus!.classList.remove("success")
            this.toolbar.wsStatus!.classList.add("error")
            //this.toolbar.wsStatus?.setAttribute("fill", "red")
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

                case ApiCommands.configLoaded:
                    this.configLoaded(msg.data)
                    break;

                case ApiCommands.settingsInfo:
                    //setSettings(msg.data)
                    const d = msg.data as iServerSettings;
                    //console.log(d)
                    if (d.CommandCenter && d.Dispacher) {
                        Globals.ServerSettings = d
                    }
                    break;

                case ApiCommands.systemInfo:
                    this.systemInfo(msg.data as iSystemStatus)
                    break;
                case ApiCommands.powerInfo:
                    this.powerInfo(msg.data as iPowerInfo)
                    break;
                case ApiCommands.UnsuccessfulOperation:
                    toastManager.showToast("UnsuccessfulOperation")
                    break;
                default: console.log("Unknow WS message:", msg)
                    break;
            }
        }



        window.addEventListener("resize", (ev) => {
            this.editor.canvas.width = window.innerWidth;
            this.editor.canvas.height = window.innerHeight;
            this.editor.draw()
        })

        // IOConn.socket.on(ApiCommands.locoState, (data: iLoco) => {
        //     var loco = this.locos?.locos.find((l: LocoElement) => {
        //         return l.address == data.address
        //     })

        //     if (loco) {
        //         loco.speed = data.speed
        //         loco.forward = data.direction == Z21Directions.forward
        //         for (var i = 0; i <= 28; i++) {
        //             if (loco.functions[i]) {
        //                 loco.functions[i].isOn = (data.functions & (1 << i)) > 0x00
        //             }
        //         }
        //         if (loco.address == data.address) {
        //             this.locos!.updateUI()
        //         }
        //     }
        // })
        // // IOConn.socket.on("systemstate", (data) => {
        // //     document.getElementById("systemstatus")!.innerHTML = `MainCurrent: ${data.MainCurrent} mA | Temp: ${data.Temperature} °C`
        // // })

        // IOConn.socket.on(ApiCommands.commandCenters, (data) => {
        //     Globals.devices = data
        //     data.forEach((c: iCommandCenter) => {
        //         console.log(c.name)
        //     })
        //     console.log(data)
        // })

        // IOConn.socket.on(ApiCommands.alert, (data: iData) => {
        //     alert(data.data)
        // })


        wsClient.connect()

        this.locoControlPanel = document.getElementById("locoControlPanel") as LocoControlPanel

        Dispatcher.App = this
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
        //Bitmask for CentralState:
        const csEmergencyStop = 0x01 // The emergency stop is switched on
        const csTrackVoltageOff = 0x02 // The track voltage is switched off
        const csShortCircuit = 0x04 // Short-circuit
        const csProgrammingModeActive = 0x20 // The programming mode is active
        //Bitmask for CentralStateEx:
        const cseHighTemperature = 0x01 // temperature too high
        const csePowerLost = 0x02 // Input voltage too low
        const cseShortCircuitExternal = 0x04 // S.C. at the external booster output
        const cseShortCircuitInternal = 0x08 // S.C. at the main track or programming track
        //From Z21 FW Version 1.42:
        const cseRCN213 = 0x20 // turnout addresses according to RCN-213
        //From Z21 FW Version 1.42:
        //Bitmask for Capabilities:
        const capDCC = 0x01 // capable of DCC
        const capMM = 0x02 // capable of MM
        //#define capReserved 0x04 // reserved for future development
        const capRailCom = 0x08 // RailCom is activated
        const capLocoCmds = 0x10 // accepts LAN commands for locomotive decoders
        const capAccessoryCmds = 0x20 // accepts LAN commands for accessory decoders
        const capDetectorCmds = 0x40 // accepts LAN commands for detectors
        const capNeedsUnlockCode = 0x80 // device needs activate code (z21start)

        if ((ss.CentralState & 0b0010_1111) > 0) {
            this.toolbar.btnPower!.classList.remove("success")
            this.toolbar.btnPower!.classList.add("error")
            this.powerOn = false
        } else {
            this.toolbar.btnPower!.classList.add("success")
            this.toolbar.btnPower!.classList.remove("error")
            this.powerOn = true
        }

        if (this.prevPower != this.powerOn) {
            window.powerChanged(this.powerOn)
            this.prevPower = this.powerOn;
        }

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

        // Globals.devices.forEach((cc) => {
        //     wsClient.send({ type: ApiCommands.getRBusInfo, data: { cc: cc } as iGetRBusInfo } as iData)
        // })


        // const d = new Dialog(300, 200, "Shapes")
        // const shape1 = new ShapeCombobox(
        //     turnouts
        // )
        // const shape2 = new ShapeCombobox(
        //     turnouts
        // )
        // const ok = new Button("OK")
        // ok.onclick = () => { d.close() }
        // const cancel = new Button("Cancel")
        // d.addBody(shape1)
        // //d.addBody(shape2)
        // d.addFooter(ok)
        // d.addFooter(cancel)

        // const shape2 = new ShapeCombobox([{label: "kettő", shape: turnouts[1]}])
        // d.addBody(shape2)


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
    powerInfo(pi: iPowerInfo) {

        if (pi.emergencyStop) {
            this.toolbar.btnEmergencyStop!.classList.add("error")
            
        } else {
            this.toolbar.btnEmergencyStop!.classList.remove("error")
        }


        switch (pi.info) {
            case Z21POWERINFO.poweroff:
                this.toolbar.btnPower!.classList.remove("sucess")
                this.toolbar.btnPower!.classList.add("error")
                this.powerOn = false
                break;

            case Z21POWERINFO.poweron:
                this.toolbar.btnPower!.classList.remove("error")
                this.toolbar.btnPower!.classList.add("success")
                this.powerOn = true
                break;

            case Z21POWERINFO.programmingmode:
                break;

            case Z21POWERINFO.shortcircuit:
                this.toolbar.btnPower!.classList.remove("sucess")
                this.toolbar.btnPower!.classList.add("error")
                break;
        }

        if (this.prevPower != this.powerOn) {
            window.powerChanged(this.powerOn)
            this.prevPower = this.powerOn;
        }


    }

}
