import { wsClient } from "../helpers/ws";
import { ApiCommands, CommandCenterTypes, iData, iSetBasicAccessory, OutputModes } from "../../../common/src/dcc";
import { ButtonShapeElement } from "../editor/button";
import { BitElement } from "./bitElement";
import { ButtonCanvasElement } from "./canvasElement";
import { Globals } from "../helpers/globals";

export class ButtonPropertiesElement extends HTMLElement {
    shadow: ShadowRoot;
    addressInputElement: HTMLInputElement | null;
    btnOffElement: ButtonCanvasElement | null;
    btnOnElement: ButtonCanvasElement | null;
    valueOnElement: BitElement;
    valueOffElement: BitElement;
    button?: ButtonShapeElement;
    accessoryModeElement: HTMLInputElement;
    outputModeElement: HTMLInputElement;
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
        `
        this.addressInputElement = this.shadow.getElementById('address') as HTMLInputElement
        this.btnOffElement = this.shadow.getElementById("btnOff") as ButtonCanvasElement
        this.btnOnElement = this.shadow.getElementById("btnOn") as ButtonCanvasElement
        this.valueOffElement = this.shadow.getElementById("valueOff") as BitElement
        this.valueOnElement = this.shadow.getElementById("valueOn") as BitElement

        this.accessoryModeElement = this.shadow.getElementById("accessory") as HTMLInputElement
        this.outputModeElement = this.shadow.getElementById("output") as HTMLInputElement
    }

    setButton(button: ButtonShapeElement) {
        this.button = button

        this.btnOffElement!.button.address = button.address
        this.btnOffElement!.button.on = false
        this.btnOffElement!.onclick = (e) => {
            this.btnOffElement!.button.outputMode = this.button!.outputMode
            this.btnOffElement!.button.address = this.button!.address
            this.btnOffElement!.button.address = this.button!.address
            this.btnOffElement!.button.send()

        }

        this.btnOnElement!.button.address = button.address
        this.btnOnElement!.button.on = true
        this.btnOnElement!.draw()
        this.btnOnElement!.onclick = (e) => {
            this.btnOnElement!.button.outputMode = this.button!.outputMode
            this.btnOnElement!.button.address = this.button!.address
            this.btnOnElement!.button.address = this.button!.address
            this.btnOnElement!.button.send()
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


        this.shadowRoot!.getElementById("modeGroup")!.style.display = Globals.CommandCenterSetting.type == CommandCenterTypes.Z21 ? "none" : "block"

        this.accessoryModeElement.checked = this.button.outputMode == OutputModes.accessory
        this.accessoryModeElement.onchange = (e) => {
            this.button!.outputMode = OutputModes.accessory
        }
        this.outputModeElement.checked = button.outputMode == OutputModes.output
        this.outputModeElement.onchange = (e) => {
            this.button!.outputMode = OutputModes.output
        }
    }
}
customElements.define("button-properties-element", ButtonPropertiesElement)