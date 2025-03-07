import { drawTextWithRoundedBackground } from "../helpers/graphics";
import { degreesToRadians, getDirectionXy, Point } from "../helpers/math";
import { RailView } from "./view";
import { Colors } from "./view";
import { iSetTurnout, OutputModes } from "../../../common/src/dcc";
import { wsClient } from "../helpers/ws";
import { Globals } from "../helpers/globals";


export abstract class TurnoutElement extends RailView {
    t1Closed: boolean = true
    t1ClosedValue: boolean = true;
    t1OpenValue: boolean = false;
    address: number = 10
    showAddress: boolean = false
    outputMode: OutputModes = OutputModes.dccExAccessory;

    constructor(uuid: string, address: number, x1: number, y1: number, name: string) {
        super(uuid, x1, y1, name)
        this.angleStep = -45
        this.address = address

        // var decoder = new Decoder(address)
        // this.decoders.push(decoder)
    }

    public get canRotate(): boolean {
        return true
    }
    public get hasProperties(): boolean {
        return true
    }

    mouseDown(e: MouseEvent): void {
        this.toggle()
        if (this.mouseDownHandler) {
            this.mouseDownHandler(this)
        }
    }
    drawAddress(ctx: CanvasRenderingContext2D) {
        if (this.showAddress) {
            drawTextWithRoundedBackground(ctx, this.posLeft, this.posBottom - 10, "#" + this.address.toString())
        }
    }
    toggle() {
        this.t1Closed = !this.t1Closed
        this.send()
    }
    send() {
        wsClient.sendTurnoutCmd({ address: this.address, isClosed: this.t1Closed ? this.t1ClosedValue : this.t1OpenValue } as iSetTurnout)
        console.log("sendTurnoutCmd", this.address, this.t1Closed, this.t1ClosedValue, this.t1OpenValue)
    }

    hasAddress(obj: object) {
        const turnout = obj as TurnoutElement
        return this.address == turnout.address
    }

    compare(obj: object) {
        const turnout = obj as TurnoutElement
        return (this.address == turnout.address && this.t1Closed == turnout.t1Closed)
    }

    toString(): string {
        return "#" + this.address
    }


    private _locked: boolean = false;
    public get locked(): boolean {
        return this._locked;
    }
    public set locked(v: boolean) {
        this._locked = v;
    }

}

export class TurnoutRightElement extends TurnoutElement {
    
    constructor(uuid: string, address: number, x1: number, y1: number, name: string) {
        super(uuid, address, x1, y1, name)
    }

    get type(): string {
        return 'turnoutRight'
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save()
        this.drawTurnout(ctx, this.t1Closed)
        this.drawAddress(ctx)
        ctx.restore()
        super.draw(ctx)
    }

