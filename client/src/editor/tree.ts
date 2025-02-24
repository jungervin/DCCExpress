import { degreesToRadians } from "../helpers/math";
import { View } from "./view";

export class TreeShapeElement extends View {
    on: boolean = false;

    constructor(uuid: string, x: number, y: number, name: string) {
        super(uuid, x, y, name)
    }
    get type(): string {
        return 'tree'
    }

    public get canRotate(): boolean {
        return true
    }

    draw(ctx: CanvasRenderingContext2D) {

        ctx.save();

        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(degreesToRadians(this.angle));
        ctx.translate(-this.centerX, -this.centerY);

        var x = this.centerX
        var y = this.centerY
        var size = this.width / 2 - 2

        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.fillStyle = "#4F8A10";
        ctx.arc(x + 3, y + 3, size, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "#5CA420";
        ctx.arc(x + 2 , y + 2, size - 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "#6EC13C";
        ctx.arc(x + 4, y +4, 6, 0, Math.PI * 2);
        ctx.fill();

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