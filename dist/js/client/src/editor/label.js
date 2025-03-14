define(["require", "exports", "../helpers/globals", "./view"], function (require, exports, globals_1, view_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Label2Element = void 0;
    class Label2Element extends view_1.View {
        constructor(uuid, x, y, name) {
            super(uuid, x, y, name);
            this.text = 'LABEL';
            this.fgColor = 'black';
            this.bgColor = "red";
            this.fontSize = "10px";
            this.fontStyle = "normal";
            this.fontName = "Arial";
            this.textAlign = "left";
            this.textBaseline = "top";
            this.locoAddress = 0;
            this._valign = "center";
            this.angleStep = 0;
            this.w = 2;
            this.h = 1;
            this.cursor = "default";
        }
        get type() {
            return 'label2';
        }
        draw(ctx) {
            ctx.save();
            ctx.fillStyle = this.fgColor;
            // ctx.font = this.fontStyle + " " + this.fontSize + " " + this.fontName;
            ctx.font = "10px Arial";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            var y = this.posTop - 1;
            var x = this.posLeft + 1;
            if (this.valign == "center") {
                y = this.centerY - 4;
            }
            else if (this.valign == "bottom") {
                y = this.posBottom - 10;
            }
            ctx.fillText(this.text, this.posLeft, y);
            // drawTextWithRoundedBackground(ctx, x, y,this.text,this.fgColor,"red",2, 4)
            ctx.restore();
            super.draw(ctx);
        }
        get canRotate() {
            return false;
        }
        mouseInView(x, y) {
            var x1 = this.x;
            var x2 = this.x + 1;
            var y1 = this.y;
            var y2 = this.y;
            return (x >= x1 && x <= x2 && y >= y1 && y <= y2);
        }
        get posRight() {
            return this.x * globals_1.Globals.GridSizeX + 2 * globals_1.Globals.GridSizeX;
        }
        get valign() {
            return this._valign;
        }
        set valign(v) {
            this._valign = v;
        }
    }
    exports.Label2Element = Label2Element;
});
