import { Globals } from "../helpers/globals";
import { drawPolarLine } from "../helpers/graphics";
import { degreesToRadians } from "../helpers/math";
import {  RailView, RailStates } from "./view";
import { Colors } from "./view";

export class TrackEndElement extends RailView {

    constructor(uuid: string, x1: number, y1: number, name: string) {
        super(uuid, x1, y1, name)
        this.angleStep = 45
    }
    get type() : string {
        return 'trackEnd' 
    }

    public get canRotate(): boolean {
        return true
    }

    public get hasProperties(): boolean {
        return true
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.save()

        var h = Globals.AppSettings.GridSizeY / 4.0
        {

            ctx.translate(this.centerX, this.centerY);
            ctx.rotate(degreesToRadians(this.angle));
            ctx.translate(-this.centerX, -this.centerY);

            ctx.lineWidth = Globals.AppSettings.TrackWidth7;
            ctx.strokeStyle = Colors.TrackPrimaryColor

            if (this.angle % 90 == 0) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX, this.centerY);
                ctx.lineTo(this.centerX, this.centerY);
                ctx.moveTo(this.centerX, this.centerY - h);
                ctx.lineTo(this.centerX, this.centerY + h);
                ctx.stroke();
            } else {
                var r = Globals.AppSettings.GridSizeX / 2
                var l = Math.sqrt(2 * r * r)

                ctx.beginPath();
                ctx.moveTo(this.centerX - l, this.centerY);
                ctx.lineTo(this.centerX, this.centerY);
                ctx.moveTo(this.centerX, this.centerY - h);
                ctx.lineTo(this.centerX, this.centerY + h);
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

            if (this.angle % 90 == 0) {
                ctx.beginPath();
                ctx.moveTo(this.PositionX, this.centerY);
                ctx.lineTo(this.centerX - Globals.AppSettings.TrackWidth7 / 2, this.centerY);
                ctx.stroke();
            } else {
                var r = Globals.AppSettings.GridSizeX / 2
                var l = Math.sqrt(2 * r * r)

                ctx.beginPath();
                ctx.moveTo(this.centerX - l, this.centerY);
                ctx.lineTo(this.centerX - Globals.AppSettings.TrackWidth7 / 2, this.centerY);
                ctx.stroke();
            }

            
            // drawPolarLine(ctx, this.centerX, this.centerY, settings.GridSizeX / 4, this.angle , color, settings.TrackWidth3)
            // // ctx.beginPath();
            // // ctx.moveTo(this.PositionX, this.centerY);
            // // ctx.lineTo(this.centerX, this.centerY);
            // // // this.ctx.moveTo(this.centerX, this.centerY - h);
            // // // this.ctx.lineTo(this.centerX, this.centerY + h);
            // // ctx.stroke();


            // if (this.angle % 90 == 0) {
            //     ctx.beginPath();
            //     ctx.moveTo(this.PositionX, this.centerY);
            //     ctx.lineTo(this.centerX, this.centerY);
            //     // this.ctx.moveTo(this.centerX, this.centerY - h);
            //     // this.ctx.lineTo(this.centerX, this.centerY + h);
            //     ctx.stroke();
            // } else {
            //     var r = settings.GridSizeX / 2
            //     var l = Math.sqrt(2 * r * r) / 2

            //     ctx.beginPath();
            //     ctx.moveTo(this.centerX - l, this.centerY);
            //     ctx.lineTo(this.centerX, this.centerY);
            //     // this.ctx.moveTo(this.centerX, this.centerY - h);
            //     // this.ctx.lineTo(this.centerX, this.centerY + h);
            //     ctx.stroke();
            // }


            
        }



        ctx.restore()
        super.draw(ctx)
    }

}
