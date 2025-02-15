// export class Dispatcher2 {
//     static App: any;
//     static code: string = "";
//     static intervalId: any;
//     static interval: number = 1000;
//     static onchange?: () => void;
//     static onerror?: (msg: string, err: any) => void;

import { Globals } from "../helpers/globals";

//     private static _active : boolean = false ;
//     static get active() : boolean {
//         return Dispatcher2._active;
//     }
//     static set active(v: boolean) {
//         Dispatcher2._active = v
//         if(v) {
//             Dispatcher2.startExecution();
//         } else {
//             Dispatcher2.stopExecution();
//         }
//         if(Dispatcher2.onchange) {
//             Dispatcher2.onchange()
//         }
//     }


//     static validateCode(code: string) {
//         try {
//             new Function(code); // Szintaktikai ellenőrzés
//             return null; // Nincs hiba
//         } catch (error: any) {
//             // const match = error.stack.match(/<anonymous>:(\d+):\d+/);
//             // const lineNumber = match ? parseInt(match[1]) - 1 : "ismeretlen";
//             return error.stack
//         }
//     }

//     static startExecution() {

//         if (Dispatcher2.intervalId) {
//             clearInterval(Dispatcher2.intervalId);
//         }


//         const error = Dispatcher2.validateCode(Dispatcher2.code);
//         if (error) {
//             console.log("Dispatcher Validate Error:", error)
//             if(Dispatcher2.onerror) {
//                 Dispatcher2.onerror("Dispatcher Validate Error", error)
//             }

//             return;
//         }

//         try {
//             const func = new Function("App", "with (App) { " + Dispatcher2.code + " }");

//             Dispatcher2.intervalId = setInterval(() => {
//                 try {
//                     func(Dispatcher2.App);

//                 } catch (err: any) {
//                     console.log("Dispatcher Run Error:", err)
//                     if(Dispatcher2.onerror) {
//                         Dispatcher2.onerror("Dispatcher Run Error", err)
//                     }
//                 }
//             }, Dispatcher2.interval);

//         } catch (error) {
//             console.log("Dispatcher Func Error:", error)
//             if(Dispatcher2.onerror) {
//                 Dispatcher2.onerror("Dispatcher Func Error", error)
//             }

//         }
//     }

//     static stopExecution() {
//         if (Dispatcher2.intervalId) {
//             clearInterval(Dispatcher2.intervalId);
//             Dispatcher2.intervalId = null;
//         }
//     }
// }

export class Dispatcher {
    static App: any;
    //static code: string = "";

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

// // Példa App objektum
// const App = {
//     log: (message: string) => console.log("App log:", message),
//     sum: (a: number, b: number) => a + b,
// };

// // Példa script futtatása, amelyet 2 másodpercenként hívunk meg
// Dispatcher.start("example.js", 2000);

// // 10 másodperc múlva leállítja a scriptet
// setTimeout(() => {
//     Dispatcher.stop();
// }, 10000);
