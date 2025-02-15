define(["require", "exports", "../helpers/globals", "../helpers/math", "./view", "./view"], function (require, exports, globals_1, math_1, view_1, view_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TrackCornerElement = void 0;
    class TrackCornerElement extends view_1.RailView {
        constructor(uuid, x1, y1, name) {
            super(uuid, x1, y1, name);
            this.angleStep = 90;
        }
        get type() {
            return 'corner';
        }
        get canRotate() {
            return true;
        }
        get hasProperties() {
            return true;
        }
        draw(ctx) {
            var w = globals_1.Globals.AppSettings.GridSizeX / 4.0;
            var h = globals_1.Globals.AppSettings.GridSizeY / 4.0;
            ctx.save();
            ctx.lineWidth = globals_1.Globals.AppSettings.TrackWidth7;
            ctx.strokeStyle = view_2.Colors.TrackPrimaryColor;
            if (this.angle == 0) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX, this.centerY);
                ctx.lineTo(this.PositionX + 1 * w, this.centerY);
                ctx.lineTo(this.centerX, this.centerY + 1 * h);
                ctx.lineTo(this.centerX, this.PositionY + globals_1.Globals.AppSettings.GridSizeY);
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
                ctx.lineTo(this.PositionX + globals_1.Globals.AppSettings.GridSizeX, this.centerY);
                ctx.stroke();
            }
            else if (this.angle == 270) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX + globals_1.Globals.AppSettings.GridSizeX, this.centerY);
                ctx.lineTo(this.centerX + w, this.centerY);
                ctx.lineTo(this.centerX, this.centerY + h);
                ctx.lineTo(this.centerX, this.PositionY + globals_1.Globals.AppSettings.GridSizeY);
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
    exports.TrackCornerElement = TrackCornerElement;
});
