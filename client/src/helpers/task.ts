import { Z21Directions } from "../../../common/src/dcc";
import { Api } from "./api";

enum StepTypes {
    loco = "loco",
    setTurnout = "setTurnout",
    foward = "foward",
    reverse = "reverse",
    stop = "stop",
    delay = "delay",
    waitForSensor = "waitForSensor",
    function = "function",
    restart = "restart"
}
interface iStep {
    type: StepTypes,
    data: object
}

interface iLocoStep {
    address: number
}

interface iSetTurnoutStep {
    address: number,
    closed: boolean
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

export class Tasks {

    tasks: Task[] = []
    timer: NodeJS.Timeout;
    //private worker: Worker;
    constructor() {
        this.timer = setInterval(() => {
            this.tasks.forEach(t => { t.proc() })
        }, 50)
        //this.worker = new Worker(new URL("./worker.ts", import.meta.url));
        // this.worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });

        // // Fogadjuk a Worker által küldött Tick eseményeket
        // this.worker.onmessage = () => {
        //     this.tasks.forEach(t => t.proc());
        // };

        // // Küldjük a workernek a kívánt intervallumot
        // this.worker.postMessage({ interval: 50 });
    }

    exec() {

    }
    addTask(name: string) {
        console.log(`addTask: ${name}`)
        const task = new Task(name)
        this.tasks.push(task)
        return task
    }

    startTask(name: string) {
        console.log(`startTask: ${name}`)
        const task = this.getTask(name)
        if (task) {
            task.taskStart()
        }
    }

    stopTask(name: string) {
        console.log(`stopTask: ${name}`)
        const task = this.getTask(name)
        if (task) {
            task.taskStop()
        }
    }

    getTask(name: string) {
        console.log(`getTask: ${name}`)
        return this.tasks.find(t => t.name == name)
    }

    getTasks() {
        return this.tasks
    }

    getTaskNames() {
        return this.tasks.map(t => t.name)
    }

    // restartTask(name: string) {
    //     const task = this.getTask(name)
    //     if (task) {
    //         task.restart()
    //     }
    // }   

    // deleteTask(name: string) {
    //     const task = this.getTask(name)
    //     if (task) {
    //         task.taskStop()
    //         const index = this.tasks.indexOf(task)
    //         this.tasks.splice(index, 1)
    //     }
    // }   

    stopAllTask() {
        console.log('stopAllTask()')
        this.tasks.forEach(t => {
            t.taskStop()
        })
    }

    startAllTask() {
        console.log('startAllTask()')
        this.tasks.forEach(t => {
            t.taskStart()
        })
    }

    restartAllTask() {
        console.log('restartAllTask()')
        this.tasks.forEach(t => {
            t.restart()
        })
    }
}

export class Task {
    name: string;
    index: number = 0;
    prevIndex: number = -1;
    steps: any[] = []
    //delayTimer?: NodeJS.Timeout | undefined;
    // timer?: NodeJS.Timeout | undefined;
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

    setTurnout(address: number, closed: boolean) {
        this.steps.push({ type: StepTypes.setTurnout, data: { address: address, closed: closed } as iSetTurnoutStep } as iStep)
    }

    setTurnoutMs(address: number, closed: boolean, wait: number) {
        this.setTurnout(address, closed)
        this.delay(wait)
    }

    foward(speed: number) {
        this.steps.push({ type: StepTypes.foward, data: { speed: speed } as iForwardStep } as iStep)
    }
    reverse(speed: number) {
        this.steps.push({ type: StepTypes.reverse, data: { speed: speed } as iForwardStep } as iStep)
    }
    stop() {
        this.steps.push({ type: StepTypes.stop, data: { speed: 0 } } as iStep)
    }

    setFunction(fn: number, on: boolean): void {
        this.steps.push({ type: StepTypes.function, data: { fn: fn, on: on } as iFunctionStep } as iStep)
    }

    setFunctionMs(fn: number, on: boolean, wait: number): void {
        this.setFunction(fn, on)
        this.delay(wait)
        this.setFunction(fn, !on)
    }

    delay(ms: number) {
        this.steps.push({ type: StepTypes.delay, data: { ms: ms } as iDelayStep } as iStep)
    }

    waitMs(min: number, max: number) {
        const ms = Math.floor(Math.random() * (max - min + 1) + min)
        this.delay(ms)
    }

    waitSec(min: number, max: number) {
        const ms = Math.floor(Math.random() * (max - min + 1) + min) * 1000
        this.delay(ms)
    }

