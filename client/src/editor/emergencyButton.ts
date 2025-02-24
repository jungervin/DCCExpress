import { Globals } from "../helpers/globals";
import { Api } from "../helpers/api";
import { View } from "./view";

export class EmergencyButtonShapeElement extends View {

    constructor(uuid: string, x: number, y: number, name: string) {
        super(uuid, x, y, name)
    }
    get type(): string {
        return 'emergencybutton'
    }

    draw(ctx: CanvasRenderingContext2D) {

        ctx.save();

        ctx.beginPath()
        ctx.strokeStyle = "black";
        ctx.fillStyle = "yellow"
        ctx.lineWidth = 1;
        ctx.roundRect(this.PositionX, this.PositionY, this.width, this.height, [5])
        ctx.fill()
        ctx.stroke();

        ctx.beginPath()
        if (!Globals.power.emergencyStop) {
            ctx.shadowBlur = 5;
            ctx.shadowColor = "black";
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
        }
        ctx.strokeStyle = "black";
        ctx.fillStyle = Globals.power.emergencyStop ? "red" : "#ff7f8f"

        ctx.arc(this.centerX, this.centerY, this.width / 2 - 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.stroke();

        ctx.beginPath()

        ctx.fillStyle = "white";
        //ctx.fillStyle = this.on ? "black" : "white";
        ctx.font = Globals.power.emergencyStop ? "7px Arial" : "8px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("STOP", this.centerX, this.centerY + 1);
        ctx.stroke()

        ctx.restore();
        super.draw(ctx)
    }

    mouseDown(e: MouseEvent): void {
        Api.emergencyStop()
    }
}