define(["require", "exports", "../helpers/globals", "../helpers/api", "./view"], function (require, exports, globals_1, api_1, view_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EmergencyButtonShapeElement = void 0;
    class EmergencyButtonShapeElement extends view_1.View {
        constructor(uuid, x, y, name) {
            super(uuid, x, y, name);
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
            if (!globals_1.Globals.power.emergencyStop) {
                ctx.shadowBlur = 5;
                ctx.shadowColor = "black";
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
            }
            ctx.strokeStyle = "black";
            ctx.fillStyle = globals_1.Globals.power.emergencyStop ? "red" : "#ff7f8f";
            ctx.arc(this.centerX, this.centerY, this.width / 2 - 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.stroke();
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.font = globals_1.Globals.power.emergencyStop ? "7px Arial" : "8px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("STOP", this.centerX, this.centerY + 1);
            ctx.stroke();
            ctx.restore();
            super.draw(ctx);
        }
        mouseDown(e) {
            api_1.Api.emergencyStop();
        }
    }
    exports.EmergencyButtonShapeElement = EmergencyButtonShapeElement;
});
