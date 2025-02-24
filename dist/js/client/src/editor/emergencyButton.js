define(["require", "exports", "./view"], function (require, exports, view_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EmergencyButtonShapeElement = void 0;
    class EmergencyButtonShapeElement extends view_1.View {
        constructor(uuid, x, y, name) {
            super(uuid, x, y, name);
            this.on = false;
        }
        get type() {
            return 'emergencybutton';
        }
        draw(ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = "black";
            ctx.fillStyle = "yellow";
            ctx.lineWidth = 1;
            ctx.roundRect(this.PositionX, this.PositionY, this.width, this.height, [5]);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            if (!this.on) {
                ctx.shadowBlur = 5;
                ctx.shadowColor = "gray";
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
            }
            ctx.strokeStyle = "black";
            ctx.fillStyle = this.on ? "red" : "#fd5c63";
            ctx.arc(this.centerX, this.centerY, this.width / 2 - 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.stroke();
            ctx.beginPath();
            ctx.fillStyle = "white";
            //ctx.fillStyle = this.on ? "black" : "white";
            ctx.font = this.on ? "7px Arial" : "8px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("STOP", this.centerX, this.centerY + 1);
            ctx.stroke();
            ctx.restore();
            super.draw(ctx);
        }
        toggle() {
            this.on = !this.on;
        }
        mouseDown(e) {
            this.toggle();
            // const data: iSetBasicAccessory = {address: this.address, value: this.on ? this.valueOn : this.valueOff} as iSetBasicAccessory
            // wsClient.send({type: ApiCommands.setBasicAccessory, data: data } as iData)
            // if (this.mouseDownHandler) {
            //     this.mouseDownHandler(this)
            // }
        }
    }
    exports.EmergencyButtonShapeElement = EmergencyButtonShapeElement;
});
