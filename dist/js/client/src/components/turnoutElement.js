define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TurnoutHTMLElement = void 0;
    class TurnoutHTMLElement extends HTMLElement {
        constructor() {
            super();
            this._turnout = undefined;
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = `
            <style>
                
            </style>
            <div>
                <canvas id="canvas" width="80" height="80"></canvas>
            </div>
        `;
            this.canvas = shadow.getElementById("canvas");
        }
        get turnout() {
            return this._turnout;
        }
        set turnout(v) {
            this._turnout = v;
        }
    }
    exports.TurnoutHTMLElement = TurnoutHTMLElement;
    customElements.define("turnout-html-element", TurnoutHTMLElement);
});
