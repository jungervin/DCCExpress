define(["require", "exports", "../helpers/globals", "../helpers/math", "./view", "./view"], function (require, exports, globals_1, math_1, view_1, view_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TrackEndElement = void 0;
    class TrackEndElement extends view_1.RailView {
        constructor(uuid, x1, y1, name) {
            super(uuid, x1, y1, name);
            this.angleStep = 45;
        }
        get type() {
            return 'trackEnd';
        }
        get canRotate() {
            return true;
        }
        get hasProperties() {
            return true;
        }
        draw(ctx) {
            ctx.save();
            var h = globals_1.Globals.GridSizeY / 4.0;
            {
                ctx.translate(this.centerX, this.centerY);
                ctx.rotate((0, math_1.degreesToRadians)(this.angle));
                ctx.translate(-this.centerX, -this.centerY);
                ctx.lineWidth = globals_1.Globals.TrackWidth7;
                ctx.strokeStyle = view_2.Colors.TrackPrimaryColor;
                if (this.angle % 90 == 0) {
                    ctx.beginPath();
                    ctx.moveTo(this.PositionX, this.centerY);
                    ctx.lineTo(this.centerX, this.centerY);
                    ctx.moveTo(this.centerX, this.centerY - h);
                    ctx.lineTo(this.centerX, this.centerY + h);
                    ctx.stroke();
                }
                else {
                    var r = globals_1.Globals.GridSizeX / 2;
                    var l = Math.sqrt(2 * r * r);
                    ctx.beginPath();
                    ctx.moveTo(this.centerX - l, this.centerY);
                    ctx.lineTo(this.centerX, this.centerY);
                    ctx.moveTo(this.centerX, this.centerY - h);
                    ctx.lineTo(this.centerX, this.centerY + h);
                    ctx.stroke();
                }
                ctx.lineWidth = globals_1.Globals.TrackWidth3;
                // var color = Colors.TrackLightColor
                // switch(this.state) {
                //     case RailStates.selected : color = Colors.TrackSelectedColor
                //     break;
                //     case RailStates.occupied: color = Colors.TrackDangerColor
                //     break;
                // }
                ctx.strokeStyle = this.stateColor;
                if (this.angle % 90 == 0) {
                    ctx.beginPath();
                    ctx.moveTo(this.PositionX, this.centerY);
                    ctx.lineTo(this.centerX - globals_1.Globals.TrackWidth7 / 2, this.centerY);
                    ctx.stroke();
                }
                else {
                    var r = globals_1.Globals.GridSizeX / 2;
                    var l = Math.sqrt(2 * r * r);
                    ctx.beginPath();
                    ctx.moveTo(this.centerX - l, this.centerY);
                    ctx.lineTo(this.centerX - globals_1.Globals.TrackWidth7 / 2, this.centerY);
                    ctx.stroke();
                }
                // drawPolarLine(ctx, this.centerX, this.centerY, settings.GridSizeX / 4, this.angle , color, settings.TrackWidth3)
                // // ctx.beginPath();
                // // ctx.moveTo(this.PositionX, this.centerY);
                // // ctx.lineTo(this.centerX, this.centerY);
                // // // this.ctx.moveTo(this.centerX, this.centerY - h);
                // // // this.ctx.lineTo(this.centerX, this.centerY + h);
                // // ctx.stroke();
                // if (this.angle % 90 == 0) {
                //     ctx.beginPath();
                //     ctx.moveTo(this.PositionX, this.centerY);
                //     ctx.lineTo(this.centerX, this.centerY);
                //     // this.ctx.moveTo(this.centerX, this.centerY - h);
                //     // this.ctx.lineTo(this.centerX, this.centerY + h);
                //     ctx.stroke();
                // } else {
                //     var r = settings.GridSizeX / 2
                //     var l = Math.sqrt(2 * r * r) / 2
                //     ctx.beginPath();
                //     ctx.moveTo(this.centerX - l, this.centerY);
                //     ctx.lineTo(this.centerX, this.centerY);
                //     // this.ctx.moveTo(this.centerX, this.centerY - h);
                //     // this.ctx.lineTo(this.centerX, this.centerY + h);
                //     ctx.stroke();
                // }
            }
            ctx.restore();
            super.draw(ctx);
        }
    }
    exports.TrackEndElement = TrackEndElement;
});
