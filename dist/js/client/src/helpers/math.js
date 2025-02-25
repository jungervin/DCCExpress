define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rect = exports.Point = void 0;
    exports.degreesToRadians = degreesToRadians;
    exports.getDirection = getDirection;
    exports.getDirectionXy = getDirectionXy;
    exports.getDistance = getDistance;
    function degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }
    const directions = [
        { x: 1, y: 0 }, // 0° (jobbra)
        { x: 1, y: 1 }, // 45° (jobbra-le)
        { x: 0, y: 1 }, // 90° (le)
        { x: -1, y: 1 }, // 135° (balra-le)
        { x: -1, y: 0 }, // 180° (balra)
        { x: -1, y: -1 }, // 225° (balra-fel)
        { x: 0, y: -1 }, // 270° (fel)
        { x: 1, y: -1 }, // 315° (jobbra-fel)
    ];
    class Point {
        constructor(x, y) {
            this.x = 0;
            this.y = 0;
            this.x = x;
            this.y = y;
        }
        isEqual(p) {
            return this.x == p.x && this.y == p.y;
        }
    }
    exports.Point = Point;
    class Rect extends Point {
        constructor(x, y, w, h) {
            super(x, y);
            this.width = 0;
            this.height = 0;
            this.width = w;
            this.height = h;
        }
        grow(w, h) {
            this.width += w;
            this.height += h;
        }
        pointIn(p) {
            return p.x >= this.left && p.x <= this.right && p.y >= this.top && p.y <= this.bottom;
        }
        get left() {
            return this.x;
        }
        get right() {
            return this.x + this.width;
        }
        get top() {
            return this.y;
        }
        get bottom() {
            return this.y + this.height;
        }
    }
    exports.Rect = Rect;
    function getDirection(angle) {
        const a = ((angle % 360) + 360) % 360;
        const index = Math.round(a / 45) % directions.length;
        return directions[index];
    }
    function getDirectionXy(point, angle) {
        const d = getDirection(angle);
        var p = new Point(point.x + d.x, point.y + d.y);
        return p;
    }
    function getDistance(p1, p2) {
        return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
    }
});
