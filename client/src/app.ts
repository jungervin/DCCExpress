import { CustomCanvas, drawModes } from "./editor/editor";
import { Toolbar } from "./editor/toolbar";
import { TurnoutDoubleElement, TurnoutElement, TurnoutLeftElement, TurnoutRightElement } from "./editor/turnout";
import { Signal1Element } from "./editor/signals";
import { RailView } from "./editor/view";
import { ApiCommands, iData, iGetTurnout, iLoco, iPowerInfo, iRBus, iSettings, iSetPower, iSetTurnout, iSystemStatus, defaultSettings, iLocomotive, iBlockInfo, iTimeInfo, iCommandCenter, CommandCenterTypes, iZ21CommandCenter, FileNames, iSensorInfo } from "../../common/src/dcc";
import { Globals } from "./helpers/globals";
import { Dialog } from "./controls/dialog";
import { wsClient } from "./helpers/ws";
import { toastManager, ToastManager } from "./controls/toastManager";
import { Dispatcher } from "./editor/dispatcher";
import { LocoControlPanel } from "./components/controlPanel";
import { AccessoryAddressElement } from "./editor/button";
import { Api } from "./helpers/api";
import { Task, Tasks } from "./helpers/task";
import { Scheduler } from "./helpers/scheduler";
import { CommandCenterSettingsDialog } from "./dialogs/commandCenterSettingsDialog";

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
    turnouts: { [key: number]: boolean } = {}
    locoControlPanel: LocoControlPanel;
    powerInfo: iPowerInfo = {
        info: undefined,
        current: undefined,
        trackVoltageOn: undefined,
        emergencyStop: undefined,
        programmingModeActive: undefined,
        shortCircuit: undefined,
    }

    currentTask: Task | undefined;
    tasks: Tasks;


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

        Api.init(this)
        this.loadCanvasState();

        window.addEventListener("beforeunload", this.saveCanvasState);
        window.addEventListener("schedulerCompleted", () => {
            alert("schedulerCompleted")
        })



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

        Globals.loadCommandCenterSettings()
        this.toolbar.btnCommandCenterSettings!.onclick = (e) => {
            const cc = new CommandCenterSettingsDialog()
        }


        this.editor.init()

        wsClient.connect()

        Globals.fetchJsonData("/settings.json").then((data: any) => {
            const s = data as iSettings
            Globals.Settings = data as iSettings
            // Globals.Settings.CommandCenter = s.CommandCenter ?? defaultSettings.CommandCenter
            // Globals.Settings.CommandCenterZ21 = s.CommandCenterZ21 ?? defaultSettings.CommandCenterZ21
            // Globals.Settings.CommandCenterDCCExTcp = s.CommandCenterDCCExTcp ?? defaultSettings.CommandCenterDCCExTcp
            // Globals.Settings.CommandCenterDCCExSerial = s.CommandCenterDCCExSerial ?? defaultSettings.CommandCenterDCCExSerial
            Globals.Settings.Dispacher = s.Dispacher ?? defaultSettings.Dispacher
            Globals.Settings.EditorSettings = s.EditorSettings ?? defaultSettings.EditorSettings

            this.editor.fastClock!.visible = Globals.Settings.EditorSettings.ShowClock
            toastManager.showToast("Settings Loaded", "success")
            Globals.fetchJsonData('/config.json').then((conf: any) => {
                this.configLoaded(conf)
                wsClient.send({ type: ApiCommands.getRBusInfo, data: "" })

                toastManager.showToast("Config Loaded", "success")


            }).catch((reason) => {
                //toastManager.showToast("Config Not Loaded<br>"+ reason, "error")
            }).finally(() => {
            })

        }).catch((reason: any) => {
            //toastManager.showToast("Settings Not Loaded<br>"+ reason, "error")
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
                    Dispatcher.exec()
                    // const turnout = this.editor.views.getTurnout(t.address)
                    // if (turnout) {
                    //     this.execDispatcher()
                    // }
                    break;

                case ApiCommands.rbusInfo:
                    this.rbusInfo(msg.data as iRBus)
                    // this.execDispatcher()
                    Dispatcher.exec()
                    break;

                case ApiCommands.sensorInfo:
                    this.sensorInfo(msg.data as iSensorInfo)
                    break;

                case ApiCommands.blockInfo:
                    const blocks = msg.data as { [name: string]: iBlockInfo };
                    Object.values(blocks).forEach((block) => {
                        Object.values(block).forEach((bb) => {
                            this.editor.views.getBlockElements().forEach((b) => {
                                if (b.name === bb.blockName) {
                                    b.setLoco(bb.locoAddress);
                                }
                            })
                        })
                    })
                    break;
                case ApiCommands.settingsInfo:
                    const d = msg.data as iSettings;
                    if (d.Dispacher) {
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
                case ApiCommands.timeInfo:
                    if (this.editor.fastClock) {
                        const ti = msg.data as iTimeInfo
                        this.editor.fastClock.setCurrentTime(ti.timestamp);

                    }
                    break;
                default: console.log("Unknow WS message:", msg)
                    break;
            }
        }

        // A settings betöltése után
        Api.loadLocomotives().then((locos) => {

        })

        this.locoControlPanel = document.getElementById("locoControlPanel") as LocoControlPanel
        this.locos = this.locoControlPanel.locomotives


        this.tasks = new Tasks()
        Dispatcher.App = this
        Api.app = this

        this.toolbar.btnTasks.onclick = (e: MouseEvent) => {
            this.toolbar.tasks = !this.toolbar.tasks
            if (this.toolbar.tasks) {
                this.tasks.stopAllTask()
                this.tasks.tasks.length = 0
                Scheduler.start("scheduler.js").then(() => {
                    this.tasks.startAllTask()
                })
                //this.task1()
                //this.tasks.startAllTask()
                //this.tasks.save()
            } else {
                // const msg = new MessageDialog("Error", "Choose an action!", ["STOP NOW", "STOP ON COMPLETION", "CANCEL"], "")
                // msg.onclose = (sender) => {
                //     if(sender.dialogResultText == "STOP NOW") {
                //     } else if(sender.dialogResultText == "STOP ON COMPLETION") {
                //         this.tasks.stopOnCompletion()
                //     }
                // }
                this.tasks.stopAllTask()

            }
        }

    }
    task1() {

        if (!this.tasks.getTask("Task1")) {

            const task = this.tasks.addTask("Task1")

            task.setLoco(3)

            // ==========================================
            //  Szfvár P3 <=== P2 <== Szabadbattyán P3
            // ==========================================

            //task.waitForMinute(5)
            task.startAtMinutes([5, 15, 25, 35, 45, 55])
            task.setRoute("routeSwitch112")
            task.waitMs(3000, 5000)

            // Kalauz síp
            task.setFunctionMs(17, true, 500)
            task.waitMs(3000, 5000)

            // Hátra és Kürt
            task.reverse(0)
            task.setFunctionMs(3, true, 500)
            task.waitMs(3000, 5000)
            task.reverse(30)

            task.waitForSensor(16, true)

            task.setFunctionMs(3, true, 500)
            task.delay(3000)
            task.stopLoco()

            task.waitMs(10000, 20000)

            // ==========================================
            //  Szfvár P3 ==> P1 ==> Szabadbattyán P3
            // ==========================================

            //task.waitForMinute(5)
            task.startAtMinutes([0, 10, 20, 30, 40, 50])
            task.setRoute("routeSwitch113")
            task.waitMs(3000, 5000)

            // Kalauz síp
            task.setFunctionMs(17, true, 500)

            task.waitMs(3000, 5000)

            // Előre és Kürt
            task.forward(0)
            task.setFunctionMs(3, true, 500)
            task.waitMs(3000, 5000)
            task.forward(30)

            task.waitForSensor(24, true)

            task.setFunctionMs(3, true, 500)

            task.delay(3000)
            task.stopLoco()

            task.waitMs(10000, 20000)

            task.restart()

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
            wsClient.send({ type: ApiCommands.getTurnout, data: { address: s.address } as iGetTurnout } as iData)
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
                    a.t1Closed = data.isClosed == a.t1ClosedValue;
                    this.turnouts[data.address] = a.t1Closed
                    redraw = true
                }
            }
            else if (Object.getPrototypeOf(elem) == TurnoutLeftElement.prototype) {
                var la = elem as TurnoutLeftElement
                if (la.address == data.address) {
                    la.t1Closed = data.isClosed == la.t1ClosedValue;
                    this.turnouts[data.address] = la.t1Closed
                    redraw = true
                }
            }
            else if (Object.getPrototypeOf(elem) == TurnoutDoubleElement.prototype) {
                var td = elem as TurnoutDoubleElement
                if (td.address == data.address) {
                    td.t1Closed = data.isClosed == td.t1ClosedValue; // : td.t1OpenValue
                    this.turnouts[data.address] = td.t1Closed
                    redraw = true
                }
                if (td.address2 == data.address) {
                    td.t2Closed = data.isClosed == td.t2ClosedValue; // : td.t2OpenValue
                    this.turnouts[data.address] = td.t2Closed
                    redraw = true
                }
            }
        })

        const accessories = this.editor.views.getAccessoryElements()
        accessories.forEach((elem: AccessoryAddressElement) => {
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
        if (Globals.CommandCenterSetting.type == CommandCenterTypes.Z21) {
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
    }
    sensorInfo(sensor: iSensorInfo) {
        this.editor.views.getRailElements().forEach(elem => {
                if (elem.rbusAddress == sensor.address) {
                    elem.occupied = sensor.on
                }
        });
        this.editor.views.getSensorElements().forEach(elem => {
                if (elem.address == sensor.address) {
                    elem.on = sensor.on == elem.valueOn
                }
        });
        this.editor.draw()
    }


    procPowerInfo(pi: iPowerInfo) {
        Globals.power = pi
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

    getLoco(addr: number) {
        if (this.locoControlPanel.locomotives) {
            return this.locoControlPanel.locomotives.find((l) => l.address == addr)
        }
        return undefined
    }
}
