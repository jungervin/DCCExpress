define(["require", "exports", "../helpers/math", "./track", "./view", "./view", "../helpers/iocon", "../../../common/src/dcc"], function (require, exports, math_1, track_1, view_1, view_2, iocon_1, dcc_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Signal2Element = exports.SignalStates = void 0;
    var SignalStates;
    (function (SignalStates) {
        SignalStates[SignalStates["green"] = 0] = "green";
        SignalStates[SignalStates["red"] = 1] = "red";
        SignalStates[SignalStates["yellow"] = 2] = "yellow";
        SignalStates[SignalStates["white"] = 3] = "white";
    })(SignalStates || (exports.SignalStates = SignalStates = {}));
    class Signal2Element extends view_1.RailView {
        constructor(uuid, address, x1, y1, name) {
            super(uuid, x1, y1, name);
            this.valueRed = 0;
            this.valueGreen = 0;
            this.valueYellow = 0;
            this.valueWhite = 0;
            this.addressLength = 5;
            this._state = SignalStates.red;
            this.address = address;
            this.angleStep = 90;
            this.trackElem = new track_1.TrackElement("", x1, y1, "");
            this.trackElem.angleStep = 90;
            //this.trackElem.angle = 90
        }
        get type() {
            return 'signal5';
        }
        get canRotate() {
            return true;
        }
        get hasProperties() {
            return true;
        }
        drawCircle(ctx, x, y, r, color) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
        draw(ctx) {
            var w = (view_1.settings.GridSizeX - 20) / 3.0;
            var h = (view_1.settings.GridSizeY - 10) / 3.5 + 1;
            var r = w / 2;
            var y = this.centerY - 11;
            ctx.save();
            ctx.translate(this.centerX, this.centerY);
            ctx.rotate((0, math_1.degreesToRadians)(this.angle));
            ctx.translate(-this.centerX, -this.centerY);
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
            ctx.fillStyle = "black";
            ctx.roundRect(this.posLeft, y - r - 2, this.width - 2 * r, 2 * r + 4, h);
            //ctx.roundRect(300, 5, 200, 100, [50, 0, 25, 0]);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "white";
            ctx.fillStyle = "black";
            ctx.roundRect(this.posLeft + 1, y - r - 1, this.width - 2 * r - 2, 2 * r + 2, h);
            ctx.fillRect(this.posLeft + this.width - 10, y - r / 2, 10, r);
            //ctx.roundRect(300, 5, 200, 100, [50, 0, 25, 0]);
            ctx.fill();
            ctx.stroke();
            ctx.lineWidth = 1;
            ctx.strokeStyle = view_2.Colors.TrackPrimaryColor;
            //if (this.angle == 0)
            {
                this.drawCircle(ctx, this.PositionX + r * 2, y, r, this.state == SignalStates.green ? "lime" : "gray");
                this.drawCircle(ctx, this.PositionX + r * 4, y, r, this.state == SignalStates.yellow ? "yellow" : "gray");
                this.drawCircle(ctx, this.PositionX + r * 6, y, r, this.state == SignalStates.red ? "red" : "gray");
                this.drawCircle(ctx, this.PositionX + r * 8, y, r, this.state == SignalStates.white ? "white" : "gray");
                //            this.drawCircle(ctx,this.PositionX + r + w * 4, y , r-1, this.state == SignalStates.white ? "lime" : "gray")
                ctx.restore();
                this.trackElem.draw(ctx);
                super.draw(ctx);
            }
            // this.ctx.lineWidth = 3;
            // this.ctx.setLineDash(LineDash);
            // this.ctx.strokeStyle = Colors.TrackSucessColor
            ctx.restore();
            //super.draw()
        }
        get state() {
            return this._state;
        }
        set state(v) {
            this._state = v;
        }
        rotateRight() {
            super.rotateRight();
            this.trackElem.rotateRight();
        }
        rotateLeft() {
            this.rotateLeft();
            this.trackElem.rotateLeft();
        }
        send(bits) {
            var addr = this.address;
            var len = this.addressLength & 5;
            for (var i = 0; i <= len; i++) {
                var d = { address: this.address + i, value: ((bits >> i) & 1) == 1 };
                iocon_1.IOConn.socket.emit(dcc_1.ApiCommands.setDecoder, d);
            }
        }
    }
    exports.Signal2Element = Signal2Element;
});
