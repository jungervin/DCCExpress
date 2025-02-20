import { wsClient } from "../helpers/ws";
import { ApiCommands, iData, iSetBasicAccessory } from "../../../common/src/dcc";
import { ButtonShapeElement } from "../editor/button";
import { BitElement } from "./bitElement";
import { ButtonCanvasElement } from "./canvasElement";

export class ButtonPropertiesElement extends HTMLElement {
    shadow: ShadowRoot;
    addressInputElement: HTMLInputElement | null;
    btnOffElement: ButtonCanvasElement | null;
    btnOnElement: ButtonCanvasElement | null;
    valueOnElement: BitElement;
    valueOffElement: BitElement;
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
        `
        this.addressInputElement = this.shadow.getElementById('address') as HTMLInputElement
        this.btnOffElement = this.shadow.getElementById("btnOff") as ButtonCanvasElement
        this.btnOnElement = this.shadow.getElementById("btnOn") as ButtonCanvasElement
        this.valueOffElement = this.shadow.getElementById("valueOff") as BitElement
        this.valueOnElement = this.shadow.getElementById("valueOn") as BitElement
    }

    setButton(button: ButtonShapeElement) {
        this.button = button

        this.btnOffElement!.button.address = button.address
        this.btnOffElement!.button.on = false
        this.btnOffElement!.onclick = (e) => {
            const data: iSetBasicAccessory = { address: button.address, value: this.valueOffElement.value } as iSetBasicAccessory
            wsClient.send({ type: ApiCommands.setBasicAccessory, data: data } as iData)
        }

        this.btnOnElement!.button.address = button.address
        this.btnOnElement!.button.on = true
        this.btnOnElement!.draw()
        this.btnOnElement!.onclick = (e) => {
            const data: iSetBasicAccessory = { address: button.address, value: this.valueOnElement.value } as iSetBasicAccessory
            wsClient.send({ type: ApiCommands.setBasicAccessory, data: data } as iData)
        }

        this.addressInputElement!.value = button.address.toString()
        this.addressInputElement!.onchange = (e) => {
            this.button!.address = parseInt(this.addressInputElement!.value)
            window.invalidate()
        }

        this.valueOffElement.value = button.valueOff
        this.valueOffElement.onchanged = (e) => {
            this.button!.valueOff = this.valueOffElement.value
        }
        this.valueOnElement.value = button.valueOn
        this.valueOnElement.onchanged = (e) => {
            this.button!.valueOn = this.valueOnElement.value
        }
    }
}
customElements.define("button-properties-element", ButtonPropertiesElement)