// export class Dispatcher2 {
//     static App: any;
//     static code: string = "";
//     static intervalId: any;
//     static interval: number = 1000;
//     static onchange?: () => void;
//     static onerror?: (msg: string, err: any) => void;
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Dispatcher = void 0;
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
    class Dispatcher {
        static get active() {
            return Dispatcher._active;
        }
        static set active(v) {
            Dispatcher._active = v;
            if (v) {
                Dispatcher.start('/dispatcher.js');
            }
            else {
                Dispatcher.stop();
            }
            if (Dispatcher.onchange) {
                Dispatcher.onchange();
            }
        }
        /**
         * Betölt és futtat egy JavaScript fájlt, majd periodikusan hívogatja azt.
         * @param filePath A betöltendő JavaScript fájl elérési útja.
         * @param interval Hívogatás időköze (ms)
         */
        static start(filePath) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.isRunning) {
                    console.warn("⚠️ Már fut egy script. Állítsd le először a stop() metódussal.");
                    return;
                }
                try {
                    const response = yield fetch(filePath);
                    if (!response.ok) {
                        throw new Error(`Nem sikerült betölteni a fájlt: ${filePath}`);
                        //Hiba a script betöltése közben:
                    }
                    this.scriptContent = yield response.text();
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
                            }
                            catch (error) {
                                console.error("❌ Hiba a script futtatása közben:", error);
                                if (Dispatcher.onerror) {
                                    Dispatcher.onerror('Hiba a script futtatása közben:', error);
                                }
                            }
                        }
                    }, Dispatcher.interval);
                    this.isRunning = true;
                    console.log("✅ Script sikeresen elindult és folyamatosan fut!");
                }
                catch (error) {
                    console.error("❌ Hiba a script betöltése közben:", error);
                    if (Dispatcher.onerror) {
                        Dispatcher.onerror('Hiba a script betöltése közben:', error);
                    }
                }
            });
        }
        /**
         * Leállítja az éppen futó scriptet.
         */
        static stop() {
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
    exports.Dispatcher = Dispatcher;
    Dispatcher.currentScriptFunction = null;
    //private static scriptContext: any = {};
    Dispatcher.isRunning = false;
    Dispatcher.intervalId = null;
    Dispatcher.interval = 888; // 1 másodpercenként hívogatjuk
    Dispatcher._active = false;
});
