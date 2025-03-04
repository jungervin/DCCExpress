import { wsClient } from "../helpers/ws";
import { Globals } from "../helpers/globals";
import { View } from "./view";
import { ApiCommands, iData, iSetBasicAccessory } from "../../../common/src/dcc";
import { drawTextWithRoundedBackground } from "../helpers/graphics";

export abstract class AccessoryAddressElement extends View {
    address: number;
    on: boolean = false;
    textOn: string = "ON";
    textOff: string = "OFF";
    valueOn: boolean = true;
    valueOff: boolean = false;
    colorOn: string = "lime"
    showAddress: boolean = false;


    constructor(uuid: string, address: number, x: number, y: number, name: string) {
        super(uuid, x, y, name);
        this.address = address;
    }

    get type(): string {
        return 'accessoryDecoder';
    }

    toggle() {
        this.on = !this.on;
    }

    mouseDown(e: MouseEvent): void {
        this.toggle();
        const data: iSetBasicAccessory = { address: this.address, value: this.on ? this.valueOn : this.valueOff } as iSetBasicAccessory;
        wsClient.send({ type: ApiCommands.setBasicAccessory, data: data } as iData);
        if (this.mouseDownHandler) {
            this.mouseDownHandler(this);
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.showAddress) {
            drawTextWithRoundedBackground(ctx, this.posLeft, this.posBottom - 10, "#" + this.address.toString())
            // drawTextWithRoundedBackground(ctx, this.posLeft, this.posTop, this.angle.toString())
        }
        super.draw(ctx)
    }
}

export class ButtonShapeElement extends AccessoryAddressElement {

    constructor(uuid: string, address: number, x: number, y: number, name: string) {
        super(uuid, address, x, y, name)
    }
    get type(): string {
        return 'button'
    }

    public draw(ctx: CanvasRenderingContext2D) {
        var w = Globals.GridSizeX - 10

        ctx.fillStyle = this.on ? this.colorOn : "gray"
        ctx.strokeStyle = "black";


        ctx.beginPath();
        ctx.roundRect(this.centerX - w / 2, this.centerY - w / 2, w, w, 5);
        ctx.fill();
        ctx.stroke();


        ctx.fillStyle = "white";
        ctx.fillStyle = this.on ? "black" : "white";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.on ? this.textOn : this.textOff, this.centerX, this.centerY + 1);


        super.draw(ctx)
    }

    draw2(ctx: CanvasRenderingContext2D) {
        const p = 5; // padding
        ctx.save();
        // ctx.strokeRect(this.posLeft + p, this.posTop + p, this.width - 2 * p, this.height - 2 * p)
        // ctx.restore()

        ctx.fillStyle = this.on ? "lime" : "gray";

        // Gomb megrajzolása (kör alakú)
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, 35 / 2, 0, Math.PI * 2);
        ctx.fill();

        // Keret
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.fillStyle = this.on ? "black" : "white";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.on ? this.textOn : this.textOff, this.centerX, this.centerY + 1);

        ctx.restore();
        super.draw(ctx)
    }

    toggle() {
        this.on = !this.on;
    }

    mouseDown(e: MouseEvent): void {
        this.toggle()
        const data: iSetBasicAccessory = { address: this.address, value: this.on ? this.valueOn : this.valueOff } as iSetBasicAccessory
        wsClient.send({ type: ApiCommands.setBasicAccessory, data: data } as iData)
        if (this.mouseDownHandler) {
            this.mouseDownHandler(this)
        }
    }
}