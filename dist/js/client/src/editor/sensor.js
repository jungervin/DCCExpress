define(["require", "exports", "../helpers/globals", "./button"], function (require, exports, globals_1, button_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SensorShapeElement = exports.SensorTypes = void 0;
    var SensorTypes;
    (function (SensorTypes) {
        SensorTypes[SensorTypes["circle"] = 0] = "circle";
        SensorTypes[SensorTypes["rect"] = 1] = "rect";
    })(SensorTypes || (exports.SensorTypes = SensorTypes = {}));
    class SensorShapeElement extends button_1.AccessoryAddressElement {
        constructor(uuid, address, x1, y1, name) {
            super(uuid, address, x1, y1, name);
            this.kind = SensorTypes.rect;
            this.cursor = "default";
        }
        get type() {
            return 'sensor';
        }
        draw2(ctx) {
            var w = globals_1.Globals.GridSizeX - 10;
            ctx.fillStyle = this.on ? this.colorOn : "gray";
            ctx.strokeStyle = "black";
            if (this.kind == SensorTypes.rect) {
                ctx.beginPath();
                ctx.roundRect(this.centerX - w / 2, this.centerY - w / 2, w, w, 5);
                ctx.fill();
                ctx.stroke();
            }
            ctx.fillStyle = "white";
            ctx.fillStyle = this.on ? "black" : "white";
            ctx.font = "10px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.on ? this.textOn : this.textOff, this.centerX, this.centerY + 1);
            super.draw(ctx);
        }
        draw(ctx) {
            const p = 5; // padding
            ctx.save();
            // ctx.strokeRect(this.posLeft + p, this.posTop + p, this.width - 2 * p, this.height - 2 * p)
            // ctx.restore()
            ctx.fillStyle = this.on ? "lime" : "gray";
            // Gomb megrajzolása (kör alakú)
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, 25 / 2, 0, Math.PI * 2);
            ctx.fill();
            // Keret
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = "white";
            ctx.fillStyle = this.on ? "black" : "white";
            ctx.font = "8px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.on ? this.textOn : this.textOff, this.centerX, this.centerY + 1);
            ctx.restore();
            super.draw(ctx);
        }
        mouseDown(e) {
        }
    }
    exports.SensorShapeElement = SensorShapeElement;
});
