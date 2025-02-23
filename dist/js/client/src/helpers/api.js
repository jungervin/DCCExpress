define(["require", "exports", "../../../common/src/dcc", "./ws", "../editor/turnout"], function (require, exports, dcc_1, ws_1, turnout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Api = void 0;
    class Api {
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
        static setTurnout(address, isClosed) {
            const turnout = Api.getTurnout(address);
            if (turnout) {
                if (Object.getPrototypeOf(turnout) == turnout_1.TurnoutDoubleElement.prototype) {
                    const td = turnout;
                    if (td.address === address) {
                        var t = { address: address, isClosed: isClosed ? td.t1ClosedValue : td.t1OpenValue };
                        ws_1.wsClient.send({ type: dcc_1.ApiCommands.setTurnout, data: t });
                    }
                    else if (td.address2 === address) {
                        var t = { address: address, isClosed: isClosed ? td.t2ClosedValue : td.t2OpenValue };
                        ws_1.wsClient.send({ type: dcc_1.ApiCommands.setTurnout, data: t });
                    }
                }
                else {
                    const to = turnout;
                    var t = { address: address, isClosed: isClosed ? to.t1ClosedValue : to.t1OpenValue };
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.setTurnout, data: t });
                }
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
        static getTurnout(address) {
            //return Api.app.turnouts[address]
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
        static getSensor(address) {
            return Api.app.sensors[address];
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
    }
    exports.Api = Api;
});
