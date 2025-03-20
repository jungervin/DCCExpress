import { propertiesChangedEvent } from "../editor/view";
import { TurnoutDoubleElement, TurnoutElement, TurnoutLeftElement, TurnoutRightElement, TurnoutYShapeElement } from "../editor/turnout";
import { BitElement } from "./bitElement";
import { drawRectangle } from "../helpers/graphics";
import { ApiCommands, CommandCenterTypes, iSetTurnout, OutputModes } from "../../../common/src/dcc";
// import { IOConn } from "../helpers/iocon";
//import { CommandCenterHTMLSelectElement } from "./CommandCenterHTMLSelectElement";
import { TurnoutDoubleCanvasElement, TurnoutLeftCanvasElement, TurnoutRightCanvasElement, TurnoutYCanvasElement } from "./canvasElement";
import { Globals } from "../helpers/globals";
// import { DCCProtocols } from "../helpers/decoder";
console.log(BitElement)
//console.log(CommandCenterHTMLSelectElement)

export class TurnoutLeftPropertiesElement extends HTMLElement {
    turnout?: TurnoutLeftElement;
    //deviceElement: CommandCenterHTMLSelectElement;
    addressElement: HTMLInputElement;
    rbusAddressElement: HTMLInputElement;
    canvas1Element: TurnoutLeftCanvasElement;
    bit1Element: BitElement;
    canvas2Element: TurnoutLeftCanvasElement;
    bit2Element: BitElement;
    nameElement: HTMLInputElement;
    accessoryModeElement: HTMLInputElement;
    outputModeElement: HTMLInputElement;
    shadow: ShadowRoot;

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadow.innerHTML = `
        <style>
                @import url("css/bootstrap.min.css");
                @import url("css/properties.css");
            #canvas1, #canvas2 {
                cursor: pointer;
            }
        </style>

        <div class="container">

                <div class="igroup">
                    <div>Name</div>
                    <div>
                        <input id="name" type="text" value="">
                    </div>
                </div>

            <div class="igroup">
                <div class="row">
                    <div>Address</div>
                    <div>
                        <input id="address" type="number" value="0">
                    </div>
                </div>

                <div class="row">
                    <div class="col-2">
                        <turnout-left-canvas-element id="turnout1"></turnout-left-canvas-element>
                    </div>
                    <div class="col-2">
                        <bit-element id="bit1"></bit-element>
                    </div>
                </div>
                <div class="row">
                    <div class="col-2">
                        <turnout-left-canvas-element id="turnout2"></turnout-left-canvas-element>
                    </div>
                    <div class="col-2">
                        <bit-element id="bit2"></bit-element>
                    </div>
                </div>
            </div>

            <div class="igroup" id="modeGroup">
                    <div>Mode</div>
                    <div>
                        <input type="radio" id="accessory" name="mode" value="accessory" checked />
                        <label for="accessory">Accessory (&lt;a addr activate&gt;)</label>
                    </div>

                    <div>
                        <input type="radio" id="output" name="mode" value="output" />
                        <label for="output">DccEx Accessory (&lt;T id state&gt;)</label>
                    </div>
                </div>

            <div class="igroup">                
                <div class="row">
                    <div>RBus or Sensor address</div>
                    <div>
                        <input id="rbusAddress" type="number" value="0">
                    </div>
                </div>
            </div>

        </div>
    `;

        this.nameElement = this.shadow.getElementById("name") as HTMLInputElement

       // this.deviceElement = shadow.getElementById("device") as CommandCenterHTMLSelectElement
        this.addressElement = this.shadow.getElementById("address") as HTMLInputElement

        this.canvas1Element = this.shadow.getElementById("turnout1") as TurnoutLeftCanvasElement
        this.bit1Element = this.shadow.getElementById("bit1") as BitElement

        this.canvas2Element = this.shadow.getElementById("turnout2") as TurnoutLeftCanvasElement
        this.bit2Element = this.shadow.getElementById("bit2") as BitElement

        this.accessoryModeElement = this.shadow.getElementById("accessory") as HTMLInputElement
        this.outputModeElement = this.shadow.getElementById("output") as HTMLInputElement


