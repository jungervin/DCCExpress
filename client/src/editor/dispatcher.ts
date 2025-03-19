import { toastManager } from "../controls/toastManager";
import { Api } from "../helpers/api";

export class Dispatcher {
    static App: any;
    static icon = '<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 512 451.68"><path d="m269.13 380.42 7.07 44.83 37.72-91.14-49.96 14.51 18.49 18.49-13.32 13.31zm-31.92 42.31 7.15-41.81-13.77-13.81 17.57-17.62-47.64-14.76 36.69 88zm-86.43-273.1c15.59-9.22 43.71-15.3 75.01-17.66 6.7 11.66 16.58 19.35 28.91 23.86 12.53-4.71 22.41-12.57 29.07-23.86 29.15 2.23 56.16 7.94 73.65 17.66h2.61c3.92 0 2.64 20.55 3.14 25.97 3.6.99 6.2 3.39 7.98 6.62 5.54 10 1.82 27.54-2.11 37.5l-.04.13c-2.32 5.91-5.42 11.29-9.02 15.26-3.01 3.22-6.41 5.54-10.09 6.45-.7 2.27-1.49 4.63-2.06 6.95-4.1 13.81-7.32 24.68-15.84 35.48a84.995 84.995 0 0 1-5.96 6.78 69.96 69.96 0 0 1-4.46 4.34c.37 3.97.12 20.1.12 25.27 2.03-.99 4.42-1.2 6.7-.29C430.04 361.11 511.92 366.03 512 451.68H0c3.76-97.14 88.17-94 180.14-129.36 1.78-.66 5.17-2.36 6.99-2.64v-24.44c0-.91.24-1.78.62-2.53-.87-.78-1.7-1.61-2.48-2.4-7.24-7.44-12.29-14.47-16.71-24.31-3.02-6.7-5.42-13.94-8.19-22.13l-1.45-4.26c-3.14-.41-6.08-1.86-8.72-4.01-3.31-2.73-6.16-6.7-8.48-11.29-5.54-10.91-12.61-39.08.99-47.59 1.08-.71 2.28-1.2 3.6-1.53.83-8.19-2.4-25.81 4.47-25.56zM310.48 304c-10.87 6.83-21.58 11.79-34.32 14.68-23.94 5.59-46.23.5-67.61-10.58-3.39-1.78-6.78-3.73-10.22-5.92v20.31l56.12 17.37 56.03-16.26V304zM145.85 133.83v-21.96l-17.74-13.6c-25.43-28.21-20.3-27.38 6.66-34.95C174.14 52.24 200.85 28.3 224.05 13c26.31-17.33 34.45-17.33 60.75 0 23.16 15.3 49.92 39.24 89.24 50.32 26.97 7.57 32.09 6.74 6.7 34.95L363 111.87v21.96c-24.07-9.1-48.26-15.13-72.45-18.15 2.52-9.43 3.6-14.27 2.98-26.88-11.29 1.03-24.44-3.31-38.96-12.53-12.57 9.76-25.55 12.61-38.79 11.95-.37 12.94.83 17.91 3.35 27.33-24.48 2.98-48.96 9.06-73.28 18.28zm25.35 37.3-3.39 20.02c-.33 1.98-2.69 3.02-4.26 1.9l-6.28-4.01c-2.36-1.53-6.04-4.72-8.36-.99-4.13 6.7.79 24.07 4.02 30.6 1.57 3.1 3.35 5.66 5.21 7.19 3.39 2.69 4.5-.33 8.14 1.62 3.11 1.69 3.81 5.87 4.88 8.97l1.29 3.8c2.48 7.45 4.75 14.07 7.4 20.06 5.5 12.28 12.86 21.05 23.49 29.16 11.33 8.6 24.06 14.47 38.04 17.12 10.26 1.9 20.76 1.9 31.02-.17a85.537 85.537 0 0 0 36.31-16.87c4.92-3.89 9.42-8.31 13.39-13.36 3.48-4.34 5.96-8.97 7.99-14.06 2.1-5.21 3.8-10.83 5.66-17.16 1.08-3.64 2.15-7.28 3.31-10.92 1.78-6.9 7.15-2.27 11.83-7.4 2.35-2.69 4.59-6.82 6.41-11.45 1.49-3.85 7.94-26.8.82-29.16-1.9-.83-4.79 1.53-6.28 2.56-3.44 2.28-5.05 3.35-10.47 4.97-3.51.99-3.63-2.77-3.8-5.01l-1.7-18.9c-49.91 21.71-121.49 21.09-164.67 1.49z"/></svg>'

    static onchange?: () => void;
    static onerror?: (msg: string, err: any) => void;

    private static currentScriptFunction: Function | null = null;
    //private static scriptContext: any = {};
    private static isRunning: boolean = false;
    // private static intervalId: NodeJS.Timeout | null = null;
    // public static interval: number = 888; // 1 másodpercenként hívogatjuk


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

    static exec() {
        if (Dispatcher.active) {
            if (Dispatcher.currentScriptFunction) {
                try {
                    //Dispatcher.currentScriptFunction(Dispatcher.App, Api);
                    if (window.dispatcherLoop) {
                        window.dispatcherLoop()
                    } else {
                        Dispatcher.currentScriptFunction(Dispatcher.App, Api);
                    }

                } catch (error) {
                    console.error("❌Dispatcher: Hiba a script futtatása közben:", error);
                    if (Dispatcher.onerror) {
                        Dispatcher.onerror('Dispatcher: Hiba a script futtatása közben:', error)
                    }
                }
            }
        }
    }

    static async start(filePath: string): Promise<void> {
        if (Dispatcher.isRunning) {
            console.warn("⚠️ Már fut egy script. Állítsd le először a stop() metódussal.");
            return;
        }

        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Dispatcher: Nem sikerült betölteni a fájlt: ${filePath}`);
                //Hiba a script betöltése közben:
            }

            Dispatcher.scriptContent = await response.text();
            console.log(`📥Dispatcher: Betöltött fájl: ${filePath}`);

            this.currentScriptFunction = new Function("App", 'Api', "with (App, Api) { " + this.scriptContent + " }");

            // First Run
            this.currentScriptFunction(Dispatcher.App, Api);

            if (window.dispatcherInit) {
                window.dispatcherInit()
            } else {
                toastManager.showToast("Could not find window.dispatcherInit function", "warning")
            }

            if (window.dispatcherLoop) {
                window.dispatcherLoop()
            } else {
                toastManager.showToast("Could not find dispatcherLoop function", "warning")
            }


            toastManager.showToast(Dispatcher.icon + " Dispathcer Started!", "success")
            // this.intervalId = setInterval(() => {
            //     Dispatcher.exec()
            // }, Dispatcher.interval);

            Dispatcher.isRunning = true;
            console.log("✅Dispatcher: Script sikeresen elindult és folyamatosan fut!");

        } catch (error) {
            toastManager.showToast("Dispathcer Error!", "error")
            if (Dispatcher.onerror) {
                Dispatcher.onerror('Dispatcher: Hiba a script betöltése közben:', error)
            }
        }
    }

    static stop(): void {
        if (!Dispatcher.isRunning) {
            console.warn("⚠️Dispatcher: Nincs futó script.");
            return;
        }

        // if (Dispatcher.intervalId) {
        //     clearInterval(Dispatcher.intervalId);
        //     Dispatcher.intervalId = null;
        // }

        Dispatcher.currentScriptFunction = null;
        Dispatcher.isRunning = false;
        console.log("⏹Dispatcher: Script leállítva.");
        toastManager.showToast(Dispatcher.icon + " Dispathcer Stopped!", "info")
    }
}