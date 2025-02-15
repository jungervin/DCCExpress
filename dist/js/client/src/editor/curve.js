define(["require", "exports", "../helpers/globals", "../helpers/math", "./view", "./view"], function (require, exports, globals_1, math_1, view_1, view_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TrackCurveElement = void 0;
    class TrackCurveElement extends view_1.RailView {
        constructor(uuid, x1, y1, name) {
            super(uuid, x1, y1, name);
            this.angleStep = 45;
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
            var w = globals_1.Globals.AppSettings.GridSizeX / 2.0;
            var h = globals_1.Globals.AppSettings.GridSizeY / 2.0;
            ctx.save();
            ctx.lineWidth = globals_1.Globals.AppSettings.TrackWidth7;
            ctx.strokeStyle = view_2.Colors.TrackPrimaryColor;
            if (this.angle == 0) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX, this.PositionY);
                ctx.lineTo(this.centerX, this.centerY);
                ctx.lineTo(this.PositionX + globals_1.Globals.AppSettings.GridSizeX, this.centerY);
                ctx.stroke();
            }
            else if (this.angle == 45) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX + globals_1.Globals.AppSettings.GridSizeX / 2, this.PositionY);
                ctx.lineTo(this.centerX, this.centerY);
                ctx.lineTo(this.PositionX + globals_1.Globals.AppSettings.GridSizeX, this.PositionY + globals_1.Globals.AppSettings.GridSizeY);
                ctx.stroke();
            }
            else if (this.angle == 90) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX + globals_1.Globals.AppSettings.GridSizeX, this.PositionY);
                ctx.lineTo(this.centerX, this.centerY);
                ctx.lineTo(this.centerX, this.PositionY + globals_1.Globals.AppSettings.GridSizeY);
                ctx.stroke();
            }
            else if (this.angle == 135) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX, this.PositionY + globals_1.Globals.AppSettings.GridSizeY);
                ctx.lineTo(this.centerX, this.centerY);
                ctx.lineTo(this.PositionX + globals_1.Globals.AppSettings.GridSizeX, this.centerY);
                ctx.stroke();
            }
            else if (this.angle == 180) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX, this.centerY);
                ctx.lineTo(this.centerX, this.centerY);
                ctx.lineTo(this.PositionX + globals_1.Globals.AppSettings.GridSizeX, this.PositionY + globals_1.Globals.AppSettings.GridSizeY);
                ctx.stroke();
            }
            else if (this.angle == 225) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX, this.PositionY);
                ctx.lineTo(this.centerX, this.centerY);
                ctx.lineTo(this.centerX, this.PositionY + globals_1.Globals.AppSettings.GridSizeY);
                ctx.stroke();
            }
            else if (this.angle == 270) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX, this.PositionY + globals_1.Globals.AppSettings.GridSizeY);
                ctx.lineTo(this.centerX, this.centerY);
                ctx.lineTo(this.centerX, this.PositionY);
                ctx.stroke();
            }
            else if (this.angle == 315) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX, this.centerY);
                ctx.lineTo(this.centerX, this.centerY);
                ctx.lineTo(this.PositionX + globals_1.Globals.AppSettings.GridSizeX, this.PositionY);
                ctx.stroke();
            }
            ctx.lineWidth = globals_1.Globals.AppSettings.TrackWidth3;
            // var color = Colors.TrackLightColor
            // switch(this.state) {
            //     case RailStates.selected : color = Colors.TrackSelectedColor
            //     break;
            //     case RailStates.occupied: color = Colors.TrackDangerColor
            //     break;
            // }
            ctx.strokeStyle = this.stateColor;
            var w2 = globals_1.Globals.AppSettings.GridSizeX / 3;
            ctx.lineDashOffset = -w2 / 3; //w3 / 2.0
            ctx.setLineDash([w2, w2]);
            if (this.angle == 0) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX, this.PositionY);
                ctx.lineTo(this.centerX, this.centerY);
                ctx.lineTo(this.PositionX + globals_1.Globals.AppSettings.GridSizeX, this.centerY);
                ctx.stroke();
            }
            else if (this.angle == 45) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX + globals_1.Globals.AppSettings.GridSizeX / 2, this.PositionY);
                ctx.lineTo(this.centerX, this.centerY);
                ctx.lineTo(this.PositionX + globals_1.Globals.AppSettings.GridSizeX, this.PositionY + globals_1.Globals.AppSettings.GridSizeY);
                ctx.stroke();
            }
            else if (this.angle == 90) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX + globals_1.Globals.AppSettings.GridSizeX, this.PositionY);
                ctx.lineTo(this.centerX, this.centerY);
                ctx.lineTo(this.centerX, this.PositionY + globals_1.Globals.AppSettings.GridSizeY);
                ctx.stroke();
            }
            else if (this.angle == 135) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX, this.PositionY + globals_1.Globals.AppSettings.GridSizeY);
                ctx.lineTo(this.centerX, this.centerY);
                ctx.lineTo(this.PositionX + globals_1.Globals.AppSettings.GridSizeX, this.centerY);
                ctx.stroke();
            }
            else if (this.angle == 180) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX, this.centerY);
                ctx.lineTo(this.centerX, this.centerY);
                ctx.lineTo(this.PositionX + globals_1.Globals.AppSettings.GridSizeX, this.PositionY + globals_1.Globals.AppSettings.GridSizeY);
                ctx.stroke();
            }
            else if (this.angle == 225) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX, this.PositionY);
                ctx.lineTo(this.centerX, this.centerY);
                ctx.lineTo(this.centerX, this.PositionY + globals_1.Globals.AppSettings.GridSizeY);
                ctx.stroke();
            }
            else if (this.angle == 270) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX, this.PositionY + globals_1.Globals.AppSettings.GridSizeY);
                ctx.lineTo(this.centerX, this.centerY);
                ctx.lineTo(this.centerX, this.PositionY);
                ctx.stroke();
            }
            else if (this.angle == 315) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX, this.centerY);
                ctx.lineTo(this.centerX, this.centerY);
                ctx.lineTo(this.PositionX + globals_1.Globals.AppSettings.GridSizeX, this.PositionY);
                ctx.stroke();
            }
            ctx.restore();
            super.draw(ctx);
        }
        getNextItemXy() {
            return (0, math_1.getDirectionXy)(this.pos, this.angle + 0);
        }
        getPrevItemXy() {
            return (0, math_1.getDirectionXy)(this.pos, this.angle + 225);
        }
    }
    exports.TrackCurveElement = TrackCurveElement;
});
