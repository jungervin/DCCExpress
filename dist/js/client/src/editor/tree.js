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
            const colors = ["#4F8A10", "#5CA420", "#6EC13C"];
            var x = this.centerX;
            var y = this.centerY;
            var size = this.width / 2 - 2;
            ctx.beginPath();
            ctx.fillStyle = colors[0];
            ctx.arc(x + 3, y + 3, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = colors[1];
            ctx.arc(x + 2, y + 2, size - 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = colors[2];
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
