define(["require", "exports"], function (require, exports) {
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
                </div>
            </div>
        `;
            this.addressInputElement = this.shadow.getElementById('address');
        }
        setButton(button) {
            this.button = button;
            this.addressInputElement.value = button.address.toString();
            this.addressInputElement.onchange = (e) => {
                this.button.address = parseInt(this.addressInputElement.value);
                window.invalidate();
            };
        }
    }
    exports.ButtonPropertiesElement = ButtonPropertiesElement;
    customElements.define("button-properties-element", ButtonPropertiesElement);
});
