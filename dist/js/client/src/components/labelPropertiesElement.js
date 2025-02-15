define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LabelPropertiesElement = void 0;
    class LabelPropertiesElement extends HTMLElement {
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
                    <div>Text</div>
                    <div>
                        <input id="labelText" type="text" value="">
                    </div>
                </div>
            </div>
        `;
            this.labelTextElement = this.shadow.getElementById('labelText');
        }
        setLabel(label) {
            this.label = label;
            this.labelTextElement.value = label.text;
            this.labelTextElement.onchange = (e) => {
                this.label.text = this.labelTextElement.value;
                window.invalidate();
            };
        }
    }
    exports.LabelPropertiesElement = LabelPropertiesElement;
    customElements.define("label-properties-element", LabelPropertiesElement);
});
