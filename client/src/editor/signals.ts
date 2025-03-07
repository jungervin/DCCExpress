import { degreesToRadians } from "../helpers/math";
import { TrackElement } from "./track";
import { RailView } from "./view";
import { ApiCommands, iSetBasicAccessory, iData, OutputModes, iSetOutput } from "../../../common/src/dcc";
import { drawTextWithRoundedBackground } from "../helpers/graphics";
import { wsClient } from "../helpers/ws";
import { Globals } from "../helpers/globals";

export enum SignalStates {
    green,
    red,
    yellow,
    white
}

class SignalLight {
    value: number;
    color: string;
    constructor(value: number, color: string) {
        this.value = value
        this.color = color
    }
}
export class Signal1Element extends RailView {
    outputMode: OutputModes = OutputModes.accessory;
    address: number;
    addressLength: number = 5; // Digitools signal decoder must be 5 address
    trackElem: TrackElement
    max: number = 1
    //device?: iCommandCenter | null;

    isExtendedDecoder: boolean = false;


    lights: SignalLight[] = [
        { value: 0, color: "lime" },
        { value: 0, color: "red" },
        { value: 0, color: "yellow" },
        { value: 0, color: "white" },
    ]
    lightsAll: boolean = false;
    showAddress: boolean = false;
    // showTrackElem: boolean = true;

    constructor(uuid: string, address: number, x1: number, y1: number, name: string) {
        super(uuid, x1, y1, name)
        this.address = address
        this.angleStep = 90

        this.trackElem = new TrackElement("", x1, y1, "")
        this.trackElem.angleStep = 90
    }

    connectedCallback() {

    }

