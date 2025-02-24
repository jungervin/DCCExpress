define(["require", "exports", "../helpers/math", "./view"], function (require, exports, math_1, view_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TreeShapeElement = void 0;
    class TreeShapeElement extends view_1.View {
        constructor(uuid, x, y, name) {
            super(uuid, x, y, name);
            this.on = false;
        }
        get type() {
            return 'tree';
        }
        get canRotate() {
            return true;
        }
        draw(ctx) {
            ctx.save();
            ctx.translate(this.centerX, this.centerY);
            ctx.rotate((0, math_1.degreesToRadians)(this.angle));
            ctx.translate(-this.centerX, -this.centerY);
            var x = this.centerX;
            var y = this.centerY;
            var size = this.width / 2 - 2;
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.fillStyle = "#4F8A10";
            ctx.arc(x + 3, y + 3, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = "#5CA420";
            ctx.arc(x + 2, y + 2, size - 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = "#6EC13C";
            ctx.arc(x + 4, y + 4, 6, 0, Math.PI * 2);
            ctx.fill();
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
    exports.TreeShapeElement = TreeShapeElement;
});
