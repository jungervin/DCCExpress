import { Globals } from "../helpers/globals";
import { TaskStatus } from "../helpers/task";
import { View } from "./view";

export class SchedulerButtonShapeElement extends View {
    path: Path2D;
    taskName: string = "";
    status: TaskStatus = TaskStatus.stopped;

    constructor(uuid: string, x: number, y: number, name: string) {
        super(uuid, x, y, name)
        //this.path = new Path2D("M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z");
        this.path = new Path2D("M8,5.14V19.14L19,12.14L8,5.14Z")
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
            case TaskStatus.paused :
                ctx.fillStyle = "orange"
                break;
            default:
                ctx.fillStyle = "gray"
                break;
        }

        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.roundRect(this.centerX - w / 2, this.centerY - w / 2, w, w, 5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.translate(this.posLeft + 8, this.posTop + 8)
        ctx.fill(this.path);
        ctx.restore();
        super.draw(ctx)
    }


    mouseDown(e: MouseEvent): void {
    }


}