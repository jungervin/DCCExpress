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
        var w2 = Globals.AppSettings.GridSizeX / 2.0
        var h2 = Globals.AppSettings.GridSizeY / 2.0
        ctx.beginPath();
        ctx.rect(this.x * Globals.AppSettings.GridSizeX, this.y * Globals.AppSettings.GridSizeY, Globals.AppSettings.GridSizeX, Globals.AppSettings.GridSizeY);
        ctx.fillStyle = "blue";  // A színe lehet más is
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
}