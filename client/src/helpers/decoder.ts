// import { ApiCommands, iCommandCenter, iTurnout, TURNOUT_WAIT_TIME } from "../../../common/src/dcc"
// import { IOConn } from "./iocon"



// // export enum DCCProtocols {
// //     na,
// //     DCCEx,
// //     Z21
// // }

// export class Decoder {
//     address: number = 0
//     on: boolean = false
//     onValue: boolean = true
//     // offValue: boolean = false
    

//     constructor(address: number) {
//         this.address = address
//     }

//     isOn() {
//         return this.on //== this.onValue
//     }

//     setOn(on: boolean) {
//         this.on =  on //? this.onValue : this.offValue
//     }

//     toggle() {
//         this.setOn(!this.isOn())
//     }

//     public send() {

//         var to: iTurnout = {address: this.address, isClosed: this.on ? this.onValue : !this.onValue, device: this.device}
//         IOConn.socket.emit(ApiCommands.turnoutClicked, to);

//         //IOConn.sendTurnoutCmd({ address: this.address, isClosed: this.isOn() } as iTurnout)
//     }

    
//     private _device? : iCommandCenter;
//     public get device() : iCommandCenter {
//         return this._device!;
//     }
//     public set device(v : iCommandCenter) {
//         this._device = v;
//     }
    
// }

// export class Decoders extends Array<Decoder> {
//     hasAddress(address: number) {
//         return this.find((a) => {
//             return a.address == address
//         })
//     }

//     post() {
//         if(this.device) {

//         var wait = 0
//         this.forEach((d) => {
//             setTimeout(() => {
//                 d.send()
//             }, wait)
//             wait += TURNOUT_WAIT_TIME
//         })}
//         else {
//             alert("Device not configured!")
//         }
//     }

//     private _device? : iCommandCenter
//     public get device() : iCommandCenter {
//         return this._device!;
//     }
//     public set device(v : iCommandCenter) {
//         this._device = v
//         this.forEach((d) => {
//             d.device = v
//         })
//     }


// }