"use strict";
// const fs = require('fs');
// const path = require('path');
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutex = exports.File = void 0;
exports.log = log;
exports.logError = logError;
exports.bufferToHex = bufferToHex;
exports.arrayToHex = arrayToHex;
const fs_1 = require("fs");
function log(...args) {
    console.log(new Date(), args);
}
function logError(...args) {
    const message = args.join(' ');
    console.error(new Date(), `\x1b[41m\x1b[33m${message}\x1b[0m`);
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
class File {
    static read(fname) {
        return (0, fs_1.readFileSync)(fname, 'utf8');
    }
    static write(fname, text) {
        (0, fs_1.writeFileSync)(fname, text, 'utf-8');
    }
}
exports.File = File;
class Mutex {
    constructor() {
        this.promise = null;
        this.resolve = null;
    }
    lock() {
        return __awaiter(this, void 0, void 0, function* () {
            while (this.promise) {
                yield this.promise; // Várunk, amíg a lock felszabadul
            }
            this.promise = new Promise(resolve => this.resolve = resolve);
        });
    }
    unlock() {
        if (this.resolve) {
            this.resolve();
            this.promise = null;
            this.resolve = null;
        }
    }
}
exports.Mutex = Mutex;
//# sourceMappingURL=utility.js.map