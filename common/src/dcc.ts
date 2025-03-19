export enum SpeedModes {
    S14,
    S28,
    S128
}

export enum Z21Directions {
    reverse = 0,
    forward = 1
}

export enum DCCExDirections {
    reverse = 0,
    forward = 1
}

export enum DCCExTurnout {
    closed = 0,
    open = 1
}

export enum OutputModes {
    accessory = 0,
    output = 1,
    dccExAccessory = 2,
}

export enum ApiCommands {
    getLoco = "getLoco",
    setLoco = "setLoco",
    locoInfo = "locoInfo",
    setLocoFunction = "setLocoFunction",
    getTurnout = "getTurnout",
    setTurnout = "setTurnout",
    turnoutInfo = "turnoutInfo",
    getBasicAcessory = "getBasicAcessory",
    setBasicAccessory = "setBasicAccessory",
    basicAccessoryInfo = "basicAccessoryInfo",

    setBlock = "setBlock",
    getBlock = "getBlock",
    blockInfo = "blockInfo",

    getRBusInfo = "getRBusInfo",
    rbusInfo = "rbusInfo",

    alert = "alert",
    response = "response",
    systemInfo = "systemInfo",
    powerInfo = "powerInfo",
    setTrackPower = "setPower",
    emergencyStop = "emergencyStop",

    UnsuccessfulOperation = "UnsuccessfulOperation",
    saveSettings = "saveSettings",
    getSettings = "getSettings",
    settingsInfo = "settingsInfo",
    timeInfo = "timeInfo",
    setTimeSettings = "setTimeSettings",
    saveCommandCenter = "saveCommandCenter",
    getSensor = "getSensor",
    sensorInfo = "sensorInfo",
    setOutput = "setOutput",
    getOutput = "getOutput",
    outputInfo = "outputInfo",
    setProgPower = "setProgPower",
    writeDccExDirectCommand = "writeDirectCommand",
    
    dccExDirectCommandResponse = "dccExDirectCommandResponse",
    wsSensorInfo = "wsSensorInfo",
}

export interface iData {
    type: ApiCommands,
    data: Object,
}

export interface iLocoData {
    type: ApiCommands.getLoco,
    data: iLoco
}

export interface iLocoFunction {
    id: number,
    name: string,
    momentary: boolean,
    isOn: boolean
}

export interface iSetLocoFunction {
    address: number,
    id: number,
    isOn: boolean,
}

export interface iLocomotive {
    id?: string;
    name: string;
    address: number;
    imageUrl: string;
    speedMode: string;
    speed: number;
    direction: Z21Directions
    functions: iLocoFunction[]
    functionMap: number
}

export interface iLoco {
    address: number,
    speed: number,
    direction: number,
    funcMap: number,
}

export interface iSetTurnout {
    address: number,
    isClosed: boolean,
    outputMode: OutputModes
}

export interface iTurnoutInfo {
    address: number,
    isClosed: boolean,
}

export interface iGetTurnout {
    address: number,
}

export interface iSetBasicAccessory {
    address: number;
    value: boolean;
}

export interface iGetBasicAccessory {
    address: number;
}

export interface iSetOutput {
    address: number;
    value: boolean;
}
export interface iGetOutput {
    address: number;
}
export interface iOutputInfo {
    address: number;
    value: boolean;
}


export interface iExtAccessory {
    address: number;
    value: boolean;
}

export interface iRBus {
    group: number,
    bytes: number[]
}

export interface iGetSensor {
    address: number
}

export interface iSensorInfo {
    address: number,
    on: boolean
}



export interface iSetBlock {
    blockName: string,
    locoAddress: number
}
export interface iGetBlock {
    blockName: string,
    locoAddress: number
}
export interface iBlockInfo {
    blockName: string,
    locoAddress: number
}

export interface iSetTimeSettings {
    scale: number
}
export interface iTimeInfo {
    timestamp: number
}
export enum Z21POWERINFO {
    poweroff = 0,
    poweron = 1,
    programmingmode = 2,
    shortcircuit = 8
}
export interface iPowerInfo {
    info?: number,
    current?: number,
    emergencyStop?: boolean,                  // 0x01 // The emergency stop is switched on
    trackVoltageOn?: boolean,                // 0x02 // The track voltage is switched off.
    shortCircuit?: boolean,                   // 0x04 // Short-circuit
    programmingModeActive?: boolean,          // 0x20 // The programming mode is active    
    //cc: iCommandCenter
}

export interface iSetPower {
    on: boolean;
}

export enum iZ21STATUS {
    poweroff = 0,
    poweron = 1,
    programmingmode = 2,
    shortcircuit = 8
}

export interface iZ21Status {
    info: number,
}

