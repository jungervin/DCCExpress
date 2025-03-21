var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../../../common/src/dcc", "./ws", "../editor/turnout", "../editor/audioButton", "../../../common/src/logicCircuits", "../controls/toastManager"], function (require, exports, dcc_1, ws_1, turnout_1, audioButton_1, logicCircuits_1, toastManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Api = void 0;
    class Api {
        static init(app) {
            Api.app = app;
        }
        static playSound(filename) {
            audioButton_1.audioManager.play(filename);
        }
        static setBlock(blockName, locoAddress) {
            const b = { blockName: blockName, locoAddress: locoAddress };
            ws_1.wsClient.send({ type: dcc_1.ApiCommands.setBlock, data: b });
        }
        static getBlocks() {
            ws_1.wsClient.send({ type: dcc_1.ApiCommands.getBlocks, data: "" });
        }
        static getSensor(address) {
            const s = Api.app.editor.views.getSensor(address);
            if (s) {
                return s;
            }
            return undefined;
        }
        static getSensorValue(address) {
            return Api.app.sensors[address];
        }
        static getSensorDuration(address, state) {
            logicCircuits_1.PulseDetector.getSensor(address, state);
        }
        static detectRisingEdge(address) {
            const currentState = Api.getSensorValue(address);
            if (!(address in Api.edges)) {
                Api.edges[address] = currentState;
                return false;
            }
            const rising = !Api.edges[address] && currentState;
            Api.edges[address] = currentState;
            return rising;
        }
        static detectFallingEdge(address) {
            const currentState = Api.getSensorValue(address);
            if (!(address in Api.edges)) {
                Api.edges[address] = currentState;
                return false;
            }
            const falling = Api.edges[address] && !currentState;
            Api.edges[address] = currentState;
            return falling;
        }
        static emergencyStop() {
            ws_1.wsClient.send({ type: dcc_1.ApiCommands.emergencyStop, data: "" });
        }
        static getLoco(address) {
            return Api.app.locoControlPanel.locomotives.find(l => l.address === address);
        }
        static setLoco(address, speed, direction) {
            const loco = Api.getLoco(address);
            if (loco) {
                loco.speed = speed;
                loco.direction = direction;
                var l = { address: address, direction: direction, speed: speed, funcMap: 0 };
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.setLoco, data: l });
            }
        }
        static setLocoSpeed(address, speed) {
            const loco = Api.getLoco(address);
            if (loco) {
                loco.speed = speed;
                Api.setLoco(address, speed, loco.direction);
            }
        }
        static setLocoDirection(address, direction) {
            const loco = Api.getLoco(address);
            if (loco) {
                loco.direction = direction;
                Api.setLoco(address, loco.speed, direction);
            }
        }
        static setLocoFunction(address, id, isOn) {
            const loco = Api.getLoco(address);
            if (loco) {
                const data = { address: address, id: id, isOn: isOn };
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.setLocoFunction, data: data });
            }
        }
        static setTurnout(address, isClosed) {
            const turnout = Api.getTurnout(address);
            if (turnout) {
                if (Object.getPrototypeOf(turnout) == turnout_1.TurnoutDoubleElement.prototype) {
                    const td = turnout;
                    if (td.address === address) {
                        var t = { address: address, isClosed: isClosed ? td.t1ClosedValue : td.t1OpenValue, outputMode: td.outputMode };
                        ws_1.wsClient.send({ type: dcc_1.ApiCommands.setTurnout, data: t });
                    }
                    else if (td.address2 === address) {
                        var t = { address: address, isClosed: isClosed ? td.t2ClosedValue : td.t2OpenValue, outputMode: td.outputMode };
                        ws_1.wsClient.send({ type: dcc_1.ApiCommands.setTurnout, data: t });
                    }
                }
                else {
                    const to = turnout;
                    var t = { address: address, isClosed: isClosed ? to.t1ClosedValue : to.t1OpenValue, outputMode: to.outputMode };
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.setTurnout, data: t });
                }
            }
        }
        static getTurnout(address) {
            for (let t of Api.app.editor.views.getTurnoutElements()) {
                if (t.address === address) {
                    return t;
                }
                if (Object.getPrototypeOf(t) == turnout_1.TurnoutDoubleElement.prototype) {
                    const to = t;
                    if (to.address === address || to.address2 === address) {
                        return t;
                    }
                }
            }
            return undefined;
        }
        static getTurnoutState(address) {
            for (let t of Api.app.editor.views.getTurnoutElements()) {
                if (t.address === address) {
                    return t.t1Closed;
                }
                if (Object.getPrototypeOf(t) == turnout_1.TurnoutDoubleElement.prototype) {
                    const to = t;
                    if (to.address === address || to.address2 === address) {
                        return to.t2Closed;
                    }
                }
            }
            return undefined;
        }
        static getTaskButton(taskName) {
            return Api.app.editor.views.getSchedulerButtonByTaskName(taskName);
        }
        static getSignal(address) {
            return Api.app.editor.views.getSignal(address);
        }
        static getRoute(name) {
            return Api.app.editor.views.getRouteSwitchElements().find(r => r.name === name);
        }
        static setRoute(name) {
            const route = Api.getRoute(name);
            if (route) {
                route.setRoute(0, Api.app.editor.views.getTurnoutElements());
            }
        }
        static getClock() {
            return Api.app.editor.fastClock;
        }
        static getClockMinutes() {
            const clock = Api.getClock();
            if (clock) {
                return clock.currentTime.getMinutes();
            }
            return -1;
        }
        static getElement(name) {
            return Api.app.editor.views.getElement(name);
        }
        static setOutput(address, on) {
            const aa = Api.app.editor.views.getAccessoryElements().find((a) => {
                return a.address == address;
            });
            if (aa) {
                const data = { address: address, value: on };
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.setOutput, data: data });
            }
            else {
                const data = { address: address, value: on };
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.setOutput, data: data });
            }
        }
        static getOutput(address) {
            return Api.app.outputs[address];
        }
        static setAccessory(address, on) {
            const aa = Api.app.editor.views.getAccessoryElements().find((a) => {
                return a.address == address;
            });
            if (aa) {
                const data = { address: address, value: on };
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.setBasicAccessory, data: data });
            }
            else {
                const data = { address: address, value: on };
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.setBasicAccessory, data: data });
            }
        }
        static getAccessory(address) {
            return Api.app.decoders[address];
        }
        static setSignalGreen(address) {
            const sig = Api.getSignal(address);
            if (sig) {
                sig.sendGreenIfNotGreen();
            }
            else {
                toastManager_1.toastManager.showToast(`Could not find Signal By Address: ${address}`, 'error');
            }
        }
        static getSignalIsGreen(address) {
            const sig = Api.getSignal(address);
            if (sig) {
                return sig.isGreen;
            }
            toastManager_1.toastManager.showToast(`Could not find Signal By Address: ${address}`, 'error');
            return false;
        }
        static setSignalRed(address) {
            const sig = Api.getSignal(address);
            if (sig) {
                sig.sendRedIfNotRed();
            }
            else {
                toastManager_1.toastManager.showToast(`Could not find Signal By Address: ${address}`, 'error');
            }
        }
        static getSignalIsRed(address) {
            const sig = Api.getSignal(address);
            if (sig) {
                return sig.isRed;
            }
            toastManager_1.toastManager.showToast(`Could not find Signal By Address: ${address}`, 'error');
            return false;
        }
        static setSignalYellow(address) {
            const sig = Api.getSignal(address);
            if (sig) {
                sig.sendYellowIfNotYellow();
            }
            else {
                toastManager_1.toastManager.showToast(`Could not find Signal By Address: ${address}`, 'error');
            }
        }
        static getSignalIsYellow(address) {
            const sig = Api.getSignal(address);
            if (sig) {
                return sig.isYellow;
            }
            toastManager_1.toastManager.showToast(`Could not find Signal By Address: ${address}`, 'error');
            return false;
        }
        static setSignalWhite(address) {
            const sig = Api.getSignal(address);
            if (sig) {
                sig.sendWhiteIfNotWhite();
            }
            else {
                toastManager_1.toastManager.showToast(`Could not find Signal By Address: ${address}`, 'error');
            }
        }
        static getSignalIsWhite(address) {
            const sig = Api.getSignal(address);
            if (sig) {
                return sig.isWhite;
            }
            toastManager_1.toastManager.showToast(`Could not find Signal By Address: ${address}`, 'error');
            return false;
        }
        static get tasks() {
            return Api.app.tasks;
        }
        static loadLocomotives() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`/locomotives`);
                    return yield response.json();
                    //this.render();
                    // if (locomotives.length > 0) {
                    //     locomotives.forEach((l: iLocomotive) => {
                    //         l.speed = 0
                    //         var loco: iLoco = { address: l.address, direction: 0, funcMap: 0, speed: 0 }
                    //         wsClient.send({ type: ApiCommands.getLoco, data: loco } as iData)
                    //     })
                    //     return locomotives
                    // }
                }
                catch (error) {
                    console.error("Error fetching locomotives:", error);
                }
            });
        }
    }
    exports.Api = Api;
    Api.edges = {};
});
