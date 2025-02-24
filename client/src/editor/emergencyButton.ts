import { View } from "./view";

export class EmergencyButtonShapeElement extends View {
    on: boolean = false;

    constructor(uuid: string, x: number, y: number, name: string) {
        super(uuid, x, y, name)
    }
    get type(): string {
        return 'emergencybutton'
    }

    draw(ctx: CanvasRenderingContext2D) {
        const p = 5; // padding
        ctx.save();
        // ctx.strokeRect(this.posLeft + p, this.posTop + p, this.width - 2 * p, this.height - 2 * p)
        // ctx.restore()

        ctx.strokeStyle = "black";
        ctx.fillStyle = "yellow"
        ctx.lineWidth = 1;
        ctx.roundRect(this.PositionX, this.PositionY, this.width, this.height, [5])
        ctx.fill()
        ctx.stroke();


        ctx.strokeStyle = "black";
        ctx.fillStyle = "red"
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.width / 2 -4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.fillStyle = this.on ? "black" : "white";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("STOP", this.centerX, this.centerY + 1);

        return
        ctx.fillStyle = this.on ? "lime" : "gray";

        // Gomb megrajzolása (kör alakú)

        // Keret
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.fillStyle = this.on ? "black" : "white";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // ctx.fillText(this.on ? this.textOn : this.textOff, this.centerX, this.centerY + 1);

        ctx.restore();
        super.draw(ctx)
    }

    toggle() {
        this.on = !this.on;
    }

    mouseDown(e: MouseEvent): void {
        this.toggle()
        // const data: iSetBasicAccessory = {address: this.address, value: this.on ? this.valueOn : this.valueOff} as iSetBasicAccessory
        // wsClient.send({type: ApiCommands.setBasicAccessory, data: data } as iData)
        // if (this.mouseDownHandler) {
        //     this.mouseDownHandler(this)
        // }
    }
}