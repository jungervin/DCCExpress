import { getUUID } from "../../../common/src/dcc";
import { degreesToRadians, getDirectionXy, Point } from "../helpers/math";
import { Globals } from "../helpers/globals";





export class Colors {
    static TrackPrimaryColor = "black"
    static TrackLightColor = "#888"
    static TrackSucessColor = "lime"
    static TrackWarningColor = "yellow"
    static TrackDangerColor = "red"
    static TrackSelectedColor = "yellow"
    static turnoutLocked = "red"
    static turnoutUnLocked = "white"
}

// export interface iDecoder {
//     getAddress: () => string,
//     on: boolean
// }

export const propertiesChangedEvent = new Event("propertiesChanged");

// new CustomEvent("locomotiveSelected", {
//     detail: { locomotive },
//     bubbles: true,
//     composed: true,
// })

export interface ExtendedHTMLInputElement extends HTMLInputElement {
    tag?: any;
}
// export interface ExHTMLElement extends HTMLElement {
//    get visible(): boolean;
//     set visible(v: boolean);
// }

// export function setSettings(setting: any) {
//     if (setting) {
//         AppSettings = setting
//     }
// }

export abstract class View {
    public tag?: Object = undefined
    public x: number;
    public y: number;
    public w: number;
    public h: number;
    public visible: boolean = true;
    public isVisited: boolean = false
    UUID: string = ""
    public name: string = ""
    public isSelected: boolean = false
    public cursor = "pointer"
    public angleStep: number = 90; // Ha nulla akkor nem lehet forgatni!
    public mouseDownHandler?: (sender: Object) => void;
    public mouseUpHandler?: (sender: Object) => void;
    bgColor?: string;


    constructor(uuid: string, x: number, y: number, name: string) {
        //this.type = type
        this.UUID = uuid || getUUID()
        //this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;
        this.name = name
    }

    abstract get type(): string


    draw(ctx: CanvasRenderingContext2D): void {
        this.drawSelection(ctx)
    }

    drawXy(x: number, y: number, ctx: CanvasRenderingContext2D) {
        const xx = this.x
        const yy = this.y
        this.x = x
        this.y = y
        this.draw(ctx)
        this.x = xx
        this.y = yy
    }
    drawSelection(ctx: CanvasRenderingContext2D): void {

        if (this.isSelected) {
            ctx.save()
            ctx.translate(this.centerX, this.centerY);
            // ctx.rotate(degreesToRadians(this.angle));
            ctx.rotate(degreesToRadians(0));
            ctx.translate(-this.centerX, -this.centerY);


            var w2 = Globals.GridSizeX / 2.0
            var h2 = Globals.GridSizeY / 2.0
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "red";
            // if (this.bgColor) {
            //     ctx.fillStyle = this.bgColor
            //     ctx.fillRect(this.posLeft, this.posTop, this.width, this.height);
            // }
            ctx.strokeRect(this.posLeft, this.posTop, this.width, this.height);
            // ctx.stroke();
            ctx.restore()

            // Draw neighbors
            if (false) {
                //ctx.restore()
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = "lime";
                var n = this.getNextItemXy()
                ctx.rect(n.x * Globals.GridSizeX, n.y * Globals.GridSizeY, Globals.GridSizeX, Globals.GridSizeY);
                ctx.stroke();

                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = "blue";
                var p = this.getPrevItemXy()
                ctx.rect(p.x * Globals.GridSizeX, p.y * Globals.GridSizeY, Globals.GridSizeX, Globals.GridSizeY);
                ctx.stroke();
            }


        }

    }

    // drawLine(x1: number, y1: number, x2: number, y2: number, width: number = 7, color: string = 'black', dash: [] = []) {
    //     this.ctx.beginPath();
    //     this.ctx.setLineDash(dash);
    //     this.ctx.strokeStyle = color
    //     this.ctx.moveTo(this.x * settings.GridSizeX, this.y * settings.GridSizeY + settings.GridSizeY / 2.0);
    //     this.ctx.lineTo(this.x * settings.GridSizeX + settings.GridSizeX, this.y * settings.GridSizeY + settings.GridSizeY / 2.0);
    //     this.ctx.strokeStyle = this.name;
    //     this.ctx.lineWidth = 7;
    //     this.ctx.stroke();
    //     this.ctx.setLineDash([]);
    // }


