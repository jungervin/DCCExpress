
enum StepTypes {
    loco,
    delay,
    function
}
interface iStep {
    type: StepTypes,
    data: object
}

interface iLocoStep {
    address: number
}

interface iDelayStep {
    ms: number
}

export class Task {
    name: string;
    index: number = 0;
    prevIndex: number = -1;
    steps: any[] = []
    delayTimer?: NodeJS.Timeout | undefined;
    timer?: NodeJS.Timeout | undefined;
    locoAddress: number = 0;
    constructor(name: string) {
        this.name = name
    }

    addLoco(address: number) {
        this.steps.push({ type: StepTypes.loco, data: { address: address } as iLocoStep } as iStep)
    }
    addDelay(ms: number) {
        this.steps.push({ type: StepTypes.delay, data: { ms: ms } as iDelayStep } as iStep)
    }

    private delay(ms: number) {
        this.delayTimer = setTimeout(() => {
            this.index++
        }, ms)
    }

    procStep(step: iStep) {
        switch (step.type) {
            case StepTypes.loco:
               
                this.locoAddress = (step.data as iLocoStep).address
                console.log(`TASK: ${this.name} loco: ${this.locoAddress} added!`)
                this.index++
                break;
            case StepTypes.delay:
                const ms = (step.data as iDelayStep).ms
                console.log(`TASK: ${this.name} delay: ${ms} started!`)
                this.delayTimer = setTimeout(() => {
                    this.index++;
                    console.log(`TASK: ${this.name} delay finished!`)
                }, ms)

                break;
            case StepTypes.function:
                this.index++;
                break;
        }
    }
    proc() {
        if (this.index != this.prevIndex) {
            if (this.index < this.steps.length) {
                const step = this.steps[this.index]
                this.procStep(step)
                this.prevIndex = this.index;
            } else {
                console.log(`TASK: ${this.name} finished!`)
            }
        }
        this.timer = setTimeout(() => {
            this.proc()
        }, 50)
    }
    start() {
        console.log(`TASK: ${this.name} started!`)
        this.stop()
        this.index = 0;
        this.prevIndex = -1;
        this.proc();
    }

    stop() {
        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = undefined
        }
        if (this.delayTimer) {
            clearTimeout(this.delayTimer)
            this.delayTimer = undefined
        }
    }
}