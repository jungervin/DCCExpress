define(["require", "exports", "../helpers/ws", "../../../common/src/dcc"], function (require, exports, ws_1, dcc_1) {
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
            </div>
        `;
            this.addressInputElement = this.shadow.getElementById('address');
            this.btnOffElement = this.shadow.getElementById("btnOff");
            this.btnOnElement = this.shadow.getElementById("btnOn");
            this.valueOffElement = this.shadow.getElementById("valueOff");
            this.valueOnElement = this.shadow.getElementById("valueOn");
        }
        setButton(button) {
            this.button = button;
            this.btnOffElement.button.address = button.address;
            this.btnOffElement.button.on = false;
            this.btnOffElement.onclick = (e) => {
                const data = { address: button.address, value: this.valueOffElement.value };
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.setBasicAccessory, data: data });
            };
            this.btnOnElement.button.address = button.address;
            this.btnOnElement.button.on = true;
            this.btnOnElement.draw();
            this.btnOnElement.onclick = (e) => {
                const data = { address: button.address, value: this.valueOnElement.value };
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.setBasicAccessory, data: data });
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
        }
    }
    exports.ButtonPropertiesElement = ButtonPropertiesElement;
    customElements.define("button-properties-element", ButtonPropertiesElement);
});
