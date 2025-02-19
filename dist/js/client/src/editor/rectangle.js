define(["require", "exports", "../helpers/globals", "./view"], function (require, exports, globals_1, view_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RectangleElement = void 0;
    class RectangleElement extends view_1.RailView {
        constructor(uuid, x1, y1, name) {
            super(uuid, x1, y1, name);
        }
        get type() {
            return 'rectangle';
        }
        // A téglalap kirajzolása
        draw(ctx) {
            var w2 = globals_1.Globals.GridSizeX / 2.0;
            var h2 = globals_1.Globals.GridSizeY / 2.0;
            ctx.beginPath();
            ctx.rect(this.x * globals_1.Globals.GridSizeX, this.y * globals_1.Globals.GridSizeY, globals_1.Globals.GridSizeX, globals_1.Globals.GridSizeY);
            ctx.fillStyle = "blue"; // A színe lehet más is
            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
    }
    exports.RectangleElement = RectangleElement;
});
