define(["require", "exports", "./editor/editor", "./editor/turnout", "./editor/view", "../../common/src/dcc", "./helpers/globals", "./controls/dialog", "./helpers/ws", "./controls/toastManager", "./editor/dispatcher", "./components/controlPanel", "./helpers/api", "./helpers/task", "./helpers/scheduler", "./dialogs/commandCenterSettingsDialog"], function (require, exports, editor_1, turnout_1, view_1, dcc_1, globals_1, dialog_1, ws_1, toastManager_1, dispatcher_1, controlPanel_1, api_1, task_1, scheduler_1, commandCenterSettingsDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.App = void 0;
    console.log(dispatcher_1.Dispatcher);
    console.log(dcc_1.ApiCommands);
    console.log(dialog_1.Dialog);
    console.log(toastManager_1.ToastManager);
    console.log(controlPanel_1.LocoControlPanel);
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
            this.toolbar = document.getElementById("toolbar");
            this.editor = document.getElementById("editorCanvas");
            this.editor.toolbar = this.toolbar;
            this.toolbar.canvas = this.editor;
            this.toolbar.canvas.drawMode = editor_1.drawModes.pointer;
            this.toolbar.btnPower.onclick = (e) => {
                const p = { on: !this.powerInfo.trackVoltageOn };
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.setPower, data: p });
            };
            this.toolbar.btnEmergencyStop.onclick = (e) => {
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.emergencyStop, data: "" });
            };
            window.addEventListener("resize", (ev) => {
                this.editor.canvas.width = window.innerWidth;
                this.editor.canvas.height = window.innerHeight;
                this.editor.draw();
            });
            globals_1.Globals.fetchJsonData(dcc_1.FileNames.CommandCenterSettings).then((data) => {
                globals_1.Globals.CommandCenterSetting.type = data.type;
                globals_1.Globals.CommandCenterSetting.commandCenter = data.commandCenter;
            }).catch((reason) => {
                globals_1.Globals.CommandCenterSetting.type = dcc_1.CommandCenterTypes.Z21,
                    globals_1.Globals.CommandCenterSetting.commandCenter = {
                        ip: "192.168.0.70",
                        port: 21105,
                        turnoutActiveTime: 500,
                        basicAccessoryDecoderActiveTime: 100
                    };
            });
            this.toolbar.btnCommandCenterSettings.onclick = (e) => {
                const cc = new commandCenterSettingsDialog_1.CommandCenterSettingsDialog();
            };
            this.editor.init();
            ws_1.wsClient.connect();
            globals_1.Globals.fetchJsonData("/settings.json").then((data) => {
                var _a, _b, _c, _d, _e, _f;
                const s = data;
                globals_1.Globals.Settings = data;
                globals_1.Globals.Settings.CommandCenter = (_a = s.CommandCenter) !== null && _a !== void 0 ? _a : dcc_1.defaultSettings.CommandCenter;
                globals_1.Globals.Settings.CommandCenterZ21 = (_b = s.CommandCenterZ21) !== null && _b !== void 0 ? _b : dcc_1.defaultSettings.CommandCenterZ21;
                globals_1.Globals.Settings.CommandCenterDCCExTcp = (_c = s.CommandCenterDCCExTcp) !== null && _c !== void 0 ? _c : dcc_1.defaultSettings.CommandCenterDCCExTcp;
                globals_1.Globals.Settings.CommandCenterDCCExSerial = (_d = s.CommandCenterDCCExSerial) !== null && _d !== void 0 ? _d : dcc_1.defaultSettings.CommandCenterDCCExSerial;
                globals_1.Globals.Settings.Dispacher = (_e = s.Dispacher) !== null && _e !== void 0 ? _e : dcc_1.defaultSettings.Dispacher;
                globals_1.Globals.Settings.EditorSettings = (_f = s.EditorSettings) !== null && _f !== void 0 ? _f : dcc_1.defaultSettings.EditorSettings;
                this.editor.fastClock.visible = globals_1.Globals.Settings.EditorSettings.ShowClock;
                toastManager_1.toastManager.showToast("Settings Loaded", "success");
                globals_1.Globals.fetchJsonData('/config.json').then((conf) => {
                    this.configLoaded(conf);
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.getRBusInfo, data: "" });
                    toastManager_1.toastManager.showToast("Config Loaded", "success");
                }).catch((reason) => {
                    //toastManager.showToast("Config Not Loaded<br>"+ reason, "error")
                }).finally(() => {
                });
            }).catch((reason) => {
                //toastManager.showToast("Settings Not Loaded<br>"+ reason, "error")
            }).finally(() => {
            });
            ws_1.wsClient.onConnected = () => {
                this.toolbar.wsStatus.classList.remove("error");
                this.toolbar.wsStatus.classList.add("success");
                this.locoControlPanel.init();
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
                    case dcc_1.ApiCommands.settingsInfo:
                        const d = msg.data;
                        if (d.CommandCenter && d.Dispacher) {
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
                    default:
                        console.log("Unknow WS message:", msg);
                        break;
                }
            };
            // A settings betöltése után
            api_1.Api.loadLocomotives().then((locos) => {
            });
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
                        this.tasks.startAllTask();
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
        }
        task1() {
            if (!this.tasks.getTask("Task1")) {
                const task = this.tasks.addTask("Task1");
                task.setLoco(3);
                // ==========================================
                //  Szfvár P3 <=== P2 <== Szabadbattyán P3
                // ==========================================
                //task.waitForMinute(5)
                task.startAtMinutes([5, 15, 25, 35, 45, 55]);
                task.setRoute("routeSwitch112");
                task.waitMs(3000, 5000);
                // Kalauz síp
                task.setFunctionMs(17, true, 500);
                task.waitMs(3000, 5000);
                // Hátra és Kürt
                task.reverse(0);
                task.setFunctionMs(3, true, 500);
                task.waitMs(3000, 5000);
                task.reverse(30);
                task.waitForSensor(16, true);
                task.setFunctionMs(3, true, 500);
                task.delay(3000);
                task.stopLoco();
                task.waitMs(10000, 20000);
                // ==========================================
                //  Szfvár P3 ==> P1 ==> Szabadbattyán P3
                // ==========================================
                //task.waitForMinute(5)
                task.startAtMinutes([0, 10, 20, 30, 40, 50]);
                task.setRoute("routeSwitch113");
                task.waitMs(3000, 5000);
                // Kalauz síp
                task.setFunctionMs(17, true, 500);
                task.waitMs(3000, 5000);
                // Előre és Kürt
                task.forward(0);
                task.setFunctionMs(3, true, 500);
                task.waitMs(3000, 5000);
                task.forward(30);
                task.waitForSensor(24, true);
                task.setFunctionMs(3, true, 500);
                task.delay(3000);
                task.stopLoco();
                task.waitMs(10000, 20000);
                task.restart();
            }
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
            var turnouts = this.editor.views.getTurnoutElements();
            turnouts.forEach((t) => {
                //IOConn.socket.emit(ApiCommands.getTurnout, t.address)
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.getTurnout, data: { address: t.address } });
                if (Object.getPrototypeOf(t) == turnout_1.TurnoutDoubleElement.prototype) {
                    const t2 = t;
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.getTurnout, data: { address: t2.address2 } });
                }
            });
            var signals = this.editor.views.getSignalElements();
            signals.forEach((s) => {
                for (var i = 0; i < s.addressLength; i++) {
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.getTurnout, data: { address: s.address + i } });
                    //wsClient.send(ApiCommands.getTurnout, s.address + i)
                }
            });
            var accessories = this.editor.views.getAccessoryElements();
            accessories.forEach((s) => {
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.getTurnout, data: { address: s.address } });
            });
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
                if (Object.getPrototypeOf(elem) == turnout_1.TurnoutRightElement.prototype) {
                    var a = elem;
                    if (a.address == data.address) {
                        a.t1Closed = data.isClosed == a.t1ClosedValue;
                        this.turnouts[data.address] = a.t1Closed;
                        redraw = true;
                    }
                }
                else if (Object.getPrototypeOf(elem) == turnout_1.TurnoutLeftElement.prototype) {
                    var la = elem;
                    if (la.address == data.address) {
                        la.t1Closed = data.isClosed == la.t1ClosedValue;
                        this.turnouts[data.address] = la.t1Closed;
                        redraw = true;
                    }
                }
                else if (Object.getPrototypeOf(elem) == turnout_1.TurnoutDoubleElement.prototype) {
                    var td = elem;
                    if (td.address == data.address) {
                        td.t1Closed = data.isClosed == td.t1ClosedValue; // : td.t1OpenValue
                        this.turnouts[data.address] = td.t1Closed;
                        redraw = true;
                    }
                    if (td.address2 == data.address) {
                        td.t2Closed = data.isClosed == td.t2ClosedValue; // : td.t2OpenValue
                        this.turnouts[data.address] = td.t2Closed;
                        redraw = true;
                    }
                }
            });
            const accessories = this.editor.views.getAccessoryElements();
            accessories.forEach((elem) => {
                if (elem.address == data.address) {
                    elem.on = data.isClosed ? elem.valueOn : elem.valueOff;
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
            if (this.powerInfo.trackVoltageOn != pi.trackVoltageOn) {
                window.powerChanged(pi);
                if (pi.trackVoltageOn) {
                    this.toolbar.btnPower.classList.add("success");
                }
                else {
                    this.toolbar.btnPower.classList.remove("success");
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
});
