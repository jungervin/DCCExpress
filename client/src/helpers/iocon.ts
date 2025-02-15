// import { Socket, io } from "socket.io-client";
// import { ApiCommands, iRBus, iTurnout } from "../../../common/src/dcc";
// import { IIOConnection } from "../../../common/src/iioconn";

// export class IOConn {

//     static socket: Socket;
//     static rbus: { [address: number]: iRBus } = {};
//     static initialize(url: string) {
//         IOConn.socket = io(url)
//         IOConn.socket.emit("message", "Helló, szerver!")

//     }
    
//     static sendTurnoutCmd(to: iTurnout): void {
//         IOConn.socket.emit(ApiCommands.turnoutClicked, to);
//     }

//     // static sendTurnoutCmd(to: TurnoutElement) {
//     //     //if(to inst)
//     //     this.socket.emit(ApiCommands.turnoutClicked, {address: to.address, isClosed: to.isClosed, wait: settings.TurnoutWaitTime} as iTurnout)
//     // }
//     // static sendTurnoutCmd(to: iTurnout) {
//     //     //if(to inst)
//     //     this.socket.emit(ApiCommands.turnoutClicked, to)
//     // }
// }

