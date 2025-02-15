define(["require", "exports", "./view"], function (require, exports, view_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ButtonShapeElement = void 0;
    class ButtonShapeElement extends view_1.View {
        // onMouseDown?: (e: MouseEvent) => void;
        // onMouseUp?: (e: MouseEvent) => void;
        constructor(uuid, address, x, y, name) {
            super(uuid, x, y, name);
            this.on = false;
            this.address = address;
        }
        get type() {
            return 'button';
        }
        draw(ctx) {
            const p = 5; // padding
            ctx.save();
            ctx.strokeRect(this.posLeft + p, this.posTop + p, this.width - 2 * p, this.height - 2 * p);
            ctx.restore();
            super.draw(ctx);
        }
        toggle() {
            this.on = !this.on;
        }
        mouseDown(e) {
            this.toggle();
            if (this.mouseDownHandler) {
                this.mouseDownHandler(this);
            }
        }
    }
    exports.ButtonShapeElement = ButtonShapeElement;
});
