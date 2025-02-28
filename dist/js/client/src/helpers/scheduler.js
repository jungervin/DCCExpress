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
    exports.Scheduler = void 0;
    class Scheduler {
        static start(filePath) {
            return __awaiter(this, void 0, void 0, function* () {
                // if (this.isLoaded) {
                //     console.warn("⚠️ Scheduler: already loaded.");
                //     return;
                // }
                try {
                    const response = yield fetch(filePath);
                    if (!response.ok) {
                        throw new Error(`Scheduler: Nem sikerült betölteni a fájlt: ${filePath}`);
                        //Hiba a script betöltése közben:
                    }
                    this.scriptContent = yield response.text();
                    console.log(`📥Scheduler: Betöltött fájl: ${filePath}`);
                    this.currentScriptFunction = new Function("App", "Api", "with (App, Api) { " + this.scriptContent + " }");
                    this.currentScriptFunction(api_1.Api.app, api_1.Api);
                    this.isLoaded = true;
                    console.log("✅Scheduler:Script sikeresen elindult és folyamatosan fut!");
                }
                catch (error) {
                    console.error("❌Scheduler: Hiba a script betöltése közben:", error);
                    if (Scheduler.onerror) {
                        Scheduler.onerror('Scheduler: Hiba a script betöltése közben:', error);
                    }
                }
            });
        }
    }
    exports.Scheduler = Scheduler;
    Scheduler.currentScriptFunction = null;
    Scheduler.isLoaded = false;
});
