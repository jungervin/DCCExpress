import { propertiesChangedEvent } from "../editor/view";
import { BlockElement } from "../editor/block";
import { TrackElement } from "../editor/track";
import { Locomotive, LocomotiveComboBox } from "./locoComboboxElement";

export class BlockPropertiesElement extends HTMLElement {
    
    block: BlockElement | undefined;
    loco: LocomotiveComboBox;

    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
        <style>
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
    
        <div>
            <div>Loco</div>
            <div>
            <locomotive-combo-box id="loco"></locomotive-combo-box>
            </div>
        </div>
    `;

        this.loco = shadow.getElementById("loco") as LocomotiveComboBox
    }

    setBlock(block: BlockElement) {
        this.block = block

        const locomotives: Locomotive[] = [
            { id: "1", name: "M41 2182", address: 10, imageUrl: "./images/locos/csorgo.png" },
            { id: "2", name: "M41 2169", address: 11, imageUrl: "./images/locos/csorgo.png" },
            { id: "3", name: "M44 148", address: 18, imageUrl: "./images/locos/bobo.png" },
        ];
    
        
    
        // Locomotive adatok betöltése
        this.loco.setLocomotives(locomotives);
        this.loco.selectByAddress(this.block.locoAddress)
        this.loco.onChange((loco) => {
            this.block!.locoAddress = loco.address
            this.block!.text = loco.name
            //window.dispatchEvent(propertiesChangedEvent)
            window.invalidate()
        })
    }
}

customElements.define("block-properties-element", BlockPropertiesElement)


