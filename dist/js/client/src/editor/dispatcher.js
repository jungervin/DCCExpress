var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../helpers/api"], function (require, exports, api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Dispatcher = void 0;
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
        static exec() {
            if (Dispatcher.currentScriptFunction) {
                try {
                    Dispatcher.currentScriptFunction(Dispatcher.App, api_1.Api);
                }
                catch (error) {
                    console.error("❌Dispatcher: Hiba a script futtatása közben:", error);
                    if (Dispatcher.onerror) {
                        Dispatcher.onerror('Dispatcher: Hiba a script futtatása közben:', error);
                    }
                }
            }
        }
        static start(filePath) {
            return __awaiter(this, void 0, void 0, function* () {
                if (Dispatcher.isRunning) {
                    console.warn("⚠️ Már fut egy script. Állítsd le először a stop() metódussal.");
                    return;
                }
                try {
                    const response = yield fetch(filePath);
                    if (!response.ok) {
                        throw new Error(`Dispatcher: Nem sikerült betölteni a fájlt: ${filePath}`);
                        //Hiba a script betöltése közben:
                    }
                    Dispatcher.scriptContent = yield response.text();
                    console.log(`📥Dispatcher: Betöltött fájl: ${filePath}`);
                    this.currentScriptFunction = new Function("App", "with (App) { " + this.scriptContent + " }");
                    this.currentScriptFunction(Dispatcher.App);
                    this.intervalId = setInterval(() => {
                        Dispatcher.exec();
                    }, Dispatcher.interval);
                    Dispatcher.isRunning = true;
                    console.log("✅Dispatcher: Script sikeresen elindult és folyamatosan fut!");
                }
                catch (error) {
                    console.error("❌Dispatcher: Hiba a script betöltése közben:", error);
                    if (Dispatcher.onerror) {
                        Dispatcher.onerror('Dispatcher: Hiba a script betöltése közben:', error);
                    }
                }
            });
        }
        static stop() {
            if (!Dispatcher.isRunning) {
                console.warn("⚠️Dispatcher: Nincs futó script.");
                return;
            }
            if (Dispatcher.intervalId) {
                clearInterval(Dispatcher.intervalId);
                Dispatcher.intervalId = null;
            }
            Dispatcher.currentScriptFunction = null;
            Dispatcher.isRunning = false;
            console.log("⏹Dispatcher: Script leállítva.");
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
