define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SpeedometerElement = void 0;
    class SpeedometerElement extends HTMLElement {
        constructor() {
            super();
            this.maxSpeed = 100;
            this.currentSpeed = 0;
            this.speedElement = document.createElement("div");
            this.appendChild(this.speedElement);
            this.labelElement = document.createElement("div");
            this.appendChild(this.labelElement);
            this.btnForward = document.createElement("div");
            this.btnForward.className = "btnLocoForward";
            this.appendChild(this.btnForward);
            this.btnReverse = document.createElement("div");
            this.btnReverse.className = "btnLocoReverse";
            this.appendChild(this.btnReverse);
        }
        static get observedAttributes() {
            return ['max-speed', 'current-speed'];
        }
        attributeChangedCallback(name, oldValue, newValue) {
            // if (name === 'max-speed' && newValue) {
            //     this.maxSpeed = parseInt(newValue, 10);
            //     this.updateLabel();
            // } else if (name === 'current-speed' && newValue) {
            //     this.currentSpeed = parseInt(newValue, 10);
            //     this.updateNeedle();
            //     this.updateLabel();
            // }
        }
        updateNeedle() {
            const angle = (180 * this.currentSpeed) / this.maxSpeed - 90; // -90°-tól indul
            // this.needle.style.transform = `rotate(${angle}deg)`;
        }
        updateLabel() {
            // const label = this.shadowRoot!.querySelector('.label');
            // if (label) {
            //     label.textContent = `${this.currentSpeed} / ${this.maxSpeed} km/h`;
            // }
        }
        // Sebesség beállítása (TypeScriptből is)
        setSpeed(speed) {
            this.speedElement.innerHTML = speed.toString();
        }
        setMaxSpeed(maxSpeed) {
        }
        get loco() {
            return this._loco;
        }
        set loco(v) {
            this._loco = v;
            if (v) {
                this.labelElement.innerHTML = v.name;
            }
            else {
                this.labelElement.innerHTML = "";
            }
        }
    }
    exports.SpeedometerElement = SpeedometerElement;
    // Komponens regisztrációja
    customElements.define('speedometer-element', SpeedometerElement);
});
