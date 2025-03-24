import { Globals } from "../helpers/globals";
import { TaskStatus } from "../helpers/task";
import { View } from "./view";

export class SchedulerButtonShapeElement extends View {
    pathPlay: Path2D = new Path2D("M8,5.14V19.14L19,12.14L8,5.14Z");
    pathFinish: Path2D = new Path2D("M14.4,6H20V16H13L12.6,14H7V21H5V4H14L14.4,6M14,14H16V12H18V10H16V8H14V10L13,8V6H11V8H9V6H7V8H9V10H7V12H9V10H11V12H13V10L14,12V14M11,10V8H13V10H11M14,10H16V12H14V10Z")
    taskName: string = "";
    status: TaskStatus = TaskStatus.stopped;
    finishOnComplete: boolean = false

    constructor(uuid: string, x: number, y: number, name: string) {
        super(uuid, x, y, name)
    }

    get type(): string {
        return 'schedulerButton'
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        var w = Globals.GridSizeX - 10
        const p = 5; // padding
        
        switch(this.status) {
            case TaskStatus.running:
                ctx.fillStyle = "lime"
                
                break;
            default:
                ctx.fillStyle = "gray"
                break;
        }

        const path: Path2D = this.finishOnComplete ? this.pathFinish : this.pathPlay

        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.roundRect(this.centerX - w / 2, this.centerY - w / 2, w, w, 5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.translate(this.posLeft + 8, this.posTop + 8)
        ctx.fill(path);
        ctx.restore();
        super.draw(ctx)
    }

    mouseDown(e: MouseEvent): void {
    }
}