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

class SRFlipFlopManager {
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
