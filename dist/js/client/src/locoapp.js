define(["require", "exports", "../../common/src/dcc", "./helpers/ws", "./components/controlPanel"], function (require, exports, dcc_1, ws_1, controlPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LocoApp = void 0;
    console.log(dcc_1.ApiCommands);
    console.log(controlPanel_1.LocoControlPanel);
    class LocoApp {
        constructor() {
            ws_1.wsClient.onConnected = () => {
                this.cp.init();
                //wsClient.send({ type: ApiCommands.getCommandCenters, data: "" })
                //wsClient.send({ type: ApiCommands.configLoad, data: "" })
            };
            ws_1.wsClient.onError = () => {
                //this.toolbar.wsStatus?.setAttribute("fill", "red")
            };
            ws_1.wsClient.onMessage = (msg) => {
                switch (msg.type) {
                    // case ApiCommands.commandCenterInfos:
                    //     Globals.devices = msg.data as iCommandCenter[]
                    //     break;
                    case dcc_1.ApiCommands.locoInfo:
                        this.cp.processMessage(msg.data);
                        break;
                }
            };
            this.cp = document.createElement('loco-control-panel');
            document.body.appendChild(this.cp);
            ws_1.wsClient.connect();
        }
    }
    exports.LocoApp = LocoApp;
    const App = new LocoApp();
});
