define(["require", "exports", "../helpers/globals", "./view", "./view"], function (require, exports, globals_1, view_1, view_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TrackElement = void 0;
    class TrackElement extends view_1.RailView {
        constructor(uuid, x1, y1, name) {
            super(uuid, x1, y1, name);
            this.angleStep = 45;
        }
        get type() {
            return 'track';
        }
        get canRotate() {
            return true;
        }
        get hasProperties() {
            return true;
        }
        draw(ctx) {
            if (!this.visible) {
                return;
            }
            ctx.save();
            {
                ctx.lineWidth = globals_1.Globals.TrackWidth7;
                ctx.strokeStyle = view_2.Colors.TrackPrimaryColor;
                if (this.angle == 0 || this.angle == 180) {
                    ctx.beginPath();
                    ctx.moveTo(this.PositionX, this.centerY);
                    ctx.lineTo(this.PositionX + globals_1.Globals.GridSizeX, this.centerY);
                    ctx.stroke();
                }
                else if (this.angle == 45 || this.angle == 225) {
                    ctx.beginPath();
                    ctx.moveTo(this.PositionX, this.PositionY);
                    ctx.lineTo(this.PositionX + globals_1.Globals.GridSizeX, this.PositionY + globals_1.Globals.GridSizeY);
                    ctx.stroke();
                }
                else if (this.angle == 90 || this.angle == 270) {
                    ctx.beginPath();
                    ctx.moveTo(this.centerX, this.PositionY);
                    ctx.lineTo(this.centerX, this.PositionY + globals_1.Globals.GridSizeY);
                    ctx.stroke();
                }
                else if (this.angle == 135 || this.angle == 315) {
                    ctx.beginPath();
                    ctx.moveTo(this.PositionX + globals_1.Globals.GridSizeX, this.PositionY);
                    ctx.lineTo(this.PositionX, this.PositionY + globals_1.Globals.GridSizeY);
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
                var w4 = globals_1.Globals.GridSizeX / 4;
                if (this.angle == 0 || this.angle == 180) {
                    ctx.beginPath();
                    ctx.moveTo(this.posLeft + w4, this.centerY);
                    ctx.lineTo(this.posRight - w4, this.centerY);
                    ctx.stroke();
                }
                else if (this.angle == 45 || this.angle == 225) {
                    ctx.beginPath();
                    ctx.moveTo(this.posLeft + w4, this.posTop + w4);
                    ctx.lineTo(this.posRight - w4, this.posBottom - w4);
                    ctx.stroke();
                }
                else if (this.angle == 90 || this.angle == 270) {
                    ctx.beginPath();
                    ctx.moveTo(this.centerX, this.posTop + w4);
                    ctx.lineTo(this.centerX, this.posBottom - w4);
                    ctx.stroke();
                }
                else if (this.angle == 135 || this.angle == 315) {
                    ctx.beginPath();
                    ctx.moveTo(this.posRight - w4, this.posTop + w4);
                    ctx.lineTo(this.posLeft + w4, this.posBottom - w4);
                    ctx.stroke();
                }
            }
            ctx.restore();
            super.draw(ctx);
        }
    }
    exports.TrackElement = TrackElement;
});
