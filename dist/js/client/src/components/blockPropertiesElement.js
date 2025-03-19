define(["require", "exports", "../helpers/api"], function (require, exports, api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BlockPropertiesElement = void 0;
    class BlockPropertiesElement extends HTMLElement {
        constructor() {
            super();
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
                <div id="locos" style="height: 360px; overflow: auto; border-radius: 4px;">
                </div>
            </div>
            <div style="text-align: center; margin-top: 8px">
               
                <button id="btnRemove" class="btn btn-secondary">REMOVE</button>
                
            </div>

        </div>
    `;
            this.nameElement = shadow.getElementById("name");
            this.locos = shadow.getElementById("locos");
            this.btnRemove = shadow.getElementById("btnRemove");
            this.btnRemove.onclick = (e) => {
                api_1.Api.setBlock(this.block.name, 0);
            };
        }
        setBlock(block) {
            this.block = block;
            this.nameElement.value = block.name;
            this.nameElement.onchange = (e) => {
                block.name = this.nameElement.value;
            };
            this.renderLocos();
        }
        renderLocos() {
            this.locos.innerHTML = "";
            const table = document.createElement("table");
            table.style.width = "100%";
            table.style.cursor = "pointer";
            api_1.Api.loadLocomotives().then((locomotives) => {
                locomotives.forEach((loco, i) => {
                    const row = document.createElement('tr');
                    row.dataset.index = loco.address.toString();
                    table.appendChild(row);
                    const isActive = i % 2;
                    const bg = isActive ? "#777" : "#888";
                    const fg = isActive ? "white" : "black";
                    const col1 = document.createElement("td");
                    col1.style.textAlign = "center";
                    row.appendChild(col1);
                    col1.style.color = fg;
                    col1.style.backgroundColor = bg;
                    col1.style.padding = "8px 10px";
                    const img = document.createElement('img');
                    img.style.height = "32px";
                    img.src = loco.imageUrl;
                    col1.appendChild(img);
                    const div = document.createElement('div');
                    div.innerHTML = `#${loco.address} ${loco.name}`;
                    col1.appendChild(div);
                });
                table.addEventListener("click", (event) => {
                    const targetRow = event.target.closest("tr");
                    if (targetRow && targetRow.dataset.index) {
                        const addr = parseInt(targetRow.dataset.index, 10);
                        api_1.Api.setBlock(this.block.name, addr);
                        //this.renderLocos()
                    }
                });
                this.locos.appendChild(table);
            });
        }
    }
    exports.BlockPropertiesElement = BlockPropertiesElement;
    customElements.define("block-properties-element", BlockPropertiesElement);
});
