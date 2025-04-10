import { CustomCanvas, drawModes } from "./editor/editor";
import { Toolbar } from "./editor/toolbar";
import { TurnoutDoubleElement, TurnoutElement, TurnoutLeftElement, TurnoutRightElement } from "./editor/turnout";
import { Signal1Element } from "./editor/signals";
import { RailView } from "./editor/view";
import { ApiCommands, iData, iGetTurnout, iLoco, iPowerInfo, iRBus, iSettings, iSetPower, iSetTurnout, iSystemStatus, defaultSettings, iLocomotive, iBlockInfo, iTimeInfo, iCommandCenter, CommandCenterTypes, iZ21CommandCenter, FileNames, iSensorInfo, iOutputInfo, iDccExDirectCommandResponse } from "../../common/src/dcc";
import { Globals } from "./helpers/globals";
import { Dialog } from "./controls/dialog";
import { wsClient } from "./helpers/ws";
import { toastManager, ToastManager } from "./controls/toastManager";
import { Dispatcher } from "./helpers/dispatcher";
import { LocoControlPanel } from "./components/controlPanel";
import { AccessoryAddressElement } from "./editor/button";
import { Api } from "./helpers/api";
import { Task, Tasks } from "./helpers/task";
import { Scheduler } from "./helpers/scheduler";
import { CommandCenterSettingsDialog } from "./dialogs/commandCenterSettingsDialog";
import { ProgrammerDialog } from "./dialogs/programmerDialog";
import { SchedulerButtonShapeElement } from "./editor/schedulerButton";

console.log(Dispatcher)
console.log(ApiCommands)
console.log(Dialog)
console.log(ToastManager)
console.log(LocoControlPanel)
console.log(Toolbar)

export class App {
    editor: CustomCanvas;
    toolbar: Toolbar;
    //locos: Locos | undefined;
    locos: iLocomotive[] = []
    sensors: { [key: number]: boolean } = {}
    outputs: { [key: number]: boolean } = {}
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


        Scheduler.onerror = (msg, err) => {
            alert(msg + "\n\n" + err)
        }

        this.toolbar = document.getElementById("toolbar") as Toolbar
        this.editor = document.getElementById("editorCanvas") as CustomCanvas
        this.editor.toolbar = this.toolbar
        this.toolbar.canvas = this.editor
        this.toolbar.canvas.drawMode = drawModes.pointer

        this.toolbar!.btnPower!.onclick = (e: MouseEvent) => {
            const p: iSetPower = { on: !this.powerInfo.trackVoltageOn }
            wsClient.send({ type: ApiCommands.setTrackPower, data: p } as iData)
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
            this.editor.unselectAll()
            const cc = new CommandCenterSettingsDialog()
        }


        this.editor.init()




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

