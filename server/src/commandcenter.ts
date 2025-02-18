// import { iBasicAccessory, iTurnout } from "../../common/src/dcc";

import { CommandCenterTypes, iPowerInfo, iSetBasicAccessory, iSetTurnout, iTurnoutInfo, Z21Directions } from "../../common/src/dcc";

export abstract class CommandCenter {
    //uuid: string = ""
    name: string = ""
    type: CommandCenterTypes | undefined

    locos: { [address: number]: number } = {};
    turnouts: { [address: number]: iTurnoutInfo } = {};
    //decoders: { [address: number]: iSetBasicAccessory } = {};
    accessories: { [address: number]: iSetBasicAccessory } = {};

    TURNOUT_WAIT_TIME = 500
    BASICACCESSORY_WAIT_TIME = 10

    powerInfo: iPowerInfo

    constructor(name: string) {
        // this.uuid = uuid
        this.name = name
        this.powerInfo = {
            info: 0,
            current: 0,
            trackVoltageOn: true,
            emergencyStop: false,
            programmingModeActive: false,
            shortCircuit: false,
        }
    }

    abstract getConnectionString(): string;
    abstract start(): void;
    abstract stop(): void;

    // Ha újraindul a szerver
    abstract clientConnected(): void;
    abstract setTurnout(address: number, closed: boolean): void;
    abstract getTurnout(address: number): void;

    abstract setAccessoryDecoder(address: number, on: boolean): void;
    abstract getAccessoryDecoder(address: number): void;

    abstract getRBusInfo(): void;
    abstract getSystemState(): void;

    abstract getLoco(address: number) : void;
    abstract setLoco(address: number, speed: number, direction: Z21Directions): void;

    abstract setLocoFunction(address: number, fn: number, on: boolean): void;

    abstract trackPower(on: boolean): void;
    abstract emergenyStop(stop: boolean): void;
}