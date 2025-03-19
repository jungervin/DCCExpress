import { Globals } from "../helpers/globals";
import { AccessoryAddressElement } from "./button";

export enum SensorTypes { circle, rect }

export enum SensorSources {
    dcc,
    ws
}
export class SensorShapeElement extends AccessoryAddressElement {
    kind = SensorTypes.rect
    source: SensorSources = SensorSources.dcc
    constructor(uuid: string, address: number, x1: number, y1: number, name: string) {
        super(uuid, address, x1, y1, name)
        this.cursor = "default"
    }

    get type(): string {
        return 'sensor'
    }

    public draw2(ctx: CanvasRenderingContext2D) {
        var w = Globals.GridSizeX - 10

        ctx.fillStyle = this.on ? this.colorOn : "gray"
        ctx.strokeStyle = "black";

        if (this.kind == SensorTypes.rect) {
            ctx.beginPath();
            ctx.roundRect(this.centerX - w / 2, this.centerY - w / 2, w, w, 5);
            ctx.fill();
            ctx.stroke();
        }

        ctx.fillStyle = "white";
        ctx.fillStyle = this.on ? "black" : "white";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.on ? this.textOn : this.textOff, this.centerX, this.centerY + 1);


        super.draw(ctx)
    }

    draw(ctx: CanvasRenderingContext2D) {
        const p = 5; // padding
        ctx.save();
        // ctx.strokeRect(this.posLeft + p, this.posTop + p, this.width - 2 * p, this.height - 2 * p)
        // ctx.restore()

        ctx.fillStyle = this.on ? this.colorOn : "gray";

        // Gomb megrajzolása (kör alakú)
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Keret
        ctx.strokeStyle = "black"
        ctx.lineWidth = 2;
        ctx.stroke();

        // //ctx.fillStyle = "white";
        // ctx.fillStyle = this.colorOn == "red" || this.colorOn =="cornflowerblue" ? "white" : "black";
        // ctx.font = "7px Arial";
        // ctx.textAlign = "center";
        // ctx.textBaseline = "middle";
        // ctx.fillText(this.on ? this.textOn : this.textOff, this.centerX, this.centerY + 1);

        ctx.restore();
        super.draw(ctx)
    }

    mouseDown(e: MouseEvent): void {

    }
}