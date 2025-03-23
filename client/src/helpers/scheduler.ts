import { debug } from "console";
import { Api } from "../helpers/api";

export class Scheduler {
    static App: any;
    static onchange?: () => void;
    static onerror?: (msg: string, err: any) => void;

    private static currentScriptFunction: Function | null = null;

    static isLoaded: boolean = false;
    static scriptContent: string;

    static async start(filePath: string): Promise<void> {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Scheduler: could not load: ${filePath}`);
            }

            this.scriptContent = await response.text();
            console.log(`Scheduler: loaded file: ${filePath}`);

            this.currentScriptFunction = new Function("App", "Api", "with (App, Api) { " + this.scriptContent + " }");
            this.currentScriptFunction(Api.app, Api);

            this.isLoaded = true;
            console.log("✅Scheduler: started!");

            if(Scheduler.onchange) {
                Scheduler.onchange()
            }

        } catch (error) {
            console.error("❌Scheduler: Error while loading the script:", error);
            if (Scheduler.onerror) {
                Scheduler.onerror('Scheduler: Error while loading the script:', error)
            }

        }
    }
}