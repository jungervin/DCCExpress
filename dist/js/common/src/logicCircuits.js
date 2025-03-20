define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PulseDetector = exports.SRFlipFlopManager = exports.SRFlipFlop = void 0;
    class SRFlipFlop {
        constructor(id) {
            this.id = id;
            this.state = false;
        }
        set() {
            this.state = true;
        }
        reset() {
            this.state = false;
        }
        getState() {
            return this.state;
        }
    }
    exports.SRFlipFlop = SRFlipFlop;
    class SRFlipFlopManager {
        static get(id) {
            if (!this.flipFlops.has(id)) {
                this.flipFlops.set(id, new SRFlipFlop(id));
            }
            return this.flipFlops.get(id);
        }
        static remove(id) {
            this.flipFlops.delete(id);
        }
        static listAll() {
            console.log("SR Flip-Flop states:");
            this.flipFlops.forEach((flipFlop, id) => {
                console.log(`ID: ${id} | State: ${flipFlop.getState() ? "SET" : "RESET"}`);
            });
        }
    }
    exports.SRFlipFlopManager = SRFlipFlopManager;
    SRFlipFlopManager.flipFlops = new Map();
    class PulseDetector {
        static getSensor(sensorId, state) {
            const currentTime = Date.now();
            const lastChange = PulseDetector.lastStateChange.get(sensorId) || currentTime;
            if (!this.sensorStates.has(sensorId)) {
                this.sensorStates.set(sensorId, state);
                this.lastStateChange.set(sensorId, currentTime);
                console.log(`Sensor ${sensorId} initialized as ${state ? 'ON' : 'OFF'} at ${currentTime}`);
                return 0;
            }
            if (!PulseDetector.sensorStates.has(sensorId) || PulseDetector.sensorStates.get(sensorId) !== state) {
                PulseDetector.sensorStates.set(sensorId, state);
                PulseDetector.lastStateChange.set(sensorId, currentTime);
                console.log(`Sensor ${sensorId} changed to ${state ? 'ON' : 'OFF'} at ${currentTime}`);
                return 0;
            }
            return currentTime - lastChange;
        }
    }
    exports.PulseDetector = PulseDetector;
    PulseDetector.lastStateChange = new Map();
    PulseDetector.sensorStates = new Map();
});
