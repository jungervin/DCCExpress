define(["require", "exports", "../helpers/ws", "../helpers/globals", "./view", "../../../common/src/dcc", "../helpers/graphics"], function (require, exports, ws_1, globals_1, view_1, dcc_1, graphics_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ButtonShapeElement = exports.AccessoryAddressElement = void 0;
    class AccessoryAddressElement extends view_1.View {
        constructor(uuid, address, x, y, name) {
            super(uuid, x, y, name);
            this.on = false;
            this.textOn = "ON";
            this.textOff = "OFF";
            this.valueOn = true;
            this.valueOff = false;
            this.colorOn = "lime";
            this.showAddress = false;
            this.address = address;
        }
        get type() {
            return 'accessoryDecoder';
        }
        toggle() {
            this.on = !this.on;
        }
        mouseDown(e) {
            this.toggle();
            const data = { address: this.address, value: this.on ? this.valueOn : this.valueOff };
            ws_1.wsClient.send({ type: dcc_1.ApiCommands.setBasicAccessory, data: data });
            if (this.mouseDownHandler) {
                this.mouseDownHandler(this);
            }
        }
        draw(ctx) {
            if (this.showAddress) {
                (0, graphics_1.drawTextWithRoundedBackground)(ctx, this.posLeft, this.posBottom - 10, "#" + this.address.toString());
                // drawTextWithRoundedBackground(ctx, this.posLeft, this.posTop, this.angle.toString())
            }
            super.draw(ctx);
        }
    }
    exports.AccessoryAddressElement = AccessoryAddressElement;
    class ButtonShapeElement extends AccessoryAddressElement {
        constructor(uuid, address, x, y, name) {
            super(uuid, address, x, y, name);
            this.mode = dcc_1.OutputModes.accessory;
        }
        get type() {
            return 'button';
        }
        draw(ctx) {
            var w = globals_1.Globals.GridSizeX - 10;
            ctx.fillStyle = this.on ? this.colorOn : "gray";
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.roundRect(this.centerX - w / 2, this.centerY - w / 2, w, w, 5);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "white";
            ctx.fillStyle = this.on ? "black" : "white";
            ctx.font = "10px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.on ? this.textOn : this.textOff, this.centerX, this.centerY + 1);
            super.draw(ctx);
        }
        draw2(ctx) {
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
            this.send();
            if (this.mouseDownHandler) {
                this.mouseDownHandler(this);
            }
        }
        send() {
            if (globals_1.Globals.CommandCenterSetting.type == dcc_1.CommandCenterTypes.Z21) {
                const data = { address: this.address, value: this.on ? this.valueOn : this.valueOff };
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.setBasicAccessory, data: data });
            }
            else {
                if (this.mode == dcc_1.OutputModes.output) {
                    const data = { address: this.address, value: this.on ? this.valueOn : this.valueOff };
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.setOutput, data: data });
                }
                else {
                    const data = { address: this.address, value: this.on ? this.valueOn : this.valueOff };
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.setBasicAccessory, data: data });
                }
            }
        }
    }
    exports.ButtonShapeElement = ButtonShapeElement;
});
