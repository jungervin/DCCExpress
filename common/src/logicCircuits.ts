export class SRFlipFlop {
    id: string;
    private state: boolean;

    constructor(id: string) {
        this.id = id;
        this.state = false;
    }

    public set() {
        this.state = true;
    }

    public reset() {
        this.state = false;
    }

    public getState(): boolean {
        return this.state;
    }
}

export class SRFlipFlopManager {
    private static flipFlops: Map<string, SRFlipFlop> = new Map();

    public static get(id: string): SRFlipFlop {
        if (!this.flipFlops.has(id)) {
            this.flipFlops.set(id, new SRFlipFlop(id));
        }
        return this.flipFlops.get(id)!;
    }

    public static remove(id: string): void {
        this.flipFlops.delete(id);
    }

    public static listAll(): void {
        console.log("SR Flip-Flop states:");
        this.flipFlops.forEach((flipFlop, id) => {
            console.log(`ID: ${id} | State: ${flipFlop.getState() ? "SET" : "RESET"}`);
        });
    }
}

export class PulseDetector {
    private static lastStateChange: Map<number, number> = new Map();
    private static sensorStates: Map<number, boolean>= new Map();

    static getSensor(sensorId: number, state: boolean): number {
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