    static observedAttributes = ["lightsAll"];
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case 'lightsAll': this.lightsAll = newValue == 'true'
                break
        }
    }

    get type(): string {
        return 'signal2'
    }

    get lastAddress(): number {
        return this.address + this.addressLength
    }

    private _aspect: number = 2;
    public get aspect(): number {
        return this._aspect;
    }
    public set aspect(v: number) {
        if (v < 0) {
            v = 1
        } else if (v > this.lights.length) {
            v = this.lights.length
        }
        this._aspect = v;
    }


    private _value: number = 0;
    public get value(): number {
        return this._value;
    }
    public set value(v: number) {
        this._value = v;
    }

    mouseDown(e: MouseEvent) {

        // if (this.mouseDownHandler) {
        //     this.mouseDownHandler(this)
        // }

        var i = this.lights.findIndex((l) => {
            return l.value == this.value;
        })

        i++
        if (i >= this.max) {
            i = 0
        }
        this.send(this.lights[i].value)
    }

    sendGreen() {
        this.send(this.valueGreen)
    }
    sendRed() {
        this.send(this.valueRed)
    }
    sendYellow() {
        this.send(this.valueYellow)
    }
    sendWhite() {
        this.send(this.valueWhite)
    }

    setValue(address: number, v: boolean) {
        if (address >= this.address && address <= (this.lastAddress - 1)) {

            var i = address - this.address
            var mask = (1 << i)
            if (v) {
                this.value = (this.value | mask) & 0b0001_1111
            } else {
                this.value = (this.value & (~mask)) & 0b0001_1111
            }

            switch (this.value) {
                case this.valueGreen:
                    this.state = SignalStates.green
                    break;
                case this.valueYellow:
                    if (this.max > 2) {
                        this.state = SignalStates.yellow
                    } else {
                        this.state = SignalStates.red
                    }
                    break;
                case this.valueWhite:
                    if (this.max > 3) {
                        this.state = SignalStates.white
                    } else {
                        this.state = SignalStates.red
                    }
                    break;
                default: this.state = SignalStates.red
            }

            console.log("SIGNAL:", this.name, address, v, this.value)

        }
    }

    get isGreen(): boolean {
        return this.state == SignalStates.green
    }
    get isRed(): boolean {
        return this.state == SignalStates.red
    }
    get isYellow(): boolean {
        return this.state == SignalStates.yellow
    }
    get isWhite(): boolean {
        return this.state == SignalStates.white
    }

    // Api functions
    setGreen(): void {
        this.state = SignalStates.green
    }

    setRed(): void {
        this.state = SignalStates.red
    }
    setYellow(): void {
        this.state = SignalStates.yellow
    }
    setWhite(): void {
        this.state = SignalStates.white
    }

    sendRedIfNotRed() {
        if (!this.isRed) {
            this.sendRed();
        }
    }

    sendGreenIfNotGreen() {
        if (!this.isGreen) {
            this.sendGreen();
        }
    }

    sendYellowIfNotYellow() {
        if (!this.isYellow) {
            this.sendYellow();
        }
    }

    sendWhiteIfNotWhite() {
        if (!this.isWhite) {
            this.sendWhite();
        }
    }

    public get canRotate(): boolean {
        return true
    }
    public get hasProperties(): boolean {
        return true
    }

    public get valueGreen(): number {
        return this.lights[0].value;
    }
    public set valueGreen(v: number) {
        this.lights[0].value = v;
    }
    public get valueRed(): number {
        return this.lights[1].value;
    }
    public set valueRed(v: number) {
        this.lights[1].value = v;
    }
    public get valueYellow(): number {
        return this.lights[2].value;
    }
    public set valueYellow(v: number) {
        this.lights[2].value = v;
    }
    public get valueWhite(): number {
        return this.lights[3].value;
    }
    public set valueWhite(v: number) {
        this.lights[3].value = v;
    }

    drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.drawSignal(ctx)
        this.drawAddress(ctx)
        super.draw(ctx)
    }
    public drawSignal(ctx: CanvasRenderingContext2D) {
        ctx.save()

        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(degreesToRadians(this.angle));
        ctx.translate(-this.centerX, -this.centerY);

        var x = this.posLeft + 6;
        var y = this.centerY - (this.trackElem.visible ? 11 : 0)
        var r = this.width / 13
        var d = 2 * r
        var h = d + 4
        var aa = this.aspect;
        if(Globals.Settings.EditorSettings.DispalyAsSingleLamp) {
            aa = 1;
        }


        var a = aa < 2 ? 2 : aa

        
        ctx.beginPath()
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        ctx.roundRect(x - 4, y - r - 2, a * d + 5, 2 * r + 4, h)
        //ctx.roundRect(300, 5, 200, 100, [50, 0, 25, 0]);
        ctx.fill();
        ctx.stroke()

        ctx.beginPath()
        ctx.lineWidth = 1;
        ctx.strokeStyle = "white";
        ctx.fillStyle = "black";
        ctx.roundRect(x - 3, y - r - 1, a * d + 3, 2 * r + 2, h)

        ctx.fillRect(x, y - r / 2, this.width - 10, r)

        ctx.fillRect(this.posRight - 4, y - r / 2 - 3, 2, r + 6)

        //ctx.fillRect(this.posLeft + this.width - 6, y - r / 2 - 4, 2, 11)
        ctx.fill();
        ctx.stroke()

        x += aa == 1 ? 3 : 1
        if (aa == 1) {
            this.drawCircle(ctx,
                x, y,
                r,
                this.lights[this.state].color)
        } else {
            for (var i = 0; i < aa; i++) {

                if (this.lightsAll) {
                    this.drawCircle(ctx,
                        x + i * d, y,
                        r,
                        this.lights[i].color)
                } else {
                    this.drawCircle(ctx,
                        x + i * d, y,
                        r,
                        i == this.state ? this.lights[this.state].color : 'gray')
                }
            }
        }

        ctx.restore();
        if (this.trackElem.visible) {
            this.trackElem.x = this.x;
            this.trackElem.y = this.y
            this.trackElem.angle = this.angle
            this.trackElem.occupied = this.occupied
            this.trackElem.isRoute = this.isRoute
            this.trackElem.draw(ctx)
        }
        ctx.restore();
        // super.draw(ctx)

    }

    drawAddress(ctx: CanvasRenderingContext2D) {
        if (this.showAddress) {
            var addr = "#" + this.address
            drawTextWithRoundedBackground(ctx, this.posLeft, this.posBottom - 10, addr)
        }
    }

    private _state: SignalStates = SignalStates.red;
    public get state(): SignalStates {
        return this._state;
    }
    public set state(v: SignalStates) {
        this._state = v;
    }

    send(bits: number) {

        var addr = this.address;
        var len = this.addressLength & 5;
        for (var i = 0; i < len; i++) {

            const value = ((bits >> i) & 1) == 1; 
            if (this.outputMode == OutputModes.accessory) {
                var d: iSetBasicAccessory = { address: this.address + i, value: value }
                wsClient.send({ type: ApiCommands.setBasicAccessory, data: d } as iData);
            } else {
                var d: iSetOutput = { address: this.address + i, value: value}
                wsClient.send({ type: ApiCommands.setOutput, data: d } as iData);
            }
        }
    }
}

