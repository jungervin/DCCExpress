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
            var w2 = globals_1.Globals.AppSettings.GridSizeX / 2.0;
            var h2 = globals_1.Globals.AppSettings.GridSizeY / 2.0;
            ctx.beginPath();
            ctx.rect(this.x * globals_1.Globals.AppSettings.GridSizeX, this.y * globals_1.Globals.AppSettings.GridSizeY, globals_1.Globals.AppSettings.GridSizeX, globals_1.Globals.AppSettings.GridSizeY);
            ctx.fillStyle = "blue"; // A színe lehet más is
            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
    }
    exports.RectangleElement = RectangleElement;
});
