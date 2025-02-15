"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = log;
exports.logError = logError;
exports.bufferToHex = bufferToHex;
exports.arrayToHex = arrayToHex;
const chalk_1 = __importDefault(require("chalk"));
function log(...args) {
    console.log(new Date(), args);
}
function logError(...args) {
    console.error(new Date(), chalk_1.default.bgRed(args));
}
function bufferToHex(buffer) {
    // Ellenőrizzük, hogy a bemeneti paraméter egy Buffer típusú objektum-e
    if (!Buffer.isBuffer(buffer)) {
        throw new Error("A bemeneti paraméternek Buffer típusúnak kell lennie.");
    }
    // A Buffer tartalmának hexadecimális formátumban történő kinyomtatása
    let hexOutput = "";
    for (const byte of buffer) {
        // Minden bájtot kétjegyű hexadecimális számra formázunk, nullákkal kitöltve
        hexOutput += byte.toString(16).padStart(2, '0') + " ";
    }
    return hexOutput.trim(); // Az utolsó szóköz eltávolítása
}
function arrayToHex(array) {
    // Ellenőrizzük, hogy a bemenet egy számokat tartalmazó tömb-e
    if (!Array.isArray(array) || !array.every(num => Number.isInteger(num) && num >= 0 && num <= 255)) {
        throw new Error("A bemeneti paraméternek 0-255 közötti számokat tartalmazó tömbnek kell lennie.");
    }
    // A számokat hexadecimális formátumra alakítjuk
    return array.map(num => num.toString(16).padStart(2, '0')).join(" ");
}
//# sourceMappingURL=utility.js.map