export class Signal2Element extends Signal1Element {

    constructor(uuid: string, address: number, x1: number, y1: number, name: string) {
        super(uuid, address, x1, y1, name)
        this.aspect = 2
        this.max = 2;
    }

    get type(): string {
        return 'signal2'
    }
}

export class Signal3Element extends Signal1Element {

    constructor(uuid: string, address: number, x1: number, y1: number, name: string) {
        super(uuid, address, x1, y1, name)
        this.aspect = 3
        this.max = 3;
    }

    get type(): string {
        return 'signal3'
    }
}

export class Signal4Element extends Signal1Element {

    constructor(uuid: string, address: number, x1: number, y1: number, name: string) {
        super(uuid, address, x1, y1, name)
        this.aspect = 4
        this.max = 4;
    }

    get type(): string {
        return 'signal4'
    }
}

// export class Signal5Element extends Signal4Element {
//     valueBlue: number = 0;

//     get type(): string {
//         return 'signal5'
//     }

//     public draw(ctx: CanvasRenderingContext2D) {
//         var w = (settings.GridSizeX - 20) / 3.0
//         var h = (settings.GridSizeY - 10) / 3.5 + 1
//         var r = w / 2
//         var y = this.centerY - 11
//         ctx.save()

//         ctx.translate(this.centerX, this.centerY);
//         ctx.rotate(degreesToRadians(this.angle));
//         ctx.translate(-this.centerX, -this.centerY);

//         ctx.beginPath()
//         ctx.lineWidth = 1;
//         ctx.strokeStyle = "black";
//         ctx.fillStyle = "black";
//         ctx.roundRect(this.posLeft, y - r - 2, this.width - 3, 2 * r + 4, h)
//         //ctx.roundRect(300, 5, 200, 100, [50, 0, 25, 0]);
//         ctx.fill();
//         ctx.stroke()

//         ctx.beginPath()
//         ctx.lineWidth = 1;
//         ctx.strokeStyle = "white";
//         ctx.fillStyle = "black";
//         ctx.roundRect(this.posLeft + 1, y - r - 1, this.width - 5, 2 * r + 2, h)
//         ctx.fillRect(this.posLeft + this.width - 6 * r, y - r / 2, this.width - 6 * r, r)
//         //ctx.roundRect(300, 5, 200, 100, [50, 0, 25, 0]);
//         ctx.fill();
//         ctx.stroke()

//         ctx.lineWidth = 1;
//         ctx.strokeStyle = Colors.TrackPrimaryColor

//         //if (this.angle == 0)
//         {
//             this.drawCircle(ctx, this.PositionX + r * 2, y, r, this.state == SignalStates.green ? "lime" : "gray")
//             this.drawCircle(ctx, this.PositionX + r * 4, y, r, this.state == SignalStates.yellow ? "yellow" : "gray")
//             this.drawCircle(ctx, this.PositionX + r * 6, y, r, this.state == SignalStates.red ? "red" : "gray")
//             this.drawCircle(ctx, this.PositionX + r * 8, y, r, this.state == SignalStates.white ? "white" : "gray")
//             this.drawCircle(ctx, this.PositionX + r * 10 - 1, y, r - 1, this.state == SignalStates.blue ? "blue" : "gray")

//             ctx.restore()
//             this.trackElem.x = this.x;
//             this.trackElem.y = this.y
//             this.trackElem.angle = this.angle
//             this.trackElem.draw(ctx)
//             super.drawSelection(ctx)
//         }

//     }
// }
