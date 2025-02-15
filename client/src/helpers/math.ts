export function degreesToRadians(degrees: number) {
    return degrees * Math.PI / 180;
}

type Direction = { x: number; y: number };
const directions: Direction[] = [
    { x: 1, y: 0 },  // 0° (jobbra)
    { x: 1, y: 1 },  // 45° (jobbra-le)
    { x: 0, y: 1 },  // 90° (le)
    { x: -1, y: 1 }, // 135° (balra-le)
    { x: -1, y: 0 }, // 180° (balra)
    { x: -1, y: -1 },// 225° (balra-fel)
    { x: 0, y: -1 }, // 270° (fel)
    { x: 1, y: -1 }, // 315° (jobbra-fel)
];


export class Point {
    x: number = 0;
    y: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    isEqual(p: Point) {
        return this.x == p.x && this.y == p.y
    }
    // fromXy(x: number, y: number) {
    //     return new Point(x, y)
    // }
}

export class Rect extends Point {
    width: number = 0
    height: number = 0
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y)
        this.width = w
        this.height = h
    }

    grow(w: number, h: number) {
        this.width += w
        this.height += h
    }

    pointIn(p: Point) {
        return p.x >= this.left && p.x <= this.right && p.y >= this.top && p.y <= this.bottom
    }

    get left(): number {
        return this.x
    }
    get right(): number {
        return this.x + this.width
    }

    get top(): number {
        return this.y
    }
    get bottom(): number {
        return this.y + this.height
    }
}
export function getDirection(angle: number) {
    const a = ((angle % 360) + 360) % 360;
    const index = Math.round(a / 45) % directions.length;
    return directions[index];
}

export function getDirectionXy(point: Point, angle: number) {
    const d = getDirection(angle);
    var p = new Point(point.x + d.x, point.y + d.y)
    return p
}

