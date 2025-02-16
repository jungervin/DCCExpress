define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.List = void 0;
    class List {
        constructor() {
            this.items = [];
            this.selectedIndex = null;
        }
        add(item) {
            this.items.push(item);
        }
        remove(item) {
            const index = this.items.indexOf(item);
            if (index !== -1) {
                this.items.splice(index, 1);
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
        indexOf(item) {
            return this.items.indexOf(item);
        }
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
        get selectedElement() {
            return this.selectedIndex !== null ? this.items[this.selectedIndex] : null;
        }
        get allItems() {
            return [...this.items];
        }
        clear() {
            this.items = [];
            this.selectedIndex = null;
        }
        get size() {
            return this.items.length;
        }
    }
    exports.List = List;
});
