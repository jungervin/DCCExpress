define(["require", "exports", "./bitElement"], function (require, exports, bitElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TurnoutDoublePropertiesElement = exports.TurnoutRightPropertiesElement = exports.TurnoutLeftPropertiesElement = void 0;
    // import { DCCProtocols } from "../helpers/decoder";
    console.log(bitElement_1.BitElement);
    //console.log(CommandCenterHTMLSelectElement)
    class TurnoutLeftPropertiesElement extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = `
        <style>
            @import url("/bootstrap.css");
            @import url("/css/properties.css");
            #canvas1, #canvas2 {
                cursor: pointer;
            }
        </style>

        <div class="container">

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

            <div class="igroup">                
                <div class="row">
                    <div>RBus Address</div>
                    <div>
                        <input id="rbusAddress" type="number" value="0">
                    </div>
                </div>
            </div>

        </div>
    `;
            // this.deviceElement = shadow.getElementById("device") as CommandCenterHTMLSelectElement
            this.addressElement = shadow.getElementById("address");
            this.canvas1Element = shadow.getElementById("turnout1");
            this.bit1Element = shadow.getElementById("bit1");
            this.canvas2Element = shadow.getElementById("turnout2");
            this.bit2Element = shadow.getElementById("bit2");
            this.rbusAddressElement = shadow.getElementById("rbusAddress");
        }
        setTurnout(turnout) {
            this.turnout = turnout;
            // this.deviceElement.setSelectedDevice(this.turnout!.cc)
            // this.deviceElement!.onchangeCallback = (value) => {
            //     this.turnout!.cc = value!
            // };
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
            // this.canvas1Element.turnout!.cc = turnout.cc
            this.canvas1Element.draw();
            this.canvas1Element.onclick = (e) => {
                this.canvas1Element.turnout.address = turnout.address;
                this.canvas1Element.turnout.t1ClosedValue = this.turnout.t1ClosedValue;
                this.canvas1Element.turnout.send();
            };
            this.bit1Element.value = this.turnout.t1ClosedValue;
            this.bit1Element.onchanged = (sender) => {
                this.turnout.t1ClosedValue = this.bit1Element.value;
            };
            this.canvas2Element.turnout.t1Closed = false;
            this.canvas2Element.turnout.angle = turnout.angle;
            this.canvas2Element.turnout.address = turnout.address;
            // this.canvas2Element.turnout!.cc = turnout.cc
            this.canvas2Element.draw();
            this.canvas2Element.onclick = (e) => {
                this.canvas2Element.turnout.address = turnout.address;
                this.canvas2Element.turnout.t1OpenValue = this.turnout.t1OpenValue;
                this.canvas2Element.turnout.send();
            };
            this.bit2Element.value = this.turnout.t1OpenValue;
            this.bit2Element.onchanged = (sender) => {
                this.turnout.t1OpenValue = this.bit2Element.value;
            };
        }
    }
    exports.TurnoutLeftPropertiesElement = TurnoutLeftPropertiesElement;
    customElements.define("turnout-left-properties-element", TurnoutLeftPropertiesElement);
    class TurnoutRightPropertiesElement extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = `
        <style>
            @import url("/bootstrap.css");
            @import url("/css/properties.css");
            #canvas1, #canvas2 {
                cursor: pointer;
            }
        </style>

        <div class="container">
        
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

            <div class="igroup">                
                <div class="row">
                    <div>RBus Address</div>
                    <div>
                        <input id="rbusAddress" type="number" value="0">
                    </div>
                </div>
            </div>

        </div>
    `;
            // this.deviceElement = shadow.getElementById("device") as CommandCenterHTMLSelectElement
            this.addressElement = shadow.getElementById("address");
            this.canvas1Element = shadow.getElementById("turnout1");
            this.bit1Element = shadow.getElementById("bit1");
            this.canvas2Element = shadow.getElementById("turnout2");
            this.bit2Element = shadow.getElementById("bit2");
            this.rbusAddressElement = shadow.getElementById("rbusAddress");
        }
        setTurnout(turnout) {
            this.turnout = turnout;
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
            // this.canvas1Element.turnout!.cc = turnout.cc
            this.canvas1Element.draw();
            this.canvas1Element.onclick = (e) => {
                this.canvas1Element.turnout.address = turnout.address;
                this.canvas1Element.turnout.t1ClosedValue = this.turnout.t1ClosedValue;
                this.canvas1Element.turnout.send();
            };
            this.bit1Element.value = this.turnout.t1ClosedValue;
            this.bit1Element.onchanged = (sender) => {
                this.turnout.t1ClosedValue = this.bit1Element.value;
            };
            this.canvas2Element.turnout.t1Closed = false;
            this.canvas2Element.turnout.angle = turnout.angle;
            this.canvas2Element.turnout.address = turnout.address;
            // this.canvas2Element.turnout!.cc = turnout.cc
            this.canvas2Element.draw();
            this.canvas2Element.onclick = (e) => {
                this.canvas2Element.turnout.address = turnout.address;
                this.canvas2Element.turnout.t1OpenValue = this.turnout.t1OpenValue;
                this.canvas2Element.turnout.send();
            };
            this.bit2Element.value = this.turnout.t1OpenValue;
            this.bit2Element.onchanged = (sender) => {
                this.turnout.t1OpenValue = this.bit2Element.value;
            };
        }
    }
    exports.TurnoutRightPropertiesElement = TurnoutRightPropertiesElement;
    customElements.define("turnout-right-properties-element", TurnoutRightPropertiesElement);
    class TurnoutDoublePropertiesElement extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = `
        <style>
            @import url("/bootstrap.css");
            @import url("/css/properties.css");
            #canvas1, #canvas2 {
                cursor: pointer;
            }
        </style>

        <div class="container">

        
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

            <div class="igroup">                
                <div class="row">
                    <div>RBus Address</div>
                    <div>
                        <input id="rbusAddress" type="number" value="0">
                    </div>
                </div>
            </div>

        </div>
    `;
            // this.deviceElement = shadow.getElementById("device") as CommandCenterHTMLSelectElement
            this.address1Element = shadow.getElementById("address1");
            this.address2Element = shadow.getElementById("address2");
            this.canvas1Element = shadow.getElementById("turnout1");
            this.bit11Element = shadow.getElementById("bit11");
            this.bit12Element = shadow.getElementById("bit12");
            this.canvas2Element = shadow.getElementById("turnout2");
            this.bit21Element = shadow.getElementById("bit21");
            this.bit22Element = shadow.getElementById("bit22");
            this.canvas3Element = shadow.getElementById("turnout3");
            this.bit31Element = shadow.getElementById("bit31");
            this.bit32Element = shadow.getElementById("bit32");
            this.canvas4Element = shadow.getElementById("turnout4");
            this.bit41Element = shadow.getElementById("bit41");
            this.bit42Element = shadow.getElementById("bit42");
            this.rbusAddressElement = shadow.getElementById("rbusAddress");
        }
        setTurnout(turnout) {
            this.turnout = turnout;
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
                // this.canvas1Element.turnout!.cc = this.turnout.cc
                this.canvas1Element.draw();
                this.canvas1Element.onclick = (e) => {
                    this.canvas1Element.turnout.address = this.turnout.address;
                    this.canvas1Element.turnout.address2 = this.turnout.address2;
                    this.canvas1Element.turnout.t1ClosedValue = this.turnout.t1ClosedValue;
                    this.canvas1Element.turnout.t2OpenValue = this.turnout.t2OpenValue;
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
                // this.canvas2Element.turnout!.cc = this.turnout.cc
                this.canvas2Element.draw();
                this.canvas2Element.onclick = (e) => {
                    this.canvas2Element.turnout.address = this.turnout.address;
                    this.canvas2Element.turnout.address2 = this.turnout.address2;
                    this.canvas2Element.turnout.t1ClosedValue = this.turnout.t1ClosedValue;
                    this.canvas2Element.turnout.t2ClosedValue = this.turnout.t2ClosedValue;
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
                // this.canvas3Element.turnout!.cc = this.turnout.cc
                this.canvas3Element.draw();
                this.canvas3Element.onclick = (e) => {
                    this.canvas3Element.turnout.address = this.turnout.address;
                    this.canvas3Element.turnout.address2 = this.turnout.address2;
                    this.canvas3Element.turnout.t1OpenValue = this.turnout.t1OpenValue;
                    this.canvas3Element.turnout.t2ClosedValue = this.turnout.t2ClosedValue;
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
                // this.canvas4Element.turnout!.cc = this.turnout.cc
                this.canvas4Element.draw();
                this.canvas4Element.onclick = (e) => {
                    this.canvas4Element.turnout.address = this.turnout.address;
                    this.canvas4Element.turnout.address2 = this.turnout.address2;
                    this.canvas4Element.turnout.t1OpenValue = this.turnout.t1OpenValue;
                    this.canvas4Element.turnout.t2OpenValue = this.turnout.t2OpenValue;
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
        }
    }
    exports.TurnoutDoublePropertiesElement = TurnoutDoublePropertiesElement;
    customElements.define("turnout-double-properties-element", TurnoutDoublePropertiesElement);
});
// export class TurnoutDoublePropertiesElement extends HTMLElement {
//     address1Element: HTMLInputElement;
//     address2Element: HTMLInputElement;
//     canvas1Element: HTMLCanvasElement;
//     canvas2Element: HTMLCanvasElement;
//     canvas3Element: HTMLCanvasElement;
//     canvas4Element: HTMLCanvasElement;
//     bit11Element: BitElement;
//     bit12Element: BitElement;
//     bit21Element: BitElement;
//     bit22Element: BitElement;
//     bit31Element: BitElement;
//     bit32Element: BitElement;
//     bit41Element: BitElement;
//     bit42Element: BitElement;
//     turnout?: TurnoutDoubleElement;
//     turnout1?: TurnoutDoubleElement;
//     T1?: TurnoutDoubleElement;
//     T2?: TurnoutDoubleElement;
//     turnout2?: TurnoutDoubleElement;
//     T3?: TurnoutDoubleElement;
//     T4?: TurnoutDoubleElement;
//     deviceElement: CommandCenterHTMLSelectElement;
//     rbusAddressElement: HTMLInputElement;
//     constructor() {
//         super()
//         const shadow = this.attachShadow({ mode: 'open' });
//         shadow.innerHTML = `
//         <style>
//             @import url("/bootstrap.css");
//             @import url("/css/properties.css");
//             #canvas1, #canvas2, #canvas3, #canvas4 {
//                 cursor: pointer;
//             }
//         </style>
//         <div class="container">
//             <div class="igroup">
//                 <command-center-select-element id="device"></command-center-select-element>
//             </div>
//             <div class="igroup">
//                 <div class="row">
//                     <div>Address 1</div>
//                     <div>
//                         <input id="address1" type="number" value="0">
//                     </div>
//                 </div>
//                 <div class="row">
//                     <div>Address 2</div>
//                     <div>
//                         <input id="address2" type="number" value="0">
//                     </div>
//                 </div>
//             </div>
//             <div class="igroup">
//                 <div class="row">
//                     <div class="col-3">
//                         <canvas id="canvas1" width="80" height="80"></canvas>
//                     </div>
//                     <div class="col-1">
//                         <bit-element id="bit11"></bit-element>
//                     </div>
//                     <div class="col-1">
//                         <bit-element id="bit12"></bit-element>
//                     </div>
//                 </div>
//                 <div class="row">
//                     <div class="col-3">
//                         <canvas id="canvas2" width="80" height="80"></canvas>
//                     </div>
//                     <div class="col-1">
//                         <bit-element id="bit21"></bit-element>
//                     </div>
//                     <div class="col-1">
//                         <bit-element id="bit22"></bit-element>
//                     </div>
//                 </div>
//                 <div class="row">
//                     <div class="col-3">
//                         <canvas id="canvas3" width="80" height="80"></canvas>
//                     </div>
//                     <div class="col-1">
//                         <bit-element id="bit31"></bit-element>
//                     </div>
//                     <div class="col-1">
//                         <bit-element id="bit32"></bit-element>
//                     </div>
//                 </div>
//                 <div class="row">
//                     <div class="col-3">
//                         <canvas id="canvas4" width="80" height="80"></canvas>
//                     </div>
//                     <div class="col-1">
//                         <bit-element id="bit41"></bit-element>
//                     </div>
//                     <div class="col-1">
//                         <bit-element id="bit42"></bit-element>
//                     </div>
//                 </div>
//             </div>
//             <div class="igroup">
//                 <div>RBus Address</div>
//                 <div>
//                     <input id="rbusAddress" type="number" value="0">
//                 </div>
//             </div>
//         </div>
//     `;
//         this.address1Element = shadow.getElementById("address1") as HTMLInputElement
//         this.address2Element = shadow.getElementById("address2") as HTMLInputElement
//         this.canvas1Element = shadow.getElementById("canvas1") as HTMLCanvasElement
//         this.bit11Element = shadow.getElementById("bit11") as BitElement
//         this.bit12Element = shadow.getElementById("bit12") as BitElement
//         this.canvas2Element = shadow.getElementById("canvas2") as HTMLCanvasElement
//         this.bit21Element = shadow.getElementById("bit21") as BitElement
//         this.bit22Element = shadow.getElementById("bit22") as BitElement
//         this.canvas3Element = shadow.getElementById("canvas3") as HTMLCanvasElement
//         this.bit31Element = shadow.getElementById("bit31") as BitElement
//         this.bit32Element = shadow.getElementById("bit32") as BitElement
//         this.canvas4Element = shadow.getElementById("canvas4") as HTMLCanvasElement
//         this.bit41Element = shadow.getElementById("bit41") as BitElement
//         this.bit42Element = shadow.getElementById("bit42") as BitElement
//         this.deviceElement = shadow.getElementById("device") as CommandCenterHTMLSelectElement
//         this.rbusAddressElement = shadow.getElementById("rbusAddress") as HTMLInputElement
//     }
//     setTurnout(turnout: TurnoutDoubleElement) {
//         this.turnout = turnout
//         this.deviceElement.setSelectedDevice(this.turnout!.decoders.device)
//         const ctx1 = this.canvas1Element!.getContext('2d')
//         this.T1 = new TurnoutDoubleElement("", this.turnout.address, this.turnout.address2, 0, 0, "")
//         this.T1!.t1Closed = true
//         this.T1!.t2Closed = false
//         this.T1!.angle = turnout.angle
//         this.T1!.decoders.device = turnout.decoders.device
//         drawRectangle(ctx1!, 0, 0, 80, 80)
//         ctx1!.translate(10, 10)
//         ctx1!.scale(1.4, 1.4)
//         this.T1!.draw(ctx1!)
//         this.bit11Element!.value = this.turnout.t1ClosedValue
//         this.bit12Element!.value = this.turnout.t2OpenValue
//         const ctx2 = this.canvas2Element!.getContext('2d')
//         this.T2 = new TurnoutDoubleElement("", this.turnout.address, this.turnout.address2, 0, 0, "")
//         this.T2!.t1Closed = true
//         this.T2!.t2Closed = true
//         this.T2!.angle = turnout.angle
//         this.T2!.decoders.device = turnout.decoders.device
//         drawRectangle(ctx2!, 0, 0, 80, 80)
//         ctx2!.translate(10, 10)
//         ctx2!.scale(1.4, 1.4)
//         this.T2!.draw(ctx2!)
//         this.bit21Element!.value = this.turnout.t1ClosedValue
//         this.bit22Element!.value = this.turnout.t2ClosedValue
//         const ctx3 = this.canvas3Element!.getContext('2d')
//         this.T3 = new TurnoutDoubleElement("", this.turnout.address, this.turnout.address2, 0, 0, "")
//         this.T3!.t1Closed = false
//         this.T3!.t2Closed = true
//         this.T3!.angle = turnout.angle
//         this.T3!.decoders.device = turnout.decoders.device
//         drawRectangle(ctx3!, 0, 0, 80, 80)
//         ctx3!.translate(10, 10)
//         ctx3!.scale(1.4, 1.4)
//         this.T3!.draw(ctx3!)
//         this.bit31Element!.value = this.turnout!.t1OpenValue
//         this.bit32Element!.value = this.turnout!.t2ClosedValue
//         const ctx4 = this.canvas4Element!.getContext('2d')
//         this.T4 = new TurnoutDoubleElement("", this.turnout.address, this.turnout.address2, 0, 0, "")
//         this.T4!.t1Closed = false
//         this.T4!.t2Closed = false
//         this.T4!.angle = turnout.angle
//         this.T4!.decoders.device = turnout.decoders.device
//         drawRectangle(ctx4!, 0, 0, 80, 80)
//         ctx4!.translate(10, 10)
//         ctx4!.scale(1.4, 1.4)
//         this.T4!.draw(ctx4!)
//         this.bit41Element!.value = this.turnout!.t1OpenValue
//         this.bit42Element!.value = this.turnout!.t2OpenValue
//         this.address1Element.value = this.turnout.address.toString()
//         this.address2Element.value = this.turnout.address2.toString()
//         this.address1Element.onchange = (e: Event) => {
//             this.turnout!.address = parseInt(this.address1Element!.value)
//             window.dispatchEvent(propertiesChangedEvent)
//         }
//         this.address2Element.onchange = (e: Event) => {
//             this.turnout!.address2 = parseInt(this.address2Element!.value)
//             window.dispatchEvent(propertiesChangedEvent)
//         }
//         this.canvas1Element.onclick = (e: MouseEvent) => {
//             // this.T1!.t1ClosedValue = this.turnout!.t1ClosedValue
//             // this.T1!.t1OpenValue = this.turnout!.t1OpenValue
//             // this.T1!.decoders[0].setOn(true)
//             // this.T1!.sendTurnoutCmd()
//             this.turnout?.decoders[0].setOn(true)            
//             this.turnout?.decoders[1].setOn(false)            
//             this.turnout?.sendTurnoutCmd()
//         }
//         this.canvas2Element.onclick = (e: MouseEvent) => {
//             this.turnout?.decoders[0].setOn(true)            
//             this.turnout?.decoders[1].setOn(true)            
//             this.turnout?.sendTurnoutCmd()
//         }
//         this.canvas3Element.onclick = (e: MouseEvent) => {
//             this.turnout?.decoders[0].setOn(false)            
//             this.turnout?.decoders[1].setOn(true)            
//             this.turnout?.sendTurnoutCmd()
//         }
//         this.canvas4Element.onclick = (e: MouseEvent) => {
//             this.turnout?.decoders[0].setOn(false)            
//             this.turnout?.decoders[1].setOn(false)            
//             this.turnout?.sendTurnoutCmd()
//         }
//         this.bit11Element.onchanged = (sender: BitElement) => {
//             this.turnout!.t1ClosedValue = sender.value
//         }
//         this.bit12Element.onchanged = (sender: BitElement) => {
//             this.turnout!.t1ClosedValue = sender.value
//         }
//         this.bit21Element.onchanged = (sender: BitElement) => {
//             this.turnout!.t1ClosedValue = sender.value
//         }
//         this.bit22Element.onchanged = (sender: BitElement) => {
//             this.turnout!.t1ClosedValue = sender.value
//         }
//         this.bit31Element.onchanged = (sender: BitElement) => {
//             this.turnout!.t2ClosedValue = sender.value
//         }
//         this.bit32Element.onchanged = (sender: BitElement) => {
//             this.turnout!.t2ClosedValue = sender.value
//         }
//         this.bit41Element.onchanged = (sender: BitElement) => {
//             this.turnout!.t2ClosedValue = sender.value
//         }
//         this.bit42Element.onchanged = (sender: BitElement) => {
//             this.turnout!.t2ClosedValue = sender.value
//         }
//         this.deviceElement!.onchangeCallback = (value) => {
//             console.log("Selected Value Changed:", value);
//             this.turnout!.decoders.device = value!
//         };        
//         this.rbusAddressElement!.value = this.turnout.rbusAddress.toString()
//         this.rbusAddressElement.onchange = (e: Event) => {
//             this.turnout!.rbusAddress = parseInt(this.rbusAddressElement!.value)
//             window.dispatchEvent(propertiesChangedEvent)
//         }
//     }
// }
// customElements.define("turnout-double-properties-element", TurnoutDoublePropertiesElement)
