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
    if (v.startsWith('0b')) {
        v = v.slice(2)
        base = 2
    } else if (v.startsWith('0x')) {
        v = v.slice(2)
        base = 16
    }
    return parseInt(v, base)
}

/**
 * Egy elem helyét feljebb mozgatja egy hellyel.
 * @param {any[]} arr - A módosítandó tömb.
 * @param {number} index - A mozgatandó elem indexe.
 */
export function moveUp(arr: any[], index: number) {
    if (index <= 0) return; // már a legelső elemnél vagyunk
    // A felcserélés:
    const temp = arr[index - 1];
    arr[index - 1] = arr[index];
    arr[index] = temp;
}

/**
 * Egy elem helyét lejjebb mozgatja egy hellyel.
 * @param {any[]} arr - A módosítandó tömb.
 * @param {number} index - A mozgatandó elem indexe.
 */
export function moveDown(arr: any[], index: number) {
    if (index >= arr.length - 1) return; // már az utolsó elemnél vagyunk
    // A felcserélés:
    const temp = arr[index + 1];
    arr[index + 1] = arr[index];
    arr[index] = temp;
}

/**
* Egy elem mozgatása a tömb elejére.
* @param {any[]} arr - A módosítandó tömb.
* @param {number} index - A mozgatandó elem indexe.
*/
export function moveToStart(arr: any[], index: number) {
    if (index <= 0) return; // Ha már elején van, nincs dolgunk
    // Vágjuk ki az elemet a régi helyéről:
    const [item] = arr.splice(index, 1);
    // Illesszük be a tömb elejére:
    arr.unshift(item);
}

/**
 * Egy elem mozgatása a tömb végére.
 * @param {any[]} arr - A módosítandó tömb.
 * @param {number} index - A mozgatandó elem indexe.
 */
export function moveToEnd(arr: any[], index: number) {
    if (index >= arr.length - 1) return; // Ha már a végén van, nincs dolgunk
    // Vágjuk ki az elemet a régi helyéről:
    const [item] = arr.splice(index, 1);
    // Illesszük be a tömb végére:
    arr.push(item);
}

export function isTouchDevice(): boolean {
    return navigator.maxTouchPoints > 0 || "ontouchstart" in window || window.matchMedia("(pointer: coarse)").matches;
}