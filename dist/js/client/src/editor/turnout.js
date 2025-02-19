define(["require", "exports", "../helpers/graphics", "../helpers/math", "./view", "./view", "../helpers/ws", "../helpers/globals"], function (require, exports, graphics_1, math_1, view_1, view_2, ws_1, globals_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TurnoutDoubleElement = exports.TurnoutLeftElement = exports.TurnoutRightElement = exports.TurnoutElement = void 0;
    class TurnoutElement extends view_1.RailView {
        constructor(uuid, address, x1, y1, name) {
            super(uuid, x1, y1, name);
            this.t1Closed = true;
            this.t1ClosedValue = true;
            this.t1OpenValue = false;
            this.address = 10;
            this.showAddress = false;
            this.angleStep = -45;
            this.address = address;
            // var decoder = new Decoder(address)
            // this.decoders.push(decoder)
        }
        get canRotate() {
            return true;
        }
        get hasProperties() {
            return true;
        }
        mouseDown(e) {
            this.toggle();
            if (this.mouseDownHandler) {
                this.mouseDownHandler(this);
            }
        }
        drawAddress(ctx) {
            if (this.showAddress) {
                (0, graphics_1.drawTextWithRoundedBackground)(ctx, this.posLeft, this.posBottom - 10, "#" + this.address.toString());
            }
        }
        toggle() {
            this.t1Closed = !this.t1Closed;
            this.send();
        }
        send() {
            ws_1.wsClient.sendTurnoutCmd({ address: this.address, isClosed: this.t1Closed ? this.t1ClosedValue : this.t1OpenValue });
            console.log("sendTurnoutCmd", this.address, this.t1Closed, this.t1ClosedValue, this.t1OpenValue);
        }
        hasAddress(obj) {
            const turnout = obj;
            return this.address == turnout.address;
        }
        compare(obj) {
            const turnout = obj;
            return (this.address == turnout.address && this.t1Closed == turnout.t1Closed);
        }
        toString() {
            return "#" + this.address;
        }
    }
    exports.TurnoutElement = TurnoutElement;
    class TurnoutRightElement extends TurnoutElement {
        constructor(uuid, address, x1, y1, name) {
            super(uuid, address, x1, y1, name);
        }
        get type() {
            return 'turnoutRight';
        }
        draw(ctx) {
            ctx.save();
            this.drawTurnout(ctx, this.t1Closed);
            this.drawAddress(ctx);
            ctx.restore();
            super.draw(ctx);
        }
        drawTurnout(ctx, t1Closed) {
            ctx.beginPath();
            ctx.strokeStyle = view_2.Colors.TrackPrimaryColor;
            ctx.lineWidth = globals_1.Globals.TrackWidth7;
            if (this.angle == 0) {
                ctx.moveTo(this.posLeft, this.centerY);
                ctx.lineTo(this.posRight, this.centerY);
                ctx.moveTo(this.centerX, this.centerY);
                ctx.lineTo(this.posRight, this.posBottom);
            }
            else if (this.angle == 45) {
                ctx.moveTo(this.posLeft, this.posTop);
                ctx.lineTo(this.posRight, this.posBottom);
                ctx.moveTo(this.centerX, this.centerY);
                ctx.lineTo(this.centerX, this.posBottom);
            }
            else if (this.angle == 90) {
                ctx.moveTo(this.centerX, this.posTop);
                ctx.lineTo(this.centerX, this.posBottom);
                ctx.moveTo(this.centerX, this.centerY);
                ctx.lineTo(this.posLeft, this.posBottom);
            }
            else if (this.angle == 135) {
                ctx.moveTo(this.posRight, this.posTop);
                ctx.lineTo(this.posLeft, this.posBottom);
                ctx.moveTo(this.centerX, this.centerY);
                ctx.lineTo(this.posLeft, this.centerY);
            }
            else if (this.angle == 180) {
                ctx.moveTo(this.posLeft, this.centerY);
                ctx.lineTo(this.posRight, this.centerY);
                ctx.moveTo(this.centerX, this.centerY);
                ctx.lineTo(this.posLeft, this.posTop);
            }
            else if (this.angle == 225) {
                ctx.moveTo(this.posLeft, this.posTop);
                ctx.lineTo(this.posRight, this.posBottom);
                ctx.moveTo(this.centerX, this.centerY);
                ctx.lineTo(this.centerX, this.posTop);
            }
            else if (this.angle == 270) {
                ctx.moveTo(this.centerX, this.posTop);
                ctx.lineTo(this.centerX, this.posBottom);
                ctx.moveTo(this.centerX, this.centerY);
                ctx.lineTo(this.posRight, this.posTop);
            }
            else if (this.angle == 315) {
                ctx.moveTo(this.posRight, this.posTop);
                ctx.lineTo(this.posLeft, this.posBottom);
                ctx.moveTo(this.centerX, this.centerY);
                ctx.lineTo(this.posRight, this.centerY);
            }
            ctx.stroke();
            // var color = Colors.TrackLightColor
            // switch (this.state) {
            //     case RailStates.selected: color = Colors.TrackSelectedColor
            //         break;
            //     case RailStates.occupied: color = Colors.TrackDangerColor
            //         break;
            // }
            // CLOSED
            if (t1Closed) {
                ctx.beginPath();
                ctx.strokeStyle = this.stateColor;
                ctx.lineWidth = globals_1.Globals.TrackWidth3;
                var dx = this.width / 5;
                if (this.angle == 0) {
                    ctx.moveTo(this.posLeft + dx, this.centerY);
                    ctx.lineTo(this.posRight - dx, this.centerY);
                }
                else if (this.angle == 45) {
                    ctx.moveTo(this.posLeft + dx, this.posTop + dx);
                    ctx.lineTo(this.posRight - dx, this.posBottom - dx);
                }
                else if (this.angle == 90) {
                    ctx.moveTo(this.centerX, this.posTop + dx);
                    ctx.lineTo(this.centerX, this.posBottom - dx);
                }
                else if (this.angle == 135) {
                    ctx.moveTo(this.posRight - dx, this.posTop + dx);
                    ctx.lineTo(this.posLeft + dx, this.posBottom - dx);
                }
                else if (this.angle == 180) {
                    ctx.moveTo(this.posLeft + dx, this.centerY);
                    ctx.lineTo(this.posRight - dx, this.centerY);
                }
                else if (this.angle == 225) {
                    ctx.moveTo(this.posLeft + dx, this.posTop + dx);
                    ctx.lineTo(this.posRight - dx, this.posBottom - dx);
                }
                else if (this.angle == 270) {
                    ctx.moveTo(this.centerX, this.posTop + dx);
                    ctx.lineTo(this.centerX, this.posBottom - dx);
                }
                else if (this.angle == 315) {
                    ctx.moveTo(this.posRight - dx, this.posTop + dx);
                    ctx.lineTo(this.posLeft + dx, this.posBottom - dx);
                }
                ctx.stroke();
            }
            else {
                ctx.beginPath();
                ctx.strokeStyle = this.stateColor;
                ctx.lineWidth = globals_1.Globals.TrackWidth3;
                var dx = this.width / 5;
                var dx2 = this.width / 5;
                if (this.angle == 0) {
                    ctx.moveTo(this.posLeft + dx, this.centerY);
                    ctx.lineTo(this.centerX, this.centerY);
                    ctx.lineTo(this.posRight - dx2, this.posBottom - dx2);
                }
                else if (this.angle == 45) {
                    ctx.moveTo(this.posLeft + dx, this.posTop + dx);
                    ctx.lineTo(this.centerX, this.centerY);
                    ctx.lineTo(this.centerX, this.posBottom - dx2);
                }
                else if (this.angle == 90) {
                    ctx.moveTo(this.centerX, this.posTop + dx);
                    ctx.lineTo(this.centerX, this.centerY);
                    ctx.lineTo(this.posLeft + dx2, this.posBottom - dx2);
                }
                else if (this.angle == 135) {
                    ctx.moveTo(this.posRight - dx2, this.posTop + dx2);
                    ctx.lineTo(this.centerX, this.centerY);
                    ctx.lineTo(this.posLeft + dx, this.centerY);
                }
                else if (this.angle == 180) {
                    ctx.moveTo(this.posLeft + dx2, this.posTop + dx2);
                    ctx.lineTo(this.centerX, this.centerY);
                    ctx.lineTo(this.posRight - dx, this.centerY);
                }
                else if (this.angle == 225) {
                    ctx.moveTo(this.centerX, this.posTop + dx);
                    ctx.lineTo(this.centerX, this.centerY);
                    ctx.lineTo(this.posRight - dx2, this.posBottom - dx2);
                }
                else if (this.angle == 270) {
                    ctx.moveTo(this.posRight - dx2, this.posTop + dx2);
                    ctx.lineTo(this.centerX, this.centerY);
                    ctx.lineTo(this.centerX, this.posBottom - dx);
                }
                else if (this.angle == 315) {
                    ctx.moveTo(this.posRight - dx, this.centerY);
                    ctx.lineTo(this.centerX, this.centerY);
                    ctx.lineTo(this.posLeft + dx2, this.posBottom - dx2);
                }
                ctx.stroke();
            }
        }
        getNextItemXy() {
            if (this.t1Closed) {
                return (0, math_1.getDirectionXy)(this.pos, this.angle);
            }
            return (0, math_1.getDirectionXy)(this.pos, this.angle + 45);
        }
        getPrevItemXy() {
            return (0, math_1.getDirectionXy)(this.pos, this.angle + 180);
        }
        getNeigbordsXy() {
            var points = [];
            points.push((0, math_1.getDirectionXy)(this.pos, this.angle));
            points.push((0, math_1.getDirectionXy)(this.pos, this.angle + 45));
            points.push((0, math_1.getDirectionXy)(this.pos, this.angle + 180));
            return points;
        }
    }
    exports.TurnoutRightElement = TurnoutRightElement;
    class TurnoutLeftElement extends TurnoutRightElement {
        constructor(uuid, address, x1, y1, name) {
            super(uuid, address, x1, y1, name);
            //this.angleStep = 45
        }
        get type() {
            return 'turnoutLeft';
        }
        drawTurnout(ctx, t1Closed) {
            ctx.save();
            ctx.translate(this.centerX, this.centerY);
            ctx.scale(1, -1);
            ctx.translate(-this.centerX, -this.centerY);
            super.drawTurnout(ctx, t1Closed);
            ctx.restore();
        }
        getNextItemXy() {
            if (this.t1Closed) {
                return (0, math_1.getDirectionXy)(this.pos, -this.angle);
            }
            return (0, math_1.getDirectionXy)(this.pos, -this.angle - 45);
        }
        getPrevItemXy() {
            return (0, math_1.getDirectionXy)(this.pos, -this.angle + 180);
        }
        getNeigbordsXy() {
            var points = [];
            points.push((0, math_1.getDirectionXy)(this.pos, -this.angle));
            points.push((0, math_1.getDirectionXy)(this.pos, -this.angle - 45));
            points.push((0, math_1.getDirectionXy)(this.pos, -this.angle + 180));
            return points;
        }
    }
    exports.TurnoutLeftElement = TurnoutLeftElement;
    class TurnoutDoubleElement extends TurnoutElement {
        constructor(uuid, address1, address2, x1, y1, name) {
            super(uuid, address1, x1, y1, name);
            this.stateArray = [];
            this.address2 = 11;
            this.t2Closed = true;
            //t2Closed = true
            this.t2ClosedValue = true;
            this.t2OpenValue = false;
            this.address2 = address2;
            //this.decoders.push(new Decoder(address2))
            this.angleStep = 45;
            this.stateArray.push({ t1Closed: true, t2Closed: false });
            this.stateArray.push({ t1Closed: true, t2Closed: true });
            this.stateArray.push({ t1Closed: false, t2Closed: true });
            this.stateArray.push({ t1Closed: false, t2Closed: false });
        }
        get type() {
            return 'turnoutDouble';
        }
        getClickIndex() {
            return this.stateArray.findIndex((v) => {
                return v.t1Closed == this.t1Closed && v.t2Closed == this.t2Closed;
            });
        }
        mouseDown(e) {
            var i = this.getClickIndex() + 1;
            if (i >= this.stateArray.length) {
                i = 0;
            }
            this.t1Closed = this.stateArray[i].t1Closed;
            this.t2Closed = this.stateArray[i].t2Closed;
            this.send();
            if (this.mouseDownHandler) {
                this.mouseDownHandler(this);
            }
        }
        send() {
            ws_1.wsClient.sendTurnoutCmd({ address: this.address, isClosed: this.t1Closed ? this.t1ClosedValue : this.t1OpenValue });
            setTimeout((() => {
                ws_1.wsClient.sendTurnoutCmd({ address: this.address2, isClosed: this.t2Closed ? this.t2ClosedValue : this.t2OpenValue });
            }).bind(this), 500);
        }
        draw(ctx) {
            ctx.save();
            this.drawTurnout(ctx, this.t1Closed, this.t2Closed);
            this.drawAddress(ctx);
            ctx.restore();
            super.draw(ctx);
        }
        drawTurnout(ctx, t1Closed, t2Closed) {
            {
                ctx.beginPath();
                ctx.strokeStyle = view_2.Colors.TrackPrimaryColor;
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
                // var color = Colors.TrackLightColor
                // switch (this.state) {
                //     case RailStates.selected: color = Colors.TrackSelectedColor
                //         break;
                //     case RailStates.occupied: color = Colors.TrackDangerColor
                //         break;
                // }
                ctx.beginPath();
                ctx.strokeStyle = this.stateColor;
                ctx.lineWidth = globals_1.Globals.TrackWidth3;
                var dx = this.width / 5;
                // t1 Color
                //ctx.strokeStyle = 'lime'
                if (this.angle == 0) {
                    if (t1Closed) {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posLeft + dx, this.posTop + dx);
                    }
                    else {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posLeft + dx, this.centerY);
                    }
                }
                else if (this.angle == 45) {
                    if (t1Closed) {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.centerX, this.posTop + dx);
                    }
                    else {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posLeft + dx, this.posTop + dx);
                    }
                }
                else if (this.angle == 90) {
                    if (t1Closed) {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posRight - dx, this.posTop + dx);
                    }
                    else {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.centerX, this.posTop + dx);
                    }
                }
                else if (this.angle == 135) {
                    if (t1Closed) {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posRight - dx, this.centerY);
                    }
                    else {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posRight - dx, this.posTop + dx);
                    }
                }
                else if (this.angle == 180) {
                    if (t1Closed) {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posRight - dx, this.posBottom - dx);
                    }
                    else {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posRight - dx, this.centerY);
                    }
                }
                else if (this.angle == 225) {
                    if (t1Closed) {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.centerX, this.posBottom - dx);
                    }
                    else {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posRight - dx, this.posBottom - dx);
                    }
                }
                else if (this.angle == 270) {
                    if (t1Closed) {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posLeft + dx, this.posBottom - dx);
                    }
                    else {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.centerX, this.posBottom - dx);
                    }
                }
                else if (this.angle == 315) {
                    if (t1Closed) {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posLeft + dx, this.centerY);
                    }
                    else {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posLeft + dx, this.posBottom - dx);
                    }
                }
                ctx.stroke();
                // t2 Color
                ctx.beginPath();
                //ctx.strokeStyle = 'cornflowerblue'
                if (this.angle == 0) {
                    if (t2Closed) {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posRight - dx, this.posBottom - dx);
                    }
                    else {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posRight - dx, this.centerY);
                    }
                }
                if (this.angle == 45) {
                    if (t2Closed) {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.centerX, this.posBottom - dx);
                    }
                    else {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posRight - dx, this.posBottom - dx);
                    }
                }
                if (this.angle == 90) {
                    if (t2Closed) {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posLeft + dx, this.posBottom - dx);
                    }
                    else {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.centerX, this.posBottom - dx);
                    }
                }
                if (this.angle == 135) {
                    if (t2Closed) {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posLeft + dx, this.centerY);
                    }
                    else {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posLeft + dx, this.posBottom - dx);
                    }
                }
                if (this.angle == 180) {
                    if (t2Closed) {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posLeft + dx, this.posTop + dx);
                    }
                    else {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posLeft + dx, this.centerY);
                    }
                }
                if (this.angle == 225) {
                    if (t2Closed) {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.centerX, this.posTop + dx);
                    }
                    else {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posLeft + dx, this.posTop + dx);
                    }
                }
                else if (this.angle == 270) {
                    if (t2Closed) {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posRight - dx, this.posTop + dx);
                    }
                    else {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.centerX, this.posTop + dx);
                    }
                }
                else if (this.angle == 315) {
                    if (t2Closed) {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posRight - dx, this.centerY);
                    }
                    else {
                        ctx.moveTo(this.centerX, this.centerY);
                        ctx.lineTo(this.posRight - dx, this.posTop + dx);
                    }
                }
                ctx.stroke();
            }
        }
        drawAddress(ctx) {
            if (this.showAddress) {
                (0, graphics_1.drawTextWithRoundedBackground)(ctx, this.posLeft, this.posBottom - 10, "#" + this.address.toString() + " #" + this.address2.toString());
                // drawTextWithRoundedBackground(ctx, this.posLeft, this.posTop, this.angle.toString())
            }
        }
        // Lime
        getNextItemXy() {
            if (this.t1Closed) {
                return (0, math_1.getDirectionXy)(this.pos, this.angle + 225);
            }
            return (0, math_1.getDirectionXy)(this.pos, this.angle + 180);
        }
        // Blue
        getPrevItemXy() {
            if (this.t2Closed) {
                return (0, math_1.getDirectionXy)(this.pos, this.angle + 45);
            }
            return (0, math_1.getDirectionXy)(this.pos, this.angle + 0);
        }
        // hasAddress(address: number) {
        //     return this.address == address || this.address2 == address
        // }
        hasAddress(obj) {
            const turnout = obj;
            return this.address == turnout.address || this.address2 == turnout.address;
        }
        compare(obj) {
            const turnout = obj;
            return (this.address == turnout.address && this.address2 == turnout.address2 &&
                this.t1Closed == turnout.t1Closed && this.t2Closed == turnout.t2Closed);
        }
        getNeigbordsXy() {
            var points = [];
            points.push((0, math_1.getDirectionXy)(this.pos, this.angle + 225));
            points.push((0, math_1.getDirectionXy)(this.pos, this.angle + 180));
            points.push((0, math_1.getDirectionXy)(this.pos, this.angle + 45));
            points.push((0, math_1.getDirectionXy)(this.pos, this.angle + 0));
            return points;
        }
        toString() {
            return "#" + this.address + " #" + this.address2;
        }
    }
    exports.TurnoutDoubleElement = TurnoutDoubleElement;
});
