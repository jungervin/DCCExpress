import { Globals } from "../helpers/globals";

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

    /**
     * Betölt és futtat egy JavaScript fájlt, majd periodikusan hívogatja azt.
     * @param filePath A betöltendő JavaScript fájl elérési útja.
     * @param interval Hívogatás időköze (ms)
     */
    static async start(filePath: string): Promise<void> {
        if (this.isRunning) {
            console.warn("⚠️ Már fut egy script. Állítsd le először a stop() metódussal.");
            return;
        }

        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Nem sikerült betölteni a fájlt: ${filePath}`);
                //Hiba a script betöltése közben:
            }

            this.scriptContent = await response.text();
            console.log(`📥 Betöltött fájl: ${filePath}`);

            // Dinamikus függvény létrehozása az App és egyéni környezet számára
            // this.scriptContext =  Dispatcher.App; // Lokális környezet létrehozása
            // this.currentScriptFunction = new Function("context", `
            //     with (context) { 
            //         ${scriptContent} 
            //     }
            // `);

            this.currentScriptFunction = new Function("App", "with (App) { " + this.scriptContent + " }");

            // Először egyszer lefuttatjuk
            this.currentScriptFunction(Dispatcher.App);

            // Majd időzítve folyamatosan hívogatjuk
            
            this.intervalId = setInterval(() => {
                if (this.currentScriptFunction) {
                    try {
                        this.currentScriptFunction(Dispatcher.App);
                    } catch (error) {
                        console.error("❌ Hiba a script futtatása közben:", error);
                        if (Dispatcher.onerror) {
                            Dispatcher.onerror('Hiba a script futtatása közben:', error)
                        }
                    }
                }
            }, Dispatcher.interval);

            this.isRunning = true;
            console.log("✅ Script sikeresen elindult és folyamatosan fut!");

        } catch (error) {
            console.error("❌ Hiba a script betöltése közben:", error);
            if (Dispatcher.onerror) {
                Dispatcher.onerror('Hiba a script betöltése közben:', error)
            }

        }
    }

    /**
     * Leállítja az éppen futó scriptet.
     */
    static stop(): void {
        if (!this.isRunning) {
            console.warn("⚠️ Nincs futó script.");
            return;
        }

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.currentScriptFunction = null;
        //this.scriptContext = {};
        this.isRunning = false;
        console.log("⏹ Script leállítva.");
    }
}