"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessories = exports.locos = exports.ApiCommands = exports.DCCExDirections = exports.Z21Directions = exports.Connections = exports.SpeedModes = void 0;
var SpeedModes;
(function (SpeedModes) {
    SpeedModes[SpeedModes["S14"] = 0] = "S14";
    SpeedModes[SpeedModes["S28"] = 1] = "S28";
    SpeedModes[SpeedModes["S128"] = 2] = "S128";
})(SpeedModes || (exports.SpeedModes = SpeedModes = {}));
var Connections;
(function (Connections) {
    Connections[Connections["DCCEx"] = 0] = "DCCEx";
    Connections[Connections["Z21"] = 1] = "Z21";
})(Connections || (exports.Connections = Connections = {}));
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
var ApiCommands;
(function (ApiCommands) {
    ApiCommands["configSave"] = "configSave";
    ApiCommands["configSaved"] = "configSaved";
    ApiCommands["configLoad"] = "configLoad";
    ApiCommands["configLoaded"] = "configLoaded";
    ApiCommands["getLoco"] = "getLoco";
    ApiCommands["setLoco"] = "setLoco";
    ApiCommands["getTurnout"] = "getTurnout";
    ApiCommands["setTurnout"] = "setTurnout";
    ApiCommands["locoState"] = "locoState";
})(ApiCommands || (exports.ApiCommands = ApiCommands = {}));
exports.locos = {};
exports.accessories = {};
