import { accessories, ApiCommands, DCCExDirections, DCCExTurnout, iData, iDccExDirectCommandResponse, iLoco, iOutputInfo, iPowerInfo, iSensorInfo, iSetBasicAccessory, iSetOutput, iSystemStatus, iTurnoutInfo, locos, OutputModes, outputs, turnouts, Z21Directions } from "../../common/src/dcc";
import { CommandCenter } from "./commandcenter";
import { log } from "./utility";
import { broadcastAll } from "./ws";


// Configure myAutomation.h - DCC Turnouts/Points
// https://dcc-ex.com/exrail/creating-elements.html#configure-myautomation-h-dcc-turnouts-pointshttps://dcc-ex.com/exrail/creating-elements.html#configure-myautomation-h-dcc-turnouts-points
// TURNOUT( id, addr, sub_addr [, "description"] )

// https://dcc-ex.com/exrail/exrail-command-reference.html#objects-definition-and-control

export class DCCExCommandCenter extends CommandCenter {
    buffer: string[] = []
    private _data: string = ""
    init: string = "";

    constructor(name: string, init: string) {
        super(name, init)
        this.init = init
    }

    put(msg: string) {
        // Mutex??
        if (!msg.startsWith('<#')) {
            log(`DCCEx ${this.name} put: ${msg}`)
        }
        this.buffer.push(msg)
        
    }
    getConnectionString(): string {
        throw new Error("Method not implemented.");
    }

    setTrackPower(on: boolean): void {
        log("DCCEx ", `trackPower(${on})`)
        this.put(on ? '<1 MAIN>' : '<0>')
    }

    setProgPower(on: boolean): void {
        log("DCCEx ", `progPower(${on})`)
        this.put(on ? '<1 PROG>' : '<0 PROG>')
    }

    emergenyStop(stop: boolean): void {
        this.put('<!>')
        this.powerInfo.emergencyStop = true;
        broadcastAll({ type: ApiCommands.powerInfo, data: this.powerInfo })

    }
    setLocoFunction(address: number, fn: number, on: boolean): void {
        // <F cab funct state> - Turn loco decoder functions ON or OFF
        // 6 Response: <l cab reg speedByte functMap>
        //throw new Error("Method not implemented.");
        this.put(`<F ${address} ${fn} ${on ? 1 : 0}>`)
    }
    clientConnected(): void {
        broadcastAll({ type: ApiCommands.powerInfo, data: this.powerInfo } as iData)
        //this.put("<s>")
    }
    getLoco(address: number): void {
        this.put(`<t ${address}>`)
    }

