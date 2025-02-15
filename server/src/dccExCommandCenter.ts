import { log } from "console";
import { accessories, ApiCommands, CommandCenterTypes, DCCExDirections, DCCExTurnout, iData, iLoco, iSetBasicAccessory, iTurnoutInfo, locos, turnouts, Z21Directions } from "../../common/src/dcc";
import { CommandCenter } from "./commandcenter";
import { commandCenters } from "./commandcenters";
import { broadcastAll } from "./ws";

export class DCCExCommandCenter extends CommandCenter {
    // type: CommandCenterTypes | undefined;
    buffer: string[] = []
    power: boolean = false;
    private _data: string = ""

    constructor(name: string) {
        super(name)
    }

    getConnectionString(): string {
        throw new Error("Method not implemented.");
    }

    // locos: { [address: number]: number; };
    // turnouts: { [address: number]: iTurnoutInfo; };
    
    trackPower(on: boolean): void {
        log("DCCEx ", `trackPower(${on})`)
        this.buffer.push('<p>')
    }
    emergenyStop(stop: boolean): void {
        log("DCCEx ", `emergenyStop(${stop})`)
        this.buffer.push('<p>')
    }
    setLocoFunction(address: number, fn: number, on: boolean): void {
        // <F cab funct state> - Turn loco decoder functions ON or OFF
        // 6 Response: <l cab reg speedByte functMap>

        //throw new Error("Method not implemented.");
    }
    clientConnected(): void {
        //throw new Error("Method not implemented.");
    }
    getLoco(address: number): void {
        // <t cab>
        this.buffer.push(`<t ${address}>`)
    }
    
    setLoco(address: number, speed: number, direction: Z21Directions): void {
        // <t cab speed dir>
        this.buffer.push(`<t ${address} ${speed} ${direction}>`)
    }

    start(): void {
        this._data = ""
    }
    stop(): void {
        //throw new Error("Method not implemented.");
    }
    setTurnout(address: number, closed: boolean): void {
        // <T id state>
        var msg = `<T ${address} ${closed ? DCCExTurnout.closed : DCCExTurnout.open}>`
        console.log("DCCEx setTurnout:", msg)
        this.buffer.push(msg)
    }
    getTurnout(address: number): void {
        // <H id state>
        //throw new Error("Method not implemented.");
        //this.buffer.push(`<t ${address} ${closed ? DCCExTurnout.closed : DCCExTurnout.open}>`)

    }
    setAccessoryDecoder(address: number, on: boolean): void {
        accessories[address] = { address: address, value: on } as iSetBasicAccessory
        var msg = `<a ${address} ${on ? 1 : 0}>`
        console.log("setAccessoryDecoder:", msg)
        this.buffer.push(msg)
    }
    getAccessoryDecoder(address: number): void {
        const a = accessories[address];
        //throw new Error("Method not implemented.");
        this.buffer.push(`<t ${address} ${closed ? DCCExTurnout.closed : DCCExTurnout.open}>`)
    }
    getRBusInfo(): void {
        //throw new Error("Method not implemented.");
        //        this.buffer.push(`<t ${address} ${closed ? DCCExTurnout.closed : DCCExTurnout.open}>`)
    }
    getSystemState(): void {
        //throw new Error("Method not implemented.");
        //      this.buffer.push(`<t ${address} ${closed ? DCCExTurnout.closed : DCCExTurnout.open}>`)
    }

   

    parse(data: string) {
        console.log("DCCEx Parse:", data)
        if (data != "# 50") {
            console.log('tcpClient Data: ', data);
        }

        if (data.startsWith('p1')) {
            this.power = true
            //io.emit("resPower", true)
        }
        else if (data.startsWith('p0')) {
            this.power = false
            //io.emit("resPower", false)
        }
        else if (data.startsWith("Q ")) {
            var params = data.replace(">", "").split(" ");
            console.log('tcpClient Data: processSensor');
            var addr = parseInt(params[1])
        }
        else if (data.startsWith("q ")) {
            var params = data.replace(">", "").split(" ");
            var addr = parseInt(params[1])
            //processSensor(addr);
            //var sensor = getSensor(addr)
        }
        else if (data.startsWith('l')) {
            console.log("TCP Rec:", data)

            var items = data.split(" ")
            var addr = parseInt(items[1])
            var speedByte = parseInt(items[3]);
            var funcMap = parseInt(items[4]);

            var loco = locos[addr] // this.getLoco(addr)

            if (loco) {
                var newSpeed = 0
                loco.funcMap = funcMap
                if ((speedByte >= 2) && (speedByte <= 127)) {
                    newSpeed = speedByte - 1;
                    loco.direction = DCCExDirections.reverse;
                }
                else if ((speedByte >= 130) && (speedByte <= 255)) {
                    newSpeed = speedByte - 129;
                    loco.direction = DCCExDirections.forward;
                }
                else if (speedByte == 0) {
                    newSpeed = 0;
                    loco.direction = DCCExDirections.reverse;
                }
                else if (speedByte == 128) {
                    newSpeed = 0;
                    loco.direction = DCCExDirections.forward;
                } else {
                    //loco.speed = 0;
                }

                loco.speed = newSpeed

                // for (var i = 0; i <= 28; i++) {
                //     var func = loco.functions.find(f => f.index == i)
                //     if (func) {
                //         func.isOn = ((loco.funcMap >> i) & 0x1) > 0;
                //     }
                // }

            }
        }
        else if (data.startsWith('H')) {
                var items = data.split(" ")
                var addr = parseInt(items[1])
                var closed = parseInt(items[2])

            var t : iTurnoutInfo = {address: addr,  isClosed: closed == 0}
            broadcastAll({type: ApiCommands.turnoutInfo, data: t} as iData)
            // var lines = data.split("\n")
            // lines.forEach((item) => {
            //     var items = item.trim().replace(">", "").split(" ")
            //     var addr = parseInt(items[1])
            //     var closed = parseInt(items[2])
            //     var to = turnouts[addr] // this.getTurnout(addr)
            //     if (to) {
            //         to.isClosed = closed == 0
            //         //console.log("EMIT turnoutEvent:", to)
            //         //io.emit("turnoutEvent", to)
            //     }
            // })
        } else if (data == "X") {
            console.log("A művelet nem sikerült!")
            var d: iData = { type: ApiCommands.UnsuccessfulOperation, data: "DCCEx Unsuccessful Operation!" }
            broadcastAll(d)
        }
    }

    connected() {
        this.buffer.push('<T>')
    }

    received(buffer: any) {
        var msg = buffer.toString()
        console.log("TCP RECEIVED:", msg)

        for (var i = 0; i < msg.length; i++) {
            var c = msg[i];
            if (c == ">") {
                this.parse(this._data)
                this._data = ""
            } else if (c == "<" || c == "\n" || c == "\r") {
                this._data = ""
                continue;
            }
            else {
                this._data += c;
            }
        }
    }

}