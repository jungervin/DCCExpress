define(["require", "exports", "../helpers/globals", "../helpers/task", "./view"], function (require, exports, globals_1, task_1, view_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SchedulerButtonShapeElement = void 0;
    class SchedulerButtonShapeElement extends view_1.View {
        constructor(uuid, x, y, name) {
            super(uuid, x, y, name);
            this.pathPlay = new Path2D("M8,5.14V19.14L19,12.14L8,5.14Z");
            this.pathFinish = new Path2D("M14.4,6H20V16H13L12.6,14H7V21H5V4H14L14.4,6M14,14H16V12H18V10H16V8H14V10L13,8V6H11V8H9V6H7V8H9V10H7V12H9V10H11V12H13V10L14,12V14M11,10V8H13V10H11M14,10H16V12H14V10Z");
            this.taskName = "";
            this.status = task_1.TaskStatus.stopped;
            this.finishOnComplete = false;
        }
        get type() {
            return 'schedulerButton';
        }
        draw(ctx) {
            ctx.save();
            var w = globals_1.Globals.GridSizeX - 10;
            const p = 5; // padding
            switch (this.status) {
                case task_1.TaskStatus.running:
                    ctx.fillStyle = "lime";
                    break;
                default:
                    ctx.fillStyle = "gray";
                    break;
            }
            const path = this.finishOnComplete ? this.pathFinish : this.pathPlay;
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.roundRect(this.centerX - w / 2, this.centerY - w / 2, w, w, 5);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "black";
            ctx.translate(this.posLeft + 8, this.posTop + 8);
            ctx.fill(path);
            ctx.restore();
            super.draw(ctx);
        }
        mouseDown(e) {
        }
    }
    exports.SchedulerButtonShapeElement = SchedulerButtonShapeElement;
});
