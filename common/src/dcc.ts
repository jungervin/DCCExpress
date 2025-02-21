// import { IOConn } from "../../client/src/helpers/iocon";

import multer from "multer";



export enum SpeedModes {
    S14,
    S28,
    S128
}

// export enum Connections {
//     DCCEx = 0,
//     Z21 = 1
// }

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

export enum ApiCommands {
    // configSave = "configSave",
    // configSaved = "configSaved",
    // configLoad = "configLoad",
    // configLoaded = "configLoaded",
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
    
    //turnoutClicked = "turnoutClicked",
    // turnoutStates = "turnoutStates",
    // setCommandCenters = "setCommandCenters",
    // getCommandCenters = "getCommandCenters",
    // commandCenterInfos = "commandCenterInfos",
    
    getRBusInfo = "getRBusInfo",
    rbusInfo = "rbusInfo",
    // getTurnouts = "getTurnouts",
    // Turnouts = "Turnouts",
    alert = "alert",
    response = "response",
    systemInfo = "systemInfo",
    powerInfo = "powerInfo",
    setPower = "setPower",
    emergencyStop = "emergencyStop",

    UnsuccessfulOperation = "UnsuccessfulOperation",
    saveSettings = "saveSettings",
    getSettings = "getSettings",
    settingsInfo = "settingsInfo",
}


export interface iData {
    type: ApiCommands,
    data: Object,
}

// export interface iAlertData {
//     type: ApiCommands,
//     msg: Object,
// }

export interface iLocoData {
    type: ApiCommands.getLoco,
    data: iLoco
}


// const gl: iLocoData = {type: ApiCommands.getLoco, data: {address:10, direction: DCCExDirections.forward, speed:10, functions:0}}
// const sl: iLocoData = {type: ApiCommands.getLoco, data: {address:10, direction: DCCExDirections.forward, speed:10, functions:0}}
// export interface iSettings {
//     gridSize: number;
//     turnoutActiveTimeMs: number;
// }


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
    // functions?: Array<{
    //     id: number;
    //     name: string;
    //     momentary: boolean;
    // }>;
}


export interface iLoco {
    //cc: iCommandCenter,
    address: number,
    //name: string,
    speed: number,
    //prevSpeed: number,
    direction: number, //eDirections,
    funcMap: number,
    //functions: Array<iLocoFunction>
}

export interface iSetTurnout {
    //cc: iCommandCenter,
    address: number,
    isClosed: boolean,
}

export interface iTurnoutInfo {
    //cc: iCommandCenter,
    address: number,
    isClosed: boolean,
}

export interface iGetTurnout {
    //cc: iCommandCenter,
    address: number,
}

// export interface iGetRBusInfo {
//     //cc: iCommandCenter,
// }

export interface iSetBasicAccessory {
    //cc: iCommandCenter
    address: number;
    value: boolean;
}

export interface iGetBasicAccessory {
    //cc: iCommandCenter
    address: number;
}

export interface iExtAccessory {
    //cc: iCommandCenter
    address: number;
    value: boolean;
}


export interface iRBus {
    // on: boolean,
    // locoAddress: number,
    // dt: number
    group: number,
    bytes: number[]
}


export enum Z21POWERINFO {
    poweroff =0,
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
    poweroff =0,
    poweron = 1,
    programmingmode = 2,
    shortcircuit = 8
}

export interface iZ21Status {
    info: number,
    //cc: iCommandCenter
}

export enum CommandCenterTypes {
    "Z21",
    "DCCExTCP",
    "DCCExSerial",
    unknown
}

export function getCommandCenterType(type: CommandCenterTypes) : string {
    const res = Object.keys(CommandCenterTypes).filter(key => isNaN(Number(key)));
    return res ? res[type] : "Unknown"
}


// export interface iCommandCenter {
//     //uuid?: string
//     name: string
//     type: CommandCenterTypes, 
//     isLocoController: boolean
// }


// export interface iZ21CommandCenter extends iCommandCenter {
//     ip: string,
//     port: number
// }

export interface iSystemStatus {
    MainCurrent: number,
    ProgCurrent: number,
    FilteredMainCurrent:number,
    Temperature: number,
    SupplyVoltage: number,
    VCCVoltage: number,
    CentralState: number,
    CentralStateEx: number,
    Reserved: number,
    Capabilities: number,

}

// export interface iDCCExTCPCommandCenter extends iCommandCenter{
//     ip: string,
//     port: number
// }

export class setDecoder implements iData {
    readonly type = ApiCommands.setBasicAccessory;
    data: iSetTurnout

    constructor(message: iSetTurnout) {
        this.data =  message;
    }
}



// export abstract class CommandCenter {
//     decoders: iBasicAccessory[] = []
//     locos: iLoco[] = []

//     abstract connect(): void
//     abstract diconnect(): void
// }

//export let CommandCenters
export let locos: { [address: number]: iLoco } = {};
export let accessories: { [address: number]: iSetBasicAccessory } = {};
export let ext_accessories: { [address: number]: iExtAccessory } = {};
export let turnouts: { [address: number]: iTurnoutInfo } = {};
export let rbus: { [address: number]: iRBus } = {};


export function getUUID() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

export async function  fetchDevices() {
    try {
        const response = await fetch('/devices');
        const devices = await response.json();
        return devices


    } catch (error) {
        console.error("Error fetching devices:", error);
    }
}



export interface iSettings {
    CommandCenter: {
        type: CommandCenterTypes,
        ip: string,
        port: number,
        serialPort: string,
        turnoutActiveTime: number,     
        basicAccessoryDecoderActiveTime: number
    },
    CommandCenterZ21: {
        ip: string,
        port: number,
    },
    CommandCenterDCCExTcp: {
        ip: string,
        port: number,
    }
    CommandCenterDCCExSerial: {
        port: string,
    }
    Dispacher: {
        interval: number
    },
    EditorSettings : {
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
    CommandCenter: {
      type: CommandCenterTypes.Z21,
      ip: "192.168.0.70",
      port: 21105,
      serialPort: "COM1",
      turnoutActiveTime: 500,
      basicAccessoryDecoderActiveTime: 10
    },
    CommandCenterZ21: {
      ip:"",
      port: 21105,
    },
    CommandCenterDCCExTcp: {
      ip: "192.168.1.183",
      port: 2560,
    },
    CommandCenterDCCExSerial: {
      port: "COM3"
    },
    Dispacher: {
      interval: 500
    },
    EditorSettings : {
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
  
