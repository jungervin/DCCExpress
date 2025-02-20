import { accessories, ApiCommands, DCCExDirections, DCCExTurnout, iData, iLoco, iPowerInfo, iSetBasicAccessory, iSystemStatus, iTurnoutInfo, locos, turnouts, Z21Directions } from "../../common/src/dcc";
import { CommandCenter } from "./commandcenter";
import { log } from "./utility";
import { broadcastAll } from "./ws";

export class DCCExCommandCenter extends CommandCenter {
    buffer: string[] = []
    private _data: string = ""

    constructor(name: string) {
        super(name)
    }

    put(msg: string) {
        // Mutex??
        log(`DCCEx ${this.name} put: ${msg}`)
        this.buffer.push(msg)
    }
    getConnectionString(): string {
        throw new Error("Method not implemented.");
    }
   
    trackPower(on: boolean): void {
        log("DCCEx ", `trackPower(${on})`)
        this.put(on ? '<1>' : '<0>')
    }
    emergenyStop(stop: boolean): void {
        this.put('<!>')
        this.powerInfo.emergencyStop = true;
        broadcastAll({type: ApiCommands.powerInfo, data: this.powerInfo})

    }
    setLocoFunction(address: number, fn: number, on: boolean): void {
        // <F cab funct state> - Turn loco decoder functions ON or OFF
        // 6 Response: <l cab reg speedByte functMap>
        //throw new Error("Method not implemented.");
        this.put(`<F ${address} ${fn} ${on ? 1 : 0}`)
    }
    clientConnected(): void {
        broadcastAll({ type: ApiCommands.powerInfo, data: this.powerInfo } as iData)

    }
    getLoco(address: number): void {
        // <t cab>
        this.put(`<t ${address}>`)
    }
    
    setLoco(address: number, speed: number, direction: Z21Directions): void {
        // <t cab speed dir>
        if(speed > 126) {
            speed = 126
        }

        this.put(`<t ${address} ${speed} ${direction}>`)

        // Clear&Send EmergencyStop
        this.powerInfo.emergencyStop = false;
        broadcastAll({ type: ApiCommands.powerInfo, data: this.powerInfo } as iData)
    }

    start(): void {
        this._data = ""
    }
    stop(): void {
        //throw new Error("Method not implemented.");
    }
    setTurnout(address: number, closed: boolean): void {
        this.put(`<T ${address} ${closed ? DCCExTurnout.closed : DCCExTurnout.open}>`)
    }
    getTurnout(address: number): void {
        this.put(`<T ${address} X>`)
    }

    // 'a': // ACCESSORY <a ADDRESS SUBADDRESS ACTIVATE [ONOFF]> or <a LINEARADDRESS ACTIVATE>
    setAccessoryDecoder(address: number, on: boolean): void {
        accessories[address] = { address: address, value: on } as iSetBasicAccessory
        var msg = `<a ${address} ${(on ? 1 : 0)}>`
        this.put(msg)

        // Accessory
        const turnoutInfo: iTurnoutInfo = { address: address, isClosed: on }
        broadcastAll({ type: ApiCommands.turnoutInfo, data: turnoutInfo } as iData)
        log('setAccessoryDecoder() BROADCAST ', turnoutInfo)
    }
    getAccessoryDecoder(address: number): void {
        const a = accessories[address];
    }
    getRBusInfo(): void {
        //throw new Error("Method not implemented.");
    }
    getSystemState(): void {
        //throw new Error("Method not implemented.");
    }

    parse(data: string) {
        console.log("DCCEx Parse:", data)
        if (data != "# 50") {
            console.log('tcpClient Data: ', data);
        }

        if (data.startsWith('p1')) {
            this.powerInfo.info = 0b00000001
            this.powerInfo.trackVoltageOn = true
            broadcastAll({ type: ApiCommands.powerInfo, data: this.powerInfo } as iData)

        }
        else if (data.startsWith('p0')) {
            this.powerInfo.info = 0b00000000
            this.powerInfo.trackVoltageOn = false
            broadcastAll({ type: ApiCommands.powerInfo, data: this.powerInfo } as iData)
        }
        else if (data.startsWith("Q ")) {
            var params = data.replace(">", "").split(" ");
            console.log('tcpClient Data: processSensor');
            var address = parseInt(params[1])
        }
        else if (data.startsWith("q ")) {
            var params = data.replace(">", "").split(" ");
            var address = parseInt(params[1])
            //processSensor(addr);
            //var sensor = getSensor(addr)
        }
        else if (data.startsWith('l')) {
            console.log("TCP Rec:", data)

            var items = data.split(" ")
            var address = parseInt(items[1])
            var speedByte = parseInt(items[3]);
            var funcMap = parseInt(items[4]);
            var direction: DCCExDirections = DCCExDirections.forward
            //var loco = locos[address] // this.getLoco(addr)

            // if(speedByte == -1 && !this.powerInfo.emergencyStop) {
            //     this.powerInfo.emergencyStop = true;
            //     broadcastAll({type: ApiCommands.powerInfo, data: this.powerInfo})
            // } else if(this.powerInfo.emergencyStop) {
            //     this.powerInfo.emergencyStop = false;
            //     broadcastAll({type: ApiCommands.powerInfo, data: this.powerInfo})
            // }

    

            //if (loco) 
            {
                var newSpeed = 0
                //loco.funcMap = funcMap
                if ((speedByte >= 2) && (speedByte <= 127)) {
                    newSpeed = speedByte - 1;
                    direction = DCCExDirections.reverse;
                }
                else if ((speedByte >= 130) && (speedByte <= 255)) {
                    newSpeed = speedByte - 129;
                    direction = DCCExDirections.forward;
                }
                else if (speedByte == 0) {
                    newSpeed = 0;
                    direction = DCCExDirections.reverse;
                }
                else if (speedByte == 128) {
                    newSpeed = 0;
                    direction = DCCExDirections.forward;
                } else {
                    //loco.speed = 0;
                }

  
                var loco: iLoco = { address: address, speed: newSpeed, direction: direction, funcMap: funcMap }
                broadcastAll({ type: ApiCommands.locoInfo, data: loco } as iData)
                log("BROADCAST DCC-EX LOCO INFO:", loco)
                
                // if(this.powerInfo.emergencyStop && newSpeed > 0) {
                //     this.powerInfo.emergencyStop = false;
                //     broadcastAll({type: ApiCommands.powerInfo, data: this.powerInfo})
                // }
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
                var address = parseInt(items[1])
                var closed = parseInt(items[2])

            var t : iTurnoutInfo = {address: address,  isClosed: closed == 0}
            broadcastAll({type: ApiCommands.turnoutInfo, data: t} as iData)
        } else if (data == "X") {
            console.log("A művelet nem sikerült!")
            var d: iData = { type: ApiCommands.UnsuccessfulOperation, data: "DCCEx Unsuccessful Operation!" }
            broadcastAll(d)
        }
    }

    connected() {
        this.put('<T>')
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