    waitForSensor(address: number, on: boolean) {
        this.steps.push({ type: StepTypes.waitForSensor, data: { address: address, on: on } as iWaitForSensor } as iStep)
    }

    procStep() {
        if (this.step) {
            switch (this.step.type) {
                case StepTypes.loco:
                    this.locoAddress = (this.step.data as iLocoStep).address
                    //console.log(`TASK: ${this.name} loco: ${this.locoAddress} added!`)
                    this.index++
                    break;

                case StepTypes.setTurnout:
                    const turnout = (this.step.data as iSetTurnoutStep)
                    Api.setTurnout(turnout.address, turnout.closed)
                    this.index++;
                    break;

                case StepTypes.foward:
                    const speed = (this.step.data as iForwardStep).speed
                    //console.log(`TASK: ${this.name} foward: ${speed} started!`)
                    Api.setLoco(this.locoAddress, speed, Z21Directions.forward)
                    this.index++;
                    break;

                case StepTypes.reverse:
                    const rspeed = (this.step.data as iForwardStep).speed
                    //console.log(`TASK: ${this.name} reverse: ${rspeed} started!`)
                    Api.setLoco(this.locoAddress, rspeed, Z21Directions.reverse)
                    this.index++;
                    break;

                case StepTypes.stop:
                    //console.log(`TASK: ${this.name} stop started!`)
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
                        //console.log(`TASK: ${this.name} delay: ${ms} started!`)
                        this.delayEnd = performance.now() + ms
                    } else if (performance.now() > this.delayEnd) {
                        this.index++;
                        this.delayEnd = 0;
                        //console.log(`TASK: ${this.name} delay finished!`)
                    }
                    break;

                case StepTypes.waitForSensor:
                    const sensor = (this.step.data as iWaitForSensor)
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
                    //console.log(`TASK: ${this.name} restart!`)
                    this.index = 0;
                    this.prevIndex = -1;
                    break;
            }
        }
    }

    logStep(step: iStep) {
        switch (step.type) {
            case StepTypes.loco:
                console.log(`TASK: ${this.name} index: ${this.index} loco: ${(step.data as iLocoStep).address}`)
                break;
            case StepTypes.setTurnout:
                console.log(`TASK: ${this.name} index: ${this.index} setTurnout: ${(step.data as iSetTurnoutStep).address} closed: ${(step.data as iSetTurnoutStep).closed}`)
                break;
            case StepTypes.foward:
                console.log(`TASK: ${this.name} index: ${this.index} foward: ${(step.data as iForwardStep).speed}`)
                break;
            case StepTypes.reverse:
                console.log(`TASK: ${this.name} index: ${this.index} reverse: ${(step.data as iForwardStep).speed}`)
                break;
            case StepTypes.stop:
                console.log(`TASK: ${this.name} index: ${this.index} stop`)
                break;
            case StepTypes.delay:
                console.log(`TASK: ${this.name} index: ${this.index} delay: ${(step.data as iDelayStep).ms}`)
                break;
            case StepTypes.waitForSensor:
                console.log(`TASK: ${this.name} index: ${this.index} waitForSensor: ${(step.data as iWaitForSensor).address}`)
                break;
            case StepTypes.function:
                console.log(`TASK: ${this.name} index: ${this.index} function: ${(step.data as iFunctionStep).fn}`)
                break;
            case StepTypes.restart:
                console.log(`TASK: ${this.name} index: ${this.index} restart`)
                break;
        }
    }
    proc() {
        if (this.status == TaskStatus.running) {
            if (this.index < this.steps.length) {
                if (this.index != this.prevIndex) {
                    this.prevIndex = this.index;
                    this.step = this.steps[this.index]
                    this.logStep(this.step!)
                    //console.log(`TASK: ${this.name} index: ${this.index} step: ${this.step!.type}`)
                }
                if (this.status == TaskStatus.running) {
                    this.procStep()
                }
            } else {
                console.log(`TASK: ${this.name} finished! Exit!`)
                this.status = TaskStatus.finished
            }
        }
    }

    restart() {
        this.steps.push({ type: StepTypes.restart, data: {} })
    }

    taskStart() {
        console.log(`TASK: ${this.name} started!`)
        this.stop()
        this.index = 0;
        this.prevIndex = -1;
        this.status = TaskStatus.running
        //this.proc();
    }

    taskStop() {
        this.status = TaskStatus.stopped
        // stop the loco
        this.stop()

    }
}