import { Api } from "../helpers/api";

export class Dispatcher {
    static App: any;
    
    static onchange?: () => void;
    static onerror?: (msg: string, err: any) => void;

    private static currentScriptFunction: Function | null = null;
    //private static scriptContext: any = {};
    private static isRunning: boolean = false;
    private static intervalId: NodeJS.Timeout | null = null;
    public static interval: number = 888; // 1 másodpercenként hívogatjuk


    private static _active: boolean = false;
    static scriptContent: string;
    static get active(): boolean {
        return Dispatcher._active;
    }
    static set active(v: boolean) {
        Dispatcher._active = v
        if (v) {
            Dispatcher.start('/dispatcher.js');
        } else {
            Dispatcher.stop();
        }
        if (Dispatcher.onchange) {
            Dispatcher.onchange()
        }
    }

    static async start(filePath: string): Promise<void> {
        if (this.isRunning) {
            console.warn("⚠️ Már fut egy script. Állítsd le először a stop() metódussal.");
            return;
        }

        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Dispatcher: Nem sikerült betölteni a fájlt: ${filePath}`);
                //Hiba a script betöltése közben:
            }

            this.scriptContent = await response.text();
            console.log(`📥Dispatcher: Betöltött fájl: ${filePath}`);

           this.currentScriptFunction = new Function("App", "with (App) { " + this.scriptContent + " }");

            this.currentScriptFunction(Dispatcher.App);
            
            this.intervalId = setInterval(() => {
                if (this.currentScriptFunction) {
                    try {
                        this.currentScriptFunction(Dispatcher.App, Api);
                    } catch (error) {
                        console.error("❌Dispatcher: Hiba a script futtatása közben:", error);
                        if (Dispatcher.onerror) {
                            Dispatcher.onerror('Dispatcher: Hiba a script futtatása közben:', error)
                        }
                    }
                }
            }, Dispatcher.interval);

            this.isRunning = true;
            console.log("✅Dispatcher: Script sikeresen elindult és folyamatosan fut!");

        } catch (error) {
            console.error("❌Dispatcher: Hiba a script betöltése közben:", error);
            if (Dispatcher.onerror) {
                Dispatcher.onerror('Dispatcher: Hiba a script betöltése közben:', error)
            }

        }
    }

        static stop(): void {
        if (!this.isRunning) {
            console.warn("⚠️Dispatcher: Nincs futó script.");
            return;
        }

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.currentScriptFunction = null;
        this.isRunning = false;
        console.log("⏹Dispatcher: Script leállítva.");
    }
}