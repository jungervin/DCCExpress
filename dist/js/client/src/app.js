define(["require", "exports", "./editor/editor", "./editor/turnout", "./editor/view", "../../common/src/dcc", "./helpers/globals", "./controls/dialog", "./helpers/ws", "./controls/toastManager", "./editor/dispatcher", "./components/controlPanel", "./editor/audioButton"], function (require, exports, editor_1, turnout_1, view_1, dcc_1, globals_1, dialog_1, ws_1, toastManager_1, dispatcher_1, controlPanel_1, audioButton_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.App = void 0;
    console.log(dispatcher_1.Dispatcher);
    console.log(dcc_1.ApiCommands);
    console.log(dialog_1.Dialog);
    console.log(toastManager_1.ToastManager);
    console.log(controlPanel_1.LocoControlPanel);
    class App {
        //commandCenters: iCommandCenter[] = []
        constructor() {
            this.sensors = {};
            this.decoders = {};
            this.powerInfo = {
                info: undefined,
                current: undefined,
                trackVoltageOn: undefined,
                emergencyStop: undefined,
                programmingModeActive: undefined,
                shortCircuit: undefined,
            };
            this.audioManager = audioButton_1.audioManager;
            //Dispatcher.intervalTime = 111
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
                // if (this.powerOn) {
                //     wsClient.send({ type: ApiCommands.emergencyStop, data: "" } as iData)
                // } else {
                //     wsClient.send({ type: ApiCommands.setPower, data: { on: true } as iSetPower } as iData)
                // }
            };
            //IOConn.initialize(document.location.origin)
            // this.canvas.socket = IOConn.socket
            // this.canvas.views.socket = IOConn.socket;
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
                globals_1.Globals.fetchJsonData('/config.json').then((conf) => {
                    this.editor.init();
                    this.configLoaded(conf);
                }).catch((reason) => {
                    alert("Config Error:\n" + reason);
                });
            }).catch((reason) => {
                alert("Settings Error:\n" + reason);
            });
            ws_1.wsClient.onConnected = () => {
                this.toolbar.wsStatus.classList.remove("error");
                this.toolbar.wsStatus.classList.add("success");
                //wsClient.send({ type: ApiCommands.getSettings, data: "" })
                // wsClient.send({ type: ApiCommands.getCommandCenters, data: "" })
                //wsClient.send({ type: ApiCommands.configLoad, data: "" })
                this.locoControlPanel.init();
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.getRBusInfo, data: "" });
            };
            ws_1.wsClient.onError = () => {
                this.toolbar.wsStatus.classList.remove("success");
                this.toolbar.wsStatus.classList.add("error");
                //this.toolbar.wsStatus?.setAttribute("fill", "red")
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
                        const turnout = this.editor.views.getTurnout(t.address);
                        if (turnout) {
                            this.execDispatcher();
                        }
                        break;
                    case dcc_1.ApiCommands.rbusInfo:
                        this.rbusInfo(msg.data);
                        this.execDispatcher();
                        break;
                    case dcc_1.ApiCommands.configLoaded:
                        this.configLoaded(msg.data);
                        break;
                    case dcc_1.ApiCommands.settingsInfo:
                        //setSettings(msg.data)
                        const d = msg.data;
                        //console.log(d)
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
                    default:
                        console.log("Unknow WS message:", msg);
                        break;
                }
            };
            window.addEventListener("resize", (ev) => {
                this.editor.canvas.width = window.innerWidth;
                this.editor.canvas.height = window.innerHeight;
                this.editor.draw();
            });
            ws_1.wsClient.connect();
            this.locoControlPanel = document.getElementById("locoControlPanel");
            dispatcher_1.Dispatcher.App = this;
        }
        execDispatcher() {
            return;
            var t10 = this.editor.views.getTurnout(10);
            const signal55 = this.editor.views.getSignal(55);
            const signal50 = this.editor.views.getSignal(50);
            if (this.sensors[12]) {
                signal55 === null || signal55 === void 0 ? void 0 : signal55.sendRed();
            }
            else {
                signal55 === null || signal55 === void 0 ? void 0 : signal55.sendGreen();
            }
            if (this.sensors[12] == false) {
                if (t10 === null || t10 === void 0 ? void 0 : t10.t1Closed) {
                    signal50 === null || signal50 === void 0 ? void 0 : signal50.sendGreen();
                }
                else {
                    signal50 === null || signal50 === void 0 ? void 0 : signal50.sendYellow();
                }
            }
            else {
                signal50 === null || signal50 === void 0 ? void 0 : signal50.sendRed();
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
                        a.t1Closed = data.isClosed == a.t1ClosedValue; // : a.t1OpenValue
                        redraw = true;
                    }
                }
                else if (Object.getPrototypeOf(elem) == turnout_1.TurnoutLeftElement.prototype) {
                    var la = elem;
                    if (la.address == data.address) {
                        la.t1Closed = data.isClosed == la.t1ClosedValue; // : la.t1OpenValue
                        redraw = true;
                    }
                }
                else if (Object.getPrototypeOf(elem) == turnout_1.TurnoutDoubleElement.prototype) {
                    var td = elem;
                    if (td.address == data.address) {
                        td.t1Closed = data.isClosed == td.t1ClosedValue; // : td.t1OpenValue
                        redraw = true;
                    }
                    if (td.address2 == data.address) {
                        td.t2Closed = data.isClosed == td.t2ClosedValue; // : td.t2OpenValue
                        redraw = true;
                    }
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
    }
    exports.App = App;
});
