// import { iCommandCenter } from "../../../common/src/dcc";
import { Globals } from "../helpers/globals";
import { degreesToRadians, getDirectionXy, Point } from "../helpers/math";
import { RailView, RailStates } from "./view";
import { Colors } from "./view";

export class TrackElement extends RailView {

    constructor(uuid: string, x1: number, y1: number, name: string) {
        super(uuid, x1, y1, name)
        this.angleStep = 45
    }

    get type() : string {
        return 'track' 
    }

    public get canRotate(): boolean {
        return true
    }

    public get hasProperties(): boolean {
        return true
    }

    public draw(ctx: CanvasRenderingContext2D) {

        if(!this.visible) {
            return;
        }
        ctx.save()
        
        {
            ctx.lineWidth = Globals.AppSettings.TrackWidth7;
            ctx.strokeStyle = Colors.TrackPrimaryColor

            if (this.angle == 0 || this.angle == 180) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX, this.centerY);
                ctx.lineTo(this.PositionX + Globals.AppSettings.GridSizeX, this.centerY);
                ctx.stroke();
            }
            else if (this.angle == 45 || this.angle == 225) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX, this.PositionY);
                ctx.lineTo(this.PositionX + Globals.AppSettings.GridSizeX, this.PositionY + Globals.AppSettings.GridSizeY);
                ctx.stroke();
            }
            else if (this.angle == 90 || this.angle == 270) {
                ctx.beginPath();
                ctx.moveTo(this.centerX, this.PositionY);
                ctx.lineTo(this.centerX, this.PositionY + Globals.AppSettings.GridSizeY);
                ctx.stroke();
            }
            else if (this.angle == 135 || this.angle == 315) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX + Globals.AppSettings.GridSizeX, this.PositionY);
                ctx.lineTo(this.PositionX, this.PositionY + Globals.AppSettings.GridSizeY);
                ctx.stroke();
            }

            ctx.lineWidth = Globals.AppSettings.TrackWidth3;
            
            // var color = Colors.TrackLightColor
            // switch(this.state) {
            //     case RailStates.selected : color = Colors.TrackSelectedColor
            //     break;
            //     case RailStates.occupied: color = Colors.TrackDangerColor
            //     break;
            // }

            ctx.strokeStyle = this.stateColor

            var w4 = Globals.AppSettings.GridSizeX / 4

            if (this.angle == 0 || this.angle == 180) {
                ctx.beginPath();
                ctx.moveTo(this.posLeft + w4, this.centerY);
                ctx.lineTo(this.posRight - w4, this.centerY);
                ctx.stroke();
            }
            else if (this.angle == 45 || this.angle == 225) {
                ctx.beginPath();
                ctx.moveTo(this.posLeft + w4, this.posTop + w4);
                ctx.lineTo(this.posRight - w4, this.posBottom - w4);
                ctx.stroke();
            }
            else if (this.angle == 90 || this.angle == 270) {
                ctx.beginPath();
                ctx.moveTo(this.centerX, this.posTop + w4);
                ctx.lineTo(this.centerX, this.posBottom - w4);
                ctx.stroke();
            }
            else if (this.angle == 135 || this.angle == 315) {
                ctx.beginPath();
                ctx.moveTo(this.posRight - w4, this.posTop + w4);
                ctx.lineTo(this.posLeft + w4, this.posBottom - w4);
                ctx.stroke();
            }
        }

        ctx.restore()
        super.draw(ctx)
    }

}
