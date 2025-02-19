var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../../../common/src/dcc"], function (require, exports, dcc_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Globals = void 0;
    class Globals {
        // static EditorSettings = {
        //     GridSizeX: dGridSizeX,
        //     GridSizeY: dGridSizeY,
        //     TrackWidth7: dTrackWidth7,
        //     TrackWidth3: dTrackWidth3,
        //     ShowAddress: true,
        //     // LocoPanelVisible: false,
        //     // TurnoutWaitTime: 200,
        //     Orientation: DCCExDirections.forward,
        // }
        static fetchJsonData(url) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(url);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = yield response.json();
                    //console.log("Received JSON:", data);
                    return data;
                }
                catch (error) {
                    alert("Error fetching JSON:\n" + error);
                    return null;
                }
            });
        }
        static saveJson(fileName, data) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch("/save", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ fileName, data: data })
                    });
                    const result = yield response.json();
                    console.log(result.message);
                }
                catch (error) {
                    alert("Error saving file:\n" + error);
                }
            });
        }
    }
    exports.Globals = Globals;
    // static ServerSettings: iServerSettings = {
    //     CommandCenter: {
    //         type: CommandCenterTypes.Z21,
    //         ip: '192.168.0.70',
    //         port: 21105,
    //         serialPort: 'COM7',
    //         turnoutActiveTime: 500,
    //         basicAccessoryDecoderActiveTime: 100
    //     },
    //     CommandCenterZ21: {
    //         ip: '192.168.0.70',
    //         port: 21105,
    //     },
    //     Dispacher: {
    //         interval: 500
    //     }
    // }
    Globals.GridSizeX = 40;
    Globals.GridSizeY = 40;
    Globals.TrackWidth7 = 7;
    Globals.TrackWidth3 = 3;
    Globals.Settings = dcc_1.defaultSettings;
});
// export let commandCenters: iCommandCenter[] = []
// export function setCommandCenters(data: any) {
//     Globals.devices = data
// }
