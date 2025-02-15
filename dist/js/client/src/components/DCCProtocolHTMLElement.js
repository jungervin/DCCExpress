define(["require", "exports", "../../../common/src/dcc"], function (require, exports, dcc_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CommandCenterHTMLSelectElement = void 0;
    class CommandCenterHTMLSelectElement extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = `
            <style>
                
            </style>
            <label for="protocols">DCC Protocol:</label>
            <select name="protocols" id="protocols">
            </select>
        `;
            this.list = shadow.getElementById("protocols");
            this.list.onchange = (e) => {
                if (this.onchange) {
                    this.onchange(e);
                }
            };
        }
        connectedCallback() {
            (0, dcc_1.fetchDevices)().then((data) => {
                this.devices = data;
                for (var i = 0; i < data.length; i++) {
                    var cc = data[i];
                    var opt = document.createElement("option");
                    opt.value = cc.id;
                    opt.innerHTML = cc.name;
                    this.list.appendChild(opt);
                }
            });
        }
    }
    exports.CommandCenterHTMLSelectElement = CommandCenterHTMLSelectElement;
    customElements.define("dcc-protocol-element", CommandCenterHTMLSelectElement);
});
