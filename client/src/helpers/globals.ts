import { CommandCenterTypes, DCCExDirections, defaultCommandCenterSettings, defaultSettings, FileNames, iCommandCenter, iPowerInfo, iSettings, iZ21CommandCenter } from "../../../common/src/dcc";

declare global {
    interface Window {
        invalidate: () => void;
        dispatcherInit?: () => void;
        dispatcherLoop?: () => void;
        powerChanged: (pi: iPowerInfo) => void;

        directCommandResponse?: (data: any) => void;
        
    }
}

export class Globals {

    static GridSizeX = 40
    static GridSizeY = 40
    static TrackWidth7 = 7
    static TrackWidth3 = 3

    static Settings = defaultSettings 
    static power: iPowerInfo = {
        current: 0,
        emergencyStop: false,
        info: 0,
        programmingModeActive: false,
        shortCircuit: false,
        trackVoltageOn: false
    }

    static CommandCenterSetting = defaultCommandCenterSettings

    static async fetchJsonData(url: string) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            //console.log("Received JSON:", data);
            return data;
        } catch (error) {
            alert(`Error fetching JSON: ${url}\n` + error);
            return null;
        }
    }

    static async fetchTextData(url: string) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.text();
            //console.log("Received JSON:", data);
            return data;
        } catch (error) {
            alert("Error fetching JSON:\n" + error);
            return null;
        }
    }

    static async saveJson(fileName: string, data: any) {
        try {
            const response = await fetch("/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileName, data: data })
            });

            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            alert("Error saving file:\n" + error);
        }
    }

    static async settingsSave() {
        await Globals.saveJson("/settings.json", Globals.Settings)
    }

    static async configSave(config: any) {
        await Globals.saveJson("/config.json", config)
    }

    static async loadCommandCenterSettings() {
        Globals.fetchJsonData(FileNames.CommandCenterSettings).then((data: iCommandCenter) => {
            Globals.CommandCenterSetting.type = data.type
            Globals.CommandCenterSetting.commandCenter = data.commandCenter;
        }).catch((reason: any) => {
            Globals.CommandCenterSetting.type = CommandCenterTypes.Z21,
            Globals.CommandCenterSetting.commandCenter = {
                ip: "192.168.0.70",
                port: 21105,
                turnoutActiveTime: 500,
                basicAccessoryDecoderActiveTime: 100
            } as iZ21CommandCenter
        });

    }
}

// export let commandCenters: iCommandCenter[] = []

// export function setCommandCenters(data: any) {
//     Globals.devices = data
// }

