define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BlockPropertiesElement = void 0;
    class BlockPropertiesElement extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = `
        <style>
           @import url("/bootstrap.css");
            @import url("/css/properties.css");
            label {
                display: inline-block;
                white-space: nowrap;
            }
            .row {
                margin: 0;
            }                


            div {
                color: white;
            }
            #loco {
                color: 'black';
                width: 100%;
                margin: 0px;
                padding: 0;
                overflow: hide;
            }
        </style>
    
        <div class="container">
            <div class="igroup">
                <div>Name</div>
                <div>
                    <input id="name" type="text" value="" readonly disabled>
                </div>
            </div>
            
            <div class="igroup">
                <div>Loco</div>
                <div>
                    <locomotive-combo-box id="loco"></locomotive-combo-box>
                </div>
            </div>

        </div>
    `;
            this.nameElement = shadow.getElementById("name");
            this.loco = shadow.getElementById("loco");
        }
        setBlock(block) {
            this.block = block;
            this.nameElement.value = block.name;
            this.nameElement.onchange = (e) => {
                block.name = this.nameElement.value;
            };
            const locomotives = [
                { id: "1", name: "M41 2182", address: 10, imageUrl: "./images/locos/csorgo.png" },
                { id: "2", name: "M41 2169", address: 11, imageUrl: "./images/locos/csorgo.png" },
                { id: "3", name: "M44 148", address: 18, imageUrl: "./images/locos/bobo.png" },
            ];
            // Locomotive adatok betöltése
            this.loco.setLocomotives(locomotives);
            this.loco.selectByAddress(this.block.locoAddress);
            this.loco.onChange((loco) => {
                this.block.locoAddress = loco.address;
                this.block.text = loco.name;
                //window.dispatchEvent(propertiesChangedEvent)
                window.invalidate();
            });
        }
    }
    exports.BlockPropertiesElement = BlockPropertiesElement;
    customElements.define("block-properties-element", BlockPropertiesElement);
});
