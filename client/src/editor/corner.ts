import { Globals } from "../helpers/globals";
import { getDirectionXy, Point } from "../helpers/math";
import { RailView } from "./view";
import { Colors } from "./view";

export class TrackCornerElement extends RailView {

    constructor(uuid: string, x1: number, y1: number, name: string) {
        super(uuid, x1, y1, name)
        this.angleStep = 90
        this.cursor = "default"
    }
    get type(): string {
        return 'corner'
    }

    public get canRotate(): boolean {
        return true
    }
    public get hasProperties(): boolean {
        return true
    }

    public draw(ctx: CanvasRenderingContext2D) {
        var w = Globals.GridSizeX / 4.0
        var h = Globals.GridSizeY / 4.0
        ctx.save()

        ctx.lineWidth = Globals.TrackWidth7;
        ctx.strokeStyle = Colors.TrackPrimaryColor

        if (this.angle == 0) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX, this.centerY);
            ctx.lineTo(this.PositionX + 1 * w, this.centerY);
            ctx.lineTo(this.centerX, this.centerY + 1 * h);
            ctx.lineTo(this.centerX, this.PositionY + Globals.GridSizeY);
            ctx.stroke();
        }
        else if (this.angle == 90) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX, this.centerY);
            ctx.lineTo(this.PositionX + 1 * w, this.centerY);
            ctx.lineTo(this.centerX, this.centerY - 1 * h);
            ctx.lineTo(this.centerX, this.PositionY);
            ctx.stroke();
        }
        else if (this.angle == 180) {
            ctx.beginPath();
            ctx.moveTo(this.centerX, this.PositionY);
            ctx.lineTo(this.centerX, this.PositionY + h);
            ctx.lineTo(this.centerX + w, this.centerY);
            ctx.lineTo(this.PositionX + Globals.GridSizeX, this.centerY);
            ctx.stroke();
        }
        else if (this.angle == 270) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX + Globals.GridSizeX, this.centerY);
            ctx.lineTo(this.centerX + w, this.centerY);
            ctx.lineTo(this.centerX, this.centerY + h);
            ctx.lineTo(this.centerX, this.PositionY + Globals.GridSizeY);
            ctx.stroke();
        }


        ctx.lineWidth = 3;

        // var color = Colors.TrackLightColor
        // switch(this.state) {
        //     case RailStates.selected : color = Colors.TrackSelectedColor
        //     break;
        //     case RailStates.occupied: color = Colors.TrackDangerColor
        //     break;
        // }

        ctx.strokeStyle = this.stateColor

        if (this.angle == 0) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX + 1 * w, this.centerY);
            ctx.lineTo(this.centerX, this.centerY + 1 * h);
            ctx.stroke();
        }
        else if (this.angle == 90) {
            ctx.beginPath();
            ctx.moveTo(this.PositionX + 1 * w, this.centerY);
            ctx.lineTo(this.centerX, this.centerY - 1 * h);
            ctx.stroke();
        }
        else if (this.angle == 180) {
            ctx.beginPath();
            ctx.moveTo(this.centerX, this.PositionY + h);
            ctx.lineTo(this.centerX + w, this.centerY);
            ctx.stroke();
        }
        else if (this.angle == 270) {
            ctx.beginPath();
            ctx.moveTo(this.centerX + w, this.centerY);
            ctx.lineTo(this.centerX, this.centerY + h);
            ctx.stroke();
        }




        ctx.restore()
        super.draw(ctx)
    }

    getNextItemXy(): Point {
        return getDirectionXy(this.pos, this.angle + 90)
    }

    getPrevItemXy(): Point {
        return getDirectionXy(this.pos, this.angle + 180)
    }


}
