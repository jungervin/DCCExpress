
enum StepTypes {
    loco,
    delay,
    waitForSensor,
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

interface iWaitForSensor {
    address: number;
    on: boolean;
}

export class Task {
    name: string;
    index: number = 0;
    prevIndex: number = -1;
    steps: any[] = []
    delayTimer?: NodeJS.Timeout | undefined;
    timer?: NodeJS.Timeout | undefined;
    locoAddress: number = 0;
    num: number = 0;
    step: iStep | undefined;
    delayEnd: number = 0;
    constructor(name: string) {
        this.name = name
    }

    setLoco(address: number) {
        this.steps.push({ type: StepTypes.loco, data: { address: address } as iLocoStep } as iStep)
    }
    delay(ms: number) {
        this.steps.push({ type: StepTypes.delay, data: { ms: ms } as iDelayStep } as iStep)
    }

    waitForSensor(address: number, on: boolean) {
        this.steps.push({ type: StepTypes.waitForSensor, data: { address: address, on: on } as iWaitForSensor } as iStep)
    }

    procStep() {
        if (this.step) {
            switch (this.step.type) {
                case StepTypes.loco:
                    this.locoAddress = (this.step.data as iLocoStep).address
                    console.log(`TASK: ${this.name} loco: ${this.locoAddress} added!`)
                    this.index++
                    break;
                case StepTypes.delay:
                    // Ez helyett inkább 
                    //  delayEnd = now() + ms használj!
                    // amikor defejeződik a delayEnd pedig null legyen
                    const ms = (this.step.data as iDelayStep).ms
                    // console.log(`TASK: ${this.name} delay: ${ms} started!`)
                    // this.delayTimer = setTimeout(() => {
                    //     this.index++;
                    //     console.log(`TASK: ${this.name} delay finished!`)
                    // }, ms)

                    if (this.delayEnd <= 0) {
                        console.log(`TASK: ${this.name} delay: ${ms} started!`)
                        this.delayEnd = performance.now() + ms
                    } else if (performance.now() > this.delayEnd) {
                        this.index++;
                        this.delayEnd = 0;
                        console.log(`TASK: ${this.name} delay finished!`)
                    }


                    break;

                case StepTypes.waitForSensor:
                    const sensor = (this.step.data as iWaitForSensor)
                    console.log(`TASK: ${this.name} waitForSensor:${sensor.address} value: ${sensor.on}!`)
                    this.num++
                    if (this.num == 100) {
                        this.index++;
                        this.num = 0;
                        console.log(`TASK: ${this.name} waitForSensor:${sensor.address} finished!`)
                    }
                    break;
                case StepTypes.function:
                    this.index++;
                    break;
            }
        }
    }
    proc() {
        if (this.index < this.steps.length) {
            if (this.index != this.prevIndex) {
                this.prevIndex = this.index;
                this.step = this.steps[this.index]

            } else {
            }
            this.procStep()

            this.timer = setTimeout(() => {
                this.proc()
            }, 50)


        } else {
            console.log(`TASK: ${this.name} finished! Exit!`)

        }
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