export enum CommandCenterTypes {
    "Z21",
    "DCCExTCP",
    "DCCExSerial",
    unknown
}

export interface iDccExDirectCommand {
    command: string,
}

export interface iDccExDirectCommandResponse {
    response: string,
}

export function getCommandCenterType(type: CommandCenterTypes): string {
    const res = Object.keys(CommandCenterTypes).filter(key => isNaN(Number(key)));
    return res ? res[type] : "Unknown"
}

export interface iSystemStatus {
    MainCurrent: number,
    ProgCurrent: number,
    FilteredMainCurrent: number,
    Temperature: number,
    SupplyVoltage: number,
    VCCVoltage: number,
    CentralState: number,
    CentralStateEx: number,
    Reserved: number,
    Capabilities: number,
}


// export class setDecoder implements iData {
//     readonly type = ApiCommands.setBasicAccessory;
//     data: iSetTurnout
//     constructor(message: iSetTurnout) {
//         this.data =  message;
//     }
// }



// export abstract class CommandCenter {
//     decoders: iBasicAccessory[] = []
//     locos: iLoco[] = []

//     abstract connect(): void
//     abstract diconnect(): void
// }

//export let CommandCenters
export let locos: { [address: number]: iLoco } = {};
export let accessories: { [address: number]: iSetBasicAccessory } = {};
export let outputs: { [address: number]: iSetOutput } = {};
export let ext_accessories: { [address: number]: iExtAccessory } = {};
export let turnouts: { [address: number]: iTurnoutInfo } = {};
export let rbus: { [address: number]: iRBus } = {};
export let blocks: { [name: string]: iBlockInfo } = {};


export function getUUID() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

export async function fetchDevices() {
    try {
        const response = await fetch('/devices');
        const devices = await response.json();
        return devices


    } catch (error) {
        console.error("Error fetching devices:", error);
    }
}

export class FileNames {
    static CommandCenterSettings = "/commandcentersettings.json"
}

export interface iSettings {
    // CommandCenter: {
    //     type: CommandCenterTypes,
    //     ip: string,
    //     port: number,
    //     serialPort: string,
    //     turnoutActiveTime: number,
    //     basicAccessoryDecoderActiveTime: number
    // },
    // CommandCenterZ21: {
    //     ip: string,
    //     port: number,
    // },
    // CommandCenterDCCExTcp: {
    //     ip: string,
    //     port: number,
    // }
    // CommandCenterDCCExSerial: {
    //     port: string,
    // }
    Dispacher: {
        interval: number
    },
    EditorSettings: {
        DispalyAsSingleLamp: boolean;
        ShowGrid: boolean,
        ShowAddress: boolean,
        ShowClock: boolean,
        fastClockFactor: number,
        LocoPanelVisible: boolean,
        PropertyPanelVisible: boolean,
        EditModeEnable: boolean,
        Orientation: DCCExDirections.forward,
    }
}

export const defaultSettings: iSettings = {
    // CommandCenter: {
    //     type: CommandCenterTypes.Z21,
    //     ip: "192.168.0.70",
    //     port: 21105,
    //     serialPort: "COM1",
    //     turnoutActiveTime: 500,
    //     basicAccessoryDecoderActiveTime: 10
    // },
    // CommandCenterZ21: {
    //     ip: "",
    //     port: 21105,
    // },
    // CommandCenterDCCExTcp: {
    //     ip: "192.168.1.183",
    //     port: 2560,
    // },
    // CommandCenterDCCExSerial: {
    //     port: "COM3"
    // },
    Dispacher: {
        interval: 500
    },
    EditorSettings: {
        DispalyAsSingleLamp: true,
        ShowGrid: true,
        ShowAddress: false,
        ShowClock: true,
        fastClockFactor: 1,
        LocoPanelVisible: false,
        PropertyPanelVisible: false,
        EditModeEnable: true,
        Orientation: DCCExDirections.forward,
    }
}


export interface iZ21CommandCenter {
    ip: string,
    port: number,
    turnoutActiveTime: number,
    basicAccessoryDecoderActiveTime: number

}

export interface iDCCEx {
    init: string
}
export interface iDCCExTcp extends iDCCEx {
    ip: string,
    port: number
}

export interface iDCCExSerial {
    port: string
}

export interface iCommandCenter {
    type: CommandCenterTypes,
    commandCenter: iZ21CommandCenter | iDCCExTcp | iDCCExSerial
}

export const defaultCommandCenterSettings: iCommandCenter = {
    type: CommandCenterTypes.Z21,
    commandCenter: {
        ip: "192.168.1.70",
        port: 21105,
        turnoutActiveTime: 500,
        basicAccessoryDecoderActiveTime: 10
    } as iZ21CommandCenter,
}
