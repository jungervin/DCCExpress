define(["require", "exports", "../helpers/globals", "./view"], function (require, exports, globals_1, view_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TrackCrossingShapeElement = void 0;
    class TrackCrossingShapeElement extends view_1.RailView {
        constructor(uuid, x1, y1, name) {
            super(uuid, x1, y1, name);
            this.angleStep = 45;
            this.cursor = "default";
        }
        get type() {
            return 'trackcrossing';
        }
        get canRotate() {
            return true;
        }
        get hasProperties() {
            return true;
        }
        draw(ctx) {
            ctx.save();
            this.drawTurnout(ctx, true, true);
            ctx.restore();
            super.draw(ctx);
        }
        drawTurnout(ctx, t1Closed, t2Closed) {
            {
                ctx.beginPath();
                ctx.strokeStyle = view_1.Colors.TrackPrimaryColor;
                ctx.lineWidth = globals_1.Globals.TrackWidth7;
                if (this.angle == 0 || this.angle == 180) {
                    ctx.moveTo(this.posLeft, this.centerY);
                    ctx.lineTo(this.posRight, this.centerY);
                    ctx.moveTo(this.posLeft, this.posTop);
                    ctx.lineTo(this.posRight, this.posBottom);
                }
                else if (this.angle == 45 || this.angle == 225) {
                    ctx.moveTo(this.centerX, this.posTop);
                    ctx.lineTo(this.centerX, this.posBottom);
                    ctx.moveTo(this.posLeft, this.posTop);
                    ctx.lineTo(this.posRight, this.posBottom);
                }
                else if (this.angle == 90 || this.angle == 270) {
                    ctx.moveTo(this.centerX, this.posTop);
                    ctx.lineTo(this.centerX, this.posBottom);
                    ctx.moveTo(this.posRight, this.posTop);
                    ctx.lineTo(this.posLeft, this.posBottom);
                }
                else if (this.angle == 135 || this.angle == 315) {
                    ctx.moveTo(this.posLeft, this.centerY);
                    ctx.lineTo(this.posRight, this.centerY);
                    ctx.moveTo(this.posRight, this.posTop);
                    ctx.lineTo(this.posLeft, this.posBottom);
                }
                ctx.stroke();
            }
            {
                ctx.beginPath();
                ctx.strokeStyle = this.stateColor;
                ctx.lineWidth = globals_1.Globals.TrackWidth3;
                var dx = this.width / 5;
                // ctx.beginPath();
                // ctx.strokeStyle = Colors.TrackPrimaryColor
                // ctx.lineWidth = Globals.TrackWidth7;
                if (this.angle == 0 || this.angle == 180) {
                    ctx.moveTo(this.posLeft + dx, this.centerY);
                    ctx.lineTo(this.posRight - dx, this.centerY);
                    ctx.moveTo(this.posLeft + dx, this.posTop + dx);
                    ctx.lineTo(this.posRight - dx, this.posBottom - dx);
                }
                else if (this.angle == 45 || this.angle == 225) {
                    ctx.moveTo(this.centerX, this.posTop + dx);
                    ctx.lineTo(this.centerX, this.posBottom - dx);
                    ctx.moveTo(this.posLeft + dx, this.posTop + dx);
                    ctx.lineTo(this.posRight - dx, this.posBottom - dx);
                }
                else if (this.angle == 90 || this.angle == 270) {
                    ctx.moveTo(this.centerX, this.posTop + dx);
                    ctx.lineTo(this.centerX, this.posBottom - dx);
                    ctx.moveTo(this.posRight - dx, this.posTop + dx);
                    ctx.lineTo(this.posLeft + dx, this.posBottom - dx);
                }
                else if (this.angle == 135 || this.angle == 315) {
                    ctx.moveTo(this.posLeft + dx, this.centerY);
                    ctx.lineTo(this.posRight - dx, this.centerY);
                    ctx.moveTo(this.posRight - dx, this.posTop + dx);
                    ctx.lineTo(this.posLeft + dx, this.posBottom - dx);
                }
                ctx.stroke();
            }
        }
    }
    exports.TrackCrossingShapeElement = TrackCrossingShapeElement;
});