    setLoco(address: number, speed: number, direction: Z21Directions): void {
        if (speed > 126) {
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

    setTurnout(address: number, closed: boolean, mode: OutputModes): void {
        if (mode == OutputModes.dccExAccessory) {
            this.put(`<T ${address} ${closed ? DCCExTurnout.closed : DCCExTurnout.open}>`)
            this.getTurnout(address)
        } else if (mode == OutputModes.accessory) {
            this.setAccessoryDecoder(address, closed)
        }
    }

    getTurnout(address: number): void {
        this.put(`<JT ${address}>`)
    }

    // 'a': // ACCESSORY <a ADDRESS SUBADDRESS ACTIVATE [ONOFF]> or <a LINEARADDRESS ACTIVATE>
    setAccessoryDecoder(address: number, on: boolean): void {
        accessories[address] = { address: address, value: on } as iSetBasicAccessory

        var msg = `<a ${address} ${(on ? 1 : 0)}>`

        // Twice
        this.put(msg)
        this.put(msg)

        // Accessory
        const turnoutInfo: iTurnoutInfo = { address: address, isClosed: on }
        broadcastAll({ type: ApiCommands.turnoutInfo, data: turnoutInfo } as iData)
        log('setAccessoryDecoder() BROADCAST ', turnoutInfo)
    }

    getAccessoryDecoder(address: number): void {
        const a = accessories[address];
        if (a) {
            const turnoutInfo: iTurnoutInfo = { address: a.address, isClosed: a.value }
            broadcastAll({ type: ApiCommands.turnoutInfo, data: turnoutInfo } as iData)
        } else {
            var d: iData = { type: ApiCommands.UnsuccessfulOperation, data: "DCCEx.getAccessory Unsuccessful Operation!" }
            broadcastAll(d)
        }
    }

    setOutput(address: number, on: boolean): void {
        outputs[address] = { address: address, value: on } as iSetOutput
        this.put(`<Z ${address} ${on ? 1 : 0}>`)
    }

    getOutput(address: number): void {
        const o = outputs[address];
        if (o) {
            const outputInfo: iOutputInfo = { address: o.address, value: o.value }
            broadcastAll({ type: ApiCommands.outputInfo, data: outputInfo } as iData)
        } else {
            var d: iData = { type: ApiCommands.UnsuccessfulOperation, data: "DCCEx.getOutput Unsuccessful Operation!" }
            broadcastAll(d)
        }
    }

    getRBusInfo(): void {
    }

    getSensorInfo(address: number): void {
        this.put(`<Q ${address}>`)
    }

    getSystemState(): void {
        this.put('<s>')
    }

    writeDirectCommand(command: string): void {
        this.put(command)
    }

    parse(data: string) {
        if (data == "# 50") {
            //log('DccEx Data: ', data);
            return
        }

        if (data.startsWith('p1')) {
            const params = data.split(" ");
            this.powerInfo.info = 0b00000001
            if (params[1] == 'MAIN' || params[1] == 'A') {
                //    if (!this.powerInfo.trackVoltageOn)
                {
                    this.powerInfo.trackVoltageOn = true
                    broadcastAll({ type: ApiCommands.powerInfo, data: this.powerInfo } as iData)
                }
            } else if (params[1] == 'PROG' || params[1] == 'B') {
                this.powerInfo.programmingModeActive = true;
            }
        }
        else if (data.startsWith('p0')) {
            const params = data.split(" ");
            this.powerInfo.info = 0b00000000
            if (params.length == 2) {
                if (params[1] == 'MAIN' || params[1] == 'A') {
                    this.powerInfo.trackVoltageOn = false
                } else if (params[1] == 'PROG' || params[1] == 'B') {
                    this.powerInfo.programmingModeActive = false;
                }
            } else {
                this.powerInfo.trackVoltageOn = false
                this.powerInfo.programmingModeActive = false;
            }

            log("DCCEx PowerInfo: ", this.powerInfo)
            broadcastAll({ type: ApiCommands.powerInfo, data: this.powerInfo } as iData)
        }
        else if (data.startsWith("Q ")) {
            const params = data.split(" ");
            const si = { address: parseInt(params[1]), on: true } as iSensorInfo
            broadcastAll({ type: ApiCommands.sensorInfo, data: si } as iData)
        }
        else if (data.startsWith("q ")) {
            const params = data.split(" ");
            const si = { address: parseInt(params[1]), on: false } as iSensorInfo
            broadcastAll({ type: ApiCommands.sensorInfo, data: si } as iData)
        }
        else if (data.startsWith('l')) {

            var items = data.split(" ")
            var address = parseInt(items[1])
            var speedByte = parseInt(items[3]);
            var funcMap = parseInt(items[4]);
            var direction: DCCExDirections = DCCExDirections.forward

            {
                var newSpeed = 0
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
                }

                var loco: iLoco = { address: address, speed: newSpeed, direction: direction, funcMap: funcMap }
                broadcastAll({ type: ApiCommands.locoInfo, data: loco } as iData)
                log("BROADCAST DCC-EX LOCO INFO:", loco)
            }
        }
        else if (data.startsWith('H')) {
            var items = data.split(" ")
            var address = parseInt(items[1])
            var t: iTurnoutInfo = { address: address, isClosed: parseInt(items[2]) == 0 }
            broadcastAll({ type: ApiCommands.turnoutInfo, data: t } as iData)
        }
        else if (data.startsWith("jT")) {
            var items = data.split(" ")
            var address = parseInt(items[1])
            var t: iTurnoutInfo = { address: address, isClosed: items[2] == 'C' }
            broadcastAll({ type: ApiCommands.turnoutInfo, data: t } as iData)
        }
        else if (data.startsWith("Y")) {
            var items = data.split(" ")

            var address = parseInt(items[1])
            var o: iOutputInfo = { address: address, value: items[items.length - 1] == '1' }
            broadcastAll({ type: ApiCommands.outputInfo, data: o } as iData)
        }
        else if (data == "X") {
            console.log("(<X>) UnsuccessfulOperation !")
            var d: iData = { type: ApiCommands.UnsuccessfulOperation, data: "DCCEx (<X>) Unsuccessful Operation!" }
            broadcastAll(d)
        }
        else {
            console.log("DCCExCommandCenter: Unknown data received: ", data)
            broadcastAll({ type: ApiCommands.dccExDirectCommandResponse, data: { response: data } as iDccExDirectCommandResponse } as iData)
        }
    }

    connected() {
        log("==== COMAND CENTER CONNECTED ====")
        if(this.init.trim() != "") {
            log("==== COMAND CENTER INIT ====")
            const lines = this.init.trim().split("\n")
            lines.forEach((l) => {
                this.put(l.trim())
            })
            log("============================")
        }

        this.put('<s>')
    }

    received(buffer: any) {
        var msg = buffer.toString()
        if (!buffer.startsWith('<#')) {
            log("RECEIVED:", msg)
        }

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