                toastManager.showToast("Config Loaded", "success")




            }).catch((reason) => {

            }).finally(() => {
                wsClient.connect()
            })

        }).catch((reason: any) => {

        }).finally(() => {

        })

        wsClient.onConnected = () => {
            this.toolbar.wsStatus!.classList.remove("error")
            this.toolbar.wsStatus!.classList.add("success")

            //this.locoControlPanel.init()
            this.locoControlPanel.fetchLocomotives().then(() => {
                Api.fetchBlocks()
            })

            wsClient.send({ type: ApiCommands.getRBusInfo, data: "" })

            Api.app.editor.views.getTurnoutElements().forEach((t) => {
                wsClient.send({ type: ApiCommands.getTurnout, data: { address: t.address } as iGetTurnout } as iData)
                if (t instanceof TurnoutDoubleElement) {
                    wsClient.send({ type: ApiCommands.getTurnout, data: { address: t.address2 } as iGetTurnout } as iData)
                }
            })



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
                        Dispatcher.exec()
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
                    Dispatcher.exec()
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

                case ApiCommands.outputInfo:
                    const output = msg.data as iOutputInfo
                    this.outputs[output.address] = output.value
                    this.editor.views.getButtonElements().forEach((b) => {
                        if (b.address == output.address) {
                            b.on = output.value == b.valueOn
                            this.outputs[output.address] = b.on
                            this.editor.draw()
                            Dispatcher.exec()
                        }
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
                case ApiCommands.dccExDirectCommandResponse:
                    console.log("dccExDirectCommandResponse", msg.data)
                    if (window.directCommandResponse) {
                        window.directCommandResponse(msg.data as iDccExDirectCommandResponse)
                    }
                    break;
                default: console.log("Unknow WS message:", msg)
                    break;
            }
        }

        // A settings betöltése után??
        // Api.loadLocomotives().then((locos) => {

        // })

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
                    this.tasks.startAutoStart()
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

        this.toolbar.btnProgrammer.onclick = (e: MouseEvent) => {
            if (this.toolbar.programmerButtonEnabled) {
                const d = new ProgrammerDialog()
            }
        }


        this.toolbar.btnTaskStartAll.onclick = (e: MouseEvent) => {
            this.tasks.startAllTask()
        }
        this.toolbar.btnTaskStopAll.onclick = (e: MouseEvent) => {
            this.tasks.stopAllTask()
        }
        this.toolbar.btnTaskResumeAll.onclick = (e: MouseEvent) => {
            this.tasks.resumeAllTask()
        }
        this.toolbar.btnTaskFinishAll.onclick = (e: MouseEvent) => {
            this.tasks.finishAllTask(!(this.tasks.allFinish > 0))
        }

        Scheduler.onchange = () => {
            this.toolbar.taskButtonsEnabled = Scheduler.isLoaded
            if (this.editor.selectedElement instanceof SchedulerButtonShapeElement) {
                this.editor.propertyPanel!.selectedObject = undefined
                this.editor.propertyPanel!.selectedObject = this.editor.selectedElement
            }
            this.updateTasks()
        }

        window.addEventListener('taskChangedEvent', (e: Event) => {
            this.updateTasks()
        })

        const worker = new Worker("js/worker.js");
        worker.postMessage("msg")
        worker.onmessage = function (e) {
            Api.app.tasks.exec()
            Dispatcher.exec()
            worker.postMessage("p")
        };
    }


    updateTasks() {
        var running = this.tasks.allRuning
        switch (running) {
            case 1: this.toolbar.btnTaskStartAll.style.backgroundColor = "lime"
                break;
            case 0: this.toolbar.btnTaskStartAll.style.backgroundColor = "white"
                break;
            default: this.toolbar.btnTaskStartAll.style.backgroundColor = "orange"
                break;
        }

        var finish = this.tasks.allFinish
        switch (finish) {
            case 1: this.toolbar.btnTaskFinishAll.style.backgroundColor = "lime"
                break;
            case 0: this.toolbar.btnTaskFinishAll.style.backgroundColor = "white"
                break;
            default: this.toolbar.btnTaskFinishAll.style.backgroundColor = "orange"
                break;
        }

        this.tasks.tasks.forEach((task) => {
            const btn = Api.getTaskButtonElement(task.name)
            if (btn) {
                if (btn.status != task.status) {
                    btn.status = task.status
                }

                btn.finishOnComplete = task.finishOnComplete
                this.editor.draw();

            }
        })
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

        // var turnouts = this.editor.views.getTurnoutElements()
        // turnouts.forEach((t) => {
        //     //IOConn.socket.emit(ApiCommands.getTurnout, t.address)
        //     wsClient.send({ type: ApiCommands.getTurnout, data: { address: t.address } as iGetTurnout } as iData)
        //     if (Object.getPrototypeOf(t) == TurnoutDoubleElement.prototype) {
        //         const t2 = t as TurnoutDoubleElement
        //         wsClient.send({ type: ApiCommands.getTurnout, data: { address: t2.address2 } as iGetTurnout } as iData)
        //     }
        // })

        // var signals = this.editor.views.getSignalElements()
        // signals.forEach((s) => {
        //     for (var i = 0; i < s.addressLength; i++) {
        //         if (Globals.CommandCenterSetting.type == CommandCenterTypes.Z21) {
        //             wsClient.send({ type: ApiCommands.getTurnout, data: { address: s.address + i } as iGetTurnout } as iData)
        //             //wsClient.send(ApiCommands.getTurnout, s.address + i)
        //         }
        //     }
        // })

        // var accessories = this.editor.views.getAccessoryElements()
        // accessories.forEach((s) => {
        //     wsClient.send({ type: ApiCommands.getTurnout, data: { address: s.address } as iGetTurnout } as iData)
        // })

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

            // if (Object.getPrototypeOf(elem) == TurnoutRightElement.prototype) {
            //     var a = elem as TurnoutRightElement
            //     if (a.address == data.address) {
            //         a.t1Closed = data.isClosed == a.t1ClosedValue;
            //         this.turnouts[data.address] = a.t1Closed
            //         redraw = true
            //     }
            // }
            // else if (Object.getPrototypeOf(elem) == TurnoutLeftElement.prototype) {
            //     var la = elem as TurnoutLeftElement
            //     if (la.address == data.address) {
            //         la.t1Closed = data.isClosed == la.t1ClosedValue;
            //         this.turnouts[data.address] = la.t1Closed
            //         redraw = true
            //     }
            // }

            if (Object.getPrototypeOf(elem) == TurnoutDoubleElement.prototype) {
                var td = elem as TurnoutDoubleElement
                if (td.address == data.address) {
                    td.t1Closed = data.isClosed == td.t1ClosedValue; // : td.t1OpenValue
                    this.turnouts[data.address] = td.t1Closed
                    this.decoders[data.address] = td.t1Closed
                    redraw = true
                }
                if (td.address2 == data.address) {
                    td.t2Closed = data.isClosed == td.t2ClosedValue; // : td.t2OpenValue
                    this.turnouts[data.address] = td.t2Closed
                    this.decoders[data.address] = td.t2Closed
                    redraw = true
                }
            }
            else if (elem instanceof TurnoutElement) {
                var la = elem as TurnoutElement
                if (la.address == data.address) {
                    la.t1Closed = data.isClosed == la.t1ClosedValue;
                    this.turnouts[data.address] = la.t1Closed
                    this.decoders[data.address] = la.t1Closed
                    redraw = true
                }
            }
        })

        const accessories = this.editor.views.getAccessoryElements()
        accessories.forEach((elem: AccessoryAddressElement) => {
            if (elem.address == data.address) {
                elem.on = data.isClosed ? elem.valueOn : elem.valueOff
                this.decoders[elem.address] = elem.on
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

        this.sensors[sensor.address] = sensor.on

        this.editor.views.getRailElements().forEach(elem => {
            if (elem.rbusAddress == sensor.address) {
                elem.occupied = sensor.on
            }
        });
        this.editor.views.getSensorElements().forEach(elem => {
            if (elem.address == sensor.address) {
                elem.on = sensor.on == elem.valueOn
                this.sensors[sensor.address] = elem.on
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


        if (this.powerInfo.trackVoltageOn != pi.trackVoltageOn || this.powerInfo.programmingModeActive != pi.programmingModeActive) {
            window.powerChanged(pi)

            if (this.powerInfo.trackVoltageOn != pi.trackVoltageOn) {
                if (pi.trackVoltageOn) {
                    this.toolbar.btnPower!.classList.add("success")
                    toastManager.showToast("⚠️Track Voltage On⚠️", "light")
                } else {
                    this.toolbar.btnPower!.classList.remove("success")
                    toastManager.showToast("❌Track Voltage Off❌", "light")
                }
            }
            if (this.powerInfo.programmingModeActive != pi.programmingModeActive) {
                if (pi.programmingModeActive) {
                    this.toolbar.btnPower!.classList.add("warning")
                    toastManager.showToast("⚠️Programming Mode Active⚠️", "light")
                } else {
                    this.toolbar.btnPower!.classList.remove("warning")
                    toastManager.showToast("❌Programming Mode Inactive❌", "light")
                }
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

const Application = new App()