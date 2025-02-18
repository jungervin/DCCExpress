import { CommandCenterTypes, DCCExDirections, iPowerInfo, iServerSettings } from "../../../common/src/dcc";


declare global {
    interface Window {
        invalidate: () => void;
        powerChanged: (pi: iPowerInfo) => void;
    }
}

export const dGridSizeX = 40;
export const dGridSizeY = 40;
export const dTrackWidth7 = 7
export const dTrackWidth3 = 3

export class Globals {

    static ServerSettings: iServerSettings = {
        CommandCenter: {
            type: CommandCenterTypes.Z21,
            ip: '192.168.0.70',
            port: 21105,
            serialPort: 'COM7',
            turnoutActiveTime: 500,
            basicAccessoryDecoderActiveTime: 100
        }, 
        Dispacher: {
            interval: 500
        }
    }

    static AppSettings = {
    GridSizeX: dGridSizeX,
    GridSizeY: dGridSizeY,
    TrackWidth7: dTrackWidth7,
    TrackWidth3: dTrackWidth3,
    ShowAddress: true,
    LocoPanelVisible: false,
    TurnoutWaitTime: 200,
    Orientation: DCCExDirections.forward,
}

    // static devices: iCommandCenter[] = []

    // static get defaultDevice(): iCommandCenter | undefined {
    //     if(Globals.devices.length > 0) {
    //         return Globals.devices[0]
    //     }
    //     return undefined
    // }
}

// export let commandCenters: iCommandCenter[] = []

// export function setCommandCenters(data: any) {
//     Globals.devices = data
// }
