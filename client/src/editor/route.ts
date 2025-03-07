import { RailView } from "./view";
import { drawPolarLine, getPolarXy } from './../helpers/graphics'
import { TurnoutDoubleElement, TurnoutElement } from "./turnout";
import {iSetTurnout } from "../../../common/src/dcc";
import { wsClient } from "../helpers/ws";

export class RouteSwitchElement extends RailView {
    turnouts: Array<iSetTurnout> = new Array<iSetTurnout>()
    active: boolean = false;
    overlayElement: HTMLElement;

    constructor(uuid: string, x: number, y: number, name: string) {
        super(uuid, x, y, name)
        this.angleStep = 0
        this.overlayElement = document.getElementById('dialog-overlay') as HTMLElement
    }

    get type(): string {
        return 'routeSwitch'
    }

    draw(ctx: CanvasRenderingContext2D) {
        var fg = this.active ? "yellow" : "white"
        var bg = this.active ? "lime" : "#404040"
        const r = Math.min(this.width, this.height) / 2 - 2
        ctx.save()

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.fillStyle = bg;
        ctx.arc(this.centerX, this.centerY, r - 1, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();


        drawPolarLine(ctx, this.centerX, this.centerY, r - 6, 225, "white", 5)

        ctx.beginPath()
        ctx.lineWidth = 5
        ctx.strokeStyle = fg
        var p1 = getPolarXy(this.centerX, this.centerY, r - 6, 315)
        var p2 = getPolarXy(this.centerX, this.centerY, r - 6, 90)
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(this.centerX, this.centerY)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
        // drawPolarLine(this.ctx, this.centerX, this.centerY, r - 6, 315, "orange", 5)
        // drawPolarLine(this.ctx, this.centerX, this.centerY, r - 6, 90, "orange", 5)

        ctx.restore()
        super.draw(ctx)
    }

    // mouseDown(e: MouseEvent): void {
    //     //this.setRoute(0)

    // }

    setRoute(index: number, turnouts: TurnoutElement[]) {
        if (index < this.turnouts.length) {
            this.overlayElement.classList.remove('hidden')
            var to = this.turnouts[index]

            var turnout = turnouts.find((t) => {
                if (Object.getPrototypeOf(t) == TurnoutDoubleElement.prototype) {
                    return to.address == t.address || to.address == (t as TurnoutDoubleElement).address2
                }
                return to.address == t.address
            })

            if (turnout) {
                if (Object.getPrototypeOf(turnout) == TurnoutDoubleElement.prototype) {
                    var td = turnout as TurnoutDoubleElement
                    if (to.address == td.address) {
                        wsClient.sendTurnoutCmd({ address: td.address, isClosed: to.isClosed ? td.t1ClosedValue : td.t1OpenValue, outputMode: td.outputMode } as iSetTurnout)
                    } else {
                        wsClient.sendTurnoutCmd({ address: td.address2, isClosed: to.isClosed ? td.t2ClosedValue : td.t2OpenValue, outputMode: td.outputMode } as iSetTurnout)
                    }
                } else {
                    wsClient.sendTurnoutCmd({ address: to.address, isClosed: to.isClosed ? turnout!.t1ClosedValue : turnout!.t1OpenValue, outputMode: turnout.outputMode } as iSetTurnout)
                }
            }
            index++
            if (index < this.turnouts.length) {
                setTimeout(this.setRoute.bind(this), 500, index, turnouts)
            } else {
                this.overlayElement.classList.add('hidden')
            }
        }
    }

    isActive(turnouts: TurnoutElement[]) {
        if (this.turnouts.length > 0) {
            var test = true
            this.turnouts.forEach((t) => {
                var to = turnouts.find((tt) => { return tt.hasAddress(t) });
                if (to) {
                    if (Object.getPrototypeOf(to) == TurnoutDoubleElement.prototype) {
                        const dt = to as TurnoutDoubleElement
                        if (dt.address == t.address) {
                            test &&= dt.t1Closed == t.isClosed
                        } else if(dt.address2 == t.address) {
                            test &&= dt.t2Closed == t.isClosed
                        }
                    } else {
                        test &&= to.t1Closed == t.isClosed
                    }

                    if(!test) {
                        return false;
                    }

                } else {
                    // Ha már nincs ilyen váltó, akkor vége is
                    // Kellene egy figyelmeztetés is
                    return false;
                }

            })
            return test
        }
        return false
    }
}
