import { CommandCenterTypes, DCCExDirections, defaultSettings, iPowerInfo, iSettings } from "../../../common/src/dcc";

declare global {
    interface Window {
        invalidate: () => void;
        powerChanged: (pi: iPowerInfo) => void;
    }
}

export class Globals {

    static GridSizeX = 40
    static GridSizeY = 40
    static TrackWidth7 = 7
    static TrackWidth3 = 3

    static Settings = defaultSettings 

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


}

// export let commandCenters: iCommandCenter[] = []

// export function setCommandCenters(data: any) {
//     Globals.devices = data
// }

