define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.List = void 0;
    class List {
        constructor() {
            this.items = [];
            this.selectedIndex = null;
        }
        // Hozzáadás a listához
        add(item) {
            this.items.push(item);
        }
        // Eltávolítás a listából (érték alapján)
        remove(item) {
            const index = this.items.indexOf(item);
            if (index !== -1) {
                this.items.splice(index, 1);
                // Frissítsük a kijelölt elemet, ha szükséges
                if (this.selectedIndex === index) {
                    this.selectedIndex = null;
                }
                else if (this.selectedIndex !== null && this.selectedIndex > index) {
                    this.selectedIndex--;
                }
                return true;
            }
            return false;
        }
        // Index keresése
        indexOf(item) {
            return this.items.indexOf(item);
        }
        // Kiválasztott elem beállítása
        set selectedElement(item) {
            if (item === null) {
                this.selectedIndex = null;
            }
            else {
                const index = this.indexOf(item);
                if (index !== -1) {
                    this.selectedIndex = index;
                }
                else {
                    throw new Error("Element not found in the list");
                }
            }
        }
        // Kiválasztott elem lekérése
        get selectedElement() {
            return this.selectedIndex !== null ? this.items[this.selectedIndex] : null;
        }
        // Az összes elem lekérése
        get allItems() {
            return [...this.items]; // Másolatot adunk vissza, hogy ne lehessen közvetlenül módosítani
        }
        // Lista törlése
        clear() {
            this.items = [];
            this.selectedIndex = null;
        }
        // Lista mérete
        get size() {
            return this.items.length;
        }
    }
    exports.List = List;
});
