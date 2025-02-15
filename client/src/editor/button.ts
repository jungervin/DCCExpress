import { View } from "./view";

export class ButtonShapeElement extends View {
    address: number;
    on: boolean = false;
    // onMouseDown?: (e: MouseEvent) => void;
    // onMouseUp?: (e: MouseEvent) => void;

    constructor(uuid: string, address: number, x: number, y: number, name: string) {
        super(uuid, x, y, name)
        this.address = address
    }
    get type(): string {
        return 'button'
    }

    draw(ctx: CanvasRenderingContext2D) {
        const p = 5; // padding
        ctx.save();
        ctx.strokeRect(this.posLeft + p, this.posTop + p, this.width - 2 * p, this.height - 2 * p)
        
        ctx.restore()
        super.draw(ctx)
    }

    toggle() {
        this.on = !this.on;
    }

    mouseDown(e: MouseEvent): void {
        this.toggle()
        if (this.mouseDownHandler) {
            this.mouseDownHandler(this)
        }
    }
}