        this.rbusAddressElement = this.shadow.getElementById("rbusAddress") as HTMLInputElement

    }

    setTurnout(turnout: TurnoutLeftElement) {
        this.turnout = turnout
       
        this.nameElement.value = this.turnout.name
        this.nameElement.onchange = (e: Event) => {
            this.turnout!.name = this.nameElement.value
        }        

        this.addressElement!.value = this.turnout.address.toString()
        this.addressElement.onchange = (e: Event) => {
            this.turnout!.address = parseInt(this.addressElement!.value)
            //window.dispatchEvent(propertiesChangedEvent)
            window.invalidate()
        }

        this.rbusAddressElement!.value = this.turnout.rbusAddress.toString()
        this.rbusAddressElement.onchange = (e: Event) => {
            this.turnout!.rbusAddress = parseInt(this.rbusAddressElement!.value)
            // window.dispatchEvent(propertiesChangedEvent)
            window.invalidate()
        }

        this.canvas1Element.turnout!.t1Closed = true
        this.canvas1Element.turnout!.angle = turnout.angle
        this.canvas1Element.turnout!.address = turnout.address
        this.canvas1Element.turnout!.outputMode = this.turnout!.outputMode
        // this.canvas1Element.turnout!.cc = turnout.cc
        this.canvas1Element.draw()
        this.canvas1Element.onclick = (e: MouseEvent) => {
            this.canvas1Element.turnout!.address = turnout.address
            this.canvas1Element.turnout!.t1ClosedValue = this.turnout!.t1ClosedValue
            this.canvas1Element.turnout!.outputMode = this.turnout!.outputMode
            this.canvas1Element.turnout!.send()
        }

        this.bit1Element!.value = this.turnout.t1ClosedValue
        this.bit1Element.onchanged = (sender: BitElement) => {
            this.turnout!.t1ClosedValue = this.bit1Element.value
        }

        this.canvas2Element.turnout!.t1Closed = false
        this.canvas2Element.turnout!.angle = turnout.angle
        this.canvas2Element.turnout!.address = turnout.address
        this.canvas2Element.turnout!.outputMode = this.turnout!.outputMode
        this.canvas2Element.draw()
        this.canvas2Element.onclick = (e: MouseEvent) => {
            this.canvas2Element.turnout!.address = turnout.address
            this.canvas2Element.turnout!.t1OpenValue = this.turnout!.t1OpenValue
            this.canvas2Element.turnout!.outputMode = this.turnout!.outputMode
            this.canvas2Element.turnout!.send()
        }

        this.bit2Element!.value = this.turnout.t1OpenValue
        this.bit2Element.onchanged = (sender: BitElement) => {
            this.turnout!.t1OpenValue = this.bit2Element.value
        }

        this.shadow!.getElementById("modeGroup")!.style.display = Globals.CommandCenterSetting.type == CommandCenterTypes.Z21 ? "none" : "block"
        
        this.accessoryModeElement.checked = this.turnout!.outputMode == OutputModes.accessory
        this.accessoryModeElement.onchange = (e) => {
            this.turnout!.outputMode = OutputModes.accessory
        }
        
        this.outputModeElement.checked = this.turnout!.outputMode == OutputModes.dccExAccessory
        this.outputModeElement.onchange = (e) => {
            this.turnout!.outputMode = OutputModes.dccExAccessory
        }
    }
}
customElements.define("turnout-left-properties-element", TurnoutLeftPropertiesElement)

