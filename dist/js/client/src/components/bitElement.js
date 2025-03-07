define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BitElement = void 0;
    class BitElement extends HTMLElement {
        constructor() {
            super();
            this._value = false;
            this.onclick = (e) => {
                this.value = !this.value;
            };
        }
        connectedCallback() {
            this.style.display = "flex";
            this.style.alignItems = "center";
            this.style.justifyContent = "center";
            this.style.fontWeight = "bold";
            this.style.color = 'white';
            this.style.backgroundColor = "#2a2a2a";
            this.style.width = '32px';
            this.style.height = '32px';
            this.style.cursor = 'pointer';
            this.style.border = '1px solid black';
            this.value = this.value;
        }
        get value() {
            return this._value;
        }
        set value(v) {
            this._value = v;
            if (v) {
                this.style.backgroundColor = "orangered";
                this.innerHTML = '1';
            }
            else {
                this.style.backgroundColor = "#2a2a2a";
                this.innerHTML = '0';
            }
            if (this.onchanged) {
                this.onchanged(this);
            }
        }
        setCursor(cursor) {
            this.style.cursor = cursor;
        }
    }
    exports.BitElement = BitElement;
    customElements.define('bit-element', BitElement);
});
