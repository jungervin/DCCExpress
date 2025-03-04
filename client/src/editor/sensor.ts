import { add } from "lodash";
import { Globals } from "../helpers/globals";
import { AccessoryAddressElement } from "./button";
import { View } from "./view";


export enum SensorTypes { circle, rect }

export class SensorShapeElement extends AccessoryAddressElement {
    kind = SensorTypes.rect

    constructor(uuid: string, address: number, x1: number, y1: number, name: string) {
        super(uuid, address, x1, y1, name)

    }

    get type(): string {
        return 'sensor'
    }

    public draw(ctx: CanvasRenderingContext2D) {
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

    mouseDown(e: MouseEvent): void {

    }
}