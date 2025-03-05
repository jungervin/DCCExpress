define(["require", "exports", "../../../common/src/dcc", "../helpers/globals"], function (require, exports, dcc_1, globals_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ButtonPropertiesElement = void 0;
    class ButtonPropertiesElement extends HTMLElement {
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: 'open' });
            this.shadow.innerHTML = `
            <style>
                @import url("/bootstrap.css");
                @import url("/css/properties.css");

                               
            </style>
            <div class="container">
                <div class="igroup">
                    <div>Address</div>
                    <div>
                        <input id="address" type="number" style="width:100%" value="">
                    </div>
                    <div style="display: flex; gap:8px; text-align: left">
                        <button-canvas-element id="btnOff"></button-canvas-element>
                        <bit-element id="valueOff"></bit-element>
                    </div>
                    <div style="display: flex; gap:8px; text-align: left">
                        <button-canvas-element id="btnOn"></button-canvas-element>
                        <bit-element id="valueOn"></bit-element>
                    </div>
                </div>

                <div class="igroup" id="modeGroup">
                    <div>Mode</div>
                    <div>
                        <input type="radio" id="accessory" name="mode" value="accessory" checked />
                        <label for="accessory">Accessory</label>
                    </div>

                    <div>
                        <input type="radio" id="output" name="mode" value="output" />
                        <label for="output">Output</label>
                    </div>
                </div>
        `;
            this.addressInputElement = this.shadow.getElementById('address');
            this.btnOffElement = this.shadow.getElementById("btnOff");
            this.btnOnElement = this.shadow.getElementById("btnOn");
            this.valueOffElement = this.shadow.getElementById("valueOff");
            this.valueOnElement = this.shadow.getElementById("valueOn");
            this.accessoryModeElement = this.shadow.getElementById("accessory");
            this.outputModeElement = this.shadow.getElementById("output");
        }
        setButton(button) {
            this.button = button;
            this.btnOffElement.button.address = button.address;
            this.btnOffElement.button.on = false;
            this.btnOffElement.onclick = (e) => {
                this.btnOffElement.button.mode = this.button.mode;
                this.btnOffElement.button.address = this.button.address;
                this.btnOffElement.button.address = this.button.address;
                this.btnOffElement.button.send();
            };
            this.btnOnElement.button.address = button.address;
            this.btnOnElement.button.on = true;
            this.btnOnElement.draw();
            this.btnOnElement.onclick = (e) => {
                this.btnOnElement.button.mode = this.button.mode;
                this.btnOnElement.button.address = this.button.address;
                this.btnOnElement.button.address = this.button.address;
                this.btnOnElement.button.send();
            };
            this.addressInputElement.value = button.address.toString();
            this.addressInputElement.onchange = (e) => {
                this.button.address = parseInt(this.addressInputElement.value);
                window.invalidate();
            };
            this.valueOffElement.value = button.valueOff;
            this.valueOffElement.onchanged = (e) => {
                this.button.valueOff = this.valueOffElement.value;
            };
            this.valueOnElement.value = button.valueOn;
            this.valueOnElement.onchanged = (e) => {
                this.button.valueOn = this.valueOnElement.value;
            };
            this.shadowRoot.getElementById("modeGroup").style.display = globals_1.Globals.CommandCenterSetting.type == dcc_1.CommandCenterTypes.Z21 ? "none" : "block";
            this.accessoryModeElement.checked = this.button.mode == dcc_1.OutputModes.accessory;
            this.accessoryModeElement.onchange = (e) => {
                this.button.mode = dcc_1.OutputModes.accessory;
            };
            this.outputModeElement.checked = button.mode == dcc_1.OutputModes.output;
            this.outputModeElement.onchange = (e) => {
                this.button.mode = dcc_1.OutputModes.output;
            };
        }
    }
    exports.ButtonPropertiesElement = ButtonPropertiesElement;
    customElements.define("button-properties-element", ButtonPropertiesElement);
});
