"use strict";
// import net from 'net';
// import { CommandCenter } from './commandcenter';
// export class DCCExCommandCenter extends CommandCenter{
//     tcpClient: net.Socket = new net.Socket();
//     ip: string;
//     port: number;
//     constructor(ip: string, port: number) {
//         super('', '')
//         this.ip = '192.168.1.138'
//         this.port = 2560
//     }
//     connect() {
//         try {
//             this.tcpClient.setKeepAlive(false, 1000);
//             this.tcpClient.connect(this.port, this.ip, () => {
//                 console.log('tcpClient Connected');
//                 //connected = true;
//                 // setInterval(loop, 1000)
//                 // dispatcherTask()
//                 //io.emit("tcpConnectEvent")
//                 //tcpSend("<T>")
//                 // setInterval(() => {
//                 //     //tcpClient.write('<#>');
//                 //     tcpSend("<#>")
//                 // }, 5000)
//             });
//         } catch (error) {
//             console.log("tcpserver could not connect!")
//         }
//     }
//     disconnect(): void {
//         throw new Error('Method not implemented.');
//     }
//     send(data: any): void {
//         throw new Error('Method not implemented.');
//     }
//     receive(data: any): void {
//         throw new Error('Method not implemented.');
//     }
//     error(error: any): void {
//         throw new Error('Method not implemented.');
//     }
// }
//# sourceMappingURL=dccextcp.js.map