export class TurnoutRightPropertiesElement extends HTMLElement {
    turnout?: TurnoutRightElement;
    // deviceElement: CommandCenterHTMLSelectElement;
    addressElement: HTMLInputElement;
    rbusAddressElement: HTMLInputElement;
    canvas1Element: TurnoutRightCanvasElement;
    bit1Element: BitElement;
    canvas2Element: TurnoutRightCanvasElement;
    bit2Element: BitElement;
    nameElement: HTMLInputElement;
    accessoryModeElement: HTMLInputElement;
    outputModeElement: HTMLInputElement;
    shadow: ShadowRoot;

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadow.innerHTML = `
        <style>
                @import url("css/bootstrap.min.css");
                @import url("css/properties.css");
            #canvas1, #canvas2 {
                cursor: pointer;
            }
        </style>

        <div class="container">
        
            <div class="igroup">
                <div>Name</div>
                <div>
                    <input id="name" type="text" value="">
                </div>
            </div>

            <div class="igroup">
                <div class="row">
                    <div>Address</div>
                    <div>
                        <input id="address" type="number" value="0">
                    </div>
                </div>

                <div class="row">
                    <div class="col-2">
                        <turnout-right-canvas-element id="turnout1"></turnout-right-canvas-element>
                    </div>
                    <div class="col-2">
                        <bit-element id="bit1"></bit-element>
                    </div>
                </div>
                <div class="row">
                    <div class="col-2">
                        <turnout-right-canvas-element id="turnout2"></turnout-right-canvas-element>
                    </div>
                    <div class="col-2">
                        <bit-element id="bit2"></bit-element>
                    </div>
                </div>
            </div>


            <div class="igroup" id="modeGroup">
                <div>Mode</div>
                <div>
                    <input type="radio" id="accessory" name="mode" value="accessory" checked />
                    <label for="accessory">Accessory (&lt;a addr activate&gt;)</label>
                </div>

                <div>
                    <input type="radio" id="output" name="mode" value="output" />
                    <label for="output">DccEx Accessory (&lt;T id state&gt;)</label>
                </div>
            </div>      

            <div class="igroup">                
                <div class="row">
                    <div>RBus or Sensor address</div>
                    <div>
                        <input id="rbusAddress" type="number" value="0">
                    </div>
                </div>
            </div>

        </div>
    `;

        this.nameElement = this.shadow.getElementById("name") as HTMLInputElement
        // this.deviceElement = shadow.getElementById("device") as CommandCenterHTMLSelectElement
        this.addressElement = this.shadow.getElementById("address") as HTMLInputElement

        this.canvas1Element = this.shadow.getElementById("turnout1") as TurnoutRightCanvasElement
        this.bit1Element = this.shadow.getElementById("bit1") as BitElement

        this.canvas2Element = this.shadow.getElementById("turnout2") as TurnoutRightCanvasElement
        this.bit2Element = this.shadow.getElementById("bit2") as BitElement

        this.accessoryModeElement = this.shadow.getElementById("accessory") as HTMLInputElement
        this.outputModeElement = this.shadow.getElementById("output") as HTMLInputElement

        this.rbusAddressElement = this.shadow.getElementById("rbusAddress") as HTMLInputElement

    }

    setTurnout(turnout: TurnoutRightElement) {
        this.turnout = turnout

        this.nameElement.value = this.turnout.name
        this.nameElement.onchange = (e: Event) => {
            this.turnout!.name = this.nameElement.value
        }

        // this.deviceElement.setSelectedDevice(this.turnout!.cc)
        // this.deviceElement!.onchangeCallback = (value) => {
        //     this.turnout!.cc = value!
        // };

        this.addressElement!.value = this.turnout.address.toString()
        this.addressElement.onchange = (e: Event) => {
            this.turnout!.address = parseInt(this.addressElement!.value)
            // window.dispatchEvent(propertiesChangedEvent)
            window.invalidate()
        }

        this.rbusAddressElement!.value = this.turnout.rbusAddress.toString()
        this.rbusAddressElement.onchange = (e: Event) => {
            this.turnout!.rbusAddress = parseInt(this.rbusAddressElement!.value)
            // window.dispatchEvent(propertiesChangedEvent)
            window.invalidate()
        }

        this.canvas1Element.turnout!.t1Closed = true;
        this.canvas1Element.turnout!.angle = turnout.angle
        this.canvas1Element.turnout!.address = turnout.address
        this.canvas1Element.turnout!.outputMode = this.turnout!.outputMode
        // this.canvas1Element.turnout!.cc = turnout.cc
        this.canvas1Element.draw()
        this.canvas1Element.onclick = (e: MouseEvent) => {
            this.canvas1Element.turnout!.address = turnout.address
            this.canvas1Element.turnout!.t1ClosedValue = this.turnout!.t1ClosedValue
            this.canvas1Element.turnout!.outputMode = this.turnout!.outputMode
            this.canvas1Element.turnout!.send()
        }

        this.bit1Element!.value = this.turnout.t1ClosedValue
        this.bit1Element.onchanged = (sender: BitElement) => {
            this.turnout!.t1ClosedValue = this.bit1Element.value
        }

        this.canvas2Element.turnout!.t1Closed = false; 
        this.canvas2Element.turnout!.angle = turnout.angle
        this.canvas2Element.turnout!.address = turnout.address
        this.canvas2Element.turnout!.outputMode = this.turnout!.outputMode
        // this.canvas2Element.turnout!.cc = turnout.cc
        this.canvas2Element.draw()
        this.canvas2Element.onclick = (e: MouseEvent) => {
            this.canvas2Element.turnout!.address = turnout.address
            this.canvas2Element.turnout!.t1OpenValue = this.turnout!.t1OpenValue
            this.canvas2Element.turnout!.outputMode = this.turnout!.outputMode
            this.canvas2Element.turnout!.send()
        }

        this.bit2Element!.value = this.turnout.t1OpenValue
        this.bit2Element.onchanged = (sender: BitElement) => {
            this.turnout!.t1OpenValue = this.bit2Element.value
        }

        this.shadow!.getElementById("modeGroup")!.style.display = Globals.CommandCenterSetting.type == CommandCenterTypes.Z21 ? "none" : "block"
        
        this.accessoryModeElement.checked = this.turnout!.outputMode == OutputModes.accessory
        this.accessoryModeElement.onchange = (e) => {
            this.turnout!.outputMode = OutputModes.accessory
        }
        
        this.outputModeElement.checked = this.turnout!.outputMode == OutputModes.dccExAccessory
        this.outputModeElement.onchange = (e) => {
            this.turnout!.outputMode = OutputModes.dccExAccessory
        }
    }
}
customElements.define("turnout-right-properties-element", TurnoutRightPropertiesElement)

