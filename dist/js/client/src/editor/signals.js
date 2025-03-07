define(["require", "exports", "../helpers/math", "./track", "./view", "../../../common/src/dcc", "../helpers/graphics", "../helpers/ws"], function (require, exports, math_1, track_1, view_1, dcc_1, graphics_1, ws_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Signal4Element = exports.Signal3Element = exports.Signal2Element = exports.Signal1Element = exports.SignalStates = void 0;
    var SignalStates;
    (function (SignalStates) {
        SignalStates[SignalStates["green"] = 0] = "green";
        SignalStates[SignalStates["red"] = 1] = "red";
        SignalStates[SignalStates["yellow"] = 2] = "yellow";
        SignalStates[SignalStates["white"] = 3] = "white";
    })(SignalStates || (exports.SignalStates = SignalStates = {}));
    class SignalLight {
        constructor(value, color) {
            this.value = value;
            this.color = color;
        }
    }
    class Signal1Element extends view_1.RailView {
        // showTrackElem: boolean = true;
        constructor(uuid, address, x1, y1, name) {
            super(uuid, x1, y1, name);
            this.outputMode = dcc_1.OutputModes.accessory;
            this.addressLength = 5; // Digitools signal decoder must be 5 address
            this.max = 1;
            //device?: iCommandCenter | null;
            this.isExtendedDecoder = false;
            this.lights = [
                { value: 0, color: "lime" },
                { value: 0, color: "red" },
                { value: 0, color: "yellow" },
                { value: 0, color: "white" },
            ];
            this.lightsAll = false;
            this.showAddress = false;
            this.dispalyAsSingleLamp = false;
            this._aspect = 2;
            this._value = 0;
            this._state = SignalStates.red;
            this.address = address;
            this.angleStep = 90;
            this.trackElem = new track_1.TrackElement("", x1, y1, "");
            this.trackElem.angleStep = 90;
        }
        connectedCallback() {
        }
        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case 'lightsAll':
                    this.lightsAll = newValue == 'true';
                    break;
            }
        }
        get type() {
            return 'signal2';
        }
        get lastAddress() {
            return this.address + this.addressLength;
        }
        get aspect() {
            return this._aspect;
        }
        set aspect(v) {
            if (v < 0) {
                v = 1;
            }
            else if (v > this.lights.length) {
                v = this.lights.length;
            }
            this._aspect = v;
        }
        get value() {
            return this._value;
        }
        set value(v) {
            this._value = v;
        }
        mouseDown(e) {
            // if (this.mouseDownHandler) {
            //     this.mouseDownHandler(this)
            // }
            var i = this.lights.findIndex((l) => {
                return l.value == this.value;
            });
            i++;
            if (i >= this.max) {
                i = 0;
            }
            this.send(this.lights[i].value);
        }
        sendGreen() {
            this.send(this.valueGreen);
        }
        sendRed() {
            this.send(this.valueRed);
        }
        sendYellow() {
            this.send(this.valueYellow);
        }
        sendWhite() {
            this.send(this.valueWhite);
        }
        setValue(address, v) {
            if (address >= this.address && address <= (this.lastAddress - 1)) {
                var i = address - this.address;
                var mask = (1 << i);
                if (v) {
                    this.value = (this.value | mask) & 31;
                }
                else {
                    this.value = (this.value & (~mask)) & 31;
                }
                switch (this.value) {
                    case this.valueGreen:
                        this.state = SignalStates.green;
                        break;
                    case this.valueYellow:
                        if (this.max > 2) {
                            this.state = SignalStates.yellow;
                        }
                        else {
                            this.state = SignalStates.red;
                        }
                        break;
                    case this.valueWhite:
                        if (this.max > 3) {
                            this.state = SignalStates.white;
                        }
                        else {
                            this.state = SignalStates.red;
                        }
                        break;
                    default: this.state = SignalStates.red;
                }
                console.log("SIGNAL:", this.name, address, v, this.value);
            }
        }
        get isGreen() {
            return this.state == SignalStates.green;
        }
        get isRed() {
            return this.state == SignalStates.red;
        }
        get isYellow() {
            return this.state == SignalStates.yellow;
        }
        get isWhite() {
            return this.state == SignalStates.white;
        }
        // Api functions
        setGreen() {
            this.state = SignalStates.green;
        }
        setRed() {
            this.state = SignalStates.red;
        }
        setYellow() {
            this.state = SignalStates.yellow;
        }
        setWhite() {
            this.state = SignalStates.white;
        }
        sendRedIfNotRed() {
            if (!this.isRed) {
                this.sendRed();
            }
        }
        sendGreenIfNotGreen() {
            if (!this.isGreen) {
                this.sendGreen();
            }
        }
        sendYellowIfNotYellow() {
            if (!this.isYellow) {
                this.sendYellow();
            }
        }
        sendWhiteIfNotWhite() {
            if (!this.isWhite) {
                this.sendWhite();
            }
        }
        get canRotate() {
            return true;
        }
        get hasProperties() {
            return true;
        }
        get valueGreen() {
            return this.lights[0].value;
        }
        set valueGreen(v) {
            this.lights[0].value = v;
        }
        get valueRed() {
            return this.lights[1].value;
        }
        set valueRed(v) {
            this.lights[1].value = v;
        }
        get valueYellow() {
            return this.lights[2].value;
        }
        set valueYellow(v) {
            this.lights[2].value = v;
        }
        get valueWhite() {
            return this.lights[3].value;
        }
        set valueWhite(v) {
            this.lights[3].value = v;
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
            this.drawSignal(ctx);
            this.drawAddress(ctx);
            super.draw(ctx);
        }
        drawSignal(ctx) {
            ctx.save();
            ctx.translate(this.centerX, this.centerY);
            ctx.rotate((0, math_1.degreesToRadians)(this.angle));
            ctx.translate(-this.centerX, -this.centerY);
            var x = this.posLeft + 6;
            var y = this.centerY - (this.trackElem.visible ? 11 : 0);
            var r = this.width / 13;
            var d = 2 * r;
            var h = d + 4;
            var aa = this.aspect;
            if (this.dispalyAsSingleLamp) {
                aa = 1;
            }
            var a = aa < 2 ? 2 : aa;
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
            ctx.fillStyle = "black";
            ctx.roundRect(x - 4, y - r - 2, a * d + 5, 2 * r + 4, h);
            //ctx.roundRect(300, 5, 200, 100, [50, 0, 25, 0]);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "white";
            ctx.fillStyle = "black";
            ctx.roundRect(x - 3, y - r - 1, a * d + 3, 2 * r + 2, h);
            ctx.fillRect(x, y - r / 2, this.width - 10, r);
            ctx.fillRect(this.posRight - 4, y - r / 2 - 3, 2, r + 6);
            //ctx.fillRect(this.posLeft + this.width - 6, y - r / 2 - 4, 2, 11)
            ctx.fill();
            ctx.stroke();
            x += aa == 1 ? 3 : 1;
            if (aa == 1) {
                this.drawCircle(ctx, x, y, r, this.lights[this.state].color);
            }
            else {
                for (var i = 0; i < aa; i++) {
                    if (this.lightsAll) {
                        this.drawCircle(ctx, x + i * d, y, r, this.lights[i].color);
                    }
                    else {
                        this.drawCircle(ctx, x + i * d, y, r, i == this.state ? this.lights[this.state].color : 'gray');
                    }
                }
            }
            ctx.restore();
            if (this.trackElem.visible) {
                this.trackElem.x = this.x;
                this.trackElem.y = this.y;
                this.trackElem.angle = this.angle;
                this.trackElem.occupied = this.occupied;
                this.trackElem.isRoute = this.isRoute;
                this.trackElem.draw(ctx);
            }
            ctx.restore();
            // super.draw(ctx)
        }
        drawAddress(ctx) {
            if (this.showAddress) {
                var addr = "#" + this.address;
                (0, graphics_1.drawTextWithRoundedBackground)(ctx, this.posLeft, this.posBottom - 10, addr);
            }
        }
        get state() {
            return this._state;
        }
        set state(v) {
            this._state = v;
        }
        send(bits) {
            var addr = this.address;
            var len = this.addressLength & 5;
            for (var i = 0; i < len; i++) {
                const value = ((bits >> i) & 1) == 1;
                if (this.outputMode == dcc_1.OutputModes.accessory) {
                    var d = { address: this.address + i, value: value };
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.setBasicAccessory, data: d });
                }
                else {
                    var d = { address: this.address + i, value: value };
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.setOutput, data: d });
                }
            }
        }
    }
    exports.Signal1Element = Signal1Element;
    Signal1Element.observedAttributes = ["lightsAll"];
    class Signal2Element extends Signal1Element {
        constructor(uuid, address, x1, y1, name) {
            super(uuid, address, x1, y1, name);
            this.aspect = 2;
            this.max = 2;
        }
        get type() {
            return 'signal2';
        }
    }
    exports.Signal2Element = Signal2Element;
    class Signal3Element extends Signal1Element {
        constructor(uuid, address, x1, y1, name) {
            super(uuid, address, x1, y1, name);
            this.aspect = 3;
            this.max = 3;
        }
        get type() {
            return 'signal3';
        }
    }
    exports.Signal3Element = Signal3Element;
    class Signal4Element extends Signal1Element {
        constructor(uuid, address, x1, y1, name) {
            super(uuid, address, x1, y1, name);
            this.aspect = 4;
            this.max = 4;
        }
        get type() {
            return 'signal4';
        }
    }
    exports.Signal4Element = Signal4Element;
});
// export class Signal5Element extends Signal4Element {
//     valueBlue: number = 0;
//     get type(): string {
//         return 'signal5'
//     }
//     public draw(ctx: CanvasRenderingContext2D) {
//         var w = (settings.GridSizeX - 20) / 3.0
//         var h = (settings.GridSizeY - 10) / 3.5 + 1
//         var r = w / 2
//         var y = this.centerY - 11
//         ctx.save()
//         ctx.translate(this.centerX, this.centerY);
//         ctx.rotate(degreesToRadians(this.angle));
//         ctx.translate(-this.centerX, -this.centerY);
//         ctx.beginPath()
//         ctx.lineWidth = 1;
//         ctx.strokeStyle = "black";
//         ctx.fillStyle = "black";
//         ctx.roundRect(this.posLeft, y - r - 2, this.width - 3, 2 * r + 4, h)
//         //ctx.roundRect(300, 5, 200, 100, [50, 0, 25, 0]);
//         ctx.fill();
//         ctx.stroke()
//         ctx.beginPath()
//         ctx.lineWidth = 1;
//         ctx.strokeStyle = "white";
//         ctx.fillStyle = "black";
//         ctx.roundRect(this.posLeft + 1, y - r - 1, this.width - 5, 2 * r + 2, h)
//         ctx.fillRect(this.posLeft + this.width - 6 * r, y - r / 2, this.width - 6 * r, r)
//         //ctx.roundRect(300, 5, 200, 100, [50, 0, 25, 0]);
//         ctx.fill();
//         ctx.stroke()
//         ctx.lineWidth = 1;
//         ctx.strokeStyle = Colors.TrackPrimaryColor
//         //if (this.angle == 0)
//         {
//             this.drawCircle(ctx, this.PositionX + r * 2, y, r, this.state == SignalStates.green ? "lime" : "gray")
//             this.drawCircle(ctx, this.PositionX + r * 4, y, r, this.state == SignalStates.yellow ? "yellow" : "gray")
//             this.drawCircle(ctx, this.PositionX + r * 6, y, r, this.state == SignalStates.red ? "red" : "gray")
//             this.drawCircle(ctx, this.PositionX + r * 8, y, r, this.state == SignalStates.white ? "white" : "gray")
//             this.drawCircle(ctx, this.PositionX + r * 10 - 1, y, r - 1, this.state == SignalStates.blue ? "blue" : "gray")
//             ctx.restore()
//             this.trackElem.x = this.x;
//             this.trackElem.y = this.y
//             this.trackElem.angle = this.angle
//             this.trackElem.draw(ctx)
//             super.drawSelection(ctx)
//         }
//     }
// }
