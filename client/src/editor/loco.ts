// import { List } from "../../../common/src/list";
// import { SpeedModes } from "../../../common/src/dcc";
// import { SpeedometerElement } from "./speedometer";


// export class LocoFunction {
//     fid: number = 0;
//     name: string = "na";
//     delay: number = 0;
//     button: LocoFunctionElement
//     mouseDownHandler?: (sender: LocoFunction, e: MouseEvent) => void;
//     mouseUpHandler?: (sender: LocoFunction, e: MouseEvent) => void;

//     constructor(fid: number, name: string, delay: number, callback: any) {

//         this.fid = fid;
//         this.name = name
//         this.delay = delay
//         this.button = document.createElement('loco-function-element') as LocoFunctionElement
//         this.button.init(fid, name)
//         this.mouseDownHandler = callback
//     }
//     private _isOn: boolean = false;
//     public get isOn(): boolean {
//         return this._isOn;
//     }
//     public set isOn(v: boolean) {
//         this._isOn = v;
//         if (v) {
//             this.button.classList.add("active")
//         } else {
//             this.button.classList.remove("active")
//         }
//     }

// }

// export class LocoFunctionElement extends HTMLElement {

//     constructor() {
//         super()
//     }

//     connectedCallback() {
//         this.className = "btnLocoFunction"
//     }

//     init(fid: number, name: string) {
//         this.innerHTML = `<div>F${fid}<br>${name}</div>`
//     }
// }
// customElements.define('loco-function-element', LocoFunctionElement);


// export class LocoElement extends HTMLElement {
//     functions: Array<LocoFunction> = new Array<LocoFunction>()
//     name: string = "";
//     address: number = 3;
//     speedMode: SpeedModes = SpeedModes.S128;
//     forward: boolean = false
//     speed: number = 0
//     locoFunctionsPanel: HTMLDivElement
//     mouseDownHandler?: (sender: LocoElement, e: MouseEvent) => void |undefined;
//     constructor() {
//         super()

//         this.locoFunctionsPanel = document.getElementById("locoFunctionsPanel") as HTMLDivElement
//         this.onclick = (e: MouseEvent) => {
//             if (this.mouseDownHandler) {
//                 this.mouseDownHandler(this, e)
//             }
//         }
//     }

//     init(name: string, img: string, address: number, mode: SpeedModes, functions: List<LocoFunctionElement> | undefined) {
//         this.name = name
//         this.address = address
//         this.speedMode = mode
//         this.className = "locoItem"
//         this.innerHTML = `
//                 <div>
//                     <img src="${img}">
//                 </div>
//                 <div>#${this.address} ${this.name}</div>
//         `

//     }
//     addFunction(f: LocoFunction) {
//         this.functions.push(f)
//         f.button.onmousedown = ((e: MouseEvent) => {
//             //f.isOn = !f.isOn
//             if (f.mouseDownHandler) {
//                 f.mouseDownHandler(f, e);
//             }
//         }).bind(this)
//         f.button.onmouseup = ((e: MouseEvent) => {
//             //f.isOn = !f.isOn
//             if (f.mouseUpHandler) {
//                 f.mouseUpHandler(f, e);
//             }
//         }).bind(this)
//     }
//     show() {
//         this.locoFunctionsPanel.innerHTML = ""
//         this.functions.forEach((f: LocoFunction) => {
//             this.locoFunctionsPanel.appendChild(f.button)
//             f.isOn = f.isOn
//         });

//     }
// }
// customElements.define('loco-element', LocoElement);

// export class Locos {
//     locos: Array<LocoElement> = new Array<LocoElement>()
//     locosUIList: HTMLDivElement;
//     speedometer: SpeedometerElement;
//     io: any;
//     btnForward: HTMLDivElement;
//     btnStop: HTMLDivElement;
//     btnReverse: HTMLDivElement;
//     btnSpeed10: HTMLDivElement;
//     btnSpeed20: HTMLDivElement;
//     btnSpeed40: HTMLDivElement;
//     btnSpeed80: HTMLDivElement;
//     btnSpeed100: HTMLDivElement;
//     constructor(io: Socket) {
//         this.io = io
//         this.locosUIList = document.getElementById("locosList") as HTMLDivElement
//         this.speedometer = document.getElementById("speedometer") as SpeedometerElement
//         this.speedometer.setMaxSpeed(160);
//         this.speedometer.setSpeed(0);