export class TurnoutDoublePropertiesElement extends HTMLElement {
    turnout?: TurnoutDoubleElement;
    // deviceElement: CommandCenterHTMLSelectElement;
    address1Element: HTMLInputElement;
    address2Element: HTMLInputElement;
    rbusAddressElement: HTMLInputElement;
    canvas1Element: TurnoutDoubleCanvasElement;
    bit11Element: BitElement;
    bit12Element: BitElement;
    canvas2Element: TurnoutDoubleCanvasElement;
    bit21Element: BitElement;
    bit22Element: BitElement;
    canvas3Element: TurnoutDoubleCanvasElement;
    bit31Element: BitElement;
    bit32Element: BitElement;
    canvas4Element: TurnoutDoubleCanvasElement;
    bit41Element: BitElement;
    bit42Element: BitElement;
    nameElement: HTMLInputElement;
    accessoryModeElement: HTMLInputElement;
    outputModeElement: HTMLInputElement;
    shadow: ShadowRoot;

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadow.innerHTML = `
        <style>
                @import url("css/bootstrap.min.css");
                @import url("css/properties.css");
            #canvas1, #canvas2 {
                cursor: pointer;
            }
        </style>

        <div class="container">

                <div class="igroup">
                    <div>Name</div>
                    <div>
                        <input id="name" type="text" value="">
                    </div>
                </div>
        
            <div class="igroup">
                <div class="row">
                    <div>Address</div>
                    <div>
                        <input id="address1" type="number" value="0">
                    </div>
                    <div>
                        <input id="address2" type="number" value="0">
                    </div>
                </div>

                <div class="row">
                    <div class="col-2">
                        <turnout-double-canvas-element id="turnout1"></turnout-double-canvas-element>
                    </div>
                    <div class="col-1">
                        <bit-element id="bit11"></bit-element>
                    </div>
                    <div class="col-1">
                        <bit-element id="bit12"></bit-element>
                    </div>
                </div>
                <div class="row">
                    <div class="col-2">
                        <turnout-double-canvas-element id="turnout2"></turnout-double-canvas-element>
                    </div>
                    <div class="col-1">
                        <bit-element id="bit21"></bit-element>
                    </div>
                    <div class="col-1">
                        <bit-element id="bit22"></bit-element>
                    </div>
                </div>

                <div class="row">
                    <div class="col-2">
                        <turnout-double-canvas-element id="turnout3"></turnout-double-canvas-element>
                    </div>
                    <div class="col-1">
                        <bit-element id="bit31"></bit-element>
                    </div>
                    <div class="col-1">
                        <bit-element id="bit32"></bit-element>
                    </div>
                </div>

                <div class="row">
                    <div class="col-2">
                        <turnout-double-canvas-element id="turnout4"></turnout-double-canvas-element>
                    </div>
                    <div class="col-1">
                        <bit-element id="bit41"></bit-element>
                    </div>
                    <div class="col-1">
                        <bit-element id="bit42"></bit-element>
                    </div>
                </div>


            </div>

                <div class="igroup" id="modeGroup">
                    <div>Mode</div>
                    <div>
                        <input type="radio" id="accessory" name="mode" value="accessory" checked />
                        <label for="accessory">Accessory (&lt;a addr activate&gt;)</label>
                    </div>

                    <div>
                        <input type="radio" id="output" name="mode" value="output" />
                        <label for="output">DccEx Accessory (&lt;T id state&gt;)</label>
                    </div>
                </div>

            <div class="igroup">                
                <div class="row">
                    <div>RBus or Sensor address</div>
                    <div>
                        <input id="rbusAddress" type="number" value="0">
                    </div>
                </div>
            </div>

        </div>
    `;

