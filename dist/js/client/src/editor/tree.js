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
            var r = this.width / 2 - 8;
            var colors = ["#4F8A10", "#5CA420", "#6EC13C"];
            this.drawTree(ctx, x, y, this.width / 2 - 3, colors);
            // var colors2 = ["#5CA420", "#4F8A10", "#6EC13C"]
            // this.drawTree(ctx, x +8, y-10, r -2, colors2)
            // ctx.translate(this.centerX, this.centerY);
            // ctx.rotate(degreesToRadians(this.angle + 90));
            // ctx.translate(-this.centerX, -this.centerY);
            // this.drawTree(ctx, x +8, y-5, r, colors)
            ctx.restore();
            super.draw(ctx);
        }
        drawTree(ctx, x, y, r, colors) {
            ctx.beginPath();
            ctx.shadowBlur = 12;
            ctx.shadowColor = "gray";
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
            ctx.fillStyle = colors[0];
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillStyle = colors[1];
            ctx.arc(x + 3, y + 3, r - 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = colors[2];
            ctx.arc(x + 5, y + 5, 5, 0, Math.PI * 2);
            ctx.fill();
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
