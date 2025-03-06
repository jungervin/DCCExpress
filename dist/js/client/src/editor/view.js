define(["require", "exports", "../../../common/src/dcc", "../helpers/math", "../helpers/globals"], function (require, exports, dcc_1, math_1, globals_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RailView = exports.RailStates = exports.View = exports.propertiesChangedEvent = exports.Colors = void 0;
    class Colors {
    }
    exports.Colors = Colors;
    Colors.TrackPrimaryColor = "black";
    Colors.TrackLightColor = "#888";
    Colors.TrackSucessColor = "lime";
    Colors.TrackWarningColor = "yellow";
    Colors.TrackDangerColor = "red";
    Colors.TrackSelectedColor = "yellow";
    Colors.turnoutLocked = "red";
    Colors.turnoutUnLocked = "white";
    // export interface iDecoder {
    //     getAddress: () => string,
    //     on: boolean
    // }
    exports.propertiesChangedEvent = new Event("propertiesChanged");
    // export interface ExHTMLElement extends HTMLElement {
    //    get visible(): boolean;
    //     set visible(v: boolean);
    // }
    // export function setSettings(setting: any) {
    //     if (setting) {
    //         AppSettings = setting
    //     }
    // }
    class View {
        constructor(uuid, x, y, name) {
            this.tag = undefined;
            this.visible = true;
            this.isVisited = false;
            this.UUID = "";
            this.name = "";
            this.isSelected = false;
            this.cursor = "pointer";
            this.angleStep = 90; // Ha nulla akkor nem lehet forgatni!
            this._angle = 0;
            //this.type = type
            this.UUID = uuid || (0, dcc_1.getUUID)();
            //this.ctx = ctx;
            this.x = x;
            this.y = y;
            this.w = 1;
            this.h = 1;
            this.name = name;
        }
        draw(ctx) {
            this.drawSelection(ctx);
        }
        drawXy(x, y, ctx) {
            const xx = this.x;
            const yy = this.y;
            this.x = x;
            this.y = y;
            this.draw(ctx);
            this.x = xx;
            this.y = yy;
        }
        drawSelection(ctx) {
            if (this.isSelected) {
                ctx.save();
                ctx.translate(this.centerX, this.centerY);
                // ctx.rotate(degreesToRadians(this.angle));
                ctx.rotate((0, math_1.degreesToRadians)(0));
                ctx.translate(-this.centerX, -this.centerY);
                var w2 = globals_1.Globals.GridSizeX / 2.0;
                var h2 = globals_1.Globals.GridSizeY / 2.0;
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = "red";
                if (this.bgColor) {
                    ctx.fillStyle = this.bgColor;
                    ctx.fillRect(this.posLeft, this.posTop, this.width, this.height);
                }
                ctx.strokeRect(this.posLeft, this.posTop, this.width, this.height);
                // ctx.stroke();
                ctx.restore();
                // Draw neighbors
                if (false) {
                    //ctx.restore()
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = "lime";
                    var n = this.getNextItemXy();
                    ctx.rect(n.x * globals_1.Globals.GridSizeX, n.y * globals_1.Globals.GridSizeY, globals_1.Globals.GridSizeX, globals_1.Globals.GridSizeY);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = "blue";
                    var p = this.getPrevItemXy();
                    ctx.rect(p.x * globals_1.Globals.GridSizeX, p.y * globals_1.Globals.GridSizeY, globals_1.Globals.GridSizeX, globals_1.Globals.GridSizeY);
                    ctx.stroke();
                }
            }
        }
        // drawLine(x1: number, y1: number, x2: number, y2: number, width: number = 7, color: string = 'black', dash: [] = []) {
        //     this.ctx.beginPath();
        //     this.ctx.setLineDash(dash);
        //     this.ctx.strokeStyle = color
        //     this.ctx.moveTo(this.x * settings.GridSizeX, this.y * settings.GridSizeY + settings.GridSizeY / 2.0);
        //     this.ctx.lineTo(this.x * settings.GridSizeX + settings.GridSizeX, this.y * settings.GridSizeY + settings.GridSizeY / 2.0);
        //     this.ctx.strokeStyle = this.name;
        //     this.ctx.lineWidth = 7;
        //     this.ctx.stroke();
        //     this.ctx.setLineDash([]);
        // }
        get PositionX() {
            return this.x * globals_1.Globals.GridSizeX;
        }
        get PositionY() {
            return this.y * globals_1.Globals.GridSizeY;
        }
        get posLeft() {
            return this.x * globals_1.Globals.GridSizeX;
        }
        get posRight() {
            return this.x * globals_1.Globals.GridSizeX + this.w * globals_1.Globals.GridSizeX;
        }
        get posTop() {
            return this.y * globals_1.Globals.GridSizeY;
        }
        get posBottom() {
            return this.y * globals_1.Globals.GridSizeY + this.h * globals_1.Globals.GridSizeY;
        }
        get centerX() {
            return this.x * globals_1.Globals.GridSizeX + this.w * globals_1.Globals.GridSizeX / 2;
        }
        get centerY() {
            return this.y * globals_1.Globals.GridSizeY + this.h * globals_1.Globals.GridSizeY / 2;
        }
        get width() {
            return this.posRight - this.posLeft;
        }
        get height() {
            return this.posBottom - this.posTop;
        }
        mouseInView(x, y) {
            return (x == this.x && y == this.y);
        }
        mouseDown(e) {
            if (this.mouseDownHandler) {
                this.mouseDownHandler(this);
            }
        }
        mouseUp(e) {
            if (this.mouseUpHandler) {
                this.mouseUpHandler(this);
            }
        }
        rotateRight() {
            this.angle += this.angleStep;
            if (this.angle >= 360) {
                this.angle = 0;
            }
            else if (this.angle < 0) {
                this.angle = 360 - Math.abs(this.angleStep);
            }
            // console.log(this.angle)
        }
        rotateLeft() {
            this.angle -= this.angleStep;
            if (this.angle >= 360) {
                this.angle = 0;
            }
            else if (this.angle < 0) {
                this.angle = 360 - Math.abs(this.angleStep);
            }
        }
        get angle() {
            return this._angle;
        }
        set angle(v) {
            //this._angle = Math.abs(v % 360);
            this._angle = (v % 360);
        }
        get canRotate() {
            return false;
        }
        get hasProperties() {
            return false;
        }
        clear(ctx) {
            ctx.fillRect(this.posLeft, this.posTop, this.width, this.height);
        }
        // getImageData() {
        //     return this.ctx.getImageData(this.posLeft, this.posBottom, this.width, this.height);
        // }
        move(x, y) {
            this.x = x;
            this.y = y;
        }
        get pos() {
            var p = new math_1.Point(this.x, this.y);
            return p;
        }
        getNextItemXy() {
            return (0, math_1.getDirectionXy)(this.pos, this.angle);
        }
        getPrevItemXy() {
            return (0, math_1.getDirectionXy)(this.pos, this.angle + 180);
        }
        getNeigbordsXy() {
            var points = [];
            points.push(this.getNextItemXy());
            points.push(this.getPrevItemXy());
            return points;
        }
        toString() {
            return this.name;
        }
    }
    exports.View = View;
    var RailStates;
    (function (RailStates) {
        RailStates[RailStates["disabled"] = 1] = "disabled";
        RailStates[RailStates["free"] = 2] = "free";
        RailStates[RailStates["selected"] = 4] = "selected";
        RailStates[RailStates["occupied"] = 8] = "occupied";
    })(RailStates || (exports.RailStates = RailStates = {}));
    class RailView extends View {
        constructor(uuid, x, y, name) {
            super(uuid, x, y, name);
            this.rbusAddress = 0;
            this._occupied = false;
            this._isRoute = false;
        }
        get stateColor() {
            if (this.isRoute) {
                if (this.occupied) {
                    return "lime";
                }
                return Colors.TrackSelectedColor;
            }
            if (this.occupied) {
                return Colors.TrackDangerColor;
            }
            return Colors.TrackLightColor;
        }
        get occupied() {
            return this._occupied;
        }
        set occupied(v) {
            this._occupied = v;
        }
        get isRoute() {
            return this._isRoute;
        }
        set isRoute(v) {
            this._isRoute = v;
        }
    }
    exports.RailView = RailView;
});
