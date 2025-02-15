define(["require", "exports", "./dcc"], function (require, exports, dcc_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IOConn = void 0;
    class IOConn {
        // static sendTurnoutCmd(to: TurnoutElement) {
        //     //if(to inst)
        //     this.socket.emit(ApiCommands.turnoutClicked, {address: to.address, isClosed: to.isClosed, wait: settings.TurnoutWaitTime} as iTurnout)
        // }
        static sendTurnoutCmd(to) {
            //if(to inst)
            this.socket.emit(dcc_1.ApiCommands.turnoutClicked, to);
        }
    }
    exports.IOConn = IOConn;
});
