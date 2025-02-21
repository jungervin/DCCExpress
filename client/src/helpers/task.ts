import { Z21Directions } from "../../../common/src/dcc";
import { Api } from "./api";

enum StepTypes {
    loco,
    foward,
    reverse,
    stop,
    delay,
    waitForSensor,
    function,
    restart
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

interface iFunctionStep {
    fn: number,
    on: boolean
}

interface iForwardStep {
    speed: number
}

interface iRestart {

}
export enum TaskStatus {
    running,
    paused,
    stopped,
    finished
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
    status: TaskStatus = TaskStatus.stopped;
    constructor(name: string) {
        this.name = name
    }

    setLoco(address: number) {
        this.steps.push({ type: StepTypes.loco, data: { address: address } as iLocoStep } as iStep)
    }

    foward(speed: number) {
        this.steps.push({ type: StepTypes.foward, data: { speed: speed } as iForwardStep } as iStep)
    }
    reverse(speed: number) {
        this.steps.push({ type: StepTypes.reverse, data: { speed: speed } as iForwardStep } as iStep)
    }
    stop() {
        this.steps.push({ type: StepTypes.stop, data: {speed: 0} } as iStep)
    }

    setFunction(fn: number, on: boolean) {
        this.steps.push({ type: StepTypes.function, data: { fn: fn, on: on } as iFunctionStep } as iStep)
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

                case StepTypes.foward:
                    const speed = (this.step.data as iForwardStep).speed
                    console.log(`TASK: ${this.name} foward: ${speed} started!`)
                    Api.setLoco(this.locoAddress, speed, Z21Directions.forward)
                    this.index++;
                    break;

                case StepTypes.reverse:
                    const rspeed = (this.step.data as iForwardStep).speed   
                    console.log(`TASK: ${this.name} reverse: ${rspeed} started!`)
                    Api.setLoco(this.locoAddress, rspeed, Z21Directions.reverse)
                    this.index++;
                    break;

                case StepTypes.stop:
                    console.log(`TASK: ${this.name} stop started!`)
                    Api.setLocoSpeed(this.locoAddress, 0)
                    this.index++;
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
                    if (Api.getSensor(sensor.address) == sensor.on) {
                        this.index++;
                        console.log(`TASK: ${this.name} waitForSensor:${sensor.address} finished!`)
                    }
                    break;
                case StepTypes.function:
                    const f = (this.step.data as iFunctionStep)
                    Api.setLocoFunction(this.locoAddress, f.fn, f.on)
                    this.index++;
                    break;
                case StepTypes.restart:
                    console.log(`TASK: ${this.name} restart!`)
                    this.index = 0;
                    this.prevIndex = -1;
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

    restart() {
        this.steps.push({type: StepTypes.restart, data: {}})
    }

    taskStart() {
        console.log(`TASK: ${this.name} started!`)
        this.stop()
        this.index = 0;
        this.prevIndex = -1;
        this.status = TaskStatus.running
        this.proc();
    }

    taskStop() {
        this.status = TaskStatus.stopped
        // Ez lehet kellene
        //this.stop()
        
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