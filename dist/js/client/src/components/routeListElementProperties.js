define(["require", "exports", "../editor/turnout", "../helpers/graphics"], function (require, exports, turnout_1, graphics_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RouteListElementProperties = void 0;
    class RouteListElementProperties extends HTMLElement {
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
        </style>
    
        <div class="container">
            <div class="igroup">
                <div>Name</div>
                <div>
                    <input id="name" type="text" value="" readonly disabled>
                </div>
            </div>
            <div id="listPanel" class="igroup">
            </div>                
        </div>
        `;
            this.nameElement = shadow.getElementById("name");
            this.listPanel = shadow.getElementById("listPanel");
            this.listPanel.innerHTML = "LISTPANEL";
            this.listPanel.style.overflow = 'auto';
        }
        update() {
        }
        connectedCallback() {
        }
        setRouteSwitch(rs) {
            this.nameElement.value = rs.name;
            this.nameElement.onchange = (e) => {
                rs.name = this.nameElement.value;
            };
            this.routeSwitch = rs;
            this.listPanel.innerHTML = '';
            var turnouts = rs.tag;
            const list = [];
            const uniqueAddress = turnouts.filter((obj, index, self) => index === self.findIndex((o) => o.address === obj.address));
            // turnouts.forEach((t) => {
            uniqueAddress.forEach((t) => {
                var routeItem = this.routeSwitch.turnouts.find((to) => {
                    return to.address == t.address;
                });
                const row = document.createElement("div");
                row.className = "row";
                const col1 = document.createElement("div");
                col1.className = "col-4";
                row.appendChild(col1);
                const col2 = document.createElement("div");
                col2.className = "col-4";
                row.appendChild(col2);
                const canvas = document.createElement('canvas');
                canvas.style.cursor = "pointer";
                canvas.width = 80;
                canvas.height = 80;
                col1.appendChild(canvas);
                const ctx = canvas.getContext('2d');
                (0, graphics_1.drawRectangle)(ctx, 0, 0, 80, 80);
                ctx.translate(10, 10);
                ctx.scale(1.4, 1.4);
                var turnout;
                if (Object.getPrototypeOf(t) == turnout_1.TurnoutLeftElement.prototype) {
                    turnout = new turnout_1.TurnoutLeftElement(t.UUID, t.address, 0, 0, t.name);
                    //turnout.cc = t.cc
                    turnout.t1ClosedValue = t.t1ClosedValue;
                    turnout.t1OpenValue = t.t1OpenValue;
                }
                else if (Object.getPrototypeOf(t) == turnout_1.TurnoutRightElement.prototype) {
                    turnout = new turnout_1.TurnoutRightElement(t.UUID, t.address, 0, 0, t.name);
                    //turnout.cc = t.cc
                    turnout.t1ClosedValue = t.t1ClosedValue;
                    turnout.t1OpenValue = t.t1OpenValue;
                }
                else if (Object.getPrototypeOf(t) == turnout_1.TurnoutDoubleElement.prototype) {
                    var dt = t;
                    turnout = new turnout_1.TurnoutDoubleElement(t.UUID, dt.address, dt.address2, 0, 0, t.name);
                    //turnout.cc = t.cc
                    var routeItem2 = this.routeSwitch.turnouts.find((to) => {
                        return to.address == dt.address2;
                    });
                    if (routeItem2) {
                        turnout.t2ClosedValue = dt.t2ClosedValue;
                        turnout.t2OpenValue = dt.t2OpenValue;
                        turnout.t2Closed = routeItem2.isClosed; //? turnout.t2ClosedValue : turnout.t2OpenValue
                    }
                }
                turnout.angle = t.angle;
                if (routeItem) {
                    turnout.t1Closed = routeItem.isClosed; // ? turnout.t1ClosedValue : turnout.t1OpenValue
                }
                turnout.showAddress = true;
                turnout.draw(ctx);
                const cb = document.createElement("input");
                cb.type = "checkbox";
                cb.checked = routeItem != undefined;
                // cb.dataset.turnoutAddress = t.address.toString();
                // cb.dataset.turnoutT1Closed = t.t1Closed.toString();
                cb.tag = turnout;
                cb.style.width = "16px";
                cb.style.height = "16px";
                cb.style.cursor = "pointer";
                col2.appendChild(cb);
                // const label = document.createElement("label");
                // if (turnout instanceof TurnoutDoubleElement) {
                //     label.textContent = " #" + turnout.address + " #" + (turnout as TurnoutDoubleElement).address2
                // } else {
                //     label.textContent = " #" + turnout.address
                // }
                // // label.insertBefore(cb, label.firstChild);
                // col2.appendChild(label);
                this.listPanel.appendChild(row);
                canvas.onclick = ((e) => {
                    //turnout.t1Closed = !turnout.t1Closed
                    turnout.mouseDown();
                    turnout.draw(ctx);
                    turnout.drawAddress(ctx);
                    this.updateList();
                });
                cb.onchange = (e) => {
                    this.updateList();
                };
            });
        }
        updateList() {
            const checkedAddresses = Array.from(this.listPanel.querySelectorAll("input[type='checkbox']:checked")).map((checkbox) => checkbox);
            this.routeSwitch.turnouts = [];
            checkedAddresses.forEach((cb) => {
                var to = cb.tag;
                // this.routeSwitch!.turnouts.push({ address: to.address, isClosed: to.t1Closed ? to.t1ClosedValue : to.t1OpenValue, device: to.device })
                // if (to instanceof TurnoutDoubleElement) {
                //     this.routeSwitch!.turnouts.push({ address: to.address2, isClosed: to.t2Closed ? to.t2ClosedValue : to.t2OpenValue, device: to.device })
                // }
                this.routeSwitch.turnouts.push({ address: to.address, isClosed: to.t1Closed, outputMode: to.outputMode });
                if (to instanceof turnout_1.TurnoutDoubleElement) {
                    this.routeSwitch.turnouts.push({ address: to.address2, isClosed: to.t2Closed, outputMode: to.outputMode });
                }
            });
            console.log("Checked turnoutAddresses:", this.routeSwitch.turnouts);
        }
    }
    exports.RouteListElementProperties = RouteListElementProperties;
    customElements.define("route-list-element-properties", RouteListElementProperties);
});