        this.nameElement = this.shadow.getElementById("name") as HTMLInputElement
        // this.deviceElement = shadow.getElementById("device") as CommandCenterHTMLSelectElement
        this.address1Element = this.shadow.getElementById("address1") as HTMLInputElement
        this.address2Element = this.shadow.getElementById("address2") as HTMLInputElement

        this.canvas1Element = this.shadow.getElementById("turnout1") as TurnoutDoubleCanvasElement
        this.bit11Element = this.shadow.getElementById("bit11") as BitElement
        this.bit12Element = this.shadow.getElementById("bit12") as BitElement

        this.canvas2Element = this.shadow.getElementById("turnout2") as TurnoutDoubleCanvasElement
        this.bit21Element = this.shadow.getElementById("bit21") as BitElement
        this.bit22Element = this.shadow.getElementById("bit22") as BitElement

        this.canvas3Element = this.shadow.getElementById("turnout3") as TurnoutDoubleCanvasElement
        this.bit31Element = this.shadow.getElementById("bit31") as BitElement
        this.bit32Element = this.shadow.getElementById("bit32") as BitElement

        this.canvas4Element = this.shadow.getElementById("turnout4") as TurnoutDoubleCanvasElement
        this.bit41Element = this.shadow.getElementById("bit41") as BitElement
        this.bit42Element = this.shadow.getElementById("bit42") as BitElement

        this.accessoryModeElement = this.shadow.getElementById("accessory") as HTMLInputElement
        this.outputModeElement = this.shadow.getElementById("output") as HTMLInputElement


