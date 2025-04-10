import { Globals } from "../helpers/globals";
import { getDirectionXy, Point } from "../helpers/math";
import { RailView } from "./view";
import { Colors } from "./view";

export class TrackCurveElement extends RailView {

    constructor(uuid: string, x1: number, y1: number, name: string) {
        super(uuid, x1, y1, name)
        this.angleStep = 45
        this.cursor = "default"
    }

    get type() : string {
        return 'curve' 
    }

    public get canRotate(): boolean {
        return true
    }
    public get hasProperties(): boolean {
        return true
    }

    public draw(ctx: CanvasRenderingContext2D) {
        var w = Globals.GridSizeX / 2.0
        var h = Globals.GridSizeY / 2.0
        ctx.save()

        ctx.lineWidth = Globals.TrackWidth7;
        ctx.strokeStyle = Colors.TrackPrimaryColor

        if (this.angle == 0) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX, this.PositionY);
            ctx.lineTo(this.centerX, this.centerY);
            ctx.lineTo(this.PositionX + Globals.GridSizeX, this.centerY);
            ctx.stroke();
        }
        else if (this.angle == 45) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX + Globals.GridSizeX / 2, this.PositionY);
            ctx.lineTo(this.centerX, this.centerY);
            ctx.lineTo(this.PositionX + Globals.GridSizeX, this.PositionY + Globals.GridSizeY);
            ctx.stroke();
        }
        else if (this.angle == 90) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX + Globals.GridSizeX, this.PositionY);
            ctx.lineTo(this.centerX, this.centerY);
            ctx.lineTo(this.centerX, this.PositionY + Globals.GridSizeY);
            ctx.stroke();
        }
        else if (this.angle == 135) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX, this.PositionY + Globals.GridSizeY);
            ctx.lineTo(this.centerX, this.centerY);
            ctx.lineTo(this.PositionX + Globals.GridSizeX, this.centerY);
            ctx.stroke();
        }
        else if (this.angle == 180) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX, this.centerY);
            ctx.lineTo(this.centerX, this.centerY);
            ctx.lineTo(this.PositionX + Globals.GridSizeX, this.PositionY + Globals.GridSizeY);
            ctx.stroke();
        }
        else if (this.angle == 225) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX, this.PositionY);
            ctx.lineTo(this.centerX, this.centerY);
            ctx.lineTo(this.centerX, this.PositionY + Globals.GridSizeY);
            ctx.stroke();
        }
        else if (this.angle == 270) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX, this.PositionY + Globals.GridSizeY);
            ctx.lineTo(this.centerX, this.centerY);
            ctx.lineTo(this.centerX, this.PositionY);
            ctx.stroke();
        }
        else if (this.angle == 315) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX, this.centerY);
            ctx.lineTo(this.centerX, this.centerY);
            ctx.lineTo(this.PositionX + Globals.GridSizeX, this.PositionY);
            ctx.stroke();
        }

        ctx.lineWidth = Globals.TrackWidth3;
        ctx.strokeStyle = this.stateColor
        var w2 = Globals.GridSizeX / 3
        ctx.lineDashOffset = -w2 / 3 //w3 / 2.0
        ctx.setLineDash([w2, w2]);

        if (this.angle == 0) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX, this.PositionY);
            ctx.lineTo(this.centerX, this.centerY);
            ctx.lineTo(this.PositionX + Globals.GridSizeX, this.centerY);
            ctx.stroke();
        }
        else if (this.angle == 45) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX + Globals.GridSizeX / 2, this.PositionY);
            ctx.lineTo(this.centerX, this.centerY);
            ctx.lineTo(this.PositionX + Globals.GridSizeX, this.PositionY + Globals.GridSizeY);
            ctx.stroke();
        }
        else if (this.angle == 90) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX + Globals.GridSizeX, this.PositionY);
            ctx.lineTo(this.centerX, this.centerY);
            ctx.lineTo(this.centerX, this.PositionY + Globals.GridSizeY);
            ctx.stroke();
        }
        else if (this.angle == 135) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX, this.PositionY + Globals.GridSizeY);
            ctx.lineTo(this.centerX, this.centerY);
            ctx.lineTo(this.PositionX + Globals.GridSizeX, this.centerY);
            ctx.stroke();
        }
        else if (this.angle == 180) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX, this.centerY);
            ctx.lineTo(this.centerX, this.centerY);
            ctx.lineTo(this.PositionX + Globals.GridSizeX, this.PositionY + Globals.GridSizeY);
            ctx.stroke();
        }
        else if (this.angle == 225) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX, this.PositionY);
            ctx.lineTo(this.centerX, this.centerY);
            ctx.lineTo(this.centerX, this.PositionY + Globals.GridSizeY);
            ctx.stroke();
        }
        else if (this.angle == 270) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX, this.PositionY + Globals.GridSizeY);
            ctx.lineTo(this.centerX, this.centerY);
            ctx.lineTo(this.centerX, this.PositionY);
            ctx.stroke();
        }
        else if (this.angle == 315) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX, this.centerY);
            ctx.lineTo(this.centerX, this.centerY);
            ctx.lineTo(this.PositionX + Globals.GridSizeX, this.PositionY);
            ctx.stroke();
        }

        ctx.restore()
        super.draw(ctx)
    }

    getNextItemXy(): Point {
        return getDirectionXy(this.pos, this.angle + 0 )
    }

    getPrevItemXy(): Point {
        return getDirectionXy(this.pos, this.angle + 225 )
    }
}
