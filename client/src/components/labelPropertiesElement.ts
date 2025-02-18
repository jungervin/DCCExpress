import { Label2Element } from "../editor/label.js";

export class LabelPropertiesElement extends HTMLElement {
    shadow: ShadowRoot;
    labelTextElement: HTMLInputElement | null;
    label?: Label2Element;
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
        `
        this.labelTextElement = this.shadow.getElementById('labelText') as HTMLInputElement
    }

    setLabel(label: Label2Element) {
        this.label = label;
        this.labelTextElement!.value = label.text
        this.labelTextElement!.onchange = (e) => {
           this.label!.text = this.labelTextElement!.value
           window.invalidate()
        }

        this.shadow.querySelectorAll('input[name="position"]').forEach((radio) => {
            const r = radio as HTMLInputElement
            r.checked = r.value == label.valign

        });

        // var rb = this.shadow.querySelector(`input[name="position"][value="${label.valign}"]`) as HTMLInputElement
        // if(rb) {
        //     rb.checked = true
        // }


        this.shadow.querySelectorAll('input[name="position"]').forEach(radio => {
            radio.addEventListener('change', (event) => {
                //console.log(`Selected: ${event.target.value}`);
                this.label!.valign = (event.target as HTMLInputElement).value
                window.invalidate()
            });
        });
    }
}
customElements.define("label-properties-element", LabelPropertiesElement)