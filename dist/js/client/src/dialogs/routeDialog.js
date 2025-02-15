"use strict";
// import { IOConn } from "../helpers/iocon";
// import { ApiCommands, iBasicAccessory, iTurnout } from "../../../common/src/dcc";
// import { RouteSwitchElement } from "../editor/route";
// import { TurnoutDoubleElement, TurnoutElement, TurnoutLeftElement, TurnoutRightElement } from "../editor/turnout";
// import { Dialog, DialogResult } from "../controls/dialog";
// class RouteListElement extends HTMLElement {
//     ctx?: CanvasRenderingContext2D = undefined;
//     drawOnCanvas(arg0: (ctx: any) => void) {
//         throw new Error("Method not implemented.");
//     }
//     label: HTMLLabelElement;
//     canvas: HTMLCanvasElement;
//     checkbox: HTMLInputElement;
//     turnoutElement: TurnoutElement | undefined;
//     constructor() {
//         super()
//         const shadow = this.attachShadow({ mode: "open" });
//         const style = document.createElement("style");
//         style.textContent = `
//             :host {
//                 display: flex;
//                 align-items: center;
//                 margin: 8px 0;
//             }
//             canvas {
//                 border: 1px solid #ccc;
//                 margin-right: 8px;
//                 cursor: pointer
//             }
//             label {
//                 margin-left: 4px;
//                 font-family: Arial, sans-serif;
//                 font-size: 14px;
//             }
//         `;
//         // Canvas
//         this.canvas = document.createElement("canvas");
//         this.canvas.width = 40;
//         this.canvas.height = 40;
//         this.canvas.addEventListener("click", (e) => this.handleCanvasClick(e));
//         // Checkbox
//         this.checkbox = document.createElement("input");
//         this.checkbox.id = 'routeCheckbox';
//         this.checkbox.type = "checkbox";
//         this.label = document.createElement('label');
//         this.label.htmlFor = 'routeCheckbox';
//         this.label.textContent = 'NA';
//         this.label.style.marginLeft = '4px';
//         this.label.style.fontFamily = 'Arial, sans-serif';
//         this.label.style.fontSize = '14px';
//         shadow.appendChild(style);
//         shadow.appendChild(this.canvas);
//         shadow.appendChild(this.checkbox);
//         shadow.appendChild(this.label)
//     }
//     private handleCanvasClick(event: MouseEvent) {
//         console.log("Canvas clicked!", this);
//         this.turnoutElement!.toggle()
//         //IOConn.sendTurnoutCmd({address: thi} as iTurnout)
//     }
//     public isChecked(): boolean {
//         return this.checkbox.checked;
//     }
//     public setChecked(v: boolean) {
//         this.checkbox.checked = v
//     }
//     public setLabel(text: string) {
//         this.label.textContent = text;
//     }
//     setTurnout(t: TurnoutElement) {
//         this.setLabel(`#${t.address} ${t.name}`)
//         this.ctx = this.canvas.getContext('2d')!
//         if (t instanceof TurnoutLeftElement) {
//             this.turnoutElement = new TurnoutLeftElement("", t.address, 0, 0, t.name)
//             this.turnoutElement.angle = t.angle
//             this.turnoutElement!.draw(this.ctx)
//         }
//         else if (t instanceof TurnoutRightElement) {
//             this.turnoutElement = new TurnoutRightElement("", t.address, 0, 0, t.name)
//             this.turnoutElement.angle = t.angle
//             this.turnoutElement!.draw(this.ctx)
//         }
//         else if (t instanceof TurnoutDoubleElement) {
//             this.turnoutElement = new TurnoutDoubleElement("", t.address, t.address2, 0, 0, t.name)
//             this.turnoutElement.angle = t.angle
//             this.turnoutElement!.draw(this.ctx)
//         }
//     }
// }
// customElements.define("route-list-element", RouteListElement);
// class RouteList extends HTMLElement {
//     constructor() {
//         super();
//         // Stílus
//         const style = document.createElement("style");
//         style.textContent = `
//             :host {
//                 display: block;
//                 padding: 8px;
//             }
//         `;
//         this.attachShadow({ mode: "open" });
//         this.shadowRoot?.appendChild(style);
//     }
//     // Elemlista hozzáadása
//     public addItem(item: RouteListElement) {
//         this.shadowRoot?.appendChild(item);
//     }
//     // Az összes elem lekérése
//     public getItems(): RouteListElement[] {
//         return Array.from(this.shadowRoot?.querySelectorAll("route-list-element") || []);
//     }
// }
// customElements.define("route-list", RouteList);
// export class RouteListDialog extends Dialog {
//     routeList: RouteList;
//     route: RouteSwitchElement | undefined;
//     constructor() {
//         super()
//         this.innerHTML = this.template
//         this.routeList = new RouteList();
//     }
//     get identity(): string {
//         return 'RouteListDialog';
//     }
//     init() {
//         super.init(this.identity, 460, 600);
//         this.btnOk = this.querySelector('#btnDialogOk');
//         this.btnCancel = this.querySelector('#btnDialogCancel');
//         this.btnOk.onclick = (e: MouseEvent) => {
//             this.close(DialogResult.ok);
//             var list = this.routeList.getItems()
//             this.route!.turnouts = new Array<iTurnout>()
//             // list.forEach((item) => {
//             //     if (item.isChecked()) {
//             //         this.route!.turnouts.push({ address: item.turnoutElement!.address, value: item.turnoutElement!.T1Value1 })
//             //     }
//             // })
//         }
//         this.btnCancel.onclick = (e: MouseEvent) => {
//             this.close(DialogResult.cancel);
//         }
//         // IOConn.socket.on(ApiCommands.turnoutState, (data: iTurnout) => {
//         //     var items = this.routeList.getItems()
//         //     items.forEach((elem) => {
//         //         if (elem.isChecked() && data.address == elem.turnoutElement!.address) {
//         //             //elem.turnoutElement!.isClosed = data.isClosed;
//         //             elem.turnoutElement!.clear(this.ctx)
//         //             elem.turnoutElement!.draw(this.ctx)
//         //         }
//         //     })
//         // })
//     }
//     ctx(ctx: any) {
//         throw new Error("Method not implemented.");
//     }
//     initItems(items: TurnoutElement[], route: RouteSwitchElement) {
//         this.route = route
//         items.forEach((t: TurnoutElement) => {
//             const item = new RouteListElement();
//             item.setTurnout(t)
//             var a = this.route!.turnouts.find((to: iTurnout) => {
//                 return t.address == to.address
//             })
//             if (a) {
//                 item.setChecked(true)
//             }
//             this.routeList.addItem(item);
//         })
//         this.querySelector("#routeList")!.appendChild(this.routeList)
//     }
//     get template(): string {
//         return `
// <div class="dialog">    
// <h1>Properties</h1>    
// <form>
//   <div class="form-group row">
//     <label for="routeName" class="col-sm-3 col-form-label">Name</label>
//     <div class="col-sm-9">
//       <input type="text" class="form-control" id="routeName">
//     </div>
//   </div>
//   <div id="routeList" style="height: 400px; overflow: auto"></div>
//   <div class="form-group row">
//     <div class="offset-4 col-8">
//       <button id="btnDialogCancel" class="btn btn-primary">CANCEL</button>
//       <button id="btnDialogOk" class="btn btn-primary">OK</button>
//     </div>
//   </div>
// </form>        
// </div>
//         `
//     }
// }
// customElements.define('route-list-dialog', RouteListDialog)
