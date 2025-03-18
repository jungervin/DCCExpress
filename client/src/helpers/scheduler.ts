import { Api } from "../helpers/api";

export class Scheduler {
    static App: any;
    static onchange?: () => void;
    static onerror?: (msg: string, err: any) => void;

    private static currentScriptFunction: Function | null = null;

    private static isLoaded: boolean = false;
    static scriptContent: string;

    static async start(filePath: string): Promise<void> {
        // if (this.isLoaded) {
        //     console.warn("⚠️ Scheduler: already loaded.");
        //     return;
        // }

        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Scheduler: Nem sikerült betölteni a fájlt: ${filePath}`);
                //Hiba a script betöltése közben:
                
            }

            this.scriptContent = await response.text();
            console.log(`📥Scheduler: Betöltött fájl: ${filePath}`);

            this.currentScriptFunction = new Function("App", "Api", "with (App, Api) { " + this.scriptContent + " }");
            this.currentScriptFunction(Api.app, Api);

            this.isLoaded = true;
            console.log("✅Scheduler:Script sikeresen elindult és folyamatosan fut!");

        } catch (error) {
            console.error("❌Scheduler: Hiba a script betöltése közben:", error);
            if (Scheduler.onerror) {
                Scheduler.onerror('Scheduler: Hiba a script betöltése közben:', error)
            }

        }
    }


}