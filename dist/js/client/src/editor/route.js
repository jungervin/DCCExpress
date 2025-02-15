define(["require", "exports", "./view", "./../helpers/graphics", "./turnout", "../helpers/ws"], function (require, exports, view_1, graphics_1, turnout_1, ws_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RouteSwitchElement = void 0;
    class RouteSwitchElement extends view_1.RailView {
        constructor(uuid, x, y, name) {
            super(uuid, x, y, name);
            this.turnouts = new Array();
            this.active = false;
            this.angleStep = 0;
            this.overlayElement = document.getElementById('dialog-overlay');
        }
        get type() {
            return 'routeSwitch';
        }
        draw(ctx) {
            var fg = this.active ? "yellow" : "white";
            var bg = this.active ? "lime" : "#404040";
            const r = Math.min(this.width, this.height) / 2 - 2;
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
            ctx.fillStyle = bg;
            ctx.arc(this.centerX, this.centerY, r - 1, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            (0, graphics_1.drawPolarLine)(ctx, this.centerX, this.centerY, r - 6, 225, "white", 5);
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = fg;
            var p1 = (0, graphics_1.getPolarXy)(this.centerX, this.centerY, r - 6, 315);
            var p2 = (0, graphics_1.getPolarXy)(this.centerX, this.centerY, r - 6, 90);
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(this.centerX, this.centerY);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            // drawPolarLine(this.ctx, this.centerX, this.centerY, r - 6, 315, "orange", 5)
            // drawPolarLine(this.ctx, this.centerX, this.centerY, r - 6, 90, "orange", 5)
            ctx.restore();
            super.draw(ctx);
        }
        // mouseDown(e: MouseEvent): void {
        //     //this.setRoute(0)
        // }
        setRoute(index, turnouts) {
            if (index < this.turnouts.length) {
                this.overlayElement.classList.remove('hidden');
                var to = this.turnouts[index];
                var turnout = turnouts.find((t) => {
                    if (Object.getPrototypeOf(t) == turnout_1.TurnoutDoubleElement.prototype) {
                        return to.address == t.address || to.address == t.address2;
                    }
                    return to.address == t.address;
                });
                if (turnout) {
                    if (Object.getPrototypeOf(turnout) == turnout_1.TurnoutDoubleElement.prototype) {
                        var td = turnout;
                        if (to.address == td.address) {
                            ws_1.wsClient.sendTurnoutCmd({ address: td.address, isClosed: to.isClosed ? td.t1ClosedValue : td.t1OpenValue });
                        }
                        else {
                            ws_1.wsClient.sendTurnoutCmd({ address: td.address2, isClosed: to.isClosed ? td.t2ClosedValue : td.t2OpenValue });
                        }
                    }
                    else {
                        ws_1.wsClient.sendTurnoutCmd({ address: to.address, isClosed: to.isClosed ? turnout.t1ClosedValue : turnout.t1OpenValue });
                    }
                }
                index++;
                if (index < this.turnouts.length) {
                    setTimeout(this.setRoute.bind(this), 500, index, turnouts);
                }
                else {
                    this.overlayElement.classList.add('hidden');
                }
            }
        }
        isActive(turnouts) {
            if (this.turnouts.length > 0) {
                var test = true;
                this.turnouts.forEach((t) => {
                    var to = turnouts.find((tt) => { return tt.hasAddress(t); });
                    if (to) {
                        if (Object.getPrototypeOf(to) == turnout_1.TurnoutDoubleElement.prototype) {
                            const dt = to;
                            if (dt.address == t.address) {
                                test && (test = dt.t1Closed == t.isClosed);
                            }
                            else if (dt.address2 == t.address) {
                                test && (test = dt.t2Closed == t.isClosed);
                            }
                        }
                        else {
                            test && (test = to.t1Closed == t.isClosed);
                        }
                        if (!test) {
                            return false;
                        }
                    }
                    else {
                        // Ha már nincs ilyen váltó, akkor vége is
                        // Kellene egy figyelmeztetés is
                        return false;
                    }
                });
                return test;
            }
            return false;
        }
    }
    exports.RouteSwitchElement = RouteSwitchElement;
});