//         this.btnForward = document.getElementById("btnForward") as HTMLDivElement
//         this.btnForward.onclick = (e: MouseEvent) => {
//             this.currentLoco!.forward = true
//             this.io.emit("locoDrive", { address: this._currentLoco?.address, speedMode: this.currentLoco!.speedMode, forward: this.currentLoco!.forward, speed: this.currentLoco!.speed })
//         }
//         this.btnStop = document.getElementById("btnStop") as HTMLDivElement
//         this.btnStop.onclick = (e: MouseEvent) => {
//             this.currentLoco!.speed = 0
//             this.io.emit("locoDrive", { address: this._currentLoco!.address, speedMode: this.currentLoco!.speedMode, forward: this.currentLoco!.forward, speed: this.currentLoco!.speed })
//         }
//         this.btnReverse = document.getElementById("btnReverse") as HTMLDivElement
//         this.btnReverse.onclick = (e: MouseEvent) => {
//             this.currentLoco!.forward = false
//             this.io.emit("locoDrive", { address: this._currentLoco!.address, speedMode: this.currentLoco!.speedMode, forward: this.currentLoco!.forward, speed: this.currentLoco!.speed })
//         }
//         this.btnSpeed10 = document.getElementById("btnSpeed10") as HTMLDivElement
//         this.btnSpeed10.onclick = (e: MouseEvent) => {
//             this.currentLoco!.speed = 10
//             this.io.emit("locoDrive", { address: this._currentLoco!.address, speedMode: this.currentLoco!.speedMode, forward: this.currentLoco!.forward, speed: this.currentLoco!.speed })
//         }
//         this.btnSpeed20 = document.getElementById("btnSpeed20") as HTMLDivElement
//         this.btnSpeed20.onclick = (e: MouseEvent) => {
//             this.currentLoco!.speed = 20
//             this.io.emit("locoDrive", { address: this._currentLoco!.address, speedMode: this.currentLoco!.speedMode, forward: this.currentLoco!.forward, speed: this.currentLoco!.speed })
//         }
//         this.btnSpeed40 = document.getElementById("btnSpeed40") as HTMLDivElement
//         this.btnSpeed40.onclick = (e: MouseEvent) => {
//             this.currentLoco!.speed = 40
//             this.io.emit("locoDrive", { address: this._currentLoco!.address, speedMode: this.currentLoco!.speedMode, forward: this.currentLoco!.forward, speed: this.currentLoco!.speed })
//         }
//         this.btnSpeed80 = document.getElementById("btnSpeed80") as HTMLDivElement
//         this.btnSpeed80.onclick = (e: MouseEvent) => {
//             this.currentLoco!.speed = 80
//             this.io.emit("locoDrive", { address: this._currentLoco!.address, speedMode: this.currentLoco!.speedMode, forward: this.currentLoco!.forward, speed: this.currentLoco!.speed })
//         }
//         this.btnSpeed100 = document.getElementById("btnSpeed100") as HTMLDivElement
//         this.btnSpeed100.onclick = (e: MouseEvent) => {
//             this.currentLoco!.speed = 120
//             this.io.emit("locoDrive", { address: this._currentLoco!.address, speedMode: this.currentLoco!.speedMode, forward: this.currentLoco!.forward, speed: this.currentLoco!.speed })
//         }
//     }

//     updateUI() {

//         this.btnStop.className = this.currentLoco!.speed == 0 ? "btn btnControl active" : "btn btnControl"
//         this.btnSpeed10.className = this.currentLoco!.speed == 10 ? "btn btnControl active" : "btn btnControl"
//     }

//     private _currentLoco: LocoElement | undefined;
//     public get currentLoco(): LocoElement | undefined {
//         return this._currentLoco;
//     }
//     public set currentLoco(v: LocoElement) {
//         if (this._currentLoco) {
//             this._currentLoco!.classList.remove('active')
//         }
//         this._currentLoco = v;
//         if (this._currentLoco) {
//             this._currentLoco!.classList.add('active')
//             this.speedometer.loco = this._currentLoco;
//             v.show()
//             //this.locoFunctionsPanel.innerHTML = html
//         }
//     }

//     locoClicked(sender: LocoElement, e: MouseEvent) {
//         this.currentLoco = sender as LocoElement
//     }
    
//     functionMouseDown(sender: LocoFunction, e: MouseEvent) {
//         if (sender.delay > 0) {
//             //sender.isOn = true;
//             this.io.emit("btnFunction", { address: this.currentLoco?.address, fn: sender.fid, on: true, delay: sender.delay })
//             setTimeout(() => {
//                 sender.isOn = false;
//                 this.io.emit("btnFunction", { address: this.currentLoco?.address, fn: sender.fid, on: true, delay: sender.delay })
//             }, sender.delay)
//         } else {
//             //sender.isOn = !sender.isOn
//             this.io.emit("btnFunction", { address: this.currentLoco?.address, fn: sender.fid, on: !sender.isOn, delay: sender.delay })
//         }
//     }

//     load(config: any) {
//         this.locosUIList.innerHTML = "";

//         var loco1 = document.createElement("loco-element") as LocoElement
//         this.locos.push(loco1)
//         this.locosUIList.appendChild(loco1)
//         loco1.init("CSÖRGŐ 2182", './images/locos/csorgo.png', 11, SpeedModes.S128, undefined)
//         loco1.mouseDownHandler = this.locoClicked.bind(this);
//         for (var i = 0; i <= 28; i++) {
//             loco1.addFunction(new LocoFunction(i, "F" + i, 0, this.functionMouseDown.bind(this)))
//         }

//         var loco2 = document.createElement("loco-element") as LocoElement
//         this.locosUIList.appendChild(loco2)
//         loco2.init("BOBÓ 148", './images/locos/bobo.png', 18, SpeedModes.S128, undefined)
//         loco2.mouseDownHandler = this.locoClicked.bind(this);
//         loco2.addFunction(new LocoFunction(0, "LIGHT", 0, this.functionMouseDown.bind(this)))
//         loco2.addFunction(new LocoFunction(1, "ENGINE", 0, this.functionMouseDown.bind(this)))
//         loco2.addFunction(new LocoFunction(2, "<small>l</small>HORN", 500, this.functionMouseDown.bind(this)))
//         loco2.addFunction(new LocoFunction(3, "<small>s</small>HORM", 500, this.functionMouseDown.bind(this)))
//         this.locos.push(loco2)

//         this.currentLoco = loco1
//     }
// }