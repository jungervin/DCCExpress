define(["require", "exports", "../helpers/graphics", "../editor/signals", "../helpers/utility", "../../../common/src/dcc", "../helpers/globals"], function (require, exports, graphics_1, signals_1, utility_1, dcc_1, globals_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Signal4PropertiesElement = exports.Signal3PropertiesElement = exports.Signal2PropertiesElement = void 0;
    // import { CommandCenterHTMLSelectElement } from "./CommandCenterHTMLSelectElement";
    // import { iCommandCenter } from "../../../common/src/dcc";
    class Signal2PropertiesElement extends HTMLElement {
        // deviceElement: CommandCenterHTMLSelectElement;
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
                .container {
                    color: white;
                }


.property-item {
    display: flex;
    flex-direction: column;
   color: white;

}

.property-item label {
    font-weight: bold;
    margin-bottom: 5px;
}

.property-item input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
}                
            </style>

            <div class="container">
                
                <!-- <div class="igroup">
                     <command-center-select-element id="device"></command-center-select-element>
                </div> -->

                <div class="igroup">
                    <div>Name</div>
                    <div>
                        <input id="name" type="text" value="">
                    </div>
                </div>



                <!-- Első sor -->
                <div class="igroup">
                    <p>Set the first address and specify how many addresses need to receive the bits! Bit 0 goes to the first address</p>
                    <div class="row mb-1">
                        <div class="col-3">Address</div>
                        <div class="col-3">
                            <input id="address" type="number" value="0" >
                        </div>
                    </div>
                    <div class="row ">
                        <div class="col-3">Length</div>
                        <div class="col-3">
                            <input id="addressLength" type="number" value="5">
                        </div>
                    </div>
                </div>

                <div class="igroup">
                    <!-- Green -->
                    <div class="row">
                        <div class="col-3">
                            <canvas id="canvas1" width="80" height="80">
                        </div>
                        <div class="col-3"><input id="valueGreen" type="text" value="0"><p id="valueGreenDec">0</p></div>
                    </div>

                    <!-- Red -->
                    <div class="row">
                        <div class="col-3">
                            <canvas id="canvas2" width="80" height="80">
                        </div>
                        <div class="col-3"><input id="valueRed" type="text" value="0"><p id="valueRedDec">0</p></div>
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

                <div class="igroup">
                    <div>RBus or Sensor address</div>
                    <div>
                        <input id="rbusAddress" type="number" value="0">
                    </div>
                </div>

            </div>

        `;
            //this.deviceElement = this.shadow.getElementById("device") as CommandCenterHTMLSelectElement
            this.nameElement = this.shadow.getElementById("name");
            this.addressElement = this.shadow.getElementById("address");
            this.addressLengthElement = this.shadow.getElementById("addressLength");
            this.canvas1Element = this.shadow.getElementById('canvas1');
            this.canvas2Element = this.shadow.getElementById('canvas2');
            this.valueGreenElement = this.shadow.getElementById("valueGreen");
            this.valueRedElement = this.shadow.getElementById("valueRed");
            this.valueGreenDecElement = this.shadow.getElementById("valueGreenDec");
            this.valueRedDecElement = this.shadow.getElementById("valueRedDec");
            this.accessoryModeElement = this.shadow.getElementById("accessory");
            this.outputModeElement = this.shadow.getElementById("output");
            this.rbusAddressElement = this.shadow.getElementById("rbusAddress");
        }
        setSignal(signal2) {
            this.signal2 = signal2;
            this.nameElement.value = this.signal2.name;
            this.nameElement.onchange = (e) => {
                this.signal2.name = this.nameElement.value;
            };
            this.addressElement.value = this.signal2.address.toString();
            this.addressElement.onchange = (e) => {
                this.signal2.address = parseInt(this.addressElement.value);
            };
            this.addressLengthElement.value = this.signal2.addressLength.toString();
            this.addressLengthElement.onchange = (e) => {
                var len = parseInt(this.addressLengthElement.value);
                this.signal2.addressLength = len;
            };
            this.rbusAddressElement.value = this.signal2.rbusAddress.toString();
            this.rbusAddressElement.onchange = (e) => {
                this.signal2.rbusAddress = parseInt(this.rbusAddressElement.value);
            };
            this.valueGreenElement.value = (0, utility_1.byteToBinary)(this.signal2.valueGreen);
            this.valueGreenDecElement.innerHTML = "dec: " + (0, utility_1.toDecimal)(this.signal2.valueGreen.toString());
            this.valueRedElement.value = (0, utility_1.byteToBinary)(this.signal2.valueRed);
            this.valueRedDecElement.innerHTML = "dec: " + (0, utility_1.toDecimal)(this.signal2.valueRed.toString());
            const signalGreen = new signals_1.Signal2Element("", signal2.address, 0, 0, "green");
            signalGreen.trackElem.visible = false;
            signalGreen.state = signals_1.SignalStates.green;
            const ctx1 = this.canvas1Element.getContext('2d');
            ctx1 === null || ctx1 === void 0 ? void 0 : ctx1.reset();
            signalGreen.angle = 90;
            (0, graphics_1.drawRectangle)(ctx1, 0, 0, 80, 80);
            ctx1.translate(12, 12);
            ctx1.scale(1.4, 1.4);
            signalGreen.draw(ctx1);
            const signalRed = new signals_1.Signal2Element("", signal2.address, 0, 0, "red");
            signalRed.state = signals_1.SignalStates.red;
            signalRed.trackElem.visible = false;
            const ctx2 = this.canvas2Element.getContext('2d');
            ctx2 === null || ctx2 === void 0 ? void 0 : ctx2.reset();
            signalRed.angle = 90;
            (0, graphics_1.drawRectangle)(ctx2, 0, 0, 80, 80);
            ctx2.translate(12, 12);
            ctx2.scale(1.4, 1.4);
            signalRed.draw(ctx2);
            this.canvas1Element.onclick = (e) => {
                var _a;
                (_a = this.signal2) === null || _a === void 0 ? void 0 : _a.send(this.signal2.valueGreen);
            };
            this.canvas2Element.onclick = (e) => {
                var _a;
                (_a = this.signal2) === null || _a === void 0 ? void 0 : _a.send(this.signal2.valueRed);
            };
            this.valueGreenElement.onchange = (e) => {
                this.signal2.valueGreen = (0, utility_1.toDecimal)(this.valueGreenElement.value);
                this.valueGreenDecElement.innerHTML = "dec: " + (0, utility_1.toDecimal)(this.valueGreenElement.value);
                // this.updateUI()
            };
            this.valueRedElement.onchange = (e) => {
                this.signal2.valueRed = (0, utility_1.toDecimal)(this.valueRedElement.value);
                this.valueRedDecElement.innerHTML = "dec: " + (0, utility_1.toDecimal)(this.valueRedElement.value);
            };
            this.shadowRoot.getElementById("modeGroup").style.display = globals_1.Globals.CommandCenterSetting.type == dcc_1.CommandCenterTypes.Z21 ? "none" : "block";
            this.accessoryModeElement.checked = this.signal2.outputMode == dcc_1.OutputModes.accessory;
            this.accessoryModeElement.onchange = (e) => {
                this.signal2.outputMode = dcc_1.OutputModes.accessory;
            };
            this.outputModeElement.checked = this.signal2.outputMode == dcc_1.OutputModes.output;
            this.outputModeElement.onchange = (e) => {
                this.signal2.outputMode = dcc_1.OutputModes.output;
            };
        }
        updateUI() {
            this.signal2.address = parseInt(this.addressElement.value);
            var len = parseInt(this.addressLengthElement.value);
            this.signal2.addressLength = len;
            this.signal2.valueGreen = (0, utility_1.toDecimal)(this.valueGreenElement.value);
            this.valueGreenDecElement.innerHTML = "dec: " + (0, utility_1.toDecimal)(this.valueGreenElement.value);
            this.signal2.valueRed = (0, utility_1.toDecimal)(this.valueRedElement.value);
            this.valueRedDecElement.innerHTML = "dec: " + (0, utility_1.toDecimal)(this.valueRedElement.value);
        }
    }
    exports.Signal2PropertiesElement = Signal2PropertiesElement;
    customElements.define("signal2-properties-element", Signal2PropertiesElement);
    class Signal3PropertiesElement extends HTMLElement {
        //deviceElement: CommandCenterHTMLSelectElement;
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: 'open' });
            this.shadow.innerHTML = `
            <style>
                @import url("css/bootstrap.min.css");
                @import url("css/properties.css");

                #canvas1, #canvas2, #canvas3 {
                    cursor: pointer;
                }
                .container {
                    color: white;
                }
            </style>

            <div class="container">
                
            <!--
                <div class="igroup">
                    <command-center-select-element id="device"></command-center-select-element>
                </div>
            -->

                <div class="igroup">
                    <div>Name</div>
                    <div>
                        <input id="name" type="text" value="">
                    </div>
                </div>

                <!-- Első sor -->
                <div class="igroup">
                    <p>Set the first address and specify how many addresses need to receive the bits! Bit 0 goes to the first address</p>
                    <div class="row mb-1">
                        <div class="col-3">Address</div>
                        <div class="col-3">
                            <input id="address" type="number" value="0" >
                        </div>
                    </div>
                    <div class="row ">
                        <div class="col-3">Length</div>
                        <div class="col-3">
                            <input id="addressLength" type="number" value="5">
                        </div>
                    </div>
                </div>

                <div class="igroup">
                    <!-- Green -->
                    <div class="row">
                        <div class="col-3">
                            <canvas id="canvas1" width="80" height="80">
                        </div>
                        <div class="col-3"><input id="valueGreen" type="text" value="0"><p id="valueGreenDec">0</p></div>
                    </div>

                    <!-- Red -->
                    <div class="row">
                        <div class="col-3">
                            <canvas id="canvas2" width="80" height="80">
                        </div>
                        <div class="col-3"><input id="valueRed" type="text" value="0"><p id="valueRedDec">0</p></div>
                    </div>

                    <!-- Yellow -->
                    <div class="row">
                        <div class="col-3">
                            <canvas id="canvas3" width="80" height="80">
                        </div>
                        <div class="col-3"><input id="valueYellow" type="text" value="0"><p id="valueYellowDec">0</p></div>
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


                <div class="igroup">
                    <div>RBus or Sensor address</div>
                    <div>
                        <input id="rbusAddress" type="number" value="0">
                    </div>
                </div>
       
            </div>
        `;
            // this.deviceElement = this.shadow.getElementById("device") as CommandCenterHTMLSelectElement
            this.nameElement = this.shadow.getElementById("name");
            this.addressElement = this.shadow.getElementById("address");
            this.addressLengthElement = this.shadow.getElementById("addressLength");
            this.canvas1Element = this.shadow.getElementById('canvas1');
            this.canvas2Element = this.shadow.getElementById('canvas2');
            this.valueGreenElement = this.shadow.getElementById("valueGreen");
            this.valueRedElement = this.shadow.getElementById("valueRed");
            this.valueGreenDecElement = this.shadow.getElementById("valueGreenDec");
            this.valueRedDecElement = this.shadow.getElementById("valueRedDec");
            this.canvas3Element = this.shadow.getElementById('canvas3');
            this.valueYellowElement = this.shadow.getElementById("valueYellow");
            this.valueYellowDecElement = this.shadow.getElementById("valueYellowDec");
            this.accessoryModeElement = this.shadow.getElementById("accessory");
            this.outputModeElement = this.shadow.getElementById("output");
            this.rbusAddressElement = this.shadow.getElementById("rbusAddress");
        }
        setSignal(signal3) {
            this.signal3 = signal3;
            this.nameElement.value = this.signal3.name;
            this.nameElement.onchange = (e) => {
                this.signal3.name = this.nameElement.value;
            };
            // this.deviceElement.setSelectedDevice(this.signal3.cc!)
            // this.deviceElement.onchangeCallback = (value) => {
            //     this.signal3!.cc = value!
            // };
            this.addressElement.value = this.signal3.address.toString();
            this.addressElement.onchange = (e) => {
                this.signal3.address = parseInt(this.addressElement.value);
            };
            this.addressLengthElement.value = this.signal3.addressLength.toString();
            this.addressLengthElement.onchange = (e) => {
                var len = parseInt(this.addressLengthElement.value);
                this.signal3.addressLength = len;
            };
            this.rbusAddressElement.value = this.signal3.rbusAddress.toString();
            this.rbusAddressElement.onchange = (e) => {
                this.signal3.rbusAddress = parseInt(this.rbusAddressElement.value);
            };
            this.valueGreenElement.value = (0, utility_1.byteToBinary)(this.signal3.valueGreen);
            this.valueGreenDecElement.innerHTML = "dec: " + (0, utility_1.toDecimal)(this.signal3.valueGreen.toString());
            const signalGreen = new signals_1.Signal3Element("", signal3.address, 0, 0, "green");
            signalGreen.trackElem.visible = false;
            signalGreen.state = signals_1.SignalStates.green;
            const ctx1 = this.canvas1Element.getContext('2d');
            ctx1 === null || ctx1 === void 0 ? void 0 : ctx1.reset();
            signalGreen.angle = 90;
            (0, graphics_1.drawRectangle)(ctx1, 0, 0, 80, 80);
            ctx1.translate(12, 12);
            ctx1.scale(1.4, 1.4);
            signalGreen.draw(ctx1);
            this.canvas1Element.onclick = (e) => {
                var _a;
                (_a = this.signal3) === null || _a === void 0 ? void 0 : _a.send(this.signal3.valueGreen);
            };
            this.valueRedElement.value = (0, utility_1.byteToBinary)(this.signal3.valueRed);
            this.valueRedDecElement.innerHTML = "dec: " + (0, utility_1.toDecimal)(this.signal3.valueRed.toString());
            const signalRed = new signals_1.Signal3Element("", signal3.address, 0, 0, "red");
            signalRed.state = signals_1.SignalStates.red;
            signalRed.trackElem.visible = false;
            const ctx2 = this.canvas2Element.getContext('2d');
            ctx2 === null || ctx2 === void 0 ? void 0 : ctx2.reset();
            signalRed.angle = 90;
            (0, graphics_1.drawRectangle)(ctx2, 0, 0, 80, 80);
            ctx2.translate(12, 12);
            ctx2.scale(1.4, 1.4);
            signalRed.draw(ctx2);
            this.canvas2Element.onclick = (e) => {
                var _a;
                (_a = this.signal3) === null || _a === void 0 ? void 0 : _a.send(this.signal3.valueRed);
            };
            this.valueYellowElement.value = (0, utility_1.byteToBinary)(this.signal3.valueYellow);
            this.valueYellowDecElement.innerHTML = "dec: " + (0, utility_1.toDecimal)(this.signal3.valueYellow.toString());
            const signalYellow = new signals_1.Signal3Element("", signal3.address, 0, 0, "yellow");
            signalYellow.trackElem.visible = false;
            signalYellow.state = signals_1.SignalStates.yellow;
            const ctx3 = this.canvas3Element.getContext('2d');
            ctx3 === null || ctx3 === void 0 ? void 0 : ctx3.reset();
            signalYellow.angle = 90;
            (0, graphics_1.drawRectangle)(ctx3, 0, 0, 80, 80);
            ctx3.translate(12, 12);
            ctx3.scale(1.4, 1.4);
            signalYellow.draw(ctx3);
            this.canvas3Element.onclick = (e) => {
                var _a;
                (_a = this.signal3) === null || _a === void 0 ? void 0 : _a.send(this.signal3.valueYellow);
            };
            this.valueGreenElement.onchange = (e) => {
                this.signal3.valueGreen = (0, utility_1.toDecimal)(this.valueGreenElement.value);
                this.valueGreenDecElement.innerHTML = "dec: " + (0, utility_1.toDecimal)(this.valueGreenElement.value);
            };
            this.valueRedElement.onchange = (e) => {
                this.signal3.valueRed = (0, utility_1.toDecimal)(this.valueRedElement.value);
                this.valueRedDecElement.innerHTML = "dec: " + (0, utility_1.toDecimal)(this.valueRedElement.value);
            };
            this.valueYellowElement.onchange = (e) => {
                this.signal3.valueYellow = (0, utility_1.toDecimal)(this.valueYellowElement.value);
                this.valueYellowDecElement.innerHTML = "dec: " + (0, utility_1.toDecimal)(this.valueYellowElement.value);
            };
            this.shadowRoot.getElementById("modeGroup").style.display = globals_1.Globals.CommandCenterSetting.type == dcc_1.CommandCenterTypes.Z21 ? "none" : "block";
            this.accessoryModeElement.checked = this.signal3.outputMode == dcc_1.OutputModes.accessory;
            this.accessoryModeElement.onchange = (e) => {
                this.signal3.outputMode = dcc_1.OutputModes.accessory;
            };
            this.outputModeElement.checked = this.signal3.outputMode == dcc_1.OutputModes.output;
            this.outputModeElement.onchange = (e) => {
                this.signal3.outputMode = dcc_1.OutputModes.output;
            };
        }
        getTemplate() {
            return `
       
        `;
        }
    }
    exports.Signal3PropertiesElement = Signal3PropertiesElement;
    customElements.define("signal3-properties-element", Signal3PropertiesElement);
    class Signal4PropertiesElement extends HTMLElement {
        //deviceElement: CommandCenterHTMLSelectElement;
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: 'open' });
            this.shadow.innerHTML = `
            <style>
                @import url("css/bootstrap.min.css");
                @import url("css/properties.css");
                #canvas1, #canvas2, #canvas3, #canvas4 {
                    cursor: pointer;
                }
                .container {
                    color: white;
                }
            </style>

            <div class="container">
                <!--
                <div class="igroup">
                    <command-center-select-element id="device"></command-center-select-element>
                </div>
                -->

                <div class="igroup">
                    <div>Name</div>
                    <div>
                        <input id="name" type="text" value="">
                    </div>
                </div>

                <!-- Első sor -->
                <div class="igroup">
                    <p>Set the first address and specify how many addresses need to receive the bits! Bit 0 goes to the first address</p>
                    <div class="row mb-1">
                        <div class="col-3">Address</div>
                        <div class="col-3">
                            <input id="address" type="number" value="0" >
                        </div>
                    </div>
                    <div class="row ">
                        <div class="col-3">Length</div>
                        <div class="col-3">
                            <input id="addressLength" type="number" value="5">
                        </div>
                    </div>
                </div>

                <div class="igroup">
                    <!-- Green -->
                    <div class="row">
                        <div class="col-3">
                            <canvas id="canvas1" width="80" height="80">
                        </div>
                        <div class="col-3"><input id="valueGreen" type="text" value="0"><p id="valueGreenDec">0</p></div>
                    </div>

                    <!-- Red -->
                    <div class="row">
                        <div class="col-3">
                            <canvas id="canvas2" width="80" height="80">
                        </div>
                        <div class="col-3"><input id="valueRed" type="text" value="0"><p id="valueRedDec">0</p></div>
                    </div>

                    <!-- Yellow -->
                    <div class="row">
                        <div class="col-3">
                            <canvas id="canvas3" width="80" height="80">
                        </div>
                        <div class="col-3"><input id="valueYellow" type="text" value="0"><p id="valueYellowDec">0</p></div>
                    </div>

                    <!-- White -->
                    <div class="row">
                        <div class="col-3">
                            <canvas id="canvas4" width="80" height="80">
                        </div>
                        <div class="col-3"><input id="valueWhite" type="text" value="0"><p id="valueWhiteDec">0</p></div>
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

                <div class="igroup">
                    <div>RBus or Sensor address</div>
                    <div>
                        <input id="rbusAddress" type="number" value="0">
                    </div>
                </div>
       
            </div>
        `;
            //this.deviceElement = this.shadow.getElementById("device") as CommandCenterHTMLSelectElement
            this.nameElement = this.shadow.getElementById("name");
            this.addressElement = this.shadow.getElementById("address");
            this.addressLengthElement = this.shadow.getElementById("addressLength");
            this.canvas1Element = this.shadow.getElementById('canvas1');
            this.canvas2Element = this.shadow.getElementById('canvas2');
            this.valueGreenElement = this.shadow.getElementById("valueGreen");
            this.valueRedElement = this.shadow.getElementById("valueRed");
            this.valueGreenDecElement = this.shadow.getElementById("valueGreenDec");
            this.valueRedDecElement = this.shadow.getElementById("valueRedDec");
            this.canvas3Element = this.shadow.getElementById('canvas3');
            this.valueYellowElement = this.shadow.getElementById("valueYellow");
            this.valueYellowDecElement = this.shadow.getElementById("valueYellowDec");
            this.canvas4Element = this.shadow.getElementById('canvas4');
            this.valueWhiteElement = this.shadow.getElementById("valueWhite");
            this.valueWhiteDecElement = this.shadow.getElementById("valueWhiteDec");
            this.accessoryModeElement = this.shadow.getElementById("accessory");
            this.outputModeElement = this.shadow.getElementById("output");
            this.rbusAddressElement = this.shadow.getElementById("rbusAddress");
            this.shadowRoot.getElementById("modeGroup").style.display = globals_1.Globals.CommandCenterSetting.type == dcc_1.CommandCenterTypes.Z21 ? "none" : "block";
        }
        setSignal(signal4) {
            this.signal4 = signal4;
            this.nameElement.value = this.signal4.name;
            this.nameElement.onchange = (e) => {
                this.signal4.name = this.nameElement.value;
            };
            this.addressElement.value = this.signal4.address.toString();
            this.addressElement.onchange = (e) => {
                this.signal4.address = parseInt(this.addressElement.value);
            };
            this.addressLengthElement.value = this.signal4.addressLength.toString();
            this.addressLengthElement.onchange = (e) => {
                var len = parseInt(this.addressLengthElement.value);
                this.signal4.addressLength = len;
            };
            this.rbusAddressElement.value = this.signal4.rbusAddress.toString();
            this.rbusAddressElement.onchange = (e) => {
                this.signal4.rbusAddress = parseInt(this.rbusAddressElement.value);
            };
            this.valueGreenElement.value = (0, utility_1.byteToBinary)(this.signal4.valueGreen);
            this.valueGreenDecElement.innerHTML = "dec: " + (0, utility_1.toDecimal)(this.signal4.valueGreen.toString());
            const signalGreen = new signals_1.Signal4Element("", signal4.address, 0, 0, "green");
            signalGreen.trackElem.visible = false;
            signalGreen.state = signals_1.SignalStates.green;
            const ctx1 = this.canvas1Element.getContext('2d');
            ctx1 === null || ctx1 === void 0 ? void 0 : ctx1.reset();
            signalGreen.angle = 90;
            (0, graphics_1.drawRectangle)(ctx1, 0, 0, 80, 80);
            ctx1.translate(12, 12);
            ctx1.scale(1.4, 1.4);
            signalGreen.draw(ctx1);
            this.canvas1Element.onclick = (e) => {
                var _a;
                (_a = this.signal4) === null || _a === void 0 ? void 0 : _a.send(this.signal4.valueGreen);
            };
            this.valueRedElement.value = (0, utility_1.byteToBinary)(this.signal4.valueRed);
            this.valueRedDecElement.innerHTML = "dec: " + (0, utility_1.toDecimal)(this.signal4.valueRed.toString());
            const signalRed = new signals_1.Signal4Element("", signal4.address, 0, 0, "red");
            signalRed.state = signals_1.SignalStates.red;
            signalRed.trackElem.visible = false;
            const ctx2 = this.canvas2Element.getContext('2d');
            ctx2 === null || ctx2 === void 0 ? void 0 : ctx2.reset();
            signalRed.angle = 90;
            (0, graphics_1.drawRectangle)(ctx2, 0, 0, 80, 80);
            ctx2.translate(12, 12);
            ctx2.scale(1.4, 1.4);
            signalRed.draw(ctx2);
            this.canvas2Element.onclick = (e) => {
                var _a;
                (_a = this.signal4) === null || _a === void 0 ? void 0 : _a.send(this.signal4.valueRed);
            };
            this.valueYellowElement.value = (0, utility_1.byteToBinary)(this.signal4.valueYellow);
            this.valueYellowDecElement.innerHTML = "dec: " + (0, utility_1.toDecimal)(this.signal4.valueYellow.toString());
            const signalYellow = new signals_1.Signal4Element("", signal4.address, 0, 0, "yellow");
            signalYellow.trackElem.visible = false;
            signalYellow.state = signals_1.SignalStates.yellow;
            const ctx3 = this.canvas3Element.getContext('2d');
            ctx3 === null || ctx3 === void 0 ? void 0 : ctx3.reset();
            signalYellow.angle = 90;
            (0, graphics_1.drawRectangle)(ctx3, 0, 0, 80, 80);
            ctx3.translate(12, 12);
            ctx3.scale(1.4, 1.4);
            signalYellow.draw(ctx3);
            this.canvas3Element.onclick = (e) => {
                var _a;
                (_a = this.signal4) === null || _a === void 0 ? void 0 : _a.send(this.signal4.valueYellow);
            };
            this.valueWhiteElement.value = (0, utility_1.byteToBinary)(this.signal4.valueWhite);
            this.valueWhiteDecElement.innerHTML = "dec: " + (0, utility_1.toDecimal)(this.signal4.valueWhite.toString());
            const signalWhite = new signals_1.Signal4Element("", signal4.address, 0, 0, "white");
            signalWhite.trackElem.visible = false;
            signalWhite.state = signals_1.SignalStates.white;
            const ctx4 = this.canvas4Element.getContext('2d');
            ctx4 === null || ctx4 === void 0 ? void 0 : ctx4.reset();
            signalWhite.angle = 90;
            (0, graphics_1.drawRectangle)(ctx4, 0, 0, 80, 80);
            ctx4.translate(12, 12);
            ctx4.scale(1.4, 1.4);
            signalWhite.draw(ctx4);
            this.canvas4Element.onclick = (e) => {
                var _a;
                (_a = this.signal4) === null || _a === void 0 ? void 0 : _a.send(this.signal4.valueWhite);
            };
            this.valueGreenElement.onchange = (e) => {
                this.signal4.valueGreen = (0, utility_1.toDecimal)(this.valueGreenElement.value);
                this.valueGreenDecElement.innerHTML = "dec: " + (0, utility_1.toDecimal)(this.valueGreenElement.value);
            };
            this.valueRedElement.onchange = (e) => {
                this.signal4.valueRed = (0, utility_1.toDecimal)(this.valueRedElement.value);
                this.valueRedDecElement.innerHTML = "dec: " + (0, utility_1.toDecimal)(this.valueRedElement.value);
            };
            this.valueYellowElement.onchange = (e) => {
                this.signal4.valueYellow = (0, utility_1.toDecimal)(this.valueYellowElement.value);
                this.valueYellowDecElement.innerHTML = "dec: " + (0, utility_1.toDecimal)(this.valueYellowElement.value);
            };
            this.valueWhiteElement.onchange = (e) => {
                this.signal4.valueWhite = (0, utility_1.toDecimal)(this.valueWhiteElement.value);
                this.valueWhiteDecElement.innerHTML = "dec: " + (0, utility_1.toDecimal)(this.valueWhiteElement.value);
            };
            this.shadowRoot.getElementById("modeGroup").style.display = globals_1.Globals.CommandCenterSetting.type == dcc_1.CommandCenterTypes.Z21 ? "none" : "block";
            this.accessoryModeElement.checked = this.signal4.outputMode == dcc_1.OutputModes.accessory;
            this.accessoryModeElement.onchange = (e) => {
                this.signal4.outputMode = dcc_1.OutputModes.accessory;
            };
            this.outputModeElement.checked = this.signal4.outputMode == dcc_1.OutputModes.output;
            this.outputModeElement.onchange = (e) => {
                this.signal4.outputMode = dcc_1.OutputModes.output;
            };
        }
        getTemplate() {
            return `
        
        `;
        }
    }
    exports.Signal4PropertiesElement = Signal4PropertiesElement;
    customElements.define("signal4-properties-element", Signal4PropertiesElement);
});
