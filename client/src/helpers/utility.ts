export function getUUID() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

export function byteToBinary(byte: number, len: number = 8): string {

    byte = byte & 0xff

    // if (byte < 0 || byte > 255) {
    //     throw new Error("The input must be a number between 0 and 255.");
    // }

    const binaryString = byte.toString(2).padStart(len, "0");
    return `0b${binaryString}`;
}

export function toDecimal(v: string) {
    var base = 10
    v = v.replace('_', '')
    if (v.startsWith('0b')) {
        v = v.slice(2)
        base = 2
    } else if (v.startsWith('0x')) {
        v = v.slice(2)
        base = 16
    }
    return parseInt(v, base)
}

export function moveUp(arr: any[], index: number) {
    if (index <= 0) return;

    const temp = arr[index - 1];
    arr[index - 1] = arr[index];
    arr[index] = temp;
}

export function moveDown(arr: any[], index: number) {
    if (index >= arr.length - 1) return;

    const temp = arr[index + 1];
    arr[index + 1] = arr[index];
    arr[index] = temp;
}

export function moveToStart(arr: any[], index: number) {
    if (index <= 0) return;
    const [item] = arr.splice(index, 1);

    arr.unshift(item);
}

export function moveToEnd(arr: any[], index: number) {
    if (index >= arr.length - 1) return;
    const [item] = arr.splice(index, 1);
    arr.push(item);
}

export function isTouchDevice(): boolean {
    return navigator.maxTouchPoints > 0 || "ontouchstart" in window || window.matchMedia("(pointer: coarse)").matches;
}

export function htmlSpaces(x: number): string {
    return "&nbsp;".repeat(x * 4);
}
