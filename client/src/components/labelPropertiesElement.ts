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
                        <input id="labelText" type="text" value="">
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
    }
}
customElements.define("label-properties-element", LabelPropertiesElement)