        this.rbusAddressElement = this.shadow.getElementById("rbusAddress") as HTMLInputElement

    }

    setTurnout(turnout: TurnoutDoubleElement) {
        this.turnout = turnout

        this.nameElement.value = this.turnout.name
        this.nameElement.onchange = (e: Event) => {
            this.turnout!.name = this.nameElement.value
        }
        // this.deviceElement.setSelectedDevice(this.turnout!.cc)
        // this.deviceElement!.onchangeCallback = (value) => {
        //     this.turnout!.cc = value!
        // };

        this.address1Element!.value = this.turnout.address.toString()
        this.address1Element.onchange = (e: Event) => {
            this.turnout!.address = parseInt(this.address1Element!.value)
            // window.dispatchEvent(propertiesChangedEvent)
            window.invalidate()
        }

        this.address2Element!.value = this.turnout.address2.toString()
        this.address2Element.onchange = (e: Event) => {
            this.turnout!.address2 = parseInt(this.address2Element!.value)
            // window.dispatchEvent(propertiesChangedEvent)
            window.invalidate()
        }

        this.rbusAddressElement!.value = this.turnout.rbusAddress.toString()
        this.rbusAddressElement.onchange = (e: Event) => {
            this.turnout!.rbusAddress = parseInt(this.rbusAddressElement!.value)
            // window.dispatchEvent(propertiesChangedEvent)
            window.invalidate()
        }

        //==================
        // T1 
        //==================
        {
            this.canvas1Element.turnout!.t1Closed = true
            this.canvas1Element.turnout!.t2Closed = false
            this.canvas1Element.turnout!.angle = this.turnout.angle
            this.canvas1Element.turnout!.address = this.turnout.address
            this.canvas1Element.turnout!.address2 = this.turnout.address2
            this.canvas1Element.turnout!.outputMode = this.turnout!.outputMode
            // this.canvas1Element.turnout!.cc = this.turnout.cc
            this.canvas1Element.draw()
            this.canvas1Element.onclick = (e: MouseEvent) => {
                this.canvas1Element.turnout!.address = this.turnout!.address
                this.canvas1Element.turnout!.address2 = this.turnout!.address2
  
                this.canvas1Element.turnout!.t1ClosedValue = this.turnout!.t1ClosedValue
                this.canvas1Element.turnout!.t2OpenValue = this.turnout!.t2OpenValue
                this.canvas1Element.turnout!.outputMode = this.turnout!.outputMode
                this.canvas1Element.turnout!.send()
            }
        
            this.bit11Element!.value = this.turnout.t1ClosedValue
            this.bit11Element.onchanged = (sender: BitElement) => {
                this.turnout!.t1ClosedValue = this.bit11Element.value
            }
            this.bit12Element!.value = this.turnout.t2OpenValue
            this.bit12Element.onchanged = (sender: BitElement) => {
                this.turnout!.t2OpenValue = this.bit12Element.value
                //this.canvas2Element.turnout!.sendTurnoutCmd()
            }
        }

        //==================
        // T2 
        //==================
        {
            this.canvas2Element.turnout!.t1Closed = true
            this.canvas2Element.turnout!.t2Closed = true
            this.canvas2Element.turnout!.angle = this.turnout.angle
            this.canvas2Element.turnout!.address = this.turnout.address
            this.canvas2Element.turnout!.address2 = this.turnout.address2
            this.canvas2Element.turnout!.outputMode = this.turnout!.outputMode
            // this.canvas2Element.turnout!.cc = this.turnout.cc
            this.canvas2Element.draw()
            this.canvas2Element.onclick = (e: MouseEvent) => {
                this.canvas2Element.turnout!.address = this.turnout!.address
                this.canvas2Element.turnout!.address2 = this.turnout!.address2
                this.canvas2Element.turnout!.t1ClosedValue = this.turnout!.t1ClosedValue
                this.canvas2Element.turnout!.t2ClosedValue = this.turnout!.t2ClosedValue
                this.canvas2Element.turnout!.outputMode = this.turnout!.outputMode
                this.canvas2Element.turnout!.send()
            }
        
            this.bit21Element!.value = this.turnout.t1ClosedValue
            this.bit21Element.onchanged = (sender: BitElement) => {
                this.turnout!.t1ClosedValue = this.bit21Element.value
            }
            this.bit22Element!.value = this.turnout.t2ClosedValue
            this.bit22Element.onchanged = (sender: BitElement) => {
                this.turnout!.t2ClosedValue = this.bit22Element.value
            }
        }

        //==================
        // T3 
        //==================
        {
            this.canvas3Element.turnout!.t1Closed = false
            this.canvas3Element.turnout!.t2Closed = true
            this.canvas3Element.turnout!.angle = this.turnout.angle
            this.canvas3Element.turnout!.address = this.turnout.address
            this.canvas3Element.turnout!.address2 = this.turnout.address2
            this.canvas3Element.turnout!.outputMode = this.turnout!.outputMode
            // this.canvas3Element.turnout!.cc = this.turnout.cc
            this.canvas3Element.draw()
            this.canvas3Element.onclick = (e: MouseEvent) => {
                this.canvas3Element.turnout!.address = this.turnout!.address
                this.canvas3Element.turnout!.address2 = this.turnout!.address2   
                this.canvas3Element.turnout!.t1OpenValue = this.turnout!.t1OpenValue
                this.canvas3Element.turnout!.t2ClosedValue = this.turnout!.t2ClosedValue
                this.canvas3Element.turnout!.outputMode = this.turnout!.outputMode
                this.canvas3Element.turnout!.send()
            }
        
            this.bit31Element!.value = this.turnout.t1OpenValue
            this.bit31Element.onchanged = (sender: BitElement) => {
                this.turnout!.t1OpenValue = this.bit31Element.value
            }
            this.bit32Element!.value = this.turnout.t2ClosedValue
            this.bit32Element.onchanged = (sender: BitElement) => {
                this.turnout!.t2ClosedValue = this.bit32Element.value
            }
        }

        //==================
        // T4
        //==================
        {
            this.canvas4Element.turnout!.t1Closed = false
            this.canvas4Element.turnout!.t2Closed = false
            this.canvas4Element.turnout!.angle = this.turnout.angle
            this.canvas4Element.turnout!.address = this.turnout.address
            this.canvas4Element.turnout!.address2 = this.turnout.address2
            this.canvas4Element.turnout!.outputMode = this.turnout!.outputMode
            // this.canvas4Element.turnout!.cc = this.turnout.cc
            this.canvas4Element.draw()
            this.canvas4Element.onclick = (e: MouseEvent) => {
                this.canvas4Element.turnout!.address = this.turnout!.address
                this.canvas4Element.turnout!.address2 = this.turnout!.address2
                this.canvas4Element.turnout!.t1OpenValue = this.turnout!.t1OpenValue
                this.canvas4Element.turnout!.t2OpenValue = this.turnout!.t2OpenValue
                this.canvas4Element.turnout!.outputMode = this.turnout!.outputMode
                this.canvas4Element.turnout!.send()
            }
        
            this.bit41Element!.value = this.turnout.t1OpenValue
            this.bit41Element.onchanged = (sender: BitElement) => {
                this.turnout!.t1OpenValue = this.bit41Element.value
            }
            this.bit42Element!.value = this.turnout.t2OpenValue
            this.bit42Element.onchanged = (sender: BitElement) => {
                this.turnout!.t2OpenValue = this.bit42Element.value
            }
        }

        this.shadow!.getElementById("modeGroup")!.style.display = Globals.CommandCenterSetting.type == CommandCenterTypes.Z21 ? "none" : "block"
        
        this.accessoryModeElement.checked = this.turnout!.outputMode == OutputModes.accessory
        this.accessoryModeElement.onchange = (e) => {
            this.turnout!.outputMode = OutputModes.accessory
        }
        
        this.outputModeElement.checked = this.turnout!.outputMode == OutputModes.dccExAccessory
        this.outputModeElement.onchange = (e) => {
            this.turnout!.outputMode = OutputModes.dccExAccessory
        }
    }
}
customElements.define("turnout-double-properties-element", TurnoutDoublePropertiesElement)

