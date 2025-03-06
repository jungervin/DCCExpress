import { Globals } from "../helpers/globals";
import { RailView, Colors } from "./view";


export class TrackCrossingShapeElement extends RailView {

    constructor(uuid: string, x1: number, y1: number, name: string) {
        super(uuid, x1, y1, name)
        this.angleStep = 45
        this.cursor = "default"
    }

    get type(): string {
        return 'trackcrossing'
    }

    public get canRotate(): boolean {
        return true
    }

    public get hasProperties(): boolean {
        return true
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.save()
        this.drawTurnout(ctx, true, true)
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


            ctx.beginPath();
            ctx.strokeStyle = this.stateColor
            ctx.lineWidth = Globals.TrackWidth3;
            var dx = this.width / 5

            // ctx.beginPath();
            // ctx.strokeStyle = Colors.TrackPrimaryColor
            // ctx.lineWidth = Globals.TrackWidth7;

            if (this.angle == 0 || this.angle == 180) {
                ctx.moveTo(this.posLeft + dx, this.centerY)
                ctx.lineTo(this.posRight - dx, this.centerY)
                ctx.moveTo(this.posLeft + dx, this.posTop + dx)
                ctx.lineTo(this.posRight - dx, this.posBottom-dx)
            }
            else if (this.angle == 45 || this.angle == 225) {
                ctx.moveTo(this.centerX, this.posTop + dx)
                ctx.lineTo(this.centerX, this.posBottom-dx)
                ctx.moveTo(this.posLeft+dx, this.posTop + dx)
                ctx.lineTo(this.posRight-dx, this.posBottom-dx)
            }
            else if (this.angle == 90 || this.angle == 270) {
                ctx.moveTo(this.centerX, this.posTop + dx)
                ctx.lineTo(this.centerX, this.posBottom-dx)
                ctx.moveTo(this.posRight -dx, this.posTop+dx)
                ctx.lineTo(this.posLeft+dx, this.posBottom-dx)
            }
            else if (this.angle == 135 || this.angle == 315) {
                ctx.moveTo(this.posLeft+dx, this.centerY)
                ctx.lineTo(this.posRight-dx, this.centerY)
                ctx.moveTo(this.posRight-dx, this.posTop+dx)
                ctx.lineTo(this.posLeft+dx, this.posBottom-dx)
            }
            ctx.stroke()


        }

    }
}