    public get PositionX(): number {
        return this.x * Globals.GridSizeX
    }

    public get PositionY(): number {
        return this.y * Globals.GridSizeY
    }

    get posLeft(): number {
        return this.x * Globals.GridSizeX
    }
    get posRight(): number {
        return this.x * Globals.GridSizeX + this.w * Globals.GridSizeX
    }
    get posTop(): number {
        return this.y * Globals.GridSizeY
    }
    get posBottom(): number {
        return this.y * Globals.GridSizeY + this.h * Globals.GridSizeY
    }

    public get centerX(): number {
        return this.x * Globals.GridSizeX + this.w * Globals.GridSizeX / 2
    }

    public get centerY(): number {
        return this.y * Globals.GridSizeY + this.h * Globals.GridSizeY / 2
    }

    get width(): number {
        return this.posRight - this.posLeft
    }
    get height(): number {
        return this.posBottom - this.posTop
    }

    mouseInView(x: number, y: number): boolean {
        return (x == this.x && y == this.y)
    }
    mouseDown(e: MouseEvent) {
        if (this.mouseDownHandler) {
            this.mouseDownHandler(this)
        }
    }
    mouseUp(e: MouseEvent) {
        if (this.mouseUpHandler) {
            this.mouseUpHandler(this)
        }
    }


    rotateRight() {
        this.angle += this.angleStep
        if (this.angle >= 360) {
            this.angle = 0
        }
        else if (this.angle < 0) {
            this.angle = 360 - Math.abs(this.angleStep)
        }
        // console.log(this.angle)
    }
    rotateLeft() {
        this.angle -= this.angleStep
        if (this.angle >= 360) {
            this.angle = 0
        } else
            if (this.angle < 0) {
                this.angle = 360 - Math.abs(this.angleStep)
            }
    }


    private _angle: number = 0;
    public get angle(): number {
        return this._angle;
    }
    public set angle(v: number) {
        //this._angle = Math.abs(v % 360);
        this._angle = (v % 360);
    }


    public get canRotate(): boolean {
        return false
    }
    public get hasProperties(): boolean {
        return false
    }

    clear(ctx: CanvasRenderingContext2D) {
        ctx!.fillRect(this.posLeft, this.posTop, this.width, this.height)
    }

    // getImageData() {
    //     return this.ctx.getImageData(this.posLeft, this.posBottom, this.width, this.height);
    // }

    move(x: number, y: number) {
        this.x = x
        this.y = y;
    }

    get pos(): Point {
        var p = new Point(this.x, this.y)
        return p;
    }

    getNextItemXy(): Point {
        return getDirectionXy(this.pos, this.angle);
    }

    getPrevItemXy(): Point {
        return getDirectionXy(this.pos, this.angle + 180);
    }

    getNeigbordsXy(): Point[] {
        var points: Point[] = [];
        points.push(this.getNextItemXy());
        points.push(this.getPrevItemXy());
        return points;
    }

    toString() {
        return this.name
    }
}


export enum RailStates {
    disabled = 0b0000_0001,
    free = 0b0000_0010,
    selected = 0b0000_0100,
    occupied = 0b0000_1000
}


export abstract class RailView extends View {
    rbusAddress: number = 0

    constructor(uuid: string, x: number, y: number, name: string) {
        super(uuid, x, y, name)

    }

    get stateColor(): string {
        if (this.isRoute) {
            if (this.occupied) {
                return "lime"
            }
            return Colors.TrackSelectedColor
        }


        if (this.occupied) {
            return Colors.TrackDangerColor
        }

        return Colors.TrackLightColor
    }

    protected _occupied: boolean = false;
    public get occupied(): boolean {
        return this._occupied;
    }
    public set occupied(v: boolean) {
        this._occupied = v;
    }

    private _isRoute: boolean = false;
    public get isRoute(): boolean {
        return this._isRoute
    }
    public set isRoute(v: boolean) {
        this._isRoute = v
    }

    // private _cc?: iCommandCenter | undefined;
    // public get cc(): iCommandCenter {
    //     return this._cc!;
    // }
    // public set cc(v: iCommandCenter) {
    //     this._cc = v;
    // }

}

