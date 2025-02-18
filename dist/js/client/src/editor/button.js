define(["require", "exports", "../helpers/ws", "./view", "../../../common/src/dcc"], function (require, exports, ws_1, view_1, dcc_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ButtonShapeElement = void 0;
    class ButtonShapeElement extends view_1.View {
        constructor(uuid, address, x, y, name) {
            super(uuid, x, y, name);
            this.on = false;
            this.textOn = "ON";
            this.textOff = "OFF";
            this.address = address;
        }
        get type() {
            return 'button';
        }
        draw(ctx) {
            const p = 5; // padding
            ctx.save();
            // ctx.strokeRect(this.posLeft + p, this.posTop + p, this.width - 2 * p, this.height - 2 * p)
            // ctx.restore()
            ctx.fillStyle = this.on ? "lime" : "gray";
            // Gomb megrajzolása (kör alakú)
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, 35 / 2, 0, Math.PI * 2);
            ctx.fill();
            // Keret
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = "white";
            ctx.fillStyle = this.on ? "black" : "white";
            ctx.font = "10px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.on ? this.textOn : this.textOff, this.centerX, this.centerY + 1);
            ctx.restore();
            super.draw(ctx);
        }
        toggle() {
            this.on = !this.on;
        }
        mouseDown(e) {
            this.toggle();
            const data = { address: this.address, value: this.on };
            ws_1.wsClient.send({ type: dcc_1.ApiCommands.setBasicAccessory, data: data });
            if (this.mouseDownHandler) {
                this.mouseDownHandler(this);
            }
        }
    }
    exports.ButtonShapeElement = ButtonShapeElement;
});
