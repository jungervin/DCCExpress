"use strict";
// import { drawRectangle } from "../helpers/graphics";
// import { BitElement } from "../components/bitElement";
// import { TurnoutDoubleElement } from "../editor/turnout";
// import { Dialog, DialogResult } from "../controls/dialog";
// console.log(BitElement); 
// export class doubleTurnoutDialog extends Dialog {
//   state1Canvas: HTMLCanvasElement | undefined;
//   turnout1: TurnoutDoubleElement | undefined;
//   state2Canvas: HTMLCanvasElement | undefined;
//   turnout2: TurnoutDoubleElement | undefined;
//   state3Canvas: HTMLCanvasElement | undefined;
//   turnout3: TurnoutDoubleElement | undefined;
//   state4Canvas: HTMLCanvasElement | undefined;
//   turnout4: TurnoutDoubleElement | undefined;
//   address1closeValue: BitElement | undefined;
//   address1openValue: BitElement | undefined;
//   address2closeValue: BitElement | undefined;
//   address2openValue: BitElement | undefined;
//   address3closeValue: BitElement | undefined;
//   address3openValue: BitElement | undefined;
//   address4closeValue: BitElement | undefined;
//   address4openValue: BitElement | undefined;
//   constructor() {
//     super();
//   }
//   get identity(): string {
//     return 'doubleTurnoutDialog';
//   }
//   init() {
//     super.init('doubleTurnoutDialog', 460, 600);
//     this.btnOk = this.querySelector('#btnDialogOk');
//     this.btnCancel = this.querySelector('#btnDialogCancel');
//     this.btnOk.onclick = (e: MouseEvent) => {
//       this.close(DialogResult.ok);
//     }
//     this.btnCancel.onclick = (e: MouseEvent) => {
//       this.close(DialogResult.cancel);
//     }
//     this.state1Canvas = this.querySelector('#state1Canvas') as HTMLCanvasElement
//     this.state1Canvas.style.cursor = "pointer"
//     var ctx1 = this.state1Canvas.getContext('2d')!;
//     drawRectangle(ctx1, 0, 0, 79, 79)
//     ctx1.translate(10, 10)
//     ctx1.scale(1.5, 1.5)
//     this.turnout1 = new TurnoutDoubleElement("", 0, 0, 0, 0, "")
//     this.turnout1.showAddress = false
//     this.state1Canvas.onclick = (e:MouseEvent) => {
//       alert("OK")
//     }
//     this.state2Canvas = this.querySelector('#state2Canvas') as HTMLCanvasElement
//     this.state2Canvas.style.cursor = "pointer"
//     var ctx2 = this.state2Canvas.getContext('2d')!;
//     drawRectangle(ctx2, 0, 0, 79, 79)
//     ctx2.translate(10, 10)
//     ctx2.scale(1.5, 1.5)
//     this.turnout2 = new TurnoutDoubleElement("", 0, 0, 0, 0, "")
//     this.turnout2.showAddress = false
//     this.state3Canvas = this.querySelector('#state3Canvas') as HTMLCanvasElement
//     this.state3Canvas.style.cursor = "pointer"
//     var ctx3 = this.state3Canvas.getContext('2d')!;
//     drawRectangle(ctx3, 0, 0, 79, 79)
//     ctx3.translate(10, 10)
//     ctx3.scale(1.5, 1.5)
//     this.turnout3 = new TurnoutDoubleElement("", 0, 0, 0, 0, "")
//     this.turnout3.showAddress = false
//     this.state4Canvas = this.querySelector('#state4Canvas') as HTMLCanvasElement
//     this.state4Canvas.style.cursor = "pointer"
//     var ctx4 = this.state4Canvas.getContext('2d')!;
//     drawRectangle(ctx4, 0, 0, 79, 79)
//     ctx4.translate(10, 10)
//     ctx4.scale(1.5, 1.5)
//     this.turnout4 = new TurnoutDoubleElement("", 0, 0, 0, 0, "")
//     this.turnout4.showAddress = false
//     this.address1closeValue = this.querySelector("#address1Value1") as BitElement
//     this.address1openValue = this.querySelector("#address1Value2") as BitElement
//     this.address2closeValue = this.querySelector("#address2Value1") as BitElement
//     this.address2openValue = this.querySelector("#address2Value2") as BitElement
//     this.address3closeValue = this.querySelector("#address3Value1") as BitElement
//     this.address3openValue = this.querySelector("#address3Value2") as BitElement
//     this.address4closeValue = this.querySelector("#address4Value1") as BitElement
//     this.address4openValue = this.querySelector("#address4Value2") as BitElement
//     // this.bit3 = this.querySelector("#address3Value1") as BitElement
//     // this.bit3.setAttribute("on", 'false')
//     // this.bit4 = this.querySelector("#address4Value1") as BitElement
//     // this.bit4.setAttribute("on", 'false')
//   }
//   //private _address1: number = 0;
//   public get address1(): number {
//     return parseInt((this.querySelector('#Address1') as HTMLInputElement).value)
//   }
//   public set address1(v: number) {
//     (this.querySelector('#Address1') as HTMLInputElement).value = v.toString();
//   }
//   //private _gridSizeY: number = 0;
//   public get address2(): number {
//     return parseInt((this.querySelector('#Address2') as HTMLInputElement).value)
//   }
//   public set address2(v: number) {
//     (this.querySelector('#Address2') as HTMLInputElement).value = v.toString();
//   }
//   get template(): string {
//     return `
// <div class="dialog">    
// <h1>Properties</h1>    
// <form>
//   <div class="form-group row">
//     <label for="Address1" class="col-sm-3 col-form-label">Address 1</label>
//     <div class="col-sm-9">
//       <input type="text" class="form-control" id="Address1">
//     </div>
//   </div>
//   <div class="form-group row">
//     <label for="Address2" class="col-sm-3 col-form-label">Address 2</label>
//     <div class="col-sm-9">
//       <input type="text" class="form-control" id="Address2">
//     </div>
//   </div>
//   <div class="form-group row inline">
//     <div class="col-sm-3 d-flex align-items-center gap-2">
//       <canvas width="80" height="80" id="state1Canvas"></canvas>
//     </div>
//     <div class="col-sm-4 d-flex align-items-center gap-2">
//       <bit-element id="address1Value1"></bit-element>
//       <bit-element id="address1Value2"></bit-element>
//     </div>
//   </div>
//   <div class="form-group row inline">
//     <div class="col-sm-3 d-flex align-items-center gap-2">
//       <canvas width="80" height="80" id="state2Canvas"></canvas>
//     </div>
//     <div class="col-sm-4 d-flex align-items-center gap-2">
//       <bit-element id="address2Value1"></bit-element>
//       <bit-element id="address2Value2"></bit-element>
//     </div>
//   </div>
//   <div class="form-group row inline">
//     <div class="col-sm-3 d-flex align-items-center gap-2">
//       <canvas width="80" height="80" id="state3Canvas"></canvas>
//     </div>
//     <div class="col-sm-4 d-flex align-items-center gap-2">
//       <bit-element id="address3Value1"></bit-element>
//       <bit-element id="address3Value2"></bit-element>
//     </div>
//   </div>
//   <div class="form-group row inline">
//     <div class="col-sm-3 d-flex align-items-center gap-2">
//       <canvas width="80" height="80" id="state4Canvas"></canvas>
//     </div>
//     <div class="col-sm-4 d-flex align-items-center gap-2">
//       <bit-element id="address4Value1"></bit-element>
//       <bit-element id="address4Value2"></bit-element>
//     </div>
//   </div>
//   <div class="form-group row">
//     <div class="form-check">
//     <div class="offset-sm-3 col-sm-10">
//         <input class="form-check-input" type="checkbox" value="" id="showAddresses">
//         <label class="form-check-label" for="showAddresses">
//             Show Addresses
//         </label>
//     </div>
//     </div>
//   </div> 
//   <div class="form-group row">
//     <div class="offset-4 col-8">
//       <button id="btnDialogCancel" class="btn btn-primary">CANCEL</button>
//       <button id="btnDialogOk" class="btn btn-primary">OK</button>
//     </div>
//   </div>
// </form>        
// </div>
//         `
//   }
// }
// customElements.define('double-turnout-dialog', doubleTurnoutDialog);