export class TurnoutYPropertiesElement extends HTMLElement {
    turnout?: TurnoutYShapeElement | undefined;
    //deviceElement: CommandCenterHTMLSelectElement;
    addressElement: HTMLInputElement;
    rbusAddressElement: HTMLInputElement;
    canvas1Element: TurnoutYCanvasElement;
    bit1Element: BitElement;
    canvas2Element: TurnoutYCanvasElement;
    bit2Element: BitElement;
    nameElement: HTMLInputElement;
    accessoryModeElement: any;
    outputModeElement: any;
    shadow: ShadowRoot;
    

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadow.innerHTML = `
        <style>
                @import url("css/bootstrap.min.css");
                @import url("css/properties.css");
            #canvas1, #canvas2 {
                cursor: pointer;
            }
        </style>

        <div class="container">

                <div class="igroup">
                    <div>Name</div>
                    <div>
                        <input id="name" type="text" value="">
                    </div>
                </div>

            <div class="igroup">
                <div class="row">
                    <div>Address</div>
                    <div>
                        <input id="address" type="number" value="0">
                    </div>
                </div>

                <div class="row">
                    <div class="col-2">
                        <turnout-y-canvas-element id="turnout1"></turnout-y-canvas-element>
                    </div>
                    <div class="col-2">
                        <bit-element id="bit1"></bit-element>
                    </div>
                </div>
                <div class="row">
                    <div class="col-2">
                        <turnout-y-canvas-element id="turnout2"></turnout-y-canvas-element>
                    </div>
                    <div class="col-2">
                        <bit-element id="bit2"></bit-element>
                    </div>
                </div>
            </div>

               <div class="igroup" id="modeGroup">
                    <div>Mode</div>
                    <div>
                        <input type="radio" id="accessory" name="mode" value="accessory" checked />
                        <label for="accessory">Accessory (&lt;a addr activate&gt;)</label>
                    </div>

                    <div>
                        <input type="radio" id="output" name="mode" value="output" />
                        <label for="output">DccEx Accessory (&lt;T id state&gt;)</label>
                    </div>
                </div>            

            <div class="igroup">                
                <div class="row">
                    <div>RBus or Sensor address</div>
                    <div>
                        <input id="rbusAddress" type="number" value="0">
                    </div>
                </div>
            </div>

        </div>
    `;

