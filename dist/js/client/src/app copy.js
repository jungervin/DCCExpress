define(["require", "exports", "./editor/editor", "./editor/turnout", "./editor/view", "../../common/src/dcc", "./helpers/globlas", "./controls/dialog", "./helpers/ws", "./controls/toastManager", "./editor/dispatcher", "./components/controlPanel"], function (require, exports, editor_1, turnout_1, view_1, dcc_1, globlas_1, dialog_1, ws_1, toastManager_1, dispatcher_1, controlPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.App = void 0;
    console.log(dispatcher_1.Dispatcher);
    console.log(dcc_1.ApiCommands);
    console.log(dialog_1.Dialog);
    console.log(toastManager_1.ToastManager);
    console.log(controlPanel_1.LocoControlPanel);
    class App {
        //static wsClient: WebSocket
        //commandCenters: iCommandCenter[] = []
        constructor() {
            this.sensors = {};
            this.decoders = {};
            dispatcher_1.Dispatcher.intervalTime = 111;
            this.toolbar = document.getElementById("toolbar");
            this.canvas = document.getElementById("editorCanvas");
            this.canvas.toolbar = this.toolbar;
            this.toolbar.canvas = this.canvas;
            this.toolbar.canvas.drawMode = editor_1.drawModes.pointer;
            //IOConn.initialize(document.location.origin)
            // this.canvas.socket = IOConn.socket
            // this.canvas.views.socket = IOConn.socket;
            this.canvas.init();
            ws_1.wsClient.onConnected = () => {
                this.toolbar.wsStatus.classList.remove("error");
                this.toolbar.wsStatus.classList.add("success");
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.getCommandCenters, data: "" });
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.configLoad, data: "" });
            };
            ws_1.wsClient.onError = () => {
                this.toolbar.wsStatus.classList.remove("success");
                this.toolbar.wsStatus.classList.add("error");
                //this.toolbar.wsStatus?.setAttribute("fill", "red")
            };
            ws_1.wsClient.onMessage = (msg) => {
                switch (msg.type) {
                    case dcc_1.ApiCommands.commandCenters:
                        globlas_1.Globals.devices = msg.data;
                        break;
                    case dcc_1.ApiCommands.turnoutInfo:
                        const t = msg.data;
                        this.turnoutInfo(t);
                        const turnout = this.canvas.views.getTurnout(t.address);
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
                    case dcc_1.ApiCommands.systemInfo:
                        this.systemInfo(msg.data);
                        break;
                    case dcc_1.ApiCommands.powerInfo:
                        this.powerInfo(msg.data);
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
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                this.canvas.draw();
            });
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
            // IOConn.socket.emit(ApiCommands.configLoad, "")
            // IOConn.socket.emit(ApiCommands.getCommandCenters, "")
            ws_1.wsClient.connect();
            dispatcher_1.Dispatcher.App = this;
        }
        execDispatcher() {
            return;
            var t10 = this.canvas.views.getTurnout(10);
            const signal55 = this.canvas.views.getSignal(55);
            const signal50 = this.canvas.views.getSignal(50);
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
                this.toolbar.btnPower.classList.remove("success");
                this.toolbar.btnPower.classList.add("error");
            }
            else {
                this.toolbar.btnPower.classList.add("success");
                this.toolbar.btnPower.classList.remove("error");
            }
        }
        configLoaded(config) {
            this.canvas.load(config);
            //this.locos!.load(config)
            var turnouts = this.canvas.views.getTurnoutElements();
            turnouts.forEach((t) => {
                //IOConn.socket.emit(ApiCommands.getTurnout, t.address)
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.getTurnout, data: { cc: t.cc, address: t.address } });
                if (Object.getPrototypeOf(t) == turnout_1.TurnoutDoubleElement.prototype) {
                    const t2 = t;
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.getTurnout, data: { cc: t.cc, address: t2.address2 } });
                }
            });
            var signals = this.canvas.views.getSignalElements();
            signals.forEach((s) => {
                for (var i = 0; i < s.addressLength; i++) {
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.getTurnout, data: { cc: s.cc, address: s.address + i } });
                    //wsClient.send(ApiCommands.getTurnout, s.address + i)
                }
            });
            globlas_1.Globals.devices.forEach((cc) => {
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.getRBusInfo, data: { cc: cc } });
            });
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
        turnoutInfo(data) {
            //console.log("turnout", data)
            this.decoders[data.address] = data.isClosed;
            var redraw = false;
            this.canvas.views.getSignalElements().forEach((elem) => {
                if (data.cc && elem.cc && elem.cc.uuid == data.cc.uuid) {
                    elem.setValue(data.address, data.isClosed);
                    redraw = true;
                }
            });
            const turnouts = this.canvas.views.getTurnoutElements();
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
                var items = this.canvas.views.getRailElements();
                items.forEach((e) => {
                    e.isVisited = false;
                    e.isRoute = false;
                });
                var routes = this.canvas.views.getRouteSwitchElements();
                routes.forEach((r) => {
                    r.active = false;
                    if (r.isActive(turnouts)) {
                        r.active = true;
                        console.log("ROUTE IS ACTIVE:", r.name);
                        if (r.turnouts.length > 0) {
                            var to = r.turnouts[0];
                            var tt = this.canvas.views.getTurnoutElements().find((t) => {
                                return t.address == to.address;
                            });
                            var obj = this.canvas.views.getObjectXy(tt.pos);
                            this.canvas.views.startWalk(obj);
                        }
                    }
                });
                this.canvas.draw();
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
                    this.canvas.views.elements.forEach(elem => {
                        if (elem instanceof view_1.RailView) {
                            if (elem.rbusAddress == addr) {
                                elem.occupied = on;
                            }
                        }
                    });
                }
            }
            this.canvas.draw();
        }
        powerInfo(pi) {
            switch (pi.info) {
                case dcc_1.Z21POWERINFO.poweroff:
                    this.toolbar.btnPower.classList.remove("sucess");
                    this.toolbar.btnPower.classList.add("error");
                    break;
                case dcc_1.Z21POWERINFO.poweron:
                    this.toolbar.btnPower.classList.remove("error");
                    this.toolbar.btnPower.classList.add("success");
                    break;
                case dcc_1.Z21POWERINFO.programmingmode:
                    break;
                case dcc_1.Z21POWERINFO.shortcircuit:
                    this.toolbar.btnPower.classList.remove("sucess");
                    this.toolbar.btnPower.classList.add("error");
                    break;
            }
        }
    }
    exports.App = App;
});
// Példa a használatra
