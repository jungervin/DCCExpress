define(["require", "exports", "../../../common/src/dcc"], function (require, exports, dcc_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Globals = exports.dTrackWidth3 = exports.dTrackWidth7 = exports.dGridSizeY = exports.dGridSizeX = void 0;
    exports.dGridSizeX = 40;
    exports.dGridSizeY = 40;
    exports.dTrackWidth7 = 7;
    exports.dTrackWidth3 = 3;
    class Globals {
    }
    exports.Globals = Globals;
    Globals.ServerSettings = {
        CommandCenter: {
            type: dcc_1.CommandCenterTypes.Z21,
            ip: '192.168.0.70',
            port: 21105,
            serialPort: 'COM7',
            turnoutActiveTime: 500,
            basicAccessoryDecoderActiveTime: 100
        },
        Dispacher: {
            interval: 500
        }
    };
    Globals.AppSettings = {
        GridSizeX: exports.dGridSizeX,
        GridSizeY: exports.dGridSizeY,
        TrackWidth7: exports.dTrackWidth7,
        TrackWidth3: exports.dTrackWidth3,
        ShowAddress: true,
        LocoPanelVisible: false,
        TurnoutWaitTime: 200,
        Orientation: dcc_1.DCCExDirections.forward,
    };
});
// export let commandCenters: iCommandCenter[] = []
// export function setCommandCenters(data: any) {
//     Globals.devices = data
// }
