import { Globals } from "../helpers/globals";
import { DCCExDirections } from "../../../common/src/dcc";
import { drawTextWithRoundedBackground } from "../helpers/graphics";
import { degreesToRadians, getDirection, getDirectionXy, Point } from "../helpers/math";
import { RailView } from "./view";

export class BlockElement extends RailView {
    text: string = 'HELLO';
    textColor: string = 'black';
    locoAddress: number = 0;

    constructor(uuid: string, x: number, y: number, name: string) {
        super(uuid, x, y, name)
        this.angleStep = 90
        this.w = 1;
        this.h = 1;

    }

    get type(): string {
        return 'block'
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.save()

        var w = Globals.GridSizeX / 2.0
        var h = Globals.GridSizeY / 4.0

        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(degreesToRadians(this.angle));
        ctx.translate(-this.centerX, -this.centerY);

        ctx.fillStyle = "#eee";  // A színe lehet más is
        ctx.fillRect(this.posLeft, this.centerY - h, this.width, 2 * h);

        ctx.lineWidth = 1
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.posLeft, this.centerY - h, this.width, 2 * h);

        // Triangle
        ctx.fillStyle = 'black';
        ctx.beginPath();
        if (Globals.Settings.EditorSettings.Orientation == DCCExDirections.forward) {
            ctx.moveTo(this.posRight - 5, this.centerY);
            ctx.lineTo(this.posRight - 10, this.centerY - 3);
            ctx.lineTo(this.posRight - 10, this.centerY + 3);
        } else {
            ctx.moveTo(this.posLeft + 5, this.centerY);
            ctx.lineTo(this.posLeft + 10, this.centerY - 3);
            ctx.lineTo(this.posLeft + 10, this.centerY + 3);
        }
        ctx.closePath();
        ctx.fill();


        // if (this.text) 
        {
            if (this.angle == 180) {
                ctx.restore()
            }
            ctx.fillStyle = this.textColor;
            ctx.font = "10px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText('#' + this.locoAddress.toString() + ' ' + this.text, this.centerX, this.centerY + 1);
        }

        
        super.draw(ctx)
        ctx.restore()
    }

    public get canRotate(): boolean {
        return true
    }

    move(x: number, y: number) {
        this.x = (this.angle == 0 || this.angle == 180) ? x - 0 : x
        this.y = (this.angle == 90 || this.angle == 270) ? y - 0 : y;
    }
    mouseInView(x: number, y: number): boolean {
        var dx = (this.angle == 0 || this.angle == 180) ? 1 : 0
        var dy = (this.angle == 90 || this.angle == 270) ? 1 : 0;
        var x1 = this.x - dx;
        var x2 = this.x + dx; // (this.angle == 0 || this.angle == 180) ? this.x + this.w : this.x
        var y1 = this.y - dy;
        var y2 = this.y + dy; // (this.angle == 90 || this.angle == 270) ? this.y+this.w : this.y;
        return (x >= x1 && x <= x2 && y >= y1 && y <= y2)
    }

    get posLeft(): number {
        return this.x * Globals.GridSizeX - Globals.GridSizeX
    }
    get posRight(): number {
        return this.x * Globals.GridSizeX + 2 * Globals.GridSizeX
    }
    get posTop(): number {
        return this.y * Globals.GridSizeY
    }
    get posBottom(): number {
        return this.y * Globals.GridSizeY + this.h * Globals.GridSizeY
    }

    getNextItemXy(): Point {
        const d = getDirection(this.angle);
        var p = new Point(this.x + d.x * 2, this.y + d.y * 2)
        return p
    }

    getPrevItemXy(): Point {
        const d = getDirection(this.angle + 180);
        var p = new Point(this.x + d.x * 2, this.y + d.y * 2)
        return p


        // var d = getDirectionXy(this.pos, this.angle + 180);
        // return new Point(d.x * 2, d.y * 2)
    }

}