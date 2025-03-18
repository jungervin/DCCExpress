define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getUUID = getUUID;
    exports.byteToBinary = byteToBinary;
    exports.toDecimal = toDecimal;
    exports.moveUp = moveUp;
    exports.moveDown = moveDown;
    exports.moveToStart = moveToStart;
    exports.moveToEnd = moveToEnd;
    exports.isTouchDevice = isTouchDevice;
    function getUUID() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16));
    }
    function byteToBinary(byte, len = 8) {
        byte = byte & 0xff;
        // if (byte < 0 || byte > 255) {
        //     throw new Error("The input must be a number between 0 and 255.");
        // }
        const binaryString = byte.toString(2).padStart(len, "0");
        return `0b${binaryString}`;
    }
    function toDecimal(v) {
        var base = 10;
        v = v.replace('_', '');
        if (v.startsWith('0b')) {
            v = v.slice(2);
            base = 2;
        }
        else if (v.startsWith('0x')) {
            v = v.slice(2);
            base = 16;
        }
        return parseInt(v, base);
    }
    function moveUp(arr, index) {
        if (index <= 0)
            return;
        const temp = arr[index - 1];
        arr[index - 1] = arr[index];
        arr[index] = temp;
    }
    function moveDown(arr, index) {
        if (index >= arr.length - 1)
            return;
        const temp = arr[index + 1];
        arr[index + 1] = arr[index];
        arr[index] = temp;
    }
    function moveToStart(arr, index) {
        if (index <= 0)
            return;
        const [item] = arr.splice(index, 1);
        arr.unshift(item);
    }
    function moveToEnd(arr, index) {
        if (index >= arr.length - 1)
            return;
        const [item] = arr.splice(index, 1);
        arr.push(item);
    }
    function isTouchDevice() {
        return navigator.maxTouchPoints > 0 || "ontouchstart" in window || window.matchMedia("(pointer: coarse)").matches;
    }
});
