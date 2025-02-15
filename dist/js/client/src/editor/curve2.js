define(["require", "exports", "../helpers/math", "./view", "./view"], function (require, exports, math_1, view_1, view_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TrackCurveElement = void 0;
    class TrackCurveElement extends view_1.RailView {
        constructor(uuid, x1, y1, name) {
            super(uuid, x1, y1, name);
            this.angleStep = 90;
        }
        get type() {
            return 'curve';
        }
        get canRotate() {
            return true;
        }
        get hasProperties() {
            return true;
        }
        draw(ctx) {
            var w = view_1.settings.GridSizeX / 4.0;
            var h = view_1.settings.GridSizeY / 4.0;
            ctx.save();
            ctx.lineWidth = view_1.settings.TrackWidth7;
            ctx.strokeStyle = view_2.Colors.TrackPrimaryColor;
            if (this.angle == 0) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX, this.centerY);
                ctx.lineTo(this.PositionX + 1 * w, this.centerY);
                ctx.lineTo(this.centerX, this.centerY + 1 * h);
                ctx.lineTo(this.centerX, this.PositionY + view_1.settings.GridSizeY);
                ctx.stroke();
            }
            else if (this.angle == 90) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX, this.centerY);
                ctx.lineTo(this.PositionX + 1 * w, this.centerY);
                ctx.lineTo(this.centerX, this.centerY - 1 * h);
                ctx.lineTo(this.centerX, this.PositionY);
                ctx.stroke();
            }
            else if (this.angle == 180) {
                ctx.beginPath();
                ctx.moveTo(this.centerX, this.PositionY);
                ctx.lineTo(this.centerX, this.PositionY + h);
                ctx.lineTo(this.centerX + w, this.centerY);
                ctx.lineTo(this.PositionX + view_1.settings.GridSizeX, this.centerY);
                ctx.stroke();
            }
            else if (this.angle == 270) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX + view_1.settings.GridSizeX, this.centerY);
                ctx.lineTo(this.centerX + w, this.centerY);
                ctx.lineTo(this.centerX, this.centerY + h);
                ctx.lineTo(this.centerX, this.PositionY + view_1.settings.GridSizeY);
                ctx.stroke();
            }
            ctx.lineWidth = 3;
            // var color = Colors.TrackLightColor
            // switch(this.state) {
            //     case RailStates.selected : color = Colors.TrackSelectedColor
            //     break;
            //     case RailStates.occupied: color = Colors.TrackDangerColor
            //     break;
            // }
            ctx.strokeStyle = this.stateColor;
            if (this.angle == 0) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX + 1 * w, this.centerY);
                ctx.lineTo(this.centerX, this.centerY + 1 * h);
                ctx.stroke();
            }
            else if (this.angle == 90) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX + 1 * w, this.centerY);
                ctx.lineTo(this.centerX, this.centerY - 1 * h);
                ctx.stroke();
            }
            else if (this.angle == 180) {
                ctx.beginPath();
                ctx.moveTo(this.centerX, this.PositionY + h);
                ctx.lineTo(this.centerX + w, this.centerY);
                ctx.stroke();
            }
            else if (this.angle == 270) {
                ctx.beginPath();
                ctx.moveTo(this.centerX + w, this.centerY);
                ctx.lineTo(this.centerX, this.centerY + h);
                ctx.stroke();
            }
            ctx.restore();
            super.draw(ctx);
        }
        getNextItemXy() {
            return (0, math_1.getDirectionXy)(this.pos, this.angle + 90);
        }
        getPrevItemXy() {
            return (0, math_1.getDirectionXy)(this.pos, this.angle + 180);
        }
    }
    exports.TrackCurveElement = TrackCurveElement;
});
