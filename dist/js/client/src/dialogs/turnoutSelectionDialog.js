define(["require", "exports", "../helpers/graphics", "../components/bitElement", "../editor/turnout", "./dialog"], function (require, exports, graphics_1, bitElement_1, turnout_1, dialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.turnoutSelectionDialog = void 0;
    console.log(bitElement_1.BitElement);
    class turnoutSelectionDialog extends dialog_1.Dialog {
        constructor() {
            super();
        }
        get identity() {
            return 'turnoutSelectionDialog';
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
        }
        initTurnouts(items) {
            var turnoutList = this.querySelector("#turnoutList");
            items.forEach(t => {
                var row = document.createElement("div");
                row.className = "form-group row inline";
                var col = document.createElement("div");
                col.className = "col-sm-9";
                row.appendChild(col);
                var canvas = document.createElement("canvas");
                canvas.width = 100;
                canvas.height = 100;
                var ctx = canvas.getContext('2d');
                col.appendChild(canvas);
                if (t instanceof turnout_1.TurnoutLeftElement) {
                    const to = new turnout_1.TurnoutLeftElement("", t.address, ctx, 0, 0, "");
                    to.angle = t.angle;
                    (0, graphics_1.drawRectangle)(ctx, 0, 0, 79, 79);
                    ctx.translate(10, 10);
                    ctx.scale(1.5, 1.5);
                    to.draw();
                }
                else if (t instanceof turnout_1.TurnoutRightElement) {
                    const to = new turnout_1.TurnoutRightElement("", t.address, ctx, 0, 0, "");
                    to.angle = t.angle;
                    (0, graphics_1.drawRectangle)(ctx, 0, 0, 79, 79);
                    ctx.translate(10, 10);
                    ctx.scale(1.5, 1.5);
                    to.draw();
                }
                else if (t instanceof turnout_1.TurnoutDoubleElement) {
                    const to = new turnout_1.TurnoutDoubleElement("", t.address, t.address2, ctx, 0, 0, "");
                    to.angle = t.angle;
                    (0, graphics_1.drawRectangle)(ctx, 0, 0, 79, 79);
                    ctx.translate(10, 10);
                    ctx.scale(1.5, 1.5);
                    to.draw();
                }
                var cbdiv = document.createElement("div");
                cbdiv.className = "form-check";
                col.appendChild(cbdiv);
                var cb = document.createElement("input");
                cb.id = t.name;
                cb.className = "form-check-input";
                cb.type = "checkbox";
                cbdiv.appendChild(cb);
                var label = document.createElement("label");
                label.className = "form-check-label";
                label.innerHTML = ' ' + t.name;
                label.htmlFor = t.name;
                cbdiv.appendChild(label);
                turnoutList.appendChild(row);
            });
        }
        get template() {
            return `
<div class="dialog">    
<h1>Properties</h1>    
<form>

  <div class="form-group row">
    <label for="routeName" class="col-sm-3 col-form-label">Name</label>
    <div class="col-sm-9">
      <input type="text" class="form-control" id="routeName">
    </div>
  </div>
    
  <div id="turnoutList" style="height: 400px; overflow: auto"></div>

  
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
    exports.turnoutSelectionDialog = turnoutSelectionDialog;
    customElements.define('turnout-selection-dialog', turnoutSelectionDialog);
});