    public drawTurnout(ctx: CanvasRenderingContext2D, t1Closed: boolean): void {

        ctx.beginPath();
        ctx.strokeStyle = Colors.TrackPrimaryColor
        ctx.lineWidth = Globals.TrackWidth7;

        if (this.angle == 0) {
            ctx.moveTo(this.posLeft, this.centerY)
            ctx.lineTo(this.posRight, this.centerY)
            ctx.moveTo(this.centerX, this.centerY)
            ctx.lineTo(this.posRight, this.posBottom)
        }
        else if (this.angle == 45) {
            ctx.moveTo(this.posLeft, this.posTop)
            ctx.lineTo(this.posRight, this.posBottom)
            ctx.moveTo(this.centerX, this.centerY)
            ctx.lineTo(this.centerX, this.posBottom)
        }
        else if (this.angle == 90) {
            ctx.moveTo(this.centerX, this.posTop)
            ctx.lineTo(this.centerX, this.posBottom)
            ctx.moveTo(this.centerX, this.centerY)
            ctx.lineTo(this.posLeft, this.posBottom)
        }
        else if (this.angle == 135) {
            ctx.moveTo(this.posRight, this.posTop)
            ctx.lineTo(this.posLeft, this.posBottom)
            ctx.moveTo(this.centerX, this.centerY)
            ctx.lineTo(this.posLeft, this.centerY)
        }
        else if (this.angle == 180) {
            ctx.moveTo(this.posLeft, this.centerY)
            ctx.lineTo(this.posRight, this.centerY)
            ctx.moveTo(this.centerX, this.centerY)
            ctx.lineTo(this.posLeft, this.posTop)
        }
        else if (this.angle == 225) {
            ctx.moveTo(this.posLeft, this.posTop)
            ctx.lineTo(this.posRight, this.posBottom)
            ctx.moveTo(this.centerX, this.centerY)
            ctx.lineTo(this.centerX, this.posTop)
        }
        else if (this.angle == 270) {
            ctx.moveTo(this.centerX, this.posTop)
            ctx.lineTo(this.centerX, this.posBottom)
            ctx.moveTo(this.centerX, this.centerY)
            ctx.lineTo(this.posRight, this.posTop)
        }
        else if (this.angle == 315) {
            ctx.moveTo(this.posRight, this.posTop)
            ctx.lineTo(this.posLeft, this.posBottom)
            ctx.moveTo(this.centerX, this.centerY)
            ctx.lineTo(this.posRight, this.centerY)
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


            ctx.strokeStyle = this.stateColor
            ctx.lineWidth = Globals.TrackWidth3;

            var dx = this.width / 5
            if (this.angle == 0) {
                ctx.moveTo(this.posLeft + dx, this.centerY)
                ctx.lineTo(this.posRight - dx, this.centerY)
            }
            else if (this.angle == 45) {
                ctx.moveTo(this.posLeft + dx, this.posTop + dx)
                ctx.lineTo(this.posRight - dx, this.posBottom - dx)
            }
            else if (this.angle == 90) {
                ctx.moveTo(this.centerX, this.posTop + dx)
                ctx.lineTo(this.centerX, this.posBottom - dx)
            }
            else if (this.angle == 135) {
                ctx.moveTo(this.posRight - dx, this.posTop + dx)
                ctx.lineTo(this.posLeft + dx, this.posBottom - dx)
            }
            else if (this.angle == 180) {
                ctx.moveTo(this.posLeft + dx, this.centerY)
                ctx.lineTo(this.posRight - dx, this.centerY)
            }
            else if (this.angle == 225) {
                ctx.moveTo(this.posLeft + dx, this.posTop + dx)
                ctx.lineTo(this.posRight - dx, this.posBottom - dx)
            }
            else if (this.angle == 270) {
                ctx.moveTo(this.centerX, this.posTop + dx)
                ctx.lineTo(this.centerX, this.posBottom - dx)
            }
            else if (this.angle == 315) {
                ctx.moveTo(this.posRight - dx, this.posTop + dx)
                ctx.lineTo(this.posLeft + dx, this.posBottom - dx)
            }


            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.strokeStyle = this.stateColor
            ctx.lineWidth = Globals.TrackWidth3;

            var dx = this.width / 5
            var dx2 = this.width / 5

            if (this.angle == 0) {
                ctx.moveTo(this.posLeft + dx, this.centerY)
                ctx.lineTo(this.centerX, this.centerY)
                ctx.lineTo(this.posRight - dx2, this.posBottom - dx2)
            }
            else if (this.angle == 45) {
                ctx.moveTo(this.posLeft + dx, this.posTop + dx)
                ctx.lineTo(this.centerX, this.centerY)
                ctx.lineTo(this.centerX, this.posBottom - dx2)
            }
            else if (this.angle == 90) {
                ctx.moveTo(this.centerX, this.posTop + dx)
                ctx.lineTo(this.centerX, this.centerY)
                ctx.lineTo(this.posLeft + dx2, this.posBottom - dx2)
            }
            else if (this.angle == 135) {
                ctx.moveTo(this.posRight - dx2, this.posTop + dx2)
                ctx.lineTo(this.centerX, this.centerY)
                ctx.lineTo(this.posLeft + dx, this.centerY)
            }
            else if (this.angle == 180) {
                ctx.moveTo(this.posLeft + dx2, this.posTop + dx2)
                ctx.lineTo(this.centerX, this.centerY)
                ctx.lineTo(this.posRight - dx, this.centerY)
            }
            else if (this.angle == 225) {
                ctx.moveTo(this.centerX, this.posTop + dx)
                ctx.lineTo(this.centerX, this.centerY)
                ctx.lineTo(this.posRight - dx2, this.posBottom - dx2)
            }
            else if (this.angle == 270) {
                ctx.moveTo(this.posRight - dx2, this.posTop + dx2)
                ctx.lineTo(this.centerX, this.centerY)
                ctx.lineTo(this.centerX, this.posBottom - dx)
            }
            else if (this.angle == 315) {
                ctx.moveTo(this.posRight - dx, this.centerY)
                ctx.lineTo(this.centerX, this.centerY)
                ctx.lineTo(this.posLeft + dx2, this.posBottom - dx2)
            }
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.lineWidth = 1
        ctx.strokeStyle = "black"
        ctx.fillStyle = this.locked ? Colors.turnoutLocked : Colors.turnoutUnLocked
        ctx.arc(this.centerX, this.centerY, 3, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()

    }

    getNextItemXy(): Point {
        if (this.t1Closed) {
            return getDirectionXy(this.pos, this.angle)
        }
        return getDirectionXy(this.pos, this.angle + 45)
    }

    getPrevItemXy(): Point {
        return getDirectionXy(this.pos, this.angle + 180)
    }

    getNeigbordsXy(): Point[] {
        var points: Point[] = [];
        points.push(getDirectionXy(this.pos, this.angle))
        points.push(getDirectionXy(this.pos, this.angle + 45))
        points.push(getDirectionXy(this.pos, this.angle + 180))
        return points;
    }
}

export class TurnoutLeftElement extends TurnoutRightElement {
    
    constructor(uuid: string, address: number, x1: number, y1: number, name: string) {
        super(uuid, address, x1, y1, name)
        //this.angleStep = 45
    }
    get type(): string {
        return 'turnoutLeft'
    }

    public drawTurnout(ctx: CanvasRenderingContext2D, t1Closed: boolean): void {
        ctx.save()
        ctx.translate(this.centerX, this.centerY);
        ctx.scale(1, -1)
        ctx.translate(-this.centerX, -this.centerY);
        super.drawTurnout(ctx, t1Closed)
        ctx.restore()
    }

    getNextItemXy(): Point {
        if (this.t1Closed) {
            return getDirectionXy(this.pos, -this.angle)
        }
        return getDirectionXy(this.pos, -this.angle - 45)
    }

    getPrevItemXy(): Point {
        return getDirectionXy(this.pos, -this.angle + 180)
    }

    getNeigbordsXy(): Point[] {
        var points: Point[] = [];
        points.push(getDirectionXy(this.pos, -this.angle))
        points.push(getDirectionXy(this.pos, -this.angle - 45))
        points.push(getDirectionXy(this.pos, -this.angle + 180))
        return points;
    }
}

export class TurnoutYShapeElement extends TurnoutElement {
    
    constructor(uuid: string, address: number, x1: number, y1: number, name: string) {
        super(uuid, address, x1, y1, name)
        this.angleStep = 45
    }
    get type(): string {
        return 'turnoutY'
    }


    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save()
        this.drawTurnout(ctx, this.t1Closed)
        ctx.restore()
        this.drawAddress(ctx)
        super.draw(ctx)
    }

    public drawTurnout(ctx: CanvasRenderingContext2D, t1Closed: boolean): void {
        var dx = this.width / 5

        ctx.beginPath();
        ctx.strokeStyle = Colors.TrackPrimaryColor
        ctx.lineWidth = Globals.TrackWidth7;

        if (this.angle % 90 == 0) {
            ctx.translate(this.centerX, this.centerY);
            ctx.rotate(degreesToRadians(this.angle));
            ctx.translate(-this.centerX, -this.centerY);

            ctx.moveTo(this.posLeft, this.centerY)
            ctx.lineTo(this.centerX, this.centerY)
            ctx.lineTo(this.posRight, this.posTop)
            ctx.moveTo(this.centerX, this.centerY)
            ctx.lineTo(this.posRight, this.posBottom)
            ctx.stroke();

            // ==========
            ctx.beginPath();
            ctx.strokeStyle = this.stateColor
            ctx.lineWidth = Globals.TrackWidth3;

            ctx.moveTo(this.posLeft + dx, this.centerY)
            ctx.lineTo(this.centerX, this.centerY)
            if (t1Closed) {
                ctx.lineTo(this.posRight - dx, this.posTop + dx)
            }
            else {
                ctx.moveTo(this.centerX, this.centerY)
                ctx.lineTo(this.posRight - dx, this.posBottom - dx)
            }
            ctx.stroke();

            // Triangle
            if (this.isSelected) {
                ctx.beginPath();
                ctx.strokeStyle = 'red';
                ctx.moveTo(this.posRight -3, this.centerY);
                ctx.lineTo(this.posRight - 6, this.centerY - 2);
                ctx.lineTo(this.posRight - 6, this.centerY + 2);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }

        } else { // 45
            ctx.translate(this.centerX, this.centerY);
            ctx.rotate(degreesToRadians(this.angle + 45));
            ctx.translate(-this.centerX, -this.centerY);

            ctx.moveTo(this.posLeft, this.posBottom)
            ctx.lineTo(this.centerX, this.centerY)
            ctx.lineTo(this.centerX, this.posTop)
            ctx.moveTo(this.centerX, this.centerY)
            ctx.lineTo(this.posRight, this.centerY)
            ctx.stroke();

            //=================
            ctx.beginPath();
            ctx.strokeStyle = this.stateColor
            ctx.lineWidth = Globals.TrackWidth3;

            ctx.moveTo(this.posLeft + dx, this.posBottom - dx)
            ctx.lineTo(this.centerX, this.centerY)
            if (t1Closed) {
                ctx.lineTo(this.centerX, this.posTop + dx)
            }
            else {
                ctx.moveTo(this.centerX, this.centerY)
                ctx.lineTo(this.posRight - dx, this.centerY)
            }
            ctx.stroke();


            // Triangle
            if (this.isSelected) {
                
                ctx.translate(this.centerX, this.centerY);
                ctx.rotate(degreesToRadians(-this.angle));
                ctx.rotate(degreesToRadians(this.angle - 45));
                ctx.translate(-this.centerX, -this.centerY);
    
                ctx.beginPath();
                ctx.strokeStyle = 'red';
                ctx.moveTo(this.posRight - 3, this.centerY);
                ctx.lineTo(this.posRight - 6, this.centerY - 2);
                ctx.lineTo(this.posRight - 6, this.centerY + 2);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }


        }

        ctx.beginPath();
        ctx.lineWidth = 1
        ctx.strokeStyle = "black"
        ctx.fillStyle = this.locked ? Colors.turnoutLocked : Colors.turnoutUnLocked
        ctx.arc(this.centerX, this.centerY, 3, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()


    }

    getNextItemXy(): Point {
        if (this.t1Closed) {
            return getDirectionXy(this.pos, this.angle - 45)
        }
        return getDirectionXy(this.pos, this.angle + 45)
    }

    getPrevItemXy(): Point {
        return getDirectionXy(this.pos, this.angle + 180)
    }

    getNeigbordsXy(): Point[] {
        var points: Point[] = [];
        points.push(getDirectionXy(this.pos, -this.angle))
        points.push(getDirectionXy(this.pos, -this.angle - 45))
        points.push(getDirectionXy(this.pos, -this.angle + 180))
        return points;
    }
}

export class TurnoutDoubleElement extends TurnoutElement {

    private stateArray: { t1Closed: boolean, t2Closed: boolean }[] = [];
    address2: number = 11
    t2Closed: boolean = true;
    //t2Closed = true
    t2ClosedValue: boolean = true;
    t2OpenValue: boolean = false;

    constructor(uuid: string, address1: number, address2: number, x1: number, y1: number, name: string) {
        super(uuid, address1, x1, y1, name)
        this.address2 = address2
        //this.decoders.push(new Decoder(address2))
        this.angleStep = 45
        this.stateArray.push({ t1Closed: true, t2Closed: false })
        this.stateArray.push({ t1Closed: true, t2Closed: true })
        this.stateArray.push({ t1Closed: false, t2Closed: true })
        this.stateArray.push({ t1Closed: false, t2Closed: false })
    }
    get type(): string {
        return 'turnoutDouble'
    }

    getClickIndex() {
        return this.stateArray.findIndex((v) => {
            return v.t1Closed == this.t1Closed && v.t2Closed == this.t2Closed
        })
    }
    mouseDown(e: MouseEvent): void {
        var i = this.getClickIndex() + 1;
        if (i >= this.stateArray.length) {
            i = 0;
        }
        this.t1Closed = this.stateArray[i].t1Closed
        this.t2Closed = this.stateArray[i].t2Closed

        this.send()
        if (this.mouseDownHandler) {
            this.mouseDownHandler(this)
        }

    }

    send(): void {
        wsClient.sendTurnoutCmd({ address: this.address, isClosed: this.t1Closed ? this.t1ClosedValue : this.t1OpenValue } as iSetTurnout)
        setTimeout((() => {
            wsClient.sendTurnoutCmd({ address: this.address2, isClosed: this.t2Closed ? this.t2ClosedValue : this.t2OpenValue } as iSetTurnout)
        }).bind(this), 500)
    }


    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save()
        this.drawTurnout(ctx, this.t1Closed, this.t2Closed)

        this.drawAddress(ctx)
        ctx.restore()
        super.draw(ctx)
    }

    drawTurnout(ctx: CanvasRenderingContext2D, t1Closed: boolean, t2Closed: boolean) {
        {
            ctx.beginPath();
            ctx.strokeStyle = Colors.TrackPrimaryColor
            ctx.lineWidth = Globals.TrackWidth7;

            if (this.angle == 0 || this.angle == 180) {
                ctx.moveTo(this.posLeft, this.centerY)
                ctx.lineTo(this.posRight, this.centerY)
                ctx.moveTo(this.posLeft, this.posTop)
                ctx.lineTo(this.posRight, this.posBottom)
            }
            else if (this.angle == 45 || this.angle == 225) {
                ctx.moveTo(this.centerX, this.posTop)
                ctx.lineTo(this.centerX, this.posBottom)
                ctx.moveTo(this.posLeft, this.posTop)
                ctx.lineTo(this.posRight, this.posBottom)
            }
            else if (this.angle == 90 || this.angle == 270) {
                ctx.moveTo(this.centerX, this.posTop)
                ctx.lineTo(this.centerX, this.posBottom)
                ctx.moveTo(this.posRight, this.posTop)
                ctx.lineTo(this.posLeft, this.posBottom)
            }
            else if (this.angle == 135 || this.angle == 315) {
                ctx.moveTo(this.posLeft, this.centerY)
                ctx.lineTo(this.posRight, this.centerY)
                ctx.moveTo(this.posRight, this.posTop)
                ctx.lineTo(this.posLeft, this.posBottom)
            }
            ctx.stroke()
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
            ctx.strokeStyle = this.stateColor
            ctx.lineWidth = Globals.TrackWidth3;
            var dx = this.width / 5

            // t1 Color
            //ctx.strokeStyle = 'lime'
            if (this.angle == 0) {
                if (t1Closed) {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posLeft + dx, this.posTop + dx)
                }
                else {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posLeft + dx, this.centerY)
                }
            } else if (this.angle == 45) {
                if (t1Closed) {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.centerX, this.posTop + dx)
                } else {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posLeft + dx, this.posTop + dx)
                }
            } else if (this.angle == 90) {
                if (t1Closed) {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posRight - dx, this.posTop + dx)
                } else {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.centerX, this.posTop + dx)
                }
            } else if (this.angle == 135) {
                if (t1Closed) {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posRight - dx, this.centerY)
                } else {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posRight - dx, this.posTop + dx)
                }
            } else if (this.angle == 180) {
                if (t1Closed) {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posRight - dx, this.posBottom - dx)
                } else {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posRight - dx, this.centerY)
                }
            } else if (this.angle == 225) {
                if (t1Closed) {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.centerX, this.posBottom - dx)
                } else {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posRight - dx, this.posBottom - dx)
                }
            } else if (this.angle == 270) {
                if (t1Closed) {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posLeft + dx, this.posBottom - dx)
                } else {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.centerX, this.posBottom - dx)
                }
            } else if (this.angle == 315) {
                if (t1Closed) {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posLeft + dx, this.centerY)
                } else {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posLeft + dx, this.posBottom - dx)
                }
            }
            ctx.stroke()

            // t2 Color
            ctx.beginPath();
            //ctx.strokeStyle = 'cornflowerblue'
            if (this.angle == 0) {
                if (t2Closed) {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posRight - dx, this.posBottom - dx)
                }
                else {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posRight - dx, this.centerY)
                }
            } if (this.angle == 45) {
                if (t2Closed) {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.centerX, this.posBottom - dx)
                }
                else {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posRight - dx, this.posBottom - dx)
                }
            } if (this.angle == 90) {
                if (t2Closed) {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posLeft + dx, this.posBottom - dx)
                }
                else {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.centerX, this.posBottom - dx)
                }
            } if (this.angle == 135) {
                if (t2Closed) {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posLeft + dx, this.centerY)
                }
                else {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posLeft + dx, this.posBottom - dx)
                }
            } if (this.angle == 180) {
                if (t2Closed) {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posLeft + dx, this.posTop + dx)
                }
                else {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posLeft + dx, this.centerY)
                }
            } if (this.angle == 225) {
                if (t2Closed) {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.centerX, this.posTop + dx)
                }
                else {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posLeft + dx, this.posTop + dx)
                }
            } else if (this.angle == 270) {
                if (t2Closed) {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posRight - dx, this.posTop + dx)
                }
                else {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.centerX, this.posTop + dx)
                }
            } else if (this.angle == 315) {
                if (t2Closed) {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posRight - dx, this.centerY)
                }
                else {
                    ctx.moveTo(this.centerX, this.centerY)
                    ctx.lineTo(this.posRight - dx, this.posTop + dx)
                }
            }
            ctx.stroke()

        }

        ctx.beginPath();
        ctx.lineWidth = 1
        ctx.strokeStyle = "black"
        ctx.fillStyle = this.locked ? Colors.turnoutLocked : Colors.turnoutUnLocked
        ctx.arc(this.centerX, this.centerY, 3, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()

    }

    drawAddress(ctx: CanvasRenderingContext2D) {
        if (this.showAddress) {
            drawTextWithRoundedBackground(ctx, this.posLeft, this.posBottom - 10, "#" + this.address.toString() + " #" + this.address2.toString())
            // drawTextWithRoundedBackground(ctx, this.posLeft, this.posTop, this.angle.toString())
        }
    }

    // Lime
    getNextItemXy(): Point {
        if (this.t1Closed) {
            return getDirectionXy(this.pos, this.angle + 225)
        }
        return getDirectionXy(this.pos, this.angle + 180)
    }

    // Blue
    getPrevItemXy(): Point {
        if (this.t2Closed) {
            return getDirectionXy(this.pos, this.angle + 45)
        }
        return getDirectionXy(this.pos, this.angle + 0)
    }

    // hasAddress(address: number) {
    //     return this.address == address || this.address2 == address
    // }


    hasAddress(obj: object) {
        const turnout = obj as TurnoutDoubleElement
        return this.address == turnout.address || this.address2 == turnout.address
    }

    compare(obj: object) {
        const turnout = obj as TurnoutDoubleElement
        return (this.address == turnout.address && this.address2 == turnout.address2 &&
            this.t1Closed == turnout.t1Closed && this.t2Closed == turnout.t2Closed
        )
    }

    getNeigbordsXy(): Point[] {
        var points: Point[] = []
        points.push(getDirectionXy(this.pos, this.angle + 225))
        points.push(getDirectionXy(this.pos, this.angle + 180))
        points.push(getDirectionXy(this.pos, this.angle + 45))
        points.push(getDirectionXy(this.pos, this.angle + 0))
        return points
    }

    toString(): string {
        return "#" + this.address + " #" + this.address2
    }

}
