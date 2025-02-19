// import { IOConn } from "../../client/src/helpers/iocon";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultSettings = exports.rbus = exports.turnouts = exports.ext_accessories = exports.accessories = exports.locos = exports.setDecoder = exports.CommandCenterTypes = exports.iZ21STATUS = exports.Z21POWERINFO = exports.ApiCommands = exports.DCCExTurnout = exports.DCCExDirections = exports.Z21Directions = exports.SpeedModes = void 0;
    exports.getCommandCenterType = getCommandCenterType;
    exports.getUUID = getUUID;
    exports.fetchDevices = fetchDevices;
    var SpeedModes;
    (function (SpeedModes) {
        SpeedModes[SpeedModes["S14"] = 0] = "S14";
        SpeedModes[SpeedModes["S28"] = 1] = "S28";
        SpeedModes[SpeedModes["S128"] = 2] = "S128";
    })(SpeedModes || (exports.SpeedModes = SpeedModes = {}));
    // export enum Connections {
    //     DCCEx = 0,
    //     Z21 = 1
    // }
    var Z21Directions;
    (function (Z21Directions) {
        Z21Directions[Z21Directions["reverse"] = 0] = "reverse";
        Z21Directions[Z21Directions["forward"] = 1] = "forward";
    })(Z21Directions || (exports.Z21Directions = Z21Directions = {}));
    var DCCExDirections;
    (function (DCCExDirections) {
        DCCExDirections[DCCExDirections["reverse"] = 0] = "reverse";
        DCCExDirections[DCCExDirections["forward"] = 1] = "forward";
    })(DCCExDirections || (exports.DCCExDirections = DCCExDirections = {}));
    var DCCExTurnout;
    (function (DCCExTurnout) {
        DCCExTurnout[DCCExTurnout["closed"] = 0] = "closed";
        DCCExTurnout[DCCExTurnout["open"] = 1] = "open";
    })(DCCExTurnout || (exports.DCCExTurnout = DCCExTurnout = {}));
    var ApiCommands;
    (function (ApiCommands) {
        ApiCommands["configSave"] = "configSave";
        ApiCommands["configSaved"] = "configSaved";
        ApiCommands["configLoad"] = "configLoad";
        ApiCommands["configLoaded"] = "configLoaded";
        ApiCommands["getLoco"] = "getLoco";
        ApiCommands["setLoco"] = "setLoco";
        ApiCommands["locoInfo"] = "locoInfo";
        ApiCommands["setLocoFunction"] = "setLocoFunction";
        ApiCommands["getTurnout"] = "getTurnout";
        ApiCommands["setTurnout"] = "setTurnout";
        ApiCommands["turnoutInfo"] = "turnoutInfo";
        ApiCommands["getBasicAcessory"] = "getBasicAcessory";
        ApiCommands["setBasicAccessory"] = "setBasicAccessory";
        ApiCommands["basicAccessoryInfo"] = "basicAccessoryInfo";
        //turnoutClicked = "turnoutClicked",
        // turnoutStates = "turnoutStates",
        // setCommandCenters = "setCommandCenters",
        // getCommandCenters = "getCommandCenters",
        // commandCenterInfos = "commandCenterInfos",
        ApiCommands["getRBusInfo"] = "getRBusInfo";
        ApiCommands["rbusInfo"] = "rbusInfo";
        // getTurnouts = "getTurnouts",
        // Turnouts = "Turnouts",
        ApiCommands["alert"] = "alert";
        ApiCommands["response"] = "response";
        ApiCommands["systemInfo"] = "systemInfo";
        ApiCommands["powerInfo"] = "powerInfo";
        ApiCommands["setPower"] = "setPower";
        ApiCommands["emergencyStop"] = "emergencyStop";
        ApiCommands["UnsuccessfulOperation"] = "UnsuccessfulOperation";
        ApiCommands["saveSettings"] = "saveSettings";
        ApiCommands["getSettings"] = "getSettings";
        ApiCommands["settingsInfo"] = "settingsInfo";
    })(ApiCommands || (exports.ApiCommands = ApiCommands = {}));
    var Z21POWERINFO;
    (function (Z21POWERINFO) {
        Z21POWERINFO[Z21POWERINFO["poweroff"] = 0] = "poweroff";
        Z21POWERINFO[Z21POWERINFO["poweron"] = 1] = "poweron";
        Z21POWERINFO[Z21POWERINFO["programmingmode"] = 2] = "programmingmode";
        Z21POWERINFO[Z21POWERINFO["shortcircuit"] = 8] = "shortcircuit";
    })(Z21POWERINFO || (exports.Z21POWERINFO = Z21POWERINFO = {}));
    var iZ21STATUS;
    (function (iZ21STATUS) {
        iZ21STATUS[iZ21STATUS["poweroff"] = 0] = "poweroff";
        iZ21STATUS[iZ21STATUS["poweron"] = 1] = "poweron";
        iZ21STATUS[iZ21STATUS["programmingmode"] = 2] = "programmingmode";
        iZ21STATUS[iZ21STATUS["shortcircuit"] = 8] = "shortcircuit";
    })(iZ21STATUS || (exports.iZ21STATUS = iZ21STATUS = {}));
    var CommandCenterTypes;
    (function (CommandCenterTypes) {
        CommandCenterTypes[CommandCenterTypes["Z21"] = 0] = "Z21";
        CommandCenterTypes[CommandCenterTypes["DCCExTCP"] = 1] = "DCCExTCP";
        CommandCenterTypes[CommandCenterTypes["DCCExSerial"] = 2] = "DCCExSerial";
        CommandCenterTypes[CommandCenterTypes["unknown"] = 3] = "unknown";
    })(CommandCenterTypes || (exports.CommandCenterTypes = CommandCenterTypes = {}));
    function getCommandCenterType(type) {
        const res = Object.keys(CommandCenterTypes).filter(key => isNaN(Number(key)));
        return res ? res[type] : "Unknown";
    }
    // export interface iDCCExTCPCommandCenter extends iCommandCenter{
    //     ip: string,
    //     port: number
    // }
    class setDecoder {
        constructor(message) {
            this.type = ApiCommands.setBasicAccessory;
            this.data = message;
        }
    }
    exports.setDecoder = setDecoder;
    // export abstract class CommandCenter {
    //     decoders: iBasicAccessory[] = []
    //     locos: iLoco[] = []
    //     abstract connect(): void
    //     abstract diconnect(): void
    // }
    //export let CommandCenters
    exports.locos = {};
    exports.accessories = {};
    exports.ext_accessories = {};
    exports.turnouts = {};
    exports.rbus = {};
    function getUUID() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16));
    }
    function fetchDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('/devices');
                const devices = yield response.json();
                return devices;
            }
            catch (error) {
                console.error("Error fetching devices:", error);
            }
        });
    }
    exports.defaultSettings = {
        CommandCenter: {
            type: CommandCenterTypes.Z21,
            ip: "192.168.0.70",
            port: 21105,
            serialPort: "COM1",
            turnoutActiveTime: 500,
            basicAccessoryDecoderActiveTime: 10
        },
        CommandCenterZ21: {
            ip: "",
            port: 21105,
        },
        CommandCenterDCCExTcp: {
            ip: "192.168.1.183",
            port: 2560,
        },
        CommandCenterDCCExSerial: {
            port: "COM3"
        },
        Dispacher: {
            interval: 500
        },
        EditorSettings: {
            ShowAddress: true,
            // LocoPanelVisible: false,
            // TurnoutWaitTime: 200,
            Orientation: DCCExDirections.forward,
        }
    };
});
