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
                @import url("css/bootstrap.min.css");
                @import url("css/properties.css");
                               
            </style>
            <div class="container">
                <div class="igroup">
                    <div>Text</div>
                    <div>
                        <input id="labelText" type="text" style="width:100%" value="">
                    </div>
                    <div class="radio-container">
                        Vertical Alignment
                        <label><input type="radio" name="position" value="top"> Top</label>
                        <label><input type="radio" name="position" value="center"> Center</label>
                        <label><input type="radio" name="position" value="bottom"> Bottom</label>
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
            this.shadow.querySelectorAll('input[name="position"]').forEach((radio) => {
                const r = radio;
                r.checked = r.value == label.valign;
            });
            // var rb = this.shadow.querySelector(`input[name="position"][value="${label.valign}"]`) as HTMLInputElement
            // if(rb) {
            //     rb.checked = true
            // }
            this.shadow.querySelectorAll('input[name="position"]').forEach(radio => {
                radio.addEventListener('change', (event) => {
                    //console.log(`Selected: ${event.target.value}`);
                    this.label.valign = event.target.value;
                    window.invalidate();
                });
            });
        }
    }
    exports.LabelPropertiesElement = LabelPropertiesElement;
    customElements.define("label-properties-element", LabelPropertiesElement);
});
