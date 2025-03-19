import { propertiesChangedEvent } from "../editor/view";
import { BlockElement } from "../editor/block";
import { TrackElement } from "../editor/track";
import { Locomotive, LocomotiveComboBox } from "./locoComboboxElement";
import { Api } from "../helpers/api";
import { iLocomotive } from "../../../common/src/dcc";

export class BlockPropertiesElement extends HTMLElement {

    block: BlockElement | undefined;
    //loco: LocomotiveComboBox;
    nameElement: HTMLInputElement;
    locos: HTMLElement;

    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
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
                <div>Locos</div>
                <div id="locos" style="height: 460px; overflow: auto; border-radius: 4px;">
                </div>
            </div>

        </div>
    `;

        this.nameElement = shadow.getElementById("name") as HTMLInputElement
        this.locos = shadow.getElementById("locos") as HTMLElement
    }

    setBlock(block: BlockElement) {
        this.block = block
        this.nameElement.value = block.name
        this.nameElement.onchange = (e: Event) => {
            block.name = this.nameElement.value
        }

        this.renderLocos()
    }

    renderLocos() {
        this.locos.innerHTML = ""

        const table = document.createElement("table")
        table.style.width = "100%"
        table.style.cursor = "pointer"

        Api.loadLocomotives().then((locomotives) => {

            locomotives!.forEach((loco, i: number) => {
                const row = document.createElement('tr')
                row.dataset.index = loco.address.toString()
                table.appendChild(row)

                const isActive = i % 2;
                var bg = isActive ? "#777" : "#888";
                if(loco.address == this.block?.locoAddress) {
                        bg = "lime"
                }
                // const bg = isActive ? "whitesmoke" : "gainsboro";
                const fg = isActive ? "white" : "black";

                const col1 = document.createElement("td");
                col1.style.textAlign = "center"
                row.appendChild(col1);
                col1.style.color = fg;
                col1.style.backgroundColor = bg;
                col1.style.padding = "8px 10px"

                const img = document.createElement('img')
                img.style.height = "32px"
                img.src = loco.imageUrl
                col1.appendChild(img)
                const div = document.createElement('div')
                div.innerHTML = `#${loco.address} ${loco.name}`
                col1.appendChild(div)
            })

            table.addEventListener("click", (event) => {
                const targetRow = (event.target as HTMLElement).closest("tr");
                if (targetRow && targetRow.dataset.index) {
                    const addr = parseInt(targetRow.dataset.index, 10);
                    Api.setBlock(this.block!.name, addr)
                    //this.renderLocos()
                }
            });


            this.locos.appendChild(table)
        })

    }
}

customElements.define("block-properties-element", BlockPropertiesElement)


