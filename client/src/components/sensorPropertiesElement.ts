import { SensorShapeElement, SensorSources } from "../editor/sensor";
import { BitElement } from "./bitElement";
import { SensorCanvasElement } from "./canvasElement";

export class SensorPropertiesElement extends HTMLElement {
    shadow: ShadowRoot;
    addressInputElement: HTMLInputElement | null;
    sensorOffElement: SensorCanvasElement | null;
    sensorOnElement: SensorCanvasElement | null;
    valueOnElement: BitElement;
    valueOffElement: BitElement;
    sensor?: SensorShapeElement;
    nameElement: HTMLInputElement;
    colorSelectElement: HTMLSelectElement;
    // dccSensorInputElement: HTMLInputElement;
    // wsSensorInputElement: HTMLInputElement;
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
                    <div>Name</div>
                    <div>
                        <input id="name" type="text" value="">
                    </div>
                </div>

                <div class="igroup">
                    <div>Address</div>
                    <div>
                        <input id="address" type="number" style="width:100%" value="">
                    </div>
                    <div style="display: flex; gap:8px; text-align: left">
                        <sensor-canvas-element id="btnOff"></sensor-canvas-element>
                        <bit-element id="valueOff"></bit-element>
                    </div>
                    <div style="display: flex; gap:8px; text-align: left">
                        <sensor-canvas-element id="btnOn"></sensor-canvas-element>
                        <bit-element id="valueOn"></bit-element>
                    </div>
                </div>

            
               <div class="igroup">
                    <div>Other Settings</div>
                        <div style="padding: 8px 0">
                            <select id="colorSelect">
                                <option value="lime">Green</option>
                                <option value="red">Red</option>
                                <option value="yellow">Yellow</option>
                                <option value="cornflowerblue">Blue</option>
                                <option value="white">White</option>
                            </select>
                            <label for="colorSelect"> Color</label>                        
                        </div>
                    </div>
                </div>
            </div>
        `

        this.nameElement = this.shadow.getElementById("name") as HTMLInputElement

        this.addressInputElement = this.shadow.getElementById('address') as HTMLInputElement
        this.sensorOffElement = this.shadow.getElementById("btnOff") as SensorCanvasElement
        this.sensorOnElement = this.shadow.getElementById("btnOn") as SensorCanvasElement
        this.valueOffElement = this.shadow.getElementById("valueOff") as BitElement
        this.valueOnElement = this.shadow.getElementById("valueOn") as BitElement

        this.colorSelectElement = this.shadow.getElementById("colorSelect") as HTMLSelectElement;
        this.colorSelectElement.addEventListener("change", () => {
            this.sensor!.colorOn = this.colorSelectElement.value
            this.sensorOnElement!.sensor.colorOn = this.colorSelectElement.value
            this.sensorOnElement!.draw()
        });
    }

    setSensor(sensor: SensorShapeElement) {
        this.sensor = sensor

        this.nameElement.value = this.sensor.name
        this.nameElement.onchange = (e: Event) => {
            this.sensor!.name = this.nameElement.value
        }

        this.sensorOffElement!.sensor.address = sensor.address
        this.sensorOffElement!.sensor.on = false
        this.sensorOffElement!.onclick = (e) => {
            // const data: iSetBasicAccessory = { address: sensor.address, value: this.valueOffElement.value } as iSetBasicAccessory
            // wsClient.send({ type: ApiCommands.setBasicAccessory, data: data } as iData)
        }

        this.sensorOnElement!.sensor.address = sensor.address
        this.sensorOnElement!.sensor.address = sensor.address
        this.sensorOnElement!.sensor.on = true
        this.sensorOnElement!.sensor.colorOn = sensor.colorOn
        this.sensorOnElement!.draw()
        this.sensorOnElement!.onclick = (e) => {
            // const data: iSetBasicAccessory = { address: sensor.address, value: this.valueOnElement.value } as iSetBasicAccessory
            // wsClient.send({ type: ApiCommands.setBasicAccessory, data: data } as iData)
        }

        this.addressInputElement!.value = sensor.address.toString()
        this.addressInputElement!.onchange = (e) => {
            this.sensor!.address = parseInt(this.addressInputElement!.value)
            window.invalidate()
        }

        this.valueOffElement.value = sensor.valueOff
        this.valueOffElement.onchanged = (e) => {
            this.sensor!.valueOff = this.valueOffElement.value
        }
        this.valueOnElement.value = sensor.valueOn
        this.valueOnElement.onchanged = (e) => {
            this.sensor!.valueOn = this.valueOnElement.value
        }

        // this.dccSensorInputElement.checked = this.sensor!.source == SensorSources.dcc
        // this.dccSensorInputElement.onchange = (e: Event) => {
        //     this.sensor!.source = SensorSources.dcc
        // }

        // this.wsSensorInputElement.checked = this.sensor!.source == SensorSources.ws
        // this.wsSensorInputElement.onchange = (e: Event) => {
        //     this.sensor!.source = SensorSources.ws
        // }

        this.colorSelectElement.value = this.sensor!.colorOn
    }
}
customElements.define("sensor-properties-element", SensorPropertiesElement)