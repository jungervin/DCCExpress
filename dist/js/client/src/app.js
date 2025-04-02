define(["require", "exports", "./editor/editor", "./editor/toolbar", "./editor/turnout", "./editor/view", "../../common/src/dcc", "./helpers/globals", "./controls/dialog", "./helpers/ws", "./controls/toastManager", "./helpers/dispatcher", "./components/controlPanel", "./helpers/api", "./helpers/task", "./helpers/scheduler", "./dialogs/commandCenterSettingsDialog", "./dialogs/programmerDialog", "./editor/schedulerButton"], function (require, exports, editor_1, toolbar_1, turnout_1, view_1, dcc_1, globals_1, dialog_1, ws_1, toastManager_1, dispatcher_1, controlPanel_1, api_1, task_1, scheduler_1, commandCenterSettingsDialog_1, programmerDialog_1, schedulerButton_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.App = void 0;
    console.log(dispatcher_1.Dispatcher);
    console.log(dcc_1.ApiCommands);
    console.log(dialog_1.Dialog);
    console.log(toastManager_1.ToastManager);
    console.log(controlPanel_1.LocoControlPanel);
    console.log(toolbar_1.Toolbar);
    class App {
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
            //locos: Locos | undefined;
            this.locos = [];
            this.sensors = {};
            this.outputs = {};
            this.decoders = {};
            this.turnouts = {};
            this.powerInfo = {
                info: undefined,
                current: undefined,
                trackVoltageOn: undefined,
                emergencyStop: undefined,
                programmingModeActive: undefined,
                shortCircuit: undefined,
            };
            api_1.Api.init(this);
            this.loadCanvasState();
            window.addEventListener("beforeunload", this.saveCanvasState);
            window.addEventListener("schedulerCompleted", () => {
                alert("schedulerCompleted");
            });
            scheduler_1.Scheduler.onerror = (msg, err) => {
                alert(msg + "\n\n" + err);
            };
            this.toolbar = document.getElementById("toolbar");
            this.editor = document.getElementById("editorCanvas");
            this.editor.toolbar = this.toolbar;
            this.toolbar.canvas = this.editor;
            this.toolbar.canvas.drawMode = editor_1.drawModes.pointer;
            this.toolbar.btnPower.onclick = (e) => {
                const p = { on: !this.powerInfo.trackVoltageOn };
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.setTrackPower, data: p });
            };
            this.toolbar.btnEmergencyStop.onclick = (e) => {
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.emergencyStop, data: "" });
            };
            window.addEventListener("resize", (ev) => {
                this.editor.canvas.width = window.innerWidth;
                this.editor.canvas.height = window.innerHeight;
                this.editor.draw();
            });
            globals_1.Globals.loadCommandCenterSettings();
            this.toolbar.btnCommandCenterSettings.onclick = (e) => {
                this.editor.unselectAll();
                const cc = new commandCenterSettingsDialog_1.CommandCenterSettingsDialog();
            };
            this.editor.init();
            globals_1.Globals.fetchJsonData("/settings.json").then((data) => {
                var _a, _b;
                const s = data;
                globals_1.Globals.Settings = data;
                // Globals.Settings.CommandCenter = s.CommandCenter ?? defaultSettings.CommandCenter
                // Globals.Settings.CommandCenterZ21 = s.CommandCenterZ21 ?? defaultSettings.CommandCenterZ21
                // Globals.Settings.CommandCenterDCCExTcp = s.CommandCenterDCCExTcp ?? defaultSettings.CommandCenterDCCExTcp
                // Globals.Settings.CommandCenterDCCExSerial = s.CommandCenterDCCExSerial ?? defaultSettings.CommandCenterDCCExSerial
                globals_1.Globals.Settings.Dispacher = (_a = s.Dispacher) !== null && _a !== void 0 ? _a : dcc_1.defaultSettings.Dispacher;
                globals_1.Globals.Settings.EditorSettings = (_b = s.EditorSettings) !== null && _b !== void 0 ? _b : dcc_1.defaultSettings.EditorSettings;
                this.editor.fastClock.visible = globals_1.Globals.Settings.EditorSettings.ShowClock;
                toastManager_1.toastManager.showToast("Settings Loaded", "success");
                globals_1.Globals.fetchJsonData('/config.json').then((conf) => {
                    this.configLoaded(conf);
                    toastManager_1.toastManager.showToast("Config Loaded", "success");
                }).catch((reason) => {
                }).finally(() => {
                    ws_1.wsClient.connect();
                });
            }).catch((reason) => {
            }).finally(() => {
            });
            ws_1.wsClient.onConnected = () => {
                this.toolbar.wsStatus.classList.remove("error");
                this.toolbar.wsStatus.classList.add("success");
                //this.locoControlPanel.init()
                this.locoControlPanel.fetchLocomotives().then(() => {
                    api_1.Api.fetchBlocks();
                });
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.getRBusInfo, data: "" });
                api_1.Api.app.editor.views.getTurnoutElements().forEach((t) => {
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.getTurnout, data: { address: t.address } });
                    if (t instanceof turnout_1.TurnoutDoubleElement) {
                        ws_1.wsClient.send({ type: dcc_1.ApiCommands.getTurnout, data: { address: t.address2 } });
                    }
                });
            };
            ws_1.wsClient.onError = () => {
                this.toolbar.wsStatus.classList.remove("success");
                this.toolbar.wsStatus.classList.add("error");
            };
            ws_1.wsClient.onMessage = (msg) => {
                switch (msg.type) {
                    case dcc_1.ApiCommands.locoInfo:
                        if (this.locoControlPanel) {
                            this.locoControlPanel.processMessage(msg.data);
                            dispatcher_1.Dispatcher.exec();
                        }
                        break;
                    // case ApiCommands.commandCenterInfos:
                    //     Globals.devices = msg.data as iCommandCenter[]
                    //     break;
                    case dcc_1.ApiCommands.turnoutInfo:
                        const t = msg.data;
                        this.turnoutInfo(t);
                        dispatcher_1.Dispatcher.exec();
                        // const turnout = this.editor.views.getTurnout(t.address)
                        // if (turnout) {
                        //     this.execDispatcher()
                        // }
                        break;
                    case dcc_1.ApiCommands.rbusInfo:
                        this.rbusInfo(msg.data);
                        // this.execDispatcher()
                        dispatcher_1.Dispatcher.exec();
                        break;
                    case dcc_1.ApiCommands.sensorInfo:
                        this.sensorInfo(msg.data);
                        dispatcher_1.Dispatcher.exec();
                        break;
                    case dcc_1.ApiCommands.blockInfo:
                        const blocks = msg.data;
                        Object.values(blocks).forEach((block) => {
                            Object.values(block).forEach((bb) => {
                                this.editor.views.getBlockElements().forEach((b) => {
                                    if (b.name === bb.blockName) {
                                        b.setLoco(bb.locoAddress);
                                    }
                                });
                            });
                        });
                        break;
                    case dcc_1.ApiCommands.outputInfo:
                        const output = msg.data;
                        this.outputs[output.address] = output.value;
                        this.editor.views.getButtonElements().forEach((b) => {
                            if (b.address == output.address) {
                                b.on = output.value == b.valueOn;
                                this.outputs[output.address] = b.on;
                                this.editor.draw();
                                dispatcher_1.Dispatcher.exec();
                            }
                        });
                        break;
                    case dcc_1.ApiCommands.settingsInfo:
                        const d = msg.data;
                        if (d.Dispacher) {
                            globals_1.Globals.Settings = d;
                        }
                        break;
                    case dcc_1.ApiCommands.systemInfo:
                        this.systemInfo(msg.data);
                        break;
                    case dcc_1.ApiCommands.powerInfo:
                        this.procPowerInfo(msg.data);
                        break;
                    case dcc_1.ApiCommands.UnsuccessfulOperation:
                        toastManager_1.toastManager.showToast("UnsuccessfulOperation");
                        break;
                    case dcc_1.ApiCommands.timeInfo:
                        if (this.editor.fastClock) {
                            const ti = msg.data;
                            this.editor.fastClock.setCurrentTime(ti.timestamp);
                        }
                        break;
                    case dcc_1.ApiCommands.dccExDirectCommandResponse:
                        console.log("dccExDirectCommandResponse", msg.data);
                        if (window.directCommandResponse) {
                            window.directCommandResponse(msg.data);
                        }
                        break;
                    default:
                        console.log("Unknow WS message:", msg);
                        break;
                }
            };
            // A settings betöltése után??
            // Api.loadLocomotives().then((locos) => {
            // })
            this.locoControlPanel = document.getElementById("locoControlPanel");
            this.locos = this.locoControlPanel.locomotives;
            this.tasks = new task_1.Tasks();
            dispatcher_1.Dispatcher.App = this;
            api_1.Api.app = this;
            this.toolbar.btnTasks.onclick = (e) => {
                this.toolbar.tasks = !this.toolbar.tasks;
                if (this.toolbar.tasks) {
                    this.tasks.stopAllTask();
                    this.tasks.tasks.length = 0;
                    scheduler_1.Scheduler.start("scheduler.js").then(() => {
                        this.tasks.startAutoStart();
                    });
                    //this.task1()
                    //this.tasks.startAllTask()
                    //this.tasks.save()
                }
                else {
                    // const msg = new MessageDialog("Error", "Choose an action!", ["STOP NOW", "STOP ON COMPLETION", "CANCEL"], "")
                    // msg.onclose = (sender) => {
                    //     if(sender.dialogResultText == "STOP NOW") {
                    //     } else if(sender.dialogResultText == "STOP ON COMPLETION") {
                    //         this.tasks.stopOnCompletion()
                    //     }
                    // }
                    this.tasks.stopAllTask();
                }
            };
            this.toolbar.btnProgrammer.onclick = (e) => {
                if (this.toolbar.programmerButtonEnabled) {
                    const d = new programmerDialog_1.ProgrammerDialog();
                }
            };
            this.toolbar.btnTaskStartAll.onclick = (e) => {
                this.tasks.startAllTask();
            };
            this.toolbar.btnTaskStopAll.onclick = (e) => {
                this.tasks.stopAllTask();
            };
            this.toolbar.btnTaskResumeAll.onclick = (e) => {
                this.tasks.resumeAllTask();
            };
            this.toolbar.btnTaskFinishAll.onclick = (e) => {
                this.tasks.finishAllTask(!(this.tasks.allFinish > 0));
            };
            scheduler_1.Scheduler.onchange = () => {
                this.toolbar.taskButtonsEnabled = scheduler_1.Scheduler.isLoaded;
                if (this.editor.selectedElement instanceof schedulerButton_1.SchedulerButtonShapeElement) {
                    this.editor.propertyPanel.selectedObject = undefined;
                    this.editor.propertyPanel.selectedObject = this.editor.selectedElement;
                }
                this.updateTasks();
            };
            window.addEventListener('taskChangedEvent', (e) => {
                this.updateTasks();
            });
            const worker = new Worker("js/worker.js");
            worker.postMessage("msg");
            worker.onmessage = function (e) {
                api_1.Api.app.tasks.exec();
                dispatcher_1.Dispatcher.exec();
                worker.postMessage("p");
            };
        }
        updateTasks() {
            var running = this.tasks.allRuning;
            switch (running) {
                case 1:
                    this.toolbar.btnTaskStartAll.style.backgroundColor = "lime";
                    break;
                case 0:
                    this.toolbar.btnTaskStartAll.style.backgroundColor = "white";
                    break;
                default:
                    this.toolbar.btnTaskStartAll.style.backgroundColor = "orange";
                    break;
            }
            var finish = this.tasks.allFinish;
            switch (finish) {
                case 1:
                    this.toolbar.btnTaskFinishAll.style.backgroundColor = "lime";
                    break;
                case 0:
                    this.toolbar.btnTaskFinishAll.style.backgroundColor = "white";
                    break;
                default:
                    this.toolbar.btnTaskFinishAll.style.backgroundColor = "orange";
                    break;
            }
            this.tasks.tasks.forEach((task) => {
                const btn = api_1.Api.getTaskButtonElement(task.name);
                if (btn) {
                    if (btn.status != task.status) {
                        btn.status = task.status;
                    }
                    btn.finishOnComplete = task.finishOnComplete;
                    this.editor.draw();
                }
            });
        }
        systemInfo(ss) {
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
        configLoaded(config) {
            this.editor.load(config);
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
        turnoutInfo(data) {
            //console.log("turnout", data)
            this.decoders[data.address] = data.isClosed;
            var redraw = false;
            this.editor.views.getSignalElements().forEach((elem) => {
                // if (data.cc && elem.cc && elem.cc!.uuid == data.cc.uuid)
                {
                    elem.setValue(data.address, data.isClosed);
                    redraw = true;
                }
            });
            const turnouts = this.editor.views.getTurnoutElements();
            turnouts.forEach((elem) => {
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
                if (Object.getPrototypeOf(elem) == turnout_1.TurnoutDoubleElement.prototype) {
                    var td = elem;
                    if (td.address == data.address) {
                        td.t1Closed = data.isClosed == td.t1ClosedValue; // : td.t1OpenValue
                        this.turnouts[data.address] = td.t1Closed;
                        this.decoders[data.address] = td.t1Closed;
                        redraw = true;
                    }
                    if (td.address2 == data.address) {
                        td.t2Closed = data.isClosed == td.t2ClosedValue; // : td.t2OpenValue
                        this.turnouts[data.address] = td.t2Closed;
                        this.decoders[data.address] = td.t2Closed;
                        redraw = true;
                    }
                }
                else if (elem instanceof turnout_1.TurnoutElement) {
                    var la = elem;
                    if (la.address == data.address) {
                        la.t1Closed = data.isClosed == la.t1ClosedValue;
                        this.turnouts[data.address] = la.t1Closed;
                        this.decoders[data.address] = la.t1Closed;
                        redraw = true;
                    }
                }
            });
            const accessories = this.editor.views.getAccessoryElements();
            accessories.forEach((elem) => {
                if (elem.address == data.address) {
                    elem.on = data.isClosed ? elem.valueOn : elem.valueOff;
                    this.decoders[elem.address] = elem.on;
                    redraw = true;
                }
            });
            if (redraw) {
                var items = this.editor.views.getRailElements();
                items.forEach((e) => {
                    e.isVisited = false;
                    e.isRoute = false;
                });
                var routes = this.editor.views.getRouteSwitchElements();
                routes.forEach((r) => {
                    r.active = false;
                    if (r.isActive(turnouts)) {
                        r.active = true;
                        console.log("ROUTE IS ACTIVE:", r.name);
                        if (r.turnouts.length > 0) {
                            var to = r.turnouts[0];
                            var tt = this.editor.views.getTurnoutElements().find((t) => {
                                return t.address == to.address;
                            });
                            var obj = this.editor.views.getObjectXy(tt.pos);
                            this.editor.views.startWalk(obj);
                        }
                    }
                });
                this.editor.draw();
            }
        }
        rbusInfo(data) {
            if (globals_1.Globals.CommandCenterSetting.type == dcc_1.CommandCenterTypes.Z21) {
                var g = data.group * 100;
                for (var i = 0; i < data.bytes.length; i++) {
                    var byte = data.bytes[i];
                    for (var j = 0; j <= 7; j++) {
                        var bit = (byte & (1 << j)) > 0;
                        var addr = g + (i + 1) * 10 + j + 1;
                        var on = (byte & (1 << j)) > 0;
                        this.sensors[addr] = on;
                        this.editor.views.elements.forEach(elem => {
                            if (elem instanceof view_1.RailView) {
                                if (elem.rbusAddress == addr) {
                                    elem.occupied = on;
                                }
                            }
                        });
                    }
                }
                this.editor.draw();
            }
        }
        sensorInfo(sensor) {
            this.sensors[sensor.address] = sensor.on;
            this.editor.views.getRailElements().forEach(elem => {
                if (elem.rbusAddress == sensor.address) {
                    elem.occupied = sensor.on;
                }
            });
            this.editor.views.getSensorElements().forEach(elem => {
                if (elem.address == sensor.address) {
                    elem.on = sensor.on == elem.valueOn;
                    this.sensors[sensor.address] = elem.on;
                }
            });
            this.editor.draw();
        }
        procPowerInfo(pi) {
            globals_1.Globals.power = pi;
            if (this.powerInfo.emergencyStop != pi.emergencyStop) {
                window.powerChanged(pi);
                if (pi.emergencyStop) {
                    this.toolbar.btnEmergencyStop.classList.add("error");
                }
                else {
                    this.toolbar.btnEmergencyStop.classList.remove("error");
                }
            }
            if (this.powerInfo.trackVoltageOn != pi.trackVoltageOn || this.powerInfo.programmingModeActive != pi.programmingModeActive) {
                window.powerChanged(pi);
                if (this.powerInfo.trackVoltageOn != pi.trackVoltageOn) {
                    if (pi.trackVoltageOn) {
                        this.toolbar.btnPower.classList.add("success");
                        toastManager_1.toastManager.showToast("⚠️Track Voltage On⚠️", "light");
                    }
                    else {
                        this.toolbar.btnPower.classList.remove("success");
                        toastManager_1.toastManager.showToast("❌Track Voltage Off❌", "light");
                    }
                }
                if (this.powerInfo.programmingModeActive != pi.programmingModeActive) {
                    if (pi.programmingModeActive) {
                        this.toolbar.btnPower.classList.add("warning");
                        toastManager_1.toastManager.showToast("⚠️Programming Mode Active⚠️", "light");
                    }
                    else {
                        this.toolbar.btnPower.classList.remove("warning");
                        toastManager_1.toastManager.showToast("❌Programming Mode Inactive❌", "light");
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
        getLoco(addr) {
            if (this.locoControlPanel.locomotives) {
                return this.locoControlPanel.locomotives.find((l) => l.address == addr);
            }
            return undefined;
        }
    }
    exports.App = App;
    const Application = new App();
});
