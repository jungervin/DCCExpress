import { ButtonShapeElement } from "../editor/button";

export class ButtonPropertiesElement extends HTMLElement {
    shadow: ShadowRoot;
    addressInputElement: HTMLInputElement | null;
    button?: ButtonShapeElement;
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
        `
        this.addressInputElement = this.shadow.getElementById('address') as HTMLInputElement
    }

    setButton(button: ButtonShapeElement) {
        this.button = button;
        this.addressInputElement!.value = button.address.toString()
        this.addressInputElement!.onchange = (e) => {
           this.button!.address = parseInt(this.addressInputElement!.value)
           window.invalidate()
        }

    }
}
customElements.define("button-properties-element", ButtonPropertiesElement)