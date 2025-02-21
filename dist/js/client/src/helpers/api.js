define(["require", "exports", "../../../common/src/dcc", "./ws"], function (require, exports, dcc_1, ws_1) {
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
            return Api.app.editor.views.getTurnoutElements().find(t => t.address === address);
        }
        static getSensor(address) {
            return Api.app.sensors[address];
        }
    }
    exports.Api = Api;
});
