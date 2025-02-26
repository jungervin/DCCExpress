define(["require", "exports", "../helpers/globals", "../../../common/src/dcc", "../helpers/math", "./view", "../helpers/api"], function (require, exports, globals_1, dcc_1, math_1, view_1, api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BlockElement = void 0;
    class BlockElement extends view_1.View {
        constructor(uuid, x, y, name) {
            super(uuid, x, y, name);
            this.text = 'HELLO';
            this.textColor = 'black';
            this.locoAddress = 0;
            this.angleStep = 90;
            this.w = 1;
            this.h = 1;
        }
        get type() {
            return 'block';
        }
        draw(ctx) {
            var _a;
            let bg = "#eee"; // A színe lehet más is
            let fg = "black";
            ctx.save();
            let text = "";
            if (this.loco) {
                const loco = api_1.Api.getLoco((_a = this.loco) === null || _a === void 0 ? void 0 : _a.address);
                if (loco) {
                    text = `#${loco.address} ${loco.name}`;
                    bg = "lime"; // A színe lehet más is
                    fg = "black";
                }
            }
            else {
            }
            var w = globals_1.Globals.GridSizeX / 2.0;
            var h = globals_1.Globals.GridSizeY / 6.0;
            ctx.translate(this.centerX, this.centerY);
            ctx.rotate((0, math_1.degreesToRadians)(this.angle));
            ctx.translate(-this.centerX, -this.centerY);
            ctx.fillStyle = bg; // A színe lehet más is
            ctx.strokeStyle = fg;
            ctx.fillRect(this.posLeft + 10, this.centerY - h, this.width - 20, 2 * h);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.posLeft + 10, this.centerY - h, this.width - 20, 2 * h);
            // Triangle
            ctx.fillStyle = 'black';
            ctx.beginPath();
            if (globals_1.Globals.Settings.EditorSettings.Orientation == dcc_1.DCCExDirections.forward) {
                ctx.moveTo(this.posRight - 15, this.centerY);
                ctx.lineTo(this.posRight - 20, this.centerY - 3);
                ctx.lineTo(this.posRight - 20, this.centerY + 3);
            }
            else {
                ctx.moveTo(this.posLeft + 15, this.centerY);
                ctx.lineTo(this.posLeft + 20, this.centerY - 3);
                ctx.lineTo(this.posLeft + 20, this.centerY + 3);
            }
            ctx.closePath();
            ctx.fill();
            // if (this.text) 
            {
                if (this.angle == 180) {
                    ctx.restore();
                }
                ctx.fillStyle = fg;
                ctx.font = "8px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(text, this.centerX, this.centerY + 1);
            }
            super.draw(ctx);
            ctx.restore();
        }
        get canRotate() {
            return true;
        }
        move(x, y) {
            this.x = (this.angle == 0 || this.angle == 180) ? x - 0 : x;
            this.y = (this.angle == 90 || this.angle == 270) ? y - 0 : y;
        }
        mouseInView(x, y) {
            var dx = (this.angle == 0 || this.angle == 180) ? 1 : 0;
            var dy = (this.angle == 90 || this.angle == 270) ? 1 : 0;
            var x1 = this.x - dx;
            var x2 = this.x + dx; // (this.angle == 0 || this.angle == 180) ? this.x + this.w : this.x
            var y1 = this.y - dy;
            var y2 = this.y + dy; // (this.angle == 90 || this.angle == 270) ? this.y+this.w : this.y;
            return (x >= x1 && x <= x2 && y >= y1 && y <= y2);
        }
        get posLeft() {
            return this.x * globals_1.Globals.GridSizeX - globals_1.Globals.GridSizeX;
        }
        get posRight() {
            return this.x * globals_1.Globals.GridSizeX + 2 * globals_1.Globals.GridSizeX;
        }
        get posTop() {
            return this.y * globals_1.Globals.GridSizeY;
        }
        get posBottom() {
            return this.y * globals_1.Globals.GridSizeY + this.h * globals_1.Globals.GridSizeY;
        }
        getNextItemXy() {
            const d = (0, math_1.getDirection)(this.angle);
            var p = new math_1.Point(this.x + d.x * 2, this.y + d.y * 2);
            return p;
        }
        getPrevItemXy() {
            const d = (0, math_1.getDirection)(this.angle + 180);
            var p = new math_1.Point(this.x + d.x * 2, this.y + d.y * 2);
            return p;
            // var d = getDirectionXy(this.pos, this.angle + 180);
            // return new Point(d.x * 2, d.y * 2)
        }
        setLoco(address) {
            this.loco = api_1.Api.getLoco(address);
            window.invalidate();
        }
        getLoco() {
            return this.loco;
        }
    }
    exports.BlockElement = BlockElement;
});