        this.nameElement = this.shadow.getElementById("name") as HTMLInputElement

       // this.deviceElement = shadow.getElementById("device") as CommandCenterHTMLSelectElement
        this.addressElement = this.shadow.getElementById("address") as HTMLInputElement

        this.canvas1Element = this.shadow.getElementById("turnout1") as TurnoutYCanvasElement
        this.bit1Element = this.shadow.getElementById("bit1") as BitElement

        this.canvas2Element = this.shadow.getElementById("turnout2") as TurnoutYCanvasElement
        this.bit2Element = this.shadow.getElementById("bit2") as BitElement

        this.accessoryModeElement = this.shadow.getElementById("accessory") as HTMLInputElement
        this.outputModeElement = this.shadow.getElementById("output") as HTMLInputElement

        this.rbusAddressElement = this.shadow.getElementById("rbusAddress") as HTMLInputElement

    }

    setTurnout(turnout: TurnoutYShapeElement) {
        this.turnout = turnout
       
        this.nameElement.value = this.turnout!.name
        this.nameElement.onchange = (e: Event) => {
            this.turnout!.name = this.nameElement.value
        }        

        this.addressElement!.value = this.turnout!.address.toString()
        this.addressElement.onchange = (e: Event) => {
            this.turnout!.address = parseInt(this.addressElement!.value)
            //window.dispatchEvent(propertiesChangedEvent)
            window.invalidate()
        }

        this.rbusAddressElement!.value = this.turnout!.rbusAddress.toString()
        this.rbusAddressElement.onchange = (e: Event) => {
            this.turnout!.rbusAddress = parseInt(this.rbusAddressElement!.value)
            // window.dispatchEvent(propertiesChangedEvent)
            window.invalidate()
        }

        this.canvas1Element.turnout!.t1Closed = true
        this.canvas1Element.turnout!.angle = turnout.angle
        this.canvas1Element.turnout!.address = turnout.address
        this.canvas1Element.turnout!.outputMode = this.turnout!.outputMode
        // this.canvas1Element.turnout!.cc = turnout.cc
        this.canvas1Element.draw()
        this.canvas1Element.onclick = (e: MouseEvent) => {
            this.canvas1Element.turnout!.address = turnout.address
            this.canvas1Element.turnout!.t1ClosedValue = this.turnout!.t1ClosedValue
            this.canvas1Element.turnout!.outputMode = this.turnout!.outputMode
            this.canvas1Element.turnout!.send()
        }

        this.bit1Element!.value = this.turnout!.t1ClosedValue
        this.bit1Element.onchanged = (sender: BitElement) => {
            this.turnout!.t1ClosedValue = this.bit1Element.value
        }

        this.canvas2Element.turnout!.t1Closed = false
        this.canvas2Element.turnout!.angle = turnout.angle
        this.canvas2Element.turnout!.address = turnout.address
        this.canvas2Element.turnout!.outputMode = this.turnout!.outputMode
        // this.canvas2Element.turnout!.cc = turnout.cc
        this.canvas2Element.draw()
        this.canvas2Element.onclick = (e: MouseEvent) => {
            this.canvas2Element.turnout!.address = turnout.address
            this.canvas2Element.turnout!.t1OpenValue = this.turnout!.t1OpenValue
            this.canvas2Element.turnout!.outputMode = this.turnout!.outputMode
            this.canvas2Element.turnout!.send()
        }

        this.bit2Element!.value = this.turnout!.t1OpenValue
        this.bit2Element.onchanged = (sender: BitElement) => {
            this.turnout!.t1OpenValue = this.bit2Element.value
        }

        this.shadow!.getElementById("modeGroup")!.style.display = Globals.CommandCenterSetting.type == CommandCenterTypes.Z21 ? "none" : "block"
        
        this.accessoryModeElement.checked = this.turnout!.outputMode == OutputModes.accessory
        this.accessoryModeElement.onchange = (e: MouseEvent) => {
            this.turnout!.outputMode = OutputModes.accessory
        }
        
        this.outputModeElement.checked = this.turnout!.outputMode == OutputModes.dccExAccessory
        this.outputModeElement.onchange = (e: MouseEvent) => {
            this.turnout!.outputMode = OutputModes.dccExAccessory
        }
    }
}
customElements.define("turnout-y-properties-element", TurnoutYPropertiesElement)
