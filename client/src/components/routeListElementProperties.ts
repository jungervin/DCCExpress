import { TurnoutDoubleElement, TurnoutElement, TurnoutLeftElement, TurnoutRightElement } from "../editor/turnout";
import { RouteSwitchElement } from "../editor/route";
// import { TurnoutHTMLElement } from "./turnoutHTMLElement";
import { drawRectangle } from "../helpers/graphics";
import { iSetTurnout } from "../../../common/src/dcc";
// import { add } from "lodash";
import { ExtendedHTMLInputElement } from "../editor/view";




export class RouteListElementProperties extends HTMLElement {
    listPanel: HTMLDivElement;
    routeSwitch?: RouteSwitchElement;
    nameElement: HTMLInputElement;

    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
        <style>
                @import url("css/bootstrap.min.css");
                @import url("css/properties.css");
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
                <p>ℹ️Select the turnouts and set them to the desired position!</p>
                <div>Name</div>
                <div>
                    <input id="name" type="text" value="">
                </div>
            </div>
            <div id="listPanel" class="igroup">
            </div>                
        </div>
        `
        this.nameElement = shadow.getElementById("name") as HTMLInputElement
        this.listPanel = shadow.getElementById("listPanel") as HTMLDivElement
        this.listPanel.innerHTML = "LISTPANEL"
        this.listPanel.style.overflow = 'auto'

    }

    update() {

    }
    connectedCallback() {
    }

    setRouteSwitch(rs: RouteSwitchElement) {

        this.nameElement.value = rs.name
        this.nameElement.onchange = (e: Event) => {
            rs.name = this.nameElement.value
        }

        this.routeSwitch = rs
        this.listPanel.innerHTML = ''
        var turnouts = rs.tag as TurnoutElement[]
        const list: iSetTurnout[] = []

        const uniqueAddress = turnouts.filter((obj, index, self) =>
            index === self.findIndex((o) => o.address === obj.address)
        );

        // turnouts.forEach((t) => {
            uniqueAddress.forEach((t) => {            
            var routeItem = this.routeSwitch!.turnouts.find((to) => {
                return to.address == t.address
            })


            const row = document.createElement("div")
            row.className = "row"
            
            const col1 = document.createElement("div")
            col1.className = "col-4"
            row.appendChild(col1)
            
            const col2 = document.createElement("div")
            col2.className = "col-4"
            row.appendChild(col2)

            const canvas = document.createElement('canvas')
            canvas.style.cursor = "pointer"
            canvas.width = 80
            canvas.height = 80
            col1.appendChild(canvas)          

            const ctx = canvas.getContext('2d')
            drawRectangle(ctx!, 0, 0, 80, 80)
            ctx!.translate(10, 10)
            ctx!.scale(1.4, 1.4)

            var turnout: any;

            if (Object.getPrototypeOf(t) == TurnoutLeftElement.prototype) {
                turnout = new TurnoutLeftElement(t.UUID, t.address, 0, 0, t.name)
                //turnout.cc = t.cc
                turnout.t1ClosedValue = t.t1ClosedValue
                turnout.t1OpenValue = t.t1OpenValue
            }
            else if (Object.getPrototypeOf(t) == TurnoutRightElement.prototype) {
                turnout = new TurnoutRightElement(t.UUID, t.address, 0, 0, t.name)
                //turnout.cc = t.cc
                turnout.t1ClosedValue = t.t1ClosedValue
                turnout.t1OpenValue = t.t1OpenValue
                
            }
            else if (Object.getPrototypeOf(t) == TurnoutDoubleElement.prototype) {
                var dt = t as TurnoutDoubleElement
                turnout = new TurnoutDoubleElement(t.UUID, dt.address, dt.address2, 0, 0, t.name)
                //turnout.cc = t.cc
                var routeItem2 = this.routeSwitch!.turnouts.find((to) => {
                    return to.address == dt.address2
                })
                if (routeItem2) {
                    turnout.t2ClosedValue = dt.t2ClosedValue
                    turnout.t2OpenValue = dt.t2OpenValue
                    turnout.t2Closed = routeItem2.isClosed //? turnout.t2ClosedValue : turnout.t2OpenValue
                }

            }



            turnout.angle = t.angle;
            if (routeItem) {
                turnout.t1Closed = routeItem.isClosed // ? turnout.t1ClosedValue : turnout.t1OpenValue
            }

            turnout.showAddress = true
            turnout.draw(ctx)

            const cb = document.createElement("input") as ExtendedHTMLInputElement
            cb.type = "checkbox"
            cb.checked = routeItem != undefined
            // cb.dataset.turnoutAddress = t.address.toString();
            // cb.dataset.turnoutT1Closed = t.t1Closed.toString();
            cb.tag = turnout
            cb.style.width = "16px"
            cb.style.height = "16px"
            cb.style.cursor = "pointer"
            col2.appendChild(cb)

            // const label = document.createElement("label");
            // if (turnout instanceof TurnoutDoubleElement) {
            //     label.textContent = " #" + turnout.address + " #" + (turnout as TurnoutDoubleElement).address2
            // } else {
            //     label.textContent = " #" + turnout.address
            // }

            // // label.insertBefore(cb, label.firstChild);
            // col2.appendChild(label);

            

            this.listPanel.appendChild(row)

            canvas.onclick = ((e: MouseEvent) => {
                //turnout.t1Closed = !turnout.t1Closed
                turnout.mouseDown()
                turnout.draw(ctx);
                turnout.drawAddress(ctx)
                this.updateList()
            })

            cb.onchange = (e: Event) => {
                this.updateList()

            }
        })
    }

    updateList() {
        const checkedAddresses = Array.from(
            this.listPanel.querySelectorAll<HTMLInputElement>("input[type='checkbox']:checked")
        ).map((checkbox) => checkbox);

        this.routeSwitch!.turnouts = []

        checkedAddresses.forEach((cb: ExtendedHTMLInputElement) => {
            var to = cb.tag as TurnoutElement
            // this.routeSwitch!.turnouts.push({ address: to.address, isClosed: to.t1Closed ? to.t1ClosedValue : to.t1OpenValue, device: to.device })
            // if (to instanceof TurnoutDoubleElement) {
            //     this.routeSwitch!.turnouts.push({ address: to.address2, isClosed: to.t2Closed ? to.t2ClosedValue : to.t2OpenValue, device: to.device })
            // }
            this.routeSwitch!.turnouts.push({ address: to.address, isClosed: to.t1Closed, outputMode: to.outputMode })
            if (to instanceof TurnoutDoubleElement) {
                this.routeSwitch!.turnouts.push({ address: to.address2, isClosed: to.t2Closed, outputMode: to.outputMode })
            }

        })
        console.log("Checked turnoutAddresses:", this.routeSwitch!.turnouts);
    }

}

customElements.define("route-list-element-properties", RouteListElementProperties)