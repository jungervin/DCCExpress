define(["require", "exports", "../helpers/graphics", "../components/bitElement", "../editor/turnout", "./dialog"], function (require, exports, graphics_1, bitElement_1, turnout_1, dialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.singleTurnoutDialog = void 0;
    console.log(bitElement_1.BitElement);
    class singleTurnoutDialog extends dialog_1.Dialog {
        constructor() {
            super();
        }
        get identity() {
            return 'doubleTurnoutDialog';
        }
        init() {
            super.init('doubleTurnoutDialog', 460, 600);
            this.btnOk = this.querySelector('#btnDialogOk');
            this.btnCancel = this.querySelector('#btnDialogCancel');
            this.btnOk.onclick = (e) => {
                this.close(dialog_1.DialogResult.ok);
            };
            this.btnCancel.onclick = (e) => {
                this.close(dialog_1.DialogResult.cancel);
            };
            this.state1Canvas = this.querySelector('#state1Canvas');
            this.state1Canvas.style.cursor = "pointer";
            var ctx1 = this.state1Canvas.getContext('2d');
            (0, graphics_1.drawRectangle)(ctx1, 0, 0, 79, 79);
            ctx1.translate(10, 10);
            ctx1.scale(1.5, 1.5);
            this.turnout1 = new turnout_1.TurnoutRightElement("", 0, ctx1, 0, 0, "");
            this.turnout1.showAddress = false;
            //this.turnout1.isClosed = true
            this.state1Canvas.onclick = (e) => {
                alert("OK");
            };
            this.state2Canvas = this.querySelector('#state2Canvas');
            this.state2Canvas.style.cursor = "pointer";
            var ctx2 = this.state2Canvas.getContext('2d');
            (0, graphics_1.drawRectangle)(ctx2, 0, 0, 79, 79);
            ctx2.translate(10, 10);
            ctx2.scale(1.5, 1.5);
            this.turnout2 = new turnout_1.TurnoutRightElement("", 0, ctx2, 0, 0, "");
            this.turnout2.showAddress = false;
            this.address1closeValue = this.querySelector("#address1Value1");
            this.address1openValue = this.querySelector("#address1Value2");
        }
        //private _address1: number = 0;
        get address1() {
            return parseInt(this.querySelector('#Address1').value);
        }
        set address1(v) {
            this.querySelector('#Address1').value = v.toString();
        }
        //private _gridSizeY: number = 0;
        get address2() {
            return parseInt(this.querySelector('#Address2').value);
        }
        set address2(v) {
            this.querySelector('#Address2').value = v.toString();
        }
        get template() {
            return `
<div class="dialog">    
<h1>Properties</h1>    
<form>

  <div class="form-group row">
    <label for="Address1" class="col-sm-3 col-form-label">Address 1</label>
    <div class="col-sm-9">
      <input type="text" class="form-control" id="Address1">
    </div>
  </div>
    
  <div class="form-group row inline">
    <div class="col-sm-3 d-flex align-items-center gap-2">
      <canvas width="80" height="80" id="state1Canvas"></canvas>
    </div>
    <div class="col-sm-4 d-flex align-items-center gap-2">
      <bit-element id="address1Value1"></bit-element>
    </div>
  </div>

  <div class="form-group row inline">
    <div class="col-sm-3 d-flex align-items-center gap-2">
      <canvas width="80" height="80" id="state2Canvas"></canvas>
    </div>
    <div class="col-sm-4 d-flex align-items-center gap-2">
      <bit-element id="address1Value2"></bit-element>
    </div>
  </div>
  
  <div class="form-group row">
    <div class="offset-4 col-8">
      <button id="btnDialogCancel" class="btn btn-primary">CANCEL</button>
      <button id="btnDialogOk" class="btn btn-primary">OK</button>
    </div>
  </div>
</form>        
</div>
        `;
        }
    }
    exports.singleTurnoutDialog = singleTurnoutDialog;
    customElements.define('single-turnout-dialog', singleTurnoutDialog);
});
