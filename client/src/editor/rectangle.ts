import { Globals } from "../helpers/globals";
import {  RailView } from "./view";

export class RectangleElement extends RailView {

    constructor(uuid: string, x1: number, y1: number, name: string) {
        super(uuid, x1, y1, name)
    }
    get type() : string {
        return 'rectangle' 
    }

    // A téglalap kirajzolása
    public draw(ctx: CanvasRenderingContext2D) {
        var w2 = Globals.GridSizeX / 2.0
        var h2 = Globals.GridSizeY / 2.0
        ctx.beginPath();
        ctx.rect(this.x * Globals.GridSizeX, this.y * Globals.GridSizeY, Globals.GridSizeX, Globals.GridSizeY);
        ctx.fillStyle = "blue";  // A színe lehet más is
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
}