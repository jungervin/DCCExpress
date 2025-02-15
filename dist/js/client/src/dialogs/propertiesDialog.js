"use strict";
// import { Dialog, DialogResult } from "./dialog";
// export class PropertiesDialog extends Dialog {
//     constructor() {
//         super();
//     }
//     get identity(): string {
//         return 'propertiesDialog';
//     }
//     init() {
//         super.init('Properties2', 800, 600);
//         this.btnOk = this.querySelector('#btnDialogOk');
//         this.btnCancel = this.querySelector('#btnDialogCancel');
//         this.btnOk.onclick = (e: MouseEvent) => {
//             this.close(DialogResult.ok);
//         }
//         this.btnCancel.onclick = (e: MouseEvent) => {
//             this.close(DialogResult.cancel);
//         }
//     }
//     private _gridSizeX: number = 0;
//     public get gridSizeX(): number {
//         return parseInt((this.querySelector('#GridSizeX') as HTMLInputElement).value)
//     }
//     public set gridSizeX(v: number) {
//         (this.querySelector('#GridSizeX') as HTMLInputElement).value = v.toString();
//     }
//     private _gridSizeY: number = 0;
//     public get gridSizeY(): number {
//         return parseInt((this.querySelector('#GridSizeY') as HTMLInputElement).value)
//     }
//     public set gridSizeY(v: number) {
//         (this.querySelector('#GridSizeY') as HTMLInputElement).value = v.toString();
//     }
//     private _showAddresses: boolean = false;
//     public get showAddresses(): boolean {
//         return (this.querySelector('#showAddresses') as HTMLInputElement).checked
//     }
//     public set showAddresses(v: boolean) {
//         (this.querySelector('#showAddresses') as HTMLInputElement).checked = v
//     }
//     get template(): string {
//         return `
// <div class="dialog">    
// <h1>Properties</h1>    
// <form>
//   <div class="form-group row">
//     <label for="GridSizeX" class="col-sm-2 col-form-label">Grid Width</label>
//     <div class="col-sm-10">
//       <input type="text" class="form-control" id="GridSizeX">
//     </div>
//   </div>
//   <div class="form-group row">
//     <label for="GridSizeY" class="col-sm-2 col-form-label">Grid Height</label>
//     <div class="col-sm-10">
//       <input type="text" class="form-control" id="GridSizeY">
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
//     }
// }
// customElements.define('custom-properties-dialog', PropertiesDialog);
