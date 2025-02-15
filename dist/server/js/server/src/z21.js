"use strict";
// import dgram from "dgram";
// import { Server as IOServer } from 'socket.io';
// import { accessories, ApiCommands, CommandCenterTypes, iAlertData, iCommandCenter, iLoco, iZ21CommandCenter, locos, rbus, TURNOUT_WAIT_TIME, turnouts, Z21Directions } from '../../common/src/dcc';
// import { add, functions } from "lodash";
// import { CommandCenters } from "./commandcenters";
// import { io } from "./io";
// // import { Z21CommandCenter } from "./z21commandcenter";
// import { CommandCenter } from "./commandcenter";
// //import { connect } from "http2";
// const Z21_PORT = 21105;
// const cLAN_X_TURNOUT_INFO = 0x43
// const cLAN_SYSTEMSTATE_DATACHANGED = 0x84
// export class Z21 extends CommandCenter {
//     taskId: NodeJS.Timeout;
//     // send(data: any): void {
//     //     throw new Error("Method not implemented.");
//     // }
//     // //type: string;
//     // connect(): void {
//     //     throw new Error("Method not implemented.");
//     // }
//     // disconnect(): void {
//     //     this.udp.disconnect()
//     // }
//     // receive(data: any): void {
//     //     throw new Error("Method not implemented.");
//     // }
//     // error(error: any): void {
//     //     throw new Error("Method not implemented.");
//     // }
//     get device(): iZ21CommandCenter {
//         return { uuid: this.uuid, name: this.name, type: CommandCenterTypes.Z21, ip: this.z21Address, port: this.z21Port, isDefault: this.isDefault }
//     }
//     z21Address: string;
//     z21Port: number;
//     io: any;
//     udp: dgram.Socket;
//     buffer: any;
//     nextTime: number = 0;
//     lastMessageReceivedTime: number = 0;
//     constructor(uuid: string, name: string, z21Address: string, z21Port: number, io: IOServer) {
//         super(uuid, name)
//         this.z21Address = z21Address
//         this.z21Port = z21Port
//         this.io = io
//         this.udp = dgram.createSocket("udp4")
//         try {
//             this.udp.bind(Z21_PORT);
//         } catch (error) {
//             console.log("Z21:", error)
//         }
//         this.buffer = []
//         this.taskId = setInterval(() => {
//             if (this.buffer.length > 0) {
//                 var data: any[] = []
//                 while (this.buffer.length > 0 && data.length < 1024) {
//                     data = data.concat(this.buffer.shift().data)
//                 }
//                 this.udp.send(Buffer.from(data), this.z21Port, this.z21Address, (err) => {
//                     if (err) {
//                         console.error("Z21 Hiba az üzenet küldésekor:", err);
//                     } else {
//                         console.log(` Z1 Üzenet elküldve: ${data}`);
//                     }
//                 })
//                 this.lastMessageReceivedTime = performance.now()
//                 //var data = this.buffer.shift()
//                 // if (performance.now() > this.nextTime) {
//                 //     this.z21.send(Buffer.from(data.data), this.z21Port, this.z21Address, (err) => {
//                 //         if (err) {
//                 //             console.error("Hiba az üzenet küldésekor:", err);
//                 //         } else {
//                 //             console.log(`Üzenet elküldve a szervernek: ${data.data.toString()}`);
//                 //         }
//                 //     })
//                 //     this.nextTime = performance.now() + data.wait
//                 // }
//             }
//             if ((performance.now() - this.lastMessageReceivedTime) > 30000) {
//                 this.LAN_SET_BROADCASTFLAGS()
//                 // Fel kell írni a mozdonyokat is!!!
//                 for (const [k, v] of Object.entries(locos)) {
//                     this.LAN_X_GET_LOCO_INFO(v.address)
//                 }
//                 this.lastMessageReceivedTime = performance.now()
//                 console.log("resubscribe")
//             }
//         }, 10)
//         this.udp.on("listening", () => {
//             const address = this.udp.address();
//             console.log(`Szerver fut: ${address.address}:${address.port}`);
//             console.log('Receive Buffer Size:', this.udp.getRecvBufferSize());
//             console.log('Send Buffer Size:', this.udp.getSendBufferSize());
//         });
//         this.udp.on("message", (payload: any, rinfo) => {
//             rinfo.size
//             const length = payload.readUInt16LE(0);
//             var i = 0;
//             while (i < payload.length) {
//                 var len = payload.readUInt16LE(i);
//                 var data = payload.slice(i, i + len)
//                 i += len
//                 this.parse(data)
//             }
//             if (i != rinfo.size) {
//                 console.log("Z21 on message: eltérő méretek!")
//                 console.log("rinfo.size:", rinfo.size)
//                 console.log("payload:", i)
//                 this.io.emit(ApiCommands.alert, { msg: "Z21 on message: eltérő méretek!" } as iAlertData)
//             }
//         });
//         this.LAN_SET_BROADCASTFLAGS()
//         //this.LAN_GET_BROADCASTFLAGS()
//     }
//     parse(data: any) {
//         this.lastMessageReceivedTime = performance.now()
//         console.log(`Válasz érkezett a z21-től: ${data.toString("hex")}`);
//         var len = data.readUInt16LE(0)
//         var header = data.readUInt16LE(2)
//         if (header == 0x40) {
//             var xheader = data.readUInt8(4)
//             //========================================
//             // LAN_X_TURNOUT_INFO
//             //========================================
//             if (len == 0x09 && xheader == cLAN_X_TURNOUT_INFO) {
//                 var msb = data.readUInt8(5)
//                 var lsb = data.readUInt8(6)
//                 var zz = data.readUInt8(7)
//                 var xor = data.readUInt8(8)
//                 var valid = (xheader ^ msb ^ lsb ^ zz) == xor
//                 var closed = false
//                 var address = (msb << 8) + lsb
//                 zz = data.readUInt8(7) & 0x03
//                 var state = "NA"
//                 switch (zz) {
//                     case 0: state = "Turnout not switched yet"
//                         break
//                     case 1: state = "pos: P0"
//                         closed = false
//                         break
//                     case 2: state = "pos: P1"
//                         closed = true
//                         break
//                     case 3: state = "Invalid"
//                         break
//                 }
//                 // var payload = {
//                 //     valid: valid,
//                 //     address: address + 1,
//                 //     zz: zz,
//                 //     state: state,
//                 //     closed: closed,
//                 //     length: length
//                 // }
//                 //this.EMIT_TURNOUT_STATES()
//                 //this.io.emit("turnoutState", { address: address + 1, isClosed: closed, device: this.device })
//                 this.io.emit(ApiCommands.turnoutState, { address: address + 1, isClosed: closed, device: this.device })
//                 accessories[address] = { address: address + 1, value: closed, device: this.device }
//                 //var device: iCommandCenter = {id: this.uuid, name: this.name, type: CommandCenterTypes.Z21}
//                 turnouts[address] = { address: address + 1, isClosed: closed, device: this.device }
//                 console.log("emit: ", "turnoutState", { address: address + 1, isClosed: closed })
//             }
//             //========================================
//             // LAN_X_LOCO_INFO
//             //========================================
//             else if (xheader == 0xef && data.length >= 10) {
//                 console.log("Z21 LAN_X_LOCO_INFO:")
//                 var db0 = data.readUInt8(5)
//                 var db1 = data.readUInt8(6)
//                 console.log("db0", db0)
//                 console.log("db1", db1)
//                 var db2 = data.readUInt8(7)
//                 var db3 = data.readUInt8(8)
//                 var db4 = data.readUInt8(9)
//                 var db5 = data.readUInt8(10)
//                 var db6 = data.readUInt8(11)
//                 var db7 = data.readUInt8(12)
//                 var db8 = data.readUInt8(13)
//                 //var address = ((db0 & 0x3F) << 8) | db1
//                 var address: any = data.readInt16BE(5) & 0x3fff
//                 var busy = (db2 & 0b0000_1000) > 0
//                 var speedsteps = (db2 & 0b0000_0111)
//                 var direction = (db3 & 0b1000_0000) > 0 ? Z21Directions.forward : Z21Directions.reverse
//                 var speed = (db3 & 0b0111_1111)
//                 var f0 = ((db4 & 0b0001_0000) >> 4) | ((db4 & 0b0000_1111) << 1)
//                 var f = (db8 << 29) | (db7 << 21) | (db6 << 13) | (db5 << 5) | f0
//                 var loco: iLoco = { address: address, speed: speed, direction: direction, functions: f }
//                 locos[address] = loco
//                 this.io.emit(ApiCommands.locoState, loco)
//                 console.log("addr:    ", address)
//                 console.log("direction: ", direction)
//                 console.log("speed: ", speed)
//                 for (var i = 0; i <= 28; i++) {
//                     console.log("f" + i, (f & (1 << i)) > 0x00 ? 'on' : '')
//                 }
//             }
//         }
//         //========================================
//         // LAN_RMBUS_DATACHANGED
//         //========================================
//         else if (header == 0x80 && data.length >= 10) {
//             const length = data.readUInt16LE(0);
//             const header = data.readUInt16LE(2);
//             if (header == 0x80) {
//                 const group = data.readUInt8(4)
//                 var b1 = data.readUInt8(5)
//                 var b2 = data.readUInt8(6)
//                 const now = Date.now()
//                 rbus[11] = { on: (b1 & 0b0000_0001) > 0, locoAddress: rbus[11] ? rbus[11].locoAddress : 0, dt: now };
//                 rbus[12] = { on: (b1 & 0b0000_0010) > 0, locoAddress: rbus[12] ? rbus[12].locoAddress : 0, dt: now };
//                 rbus[13] = { on: (b1 & 0b0000_0100) > 0, locoAddress: rbus[13] ? rbus[13].locoAddress : 0, dt: now };
//                 rbus[14] = { on: (b1 & 0b0000_1000) > 0, locoAddress: rbus[14] ? rbus[14].locoAddress : 0, dt: now };
//                 rbus[15] = { on: (b1 & 0b0001_0000) > 0, locoAddress: rbus[15] ? rbus[15].locoAddress : 0, dt: now };
//                 rbus[16] = { on: (b1 & 0b0010_0000) > 0, locoAddress: rbus[16] ? rbus[16].locoAddress : 0, dt: now };
//                 rbus[17] = { on: (b1 & 0b0100_0000) > 0, locoAddress: rbus[17] ? rbus[17].locoAddress : 0, dt: now };
//                 rbus[18] = { on: (b1 & 0b1000_0000) > 0, locoAddress: rbus[18] ? rbus[18].locoAddress : 0, dt: now };
//                 rbus[21] = { on: (b2 & 0b0000_0001) > 0, locoAddress: rbus[21] ? rbus[21].locoAddress : 0, dt: now };
//                 rbus[22] = { on: (b2 & 0b0000_0010) > 0, locoAddress: rbus[22] ? rbus[22].locoAddress : 0, dt: now };
//                 rbus[23] = { on: (b2 & 0b0000_0100) > 0, locoAddress: rbus[23] ? rbus[23].locoAddress : 0, dt: now };
//                 rbus[24] = { on: (b2 & 0b0000_1000) > 0, locoAddress: rbus[24] ? rbus[24].locoAddress : 0, dt: now };
//                 rbus[25] = { on: (b2 & 0b0001_0000) > 0, locoAddress: rbus[25] ? rbus[25].locoAddress : 0, dt: now };
//                 rbus[26] = { on: (b2 & 0b0010_0000) > 0, locoAddress: rbus[26] ? rbus[26].locoAddress : 0, dt: now };
//                 rbus[27] = { on: (b2 & 0b0100_0000) > 0, locoAddress: rbus[27] ? rbus[27].locoAddress : 0, dt: now };
//                 rbus[28] = { on: (b2 & 0b1000_0000) > 0, locoAddress: rbus[28] ? rbus[28].locoAddress : 0, dt: now };
//                 console.log("emit RBUS")
//                 //this.io.emit(ApiCommands.rbusStates, rbus)
//                 this.EMIT_RBUS_STATES()
//             }
//         }
//         else if (len == 0x14 && header == cLAN_SYSTEMSTATE_DATACHANGED) {
//             var payload = {
//                 MainCurrent: data.readUInt16LE(4),
//                 ProgCurrent: data.readUInt16LE(6),
//                 FilteredMainCurrent: data.readUInt16LE(8),
//                 Temperature: data.readUInt16LE(10),
//                 SupplyVoltage: data.readUInt16LE(12),
//                 VCCVoltage: data.readUInt16LE(14),
//                 CentralState: data.readUInt8(16),
//                 CentralStateEx: data.readUInt8(17),
//                 Reserved: data.readUInt8(18),
//                 Capabilities: data.readUInt8(19),
//             }
//             this.io.emit("systemstate", payload)
//         }
//     }
//     put(data: any[], wait: number) {
//         this.buffer.push({ data: data, wait: wait })
//     }
//     LAN_SET_BROADCASTFLAGS() {
//         const msg = [0x08, 0x00, 0x50, 0x00, 0x03, 0x01, 0x00, 0x00]
//         this.put(msg, 0)
//     }
//     LAN_GET_BROADCASTFLAGS() {
//         const msg = [0x04, 0x00, 0x51, 0x00]
//         this.put(msg, 0)
//     }
//     LAN_LOGOFF() {
//         clearInterval(this.taskId);
//         this.udp.send(Buffer.from([0x04, 0x00, 0x30, 0x00]), this.z21Port, this.z21Address, (err) => {
//             if (err) {
//                 console.error("Z21 LOG_OFF nem sikerült :", err);
//             } else {
//                 console.log("Z21 LOG_OFF elküldve")
//             }
//         })
//     }
//     private LAN_X_SET_TURNOUT_WITH_Q(addr: number, activate: boolean, on: boolean, wait: number) {
//         addr--;
//         if (addr > 0) {
//             const xheader = 0x53
//             const msb = addr >> 8
//             const lsb = addr & 0xff
//             // 10Q0_A00P 
//             var db2 = 0b1010_0000
//             var db2 = 0b1010_0000
//             db2 = db2 | (activate ? 0b0000_1000 : 0)
//             db2 = db2 | (on ? 0b0000_0001 : 0)
//             var xor = xheader ^ msb ^ lsb ^ db2
//             const msg = [0x09, 0x00, 0x40, 0x00, xheader, msb, lsb, db2, xor]
//             this.put(msg, 10)
//         }
//         else {
//             console.log("LAN_X_SET_TURNOUT invalid Address: ", addr)
//         }
//     }
//     private LAN_X_SET_TURNOUT_WITHOUT_Q(addr: number, activate: boolean, on: boolean, wait: number) {
//         addr--;
//         if (addr > 0) {
//             const xheader = 0x53
//             const msb = addr >> 8
//             const lsb = addr & 0xff
//             // 10Q0_A00P 
//             var db2 = 0b1010_0000
//             var db2 = 0b1000_0000
//             db2 = db2 | (activate ? 0b0000_1000 : 0)
//             db2 = db2 | (on ? 0b0000_0001 : 0)
//             var xor = xheader ^ msb ^ lsb ^ db2
//             const msg = [0x09, 0x00, 0x40, 0x00, xheader, msb, lsb, db2, xor]
//             this.put(msg, 10)
//         }
//         else {
//             console.log("LAN_X_SET_TURNOUT invalid Address: ", addr)
//         }
//     }
//     LAN_X_SET_TURNOUT(addr: number, closed: boolean, wait: number) {
//         this.LAN_X_SET_TURNOUT_WITH_Q(addr, true, closed, 10)
//         setTimeout(() => {
//             this.LAN_X_SET_TURNOUT_WITH_Q(addr, false, closed, 10)
//         }, TURNOUT_WAIT_TIME)
//     }
//     LAN_X_SET_BASICDECODER(addr: number, closed: boolean, wait: number) {
//         this.LAN_X_SET_TURNOUT_WITH_Q(addr, true, closed, 10)
//         setTimeout(() => {
//             this.LAN_X_SET_TURNOUT_WITH_Q(addr, false, closed, 10)
//         }, wait)
//     }
//     LAN_X_GET_TURNOUT_INFO(addr: number) {
//         addr--
//         if (addr > 0) {
//             var xheader = cLAN_X_TURNOUT_INFO
//             var msb = addr >> 8
//             var lsb = addr & 0xff
//             var xor = (xheader ^ msb ^ lsb)
//             this.put([0x08, 0x00, 0x40, 0x00, xheader, msb, lsb, xor], 100)
//         }
//     }
//     LAN_X_SET_LOCO_FUNCTION(addr: number, fn: number, on: boolean) {
//         //0x0A 0x00 0x40 0x00   X-Header    DB0     DB1     DB2     DB3     XOR-Byte
//         //                      0xE4        0xF8    Adr_MSB Adr_LSB TTNN NNNN XOR-Byte
//         var xheader = 0xe4
//         var db0 = 0xf8
//         var msb = (addr & 0x3f) >> 8
//         var lsb = addr & 0xff
//         //fn |= 0b10000000 // on ? fn | 0b0100_0000 : fn & 0b0011_1111
//         fn |= on ? fn | 0b0100_0000 : fn & 0b0011_1111
//         var xor = (xheader ^ db0 ^ msb ^ lsb ^ fn)
//         this.put([0x0a, 0x00, 0x40, 0x00, xheader, db0, msb, lsb, fn, xor], 10)
//         this.LAN_X_GET_LOCO_INFO(addr)
//     }
//     LAN_X_SET_LOCO_DRIVE(addr: number, speedMode: number, forward: boolean, speed: number) {
//         var xheader = 0xe4
//         var db0 = 0x13 // 0x10 | speedMode
//         var msb = (addr & 0x3f) >> 8
//         var lsb = addr & 0xff
//         var db3 = forward ? 0b1000_0000 : 0
//         db3 |= speed & 0b0111_1111
//         var xor = (xheader ^ db0 ^ msb ^ lsb ^ db3)
//         this.put([0x0a, 0x00, 0x40, 0x00, xheader, db0, msb, lsb, db3, xor], 10)
//         //if (locos[addr] == undefined)
//         {
//             this.LAN_X_GET_LOCO_INFO(addr)
//         }
//     }
//     LAN_X_GET_LOCO_INFO(addr: number) {
//         // For locomotive addresses ≥ 128, the two highest bits in DB1 must be set to 1:
//         // DB1 = (0xC0 | Adr_MSB). For locomotive addresses < 128, these two highest bits have no meaning.
//         var xheader = 0xe3
//         var db0 = 0xf0
//         var msb = (addr | 0xc0) >> 8    // DB1
//         var lsb = addr & 0xff           // DB2
//         var xor = (xheader ^ db0 ^ msb ^ lsb)
//         this.put([0x09, 0x00, 0x40, 0x00, xheader, db0, msb, lsb, xor], 10)
//     }
//     LAN_RMBUS_GETDATA() {
//         this.put([0x05, 0x00, 0x81, 0x00, 0x00], 10)
//     }
//     EMIT_TURNOUT_STATES() {
//         this.io.emit(ApiCommands.Turnouts, turnouts)
//     }
//     EMIT_RBUS_STATES() {
//         this.io.emit(ApiCommands.rbusStates, rbus)
//     }
//     // static connect(ip:string, port: number, io: IOServer) {
//     //     z21 = new Z21("192.168.1.70", 21105, io)
//     // }
//     toString(): string {
//         return `Name: ${this.name}, ip: ${this.z21Address}, port: ${this.z21Port}`
//     }
// }
// //export let z21: Z21;
// //export const 
//# sourceMappingURL=z21.js.map