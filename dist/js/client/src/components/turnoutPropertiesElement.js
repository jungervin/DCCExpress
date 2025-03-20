define(["require", "exports", "./bitElement", "../../../common/src/dcc", "../helpers/globals"], function (require, exports, bitElement_1, dcc_1, globals_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TurnoutYPropertiesElement = exports.TurnoutDoublePropertiesElement = exports.TurnoutRightPropertiesElement = exports.TurnoutLeftPropertiesElement = void 0;
    // import { DCCProtocols } from "../helpers/decoder";
    console.log(bitElement_1.BitElement);
    //console.log(CommandCenterHTMLSelectElement)
    class TurnoutLeftPropertiesElement extends HTMLElement {
        constructor() {
            super();
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
            this.nameElement = this.shadow.getElementById("name");
            // this.deviceElement = shadow.getElementById("device") as CommandCenterHTMLSelectElement
            this.addressElement = this.shadow.getElementById("address");
            this.canvas1Element = this.shadow.getElementById("turnout1");
            this.bit1Element = this.shadow.getElementById("bit1");
            this.canvas2Element = this.shadow.getElementById("turnout2");
            this.bit2Element = this.shadow.getElementById("bit2");
            this.accessoryModeElement = this.shadow.getElementById("accessory");
            this.outputModeElement = this.shadow.getElementById("output");
            this.rbusAddressElement = this.shadow.getElementById("rbusAddress");
        }
        setTurnout(turnout) {
            this.turnout = turnout;
            this.nameElement.value = this.turnout.name;
            this.nameElement.onchange = (e) => {
                this.turnout.name = this.nameElement.value;
            };
            this.addressElement.value = this.turnout.address.toString();
            this.addressElement.onchange = (e) => {
                this.turnout.address = parseInt(this.addressElement.value);
                //window.dispatchEvent(propertiesChangedEvent)
                window.invalidate();
            };
            this.rbusAddressElement.value = this.turnout.rbusAddress.toString();
            this.rbusAddressElement.onchange = (e) => {
                this.turnout.rbusAddress = parseInt(this.rbusAddressElement.value);
                // window.dispatchEvent(propertiesChangedEvent)
                window.invalidate();
            };
            this.canvas1Element.turnout.t1Closed = true;
            this.canvas1Element.turnout.angle = turnout.angle;
            this.canvas1Element.turnout.address = turnout.address;
            this.canvas1Element.turnout.outputMode = this.turnout.outputMode;
            // this.canvas1Element.turnout!.cc = turnout.cc
            this.canvas1Element.draw();
            this.canvas1Element.onclick = (e) => {
                this.canvas1Element.turnout.address = turnout.address;
                this.canvas1Element.turnout.t1ClosedValue = this.turnout.t1ClosedValue;
                this.canvas1Element.turnout.outputMode = this.turnout.outputMode;
                this.canvas1Element.turnout.send();
            };
            this.bit1Element.value = this.turnout.t1ClosedValue;
            this.bit1Element.onchanged = (sender) => {
                this.turnout.t1ClosedValue = this.bit1Element.value;
            };
            this.canvas2Element.turnout.t1Closed = false;
            this.canvas2Element.turnout.angle = turnout.angle;
            this.canvas2Element.turnout.address = turnout.address;
            this.canvas2Element.turnout.outputMode = this.turnout.outputMode;
            this.canvas2Element.draw();
            this.canvas2Element.onclick = (e) => {
                this.canvas2Element.turnout.address = turnout.address;
                this.canvas2Element.turnout.t1OpenValue = this.turnout.t1OpenValue;
                this.canvas2Element.turnout.outputMode = this.turnout.outputMode;
                this.canvas2Element.turnout.send();
            };
            this.bit2Element.value = this.turnout.t1OpenValue;
            this.bit2Element.onchanged = (sender) => {
                this.turnout.t1OpenValue = this.bit2Element.value;
            };
            this.shadow.getElementById("modeGroup").style.display = globals_1.Globals.CommandCenterSetting.type == dcc_1.CommandCenterTypes.Z21 ? "none" : "block";
            this.accessoryModeElement.checked = this.turnout.outputMode == dcc_1.OutputModes.accessory;
            this.accessoryModeElement.onchange = (e) => {
                this.turnout.outputMode = dcc_1.OutputModes.accessory;
            };
            this.outputModeElement.checked = this.turnout.outputMode == dcc_1.OutputModes.dccExAccessory;
            this.outputModeElement.onchange = (e) => {
                this.turnout.outputMode = dcc_1.OutputModes.dccExAccessory;
            };
        }
    }
    exports.TurnoutLeftPropertiesElement = TurnoutLeftPropertiesElement;
    customElements.define("turnout-left-properties-element", TurnoutLeftPropertiesElement);
    class TurnoutRightPropertiesElement extends HTMLElement {
        constructor() {
            super();
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
            this.nameElement = this.shadow.getElementById("name");
            // this.deviceElement = shadow.getElementById("device") as CommandCenterHTMLSelectElement
            this.addressElement = this.shadow.getElementById("address");
            this.canvas1Element = this.shadow.getElementById("turnout1");
            this.bit1Element = this.shadow.getElementById("bit1");
            this.canvas2Element = this.shadow.getElementById("turnout2");
            this.bit2Element = this.shadow.getElementById("bit2");
            this.accessoryModeElement = this.shadow.getElementById("accessory");
            this.outputModeElement = this.shadow.getElementById("output");
            this.rbusAddressElement = this.shadow.getElementById("rbusAddress");
        }
        setTurnout(turnout) {
            this.turnout = turnout;
            this.nameElement.value = this.turnout.name;
            this.nameElement.onchange = (e) => {
                this.turnout.name = this.nameElement.value;
            };
            // this.deviceElement.setSelectedDevice(this.turnout!.cc)
            // this.deviceElement!.onchangeCallback = (value) => {
            //     this.turnout!.cc = value!
            // };
            this.addressElement.value = this.turnout.address.toString();
            this.addressElement.onchange = (e) => {
                this.turnout.address = parseInt(this.addressElement.value);
                // window.dispatchEvent(propertiesChangedEvent)
                window.invalidate();
            };
            this.rbusAddressElement.value = this.turnout.rbusAddress.toString();
            this.rbusAddressElement.onchange = (e) => {
                this.turnout.rbusAddress = parseInt(this.rbusAddressElement.value);
                // window.dispatchEvent(propertiesChangedEvent)
                window.invalidate();
            };
            this.canvas1Element.turnout.t1Closed = true;
            this.canvas1Element.turnout.angle = turnout.angle;
            this.canvas1Element.turnout.address = turnout.address;
            this.canvas1Element.turnout.outputMode = this.turnout.outputMode;
            // this.canvas1Element.turnout!.cc = turnout.cc
            this.canvas1Element.draw();
            this.canvas1Element.onclick = (e) => {
                this.canvas1Element.turnout.address = turnout.address;
                this.canvas1Element.turnout.t1ClosedValue = this.turnout.t1ClosedValue;
                this.canvas1Element.turnout.outputMode = this.turnout.outputMode;
                this.canvas1Element.turnout.send();
            };
            this.bit1Element.value = this.turnout.t1ClosedValue;
            this.bit1Element.onchanged = (sender) => {
                this.turnout.t1ClosedValue = this.bit1Element.value;
            };
            this.canvas2Element.turnout.t1Closed = false;
            this.canvas2Element.turnout.angle = turnout.angle;
            this.canvas2Element.turnout.address = turnout.address;
            this.canvas2Element.turnout.outputMode = this.turnout.outputMode;
            // this.canvas2Element.turnout!.cc = turnout.cc
            this.canvas2Element.draw();
            this.canvas2Element.onclick = (e) => {
                this.canvas2Element.turnout.address = turnout.address;
                this.canvas2Element.turnout.t1OpenValue = this.turnout.t1OpenValue;
                this.canvas2Element.turnout.outputMode = this.turnout.outputMode;
                this.canvas2Element.turnout.send();
            };
            this.bit2Element.value = this.turnout.t1OpenValue;
            this.bit2Element.onchanged = (sender) => {
                this.turnout.t1OpenValue = this.bit2Element.value;
            };
            this.shadow.getElementById("modeGroup").style.display = globals_1.Globals.CommandCenterSetting.type == dcc_1.CommandCenterTypes.Z21 ? "none" : "block";
            this.accessoryModeElement.checked = this.turnout.outputMode == dcc_1.OutputModes.accessory;
            this.accessoryModeElement.onchange = (e) => {
                this.turnout.outputMode = dcc_1.OutputModes.accessory;
            };
            this.outputModeElement.checked = this.turnout.outputMode == dcc_1.OutputModes.dccExAccessory;
            this.outputModeElement.onchange = (e) => {
                this.turnout.outputMode = dcc_1.OutputModes.dccExAccessory;
            };
        }
    }
    exports.TurnoutRightPropertiesElement = TurnoutRightPropertiesElement;
    customElements.define("turnout-right-properties-element", TurnoutRightPropertiesElement);
    class TurnoutDoublePropertiesElement extends HTMLElement {
        constructor() {
            super();
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
            this.nameElement = this.shadow.getElementById("name");
            // this.deviceElement = shadow.getElementById("device") as CommandCenterHTMLSelectElement
            this.address1Element = this.shadow.getElementById("address1");
            this.address2Element = this.shadow.getElementById("address2");
            this.canvas1Element = this.shadow.getElementById("turnout1");
            this.bit11Element = this.shadow.getElementById("bit11");
            this.bit12Element = this.shadow.getElementById("bit12");
            this.canvas2Element = this.shadow.getElementById("turnout2");
            this.bit21Element = this.shadow.getElementById("bit21");
            this.bit22Element = this.shadow.getElementById("bit22");
            this.canvas3Element = this.shadow.getElementById("turnout3");
            this.bit31Element = this.shadow.getElementById("bit31");
            this.bit32Element = this.shadow.getElementById("bit32");
            this.canvas4Element = this.shadow.getElementById("turnout4");
            this.bit41Element = this.shadow.getElementById("bit41");
            this.bit42Element = this.shadow.getElementById("bit42");
            this.accessoryModeElement = this.shadow.getElementById("accessory");
            this.outputModeElement = this.shadow.getElementById("output");
            this.rbusAddressElement = this.shadow.getElementById("rbusAddress");
        }
        setTurnout(turnout) {
            this.turnout = turnout;
            this.nameElement.value = this.turnout.name;
            this.nameElement.onchange = (e) => {
                this.turnout.name = this.nameElement.value;
            };
            // this.deviceElement.setSelectedDevice(this.turnout!.cc)
            // this.deviceElement!.onchangeCallback = (value) => {
            //     this.turnout!.cc = value!
            // };
            this.address1Element.value = this.turnout.address.toString();
            this.address1Element.onchange = (e) => {
                this.turnout.address = parseInt(this.address1Element.value);
                // window.dispatchEvent(propertiesChangedEvent)
                window.invalidate();
            };
            this.address2Element.value = this.turnout.address2.toString();
            this.address2Element.onchange = (e) => {
                this.turnout.address2 = parseInt(this.address2Element.value);
                // window.dispatchEvent(propertiesChangedEvent)
                window.invalidate();
            };
            this.rbusAddressElement.value = this.turnout.rbusAddress.toString();
            this.rbusAddressElement.onchange = (e) => {
                this.turnout.rbusAddress = parseInt(this.rbusAddressElement.value);
                // window.dispatchEvent(propertiesChangedEvent)
                window.invalidate();
            };
            //==================
            // T1 
            //==================
            {
                this.canvas1Element.turnout.t1Closed = true;
                this.canvas1Element.turnout.t2Closed = false;
                this.canvas1Element.turnout.angle = this.turnout.angle;
                this.canvas1Element.turnout.address = this.turnout.address;
                this.canvas1Element.turnout.address2 = this.turnout.address2;
                this.canvas1Element.turnout.outputMode = this.turnout.outputMode;
                // this.canvas1Element.turnout!.cc = this.turnout.cc
                this.canvas1Element.draw();
                this.canvas1Element.onclick = (e) => {
                    this.canvas1Element.turnout.address = this.turnout.address;
                    this.canvas1Element.turnout.address2 = this.turnout.address2;
                    this.canvas1Element.turnout.t1ClosedValue = this.turnout.t1ClosedValue;
                    this.canvas1Element.turnout.t2OpenValue = this.turnout.t2OpenValue;
                    this.canvas1Element.turnout.outputMode = this.turnout.outputMode;
                    this.canvas1Element.turnout.send();
                };
                this.bit11Element.value = this.turnout.t1ClosedValue;
                this.bit11Element.onchanged = (sender) => {
                    this.turnout.t1ClosedValue = this.bit11Element.value;
                };
                this.bit12Element.value = this.turnout.t2OpenValue;
                this.bit12Element.onchanged = (sender) => {
                    this.turnout.t2OpenValue = this.bit12Element.value;
                    //this.canvas2Element.turnout!.sendTurnoutCmd()
                };
            }
            //==================
            // T2 
            //==================
            {
                this.canvas2Element.turnout.t1Closed = true;
                this.canvas2Element.turnout.t2Closed = true;
                this.canvas2Element.turnout.angle = this.turnout.angle;
                this.canvas2Element.turnout.address = this.turnout.address;
                this.canvas2Element.turnout.address2 = this.turnout.address2;
                this.canvas2Element.turnout.outputMode = this.turnout.outputMode;
                // this.canvas2Element.turnout!.cc = this.turnout.cc
                this.canvas2Element.draw();
                this.canvas2Element.onclick = (e) => {
                    this.canvas2Element.turnout.address = this.turnout.address;
                    this.canvas2Element.turnout.address2 = this.turnout.address2;
                    this.canvas2Element.turnout.t1ClosedValue = this.turnout.t1ClosedValue;
                    this.canvas2Element.turnout.t2ClosedValue = this.turnout.t2ClosedValue;
                    this.canvas2Element.turnout.outputMode = this.turnout.outputMode;
                    this.canvas2Element.turnout.send();
                };
                this.bit21Element.value = this.turnout.t1ClosedValue;
                this.bit21Element.onchanged = (sender) => {
                    this.turnout.t1ClosedValue = this.bit21Element.value;
                };
                this.bit22Element.value = this.turnout.t2ClosedValue;
                this.bit22Element.onchanged = (sender) => {
                    this.turnout.t2ClosedValue = this.bit22Element.value;
                };
            }
            //==================
            // T3 
            //==================
            {
                this.canvas3Element.turnout.t1Closed = false;
                this.canvas3Element.turnout.t2Closed = true;
                this.canvas3Element.turnout.angle = this.turnout.angle;
                this.canvas3Element.turnout.address = this.turnout.address;
                this.canvas3Element.turnout.address2 = this.turnout.address2;
                this.canvas3Element.turnout.outputMode = this.turnout.outputMode;
                // this.canvas3Element.turnout!.cc = this.turnout.cc
                this.canvas3Element.draw();
                this.canvas3Element.onclick = (e) => {
                    this.canvas3Element.turnout.address = this.turnout.address;
                    this.canvas3Element.turnout.address2 = this.turnout.address2;
                    this.canvas3Element.turnout.t1OpenValue = this.turnout.t1OpenValue;
                    this.canvas3Element.turnout.t2ClosedValue = this.turnout.t2ClosedValue;
                    this.canvas3Element.turnout.outputMode = this.turnout.outputMode;
                    this.canvas3Element.turnout.send();
                };
                this.bit31Element.value = this.turnout.t1OpenValue;
                this.bit31Element.onchanged = (sender) => {
                    this.turnout.t1OpenValue = this.bit31Element.value;
                };
                this.bit32Element.value = this.turnout.t2ClosedValue;
                this.bit32Element.onchanged = (sender) => {
                    this.turnout.t2ClosedValue = this.bit32Element.value;
                };
            }
            //==================
            // T4
            //==================
            {
                this.canvas4Element.turnout.t1Closed = false;
                this.canvas4Element.turnout.t2Closed = false;
                this.canvas4Element.turnout.angle = this.turnout.angle;
                this.canvas4Element.turnout.address = this.turnout.address;
                this.canvas4Element.turnout.address2 = this.turnout.address2;
                this.canvas4Element.turnout.outputMode = this.turnout.outputMode;
                // this.canvas4Element.turnout!.cc = this.turnout.cc
                this.canvas4Element.draw();
                this.canvas4Element.onclick = (e) => {
                    this.canvas4Element.turnout.address = this.turnout.address;
                    this.canvas4Element.turnout.address2 = this.turnout.address2;
                    this.canvas4Element.turnout.t1OpenValue = this.turnout.t1OpenValue;
                    this.canvas4Element.turnout.t2OpenValue = this.turnout.t2OpenValue;
                    this.canvas4Element.turnout.outputMode = this.turnout.outputMode;
                    this.canvas4Element.turnout.send();
                };
                this.bit41Element.value = this.turnout.t1OpenValue;
                this.bit41Element.onchanged = (sender) => {
                    this.turnout.t1OpenValue = this.bit41Element.value;
                };
                this.bit42Element.value = this.turnout.t2OpenValue;
                this.bit42Element.onchanged = (sender) => {
                    this.turnout.t2OpenValue = this.bit42Element.value;
                };
            }
            this.shadow.getElementById("modeGroup").style.display = globals_1.Globals.CommandCenterSetting.type == dcc_1.CommandCenterTypes.Z21 ? "none" : "block";
            this.accessoryModeElement.checked = this.turnout.outputMode == dcc_1.OutputModes.accessory;
            this.accessoryModeElement.onchange = (e) => {
                this.turnout.outputMode = dcc_1.OutputModes.accessory;
            };
            this.outputModeElement.checked = this.turnout.outputMode == dcc_1.OutputModes.dccExAccessory;
            this.outputModeElement.onchange = (e) => {
                this.turnout.outputMode = dcc_1.OutputModes.dccExAccessory;
            };
        }
    }
    exports.TurnoutDoublePropertiesElement = TurnoutDoublePropertiesElement;
    customElements.define("turnout-double-properties-element", TurnoutDoublePropertiesElement);
    class TurnoutYPropertiesElement extends HTMLElement {
        constructor() {
            super();
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
            this.nameElement = this.shadow.getElementById("name");
            // this.deviceElement = shadow.getElementById("device") as CommandCenterHTMLSelectElement
            this.addressElement = this.shadow.getElementById("address");
            this.canvas1Element = this.shadow.getElementById("turnout1");
            this.bit1Element = this.shadow.getElementById("bit1");
            this.canvas2Element = this.shadow.getElementById("turnout2");
            this.bit2Element = this.shadow.getElementById("bit2");
            this.accessoryModeElement = this.shadow.getElementById("accessory");
            this.outputModeElement = this.shadow.getElementById("output");
            this.rbusAddressElement = this.shadow.getElementById("rbusAddress");
        }
        setTurnout(turnout) {
            this.turnout = turnout;
            this.nameElement.value = this.turnout.name;
            this.nameElement.onchange = (e) => {
                this.turnout.name = this.nameElement.value;
            };
            this.addressElement.value = this.turnout.address.toString();
            this.addressElement.onchange = (e) => {
                this.turnout.address = parseInt(this.addressElement.value);
                //window.dispatchEvent(propertiesChangedEvent)
                window.invalidate();
            };
            this.rbusAddressElement.value = this.turnout.rbusAddress.toString();
            this.rbusAddressElement.onchange = (e) => {
                this.turnout.rbusAddress = parseInt(this.rbusAddressElement.value);
                // window.dispatchEvent(propertiesChangedEvent)
                window.invalidate();
            };
            this.canvas1Element.turnout.t1Closed = true;
            this.canvas1Element.turnout.angle = turnout.angle;
            this.canvas1Element.turnout.address = turnout.address;
            this.canvas1Element.turnout.outputMode = this.turnout.outputMode;
            // this.canvas1Element.turnout!.cc = turnout.cc
            this.canvas1Element.draw();
            this.canvas1Element.onclick = (e) => {
                this.canvas1Element.turnout.address = turnout.address;
                this.canvas1Element.turnout.t1ClosedValue = this.turnout.t1ClosedValue;
                this.canvas1Element.turnout.outputMode = this.turnout.outputMode;
                this.canvas1Element.turnout.send();
            };
            this.bit1Element.value = this.turnout.t1ClosedValue;
            this.bit1Element.onchanged = (sender) => {
                this.turnout.t1ClosedValue = this.bit1Element.value;
            };
            this.canvas2Element.turnout.t1Closed = false;
            this.canvas2Element.turnout.angle = turnout.angle;
            this.canvas2Element.turnout.address = turnout.address;
            this.canvas2Element.turnout.outputMode = this.turnout.outputMode;
            // this.canvas2Element.turnout!.cc = turnout.cc
            this.canvas2Element.draw();
            this.canvas2Element.onclick = (e) => {
                this.canvas2Element.turnout.address = turnout.address;
                this.canvas2Element.turnout.t1OpenValue = this.turnout.t1OpenValue;
                this.canvas2Element.turnout.outputMode = this.turnout.outputMode;
                this.canvas2Element.turnout.send();
            };
            this.bit2Element.value = this.turnout.t1OpenValue;
            this.bit2Element.onchanged = (sender) => {
                this.turnout.t1OpenValue = this.bit2Element.value;
            };
            this.shadow.getElementById("modeGroup").style.display = globals_1.Globals.CommandCenterSetting.type == dcc_1.CommandCenterTypes.Z21 ? "none" : "block";
            this.accessoryModeElement.checked = this.turnout.outputMode == dcc_1.OutputModes.accessory;
            this.accessoryModeElement.onchange = (e) => {
                this.turnout.outputMode = dcc_1.OutputModes.accessory;
            };
            this.outputModeElement.checked = this.turnout.outputMode == dcc_1.OutputModes.dccExAccessory;
            this.outputModeElement.onchange = (e) => {
                this.turnout.outputMode = dcc_1.OutputModes.dccExAccessory;
            };
        }
    }
    exports.TurnoutYPropertiesElement = TurnoutYPropertiesElement;
    customElements.define("turnout-y-properties-element", TurnoutYPropertiesElement);
});
