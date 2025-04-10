import { Globals } from "../helpers/globals";
import { View } from "./view";

export class Label2Element extends View {
    text: string = 'LABEL';
    fgColor: string = 'black';
    bgColor: string = "red";
    fontSize: string = "10px";
    fontStyle: string = "normal";
    fontName: string = "Arial";
    textAlign: string = "left";
    textBaseline: string = "top";

    locoAddress: number = 0; 

    constructor(uuid: string, x: number, y: number, name: string) {
        super(uuid, x, y, name)
        this.angleStep = 0
        this.w = 2;
        this.h = 1;
        this.cursor = "default"
    }

    get type(): string {
        return 'label2'
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.save()

        ctx.fillStyle = this.fgColor;
        // ctx.font = this.fontStyle + " " + this.fontSize + " " + this.fontName;
         ctx.font = "10px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        var y = this.posTop - 1;
        var x = this.posLeft + 1;
        if(this.valign == "center") {
            y = this.centerY - 4
        } else if(this.valign == "bottom") {
            y = this.posBottom - 10
        }
        ctx.fillText(this.text, this.posLeft, y);

        // drawTextWithRoundedBackground(ctx, x, y,this.text,this.fgColor,"red",2, 4)
        ctx.restore()
        super.draw(ctx)
    }

    public get canRotate(): boolean {
        return false
    }

    mouseInView(x: number, y: number): boolean {
        var x1 = this.x;
        var x2 = this.x + 1;
        var y1 = this.y;
        var y2 = this.y;
        return (x >= x1 && x <= x2 && y >= y1 && y <= y2)
    }

    get posRight(): number {
        return this.x * Globals.GridSizeX + 2 * Globals.GridSizeX
    }
    
    private _valign : string = "center";
    public get valign() : string {
        return this._valign;
    }
    public set valign(v : string) {
        this._valign = v;
    }   
}