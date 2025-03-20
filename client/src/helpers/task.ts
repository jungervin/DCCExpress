import { toastManager } from "../controls/toastManager";
import { Z21Directions } from "../../../common/src/dcc";
import { Api } from "./api";
import { Globals } from "./globals";
import { text } from "stream/consumers";


export const tasksCompleteEvent = new Event("tasksCompleteEvent");

enum StepTypes {
    setLoco = "setLoco",
    setTurnout = "setTurnout",
    forward = "forward",
    reverse = "reverse",
    stopLoco = "stop",
    delay = "delay",
    waitForSensor = "waitForSensor",
    setFunction = "setFunction",
    restart = "restart",
    setRoute = "setRoute",
    waitForMinutes = "waitForMinutes",
    startAtMinutes = "startAtMinutes",
    playSound = "playSound",
    label = "label",
    ifFree = "ifFree",
    goto = "goto",

    ifClosed = "ifClosed",
    ifOpen = "ifOpen",
    else = "else",
    endIf = "endIf",
    break = "break"
}
export interface iStep {
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

interface iRouteStep {
    routeName: string
}
interface iRestart {

}

interface iWaitForMinute {
    minute: number,
}

interface iStartAtMinutes {
    minutes: number[]
}

interface iPlaySound {
    fname: string
}

interface iLabel {
    text: string
}

interface iGoto {
    text: string
}

interface iBreak {
    text: string
}

interface iIfClosed {
    address: number
}

interface iIfOpen {
    address: number
}


export enum TaskStatus {
    running = "🚂 RUNNING",
    paused = "paused",
    stopped = "🛑 STOPPED",
    completted = "completted"
}

export class Tasks {
    static icon = '<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24"><title>Tasks</title><path d="M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z" /></svg>'

    tasks: Task[] = []
    //timer: NodeJS.Timeout;
    running: boolean = false;
    prevRuning: boolean = false;
    //private worker: Worker;
    constructor() {
        // this.timer = setInterval(() => {
        //     var running = false;
        //     this.tasks.forEach(t => {
        //         t.proc()
        //         this.running ||= t.status == TaskStatus.running
        //     })

        //     if (!this.running != running) {
        //         this.running = running
        //         window.dispatchEvent(tasksCompleteEvent)
        //     }

        // }, 50)


    }

    exec() {

        var running = false;
        this.tasks.forEach(t => {
            t.proc()
            this.running ||= t.status == TaskStatus.running
        })

        if (!this.running != running) {
            this.running = running
            window.dispatchEvent(tasksCompleteEvent)
        }

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

    resumeTask(name: string) {
        console.log(`resumeTask: ${name}`)
        const task = this.getTask(name)
        if (task) {
            task.resumeTask()
        }
    }

    finishTask(name: string) {
        console.log(`abortTask: ${name}`)
        const task = this.getTask(name)
        if (task) {
            task.taskFinish();
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
    stopOnCompletion() {
        console.log('stopAllTask()')
        this.tasks.forEach(t => {
            t.finishOnComplete = true;
        })
    }

    startAllTask() {
        console.log('startAllTask()')
        this.tasks.forEach(t => {
            if (t.autoStart) {
                t.taskStart()
            } else {
                t.status = TaskStatus.stopped
            }
        })
    }

    restartAllTask() {
        console.log('restartAllTask()')
        this.tasks.forEach(t => {
            t.restart()
        })
    }
    save() {
        Globals.saveJson("tasks.json", this.tasks)
    }
}

export class Task {
    name: string;

    prevIndex: number = -1;
    steps: any[] = []
    //delayTimer?: NodeJS.Timeout | undefined;
    // timer?: NodeJS.Timeout | undefined;
    locoAddress: number = 0;
    num: number = 0;
    step: iStep | undefined;
    delayEnd: number = 0;
    autoStart = false

    //    stopOnComplete: boolean = true;
    prevSpeed: number = 0;
    constructor(name: string) {
        this.name = name
    }

    setLoco(address: number) {
        this.locoAddress = address
        this.steps.push({ type: StepTypes.setLoco, data: { address: address } as iLocoStep } as iStep)
    }

    setTurnout(address: number, closed: boolean) {
        this.steps.push({ type: StepTypes.setTurnout, data: { address: address, closed: closed } as iSetTurnoutStep } as iStep)
    }

    setTurnoutMs(address: number, closed: boolean, wait: number) {
        this.setTurnout(address, closed)
        this.delay(wait)
    }

    forward(speed: number) {
        this.steps.push({ type: StepTypes.forward, data: { speed: speed } as iForwardStep } as iStep)
    }
    reverse(speed: number) {
        this.steps.push({ type: StepTypes.reverse, data: { speed: speed } as iForwardStep } as iStep)
    }
    stopLoco() {
        this.steps.push({ type: StepTypes.stopLoco, data: { speed: 0 } } as iStep)
    }

    setFunction(fn: number, on: boolean): void {
        this.steps.push({ type: StepTypes.setFunction, data: { fn: fn, on: on } as iFunctionStep } as iStep)
    }

    setFunctionMs(fn: number, on: boolean, duration: number): void {
        this.setFunction(fn, on)
        this.delay(duration)
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

    setRoute(routeName: string) {
        this.steps.push({ type: StepTypes.setRoute, data: { routeName: routeName } as iRouteStep } as iStep)
    }

    waitForMinutes(minute: number) {
        this.steps.push({ type: StepTypes.waitForMinutes, data: { minute: minute } as iWaitForMinute } as iStep)
    }

    startAtMinutes(minutes: number[]) {
        this.steps.push({ type: StepTypes.startAtMinutes, data: { minutes: minutes } })
    }

    playSound(fname: string) {
        this.steps.push({ type: StepTypes.playSound, data: { fname: fname } as iPlaySound } as iStep)
    }

    label(text: string) {
        this.steps.push({ type: StepTypes.label, data: { text: text } as iLabel } as iStep)
    }

    ifClosed(address: number) {
        this.steps.push({ type: StepTypes.ifClosed, data: { address } as iIfClosed } as iStep)
    }

    ifOpen(address: number) {
        this.steps.push({ type: StepTypes.ifOpen, data: { address } as iIfOpen } as iStep)
    }

    endIf() {
        this.steps.push({ type: StepTypes.endIf, data: {} } as iStep)
    }

    else() {
        this.steps.push({ type: StepTypes.else, data: {} } as iStep)
    }

    goto(label: string) {
        this.steps.push({ type: StepTypes.goto, data: { text: label } as iGoto } as iStep)
    }

    break(text: string = "") {
        this.steps.push({ type: StepTypes.break, data: { text: text } as iBreak } as iStep)
    }

    gotoNextElse() {
        const i = this.steps.findIndex((step, i) => {
            return (i > this.index && step.type == StepTypes.else)
        })
        if (i >= 0) {
            this.index = i
        } else {
            this.status = TaskStatus.stopped
            toastManager.showToast("Could not find any endIf! STOPPED")
        }
    }
    gotoNextEndOrElse() {
        const i = this.steps.findIndex((step, i) => {
            return (i > this.index && (step.type == StepTypes.endIf || step.type == StepTypes.else))
        })
        if (i >= 0) {
            this.index = i
        } else {
            this.status = TaskStatus.stopped
            toastManager.showToast("Could not find any else or endIf! STOPPED", "error")
        }
    }

    gotoLabel(label: string) {
        const i = this.steps.findIndex((step, i) => {
            return (step.type == StepTypes.label && label == (step.data as iGoto).text)
        })
        if (i >= 0) {
            this.index = i
        } else {
            this.status = TaskStatus.stopped
            toastManager.showToast(`Could not find label named: ${label}! STOPPED`, "error")
        }
    }

    procStep() {
        if (this.step) {
            switch (this.step.type) {
                case StepTypes.setLoco:
                    this.locoAddress = (this.step.data as iLocoStep).address
                    //console.log(`TASK: ${this.name} loco: ${this.locoAddress} added!`)
                    this.index++
                    break;

                case StepTypes.setTurnout:
                    const turnout = (this.step.data as iSetTurnoutStep)
                    Api.setTurnout(turnout.address, turnout.closed)
                    this.index++;
                    break;

                case StepTypes.forward:
                    const speed = (this.step.data as iForwardStep).speed
                    this.prevSpeed = speed
                    Api.setLoco(this.locoAddress, speed, Z21Directions.forward)
                    this.index++;
                    break;

                case StepTypes.reverse:
                    const rspeed = (this.step.data as iForwardStep).speed
                    this.prevSpeed = rspeed
                    Api.setLoco(this.locoAddress, rspeed, Z21Directions.reverse)
                    this.index++;
                    break;

                case StepTypes.stopLoco:
                    this.prevSpeed = 0
                    Api.setLocoSpeed(this.locoAddress, 0)
                    this.index++;
                    break;
                case StepTypes.delay:
                    const ms = (this.step.data as iDelayStep).ms
                    if (this.delayEnd <= 0) {
                        this.delayEnd = performance.now() + ms
                    } else if (performance.now() > this.delayEnd) {
                        this.index++;
                        this.delayEnd = 0;
                    }
                    break;

                case StepTypes.waitForSensor:
                    const sensor = (this.step.data as iWaitForSensor)
                    if (Api.getSensor(sensor.address) == sensor.on) {
                        this.index++;
                        console.log(`TASK: ${this.name} waitForSensor:${sensor.address} finished!`)
                    }
                    break;
                case StepTypes.setFunction:
                    const f = (this.step.data as iFunctionStep)
                    Api.setLocoFunction(this.locoAddress, f.fn, f.on)
                    this.index++;
                    break;
                case StepTypes.setRoute:
                    const route = (this.step.data as iRouteStep)
                    Api.setRoute(route.routeName)
                    this.index++;
                    break;
                case StepTypes.restart:
                    if (!this.finishOnComplete) {
                        this.index = 0;
                        this.prevIndex = -1;
                    } else {
                        this.status = TaskStatus.stopped
                    }
                    break;
                case StepTypes.waitForMinutes:
                    const minute = (this.step.data as iWaitForMinute).minute
                    const clock = Api.getClock()
                    if (clock && clock.currentTime.getMinutes() % minute == 0) {
                        this.index++;
                        console.log(`TASK: ${this.name} waitForMinute:${minute} finished!`)
                    }
                    break;
                case StepTypes.startAtMinutes:
                    const minutes = (this.step.data as iStartAtMinutes).minutes
                    const clocka = Api.getClock()
                    if (clocka) {
                        const min = clocka.currentTime.getMinutes()
                        if (minutes.includes(min)) {
                            this.index++;
                            console.log(`TASK: ${this.name} startAtMinutes:${min} finished!`)
                        }
                    }
                    break;
                case StepTypes.playSound:
                    const fname = (this.step.data as iPlaySound).fname
                    Api.playSound(fname)
                    this.index++;
                    break;
                case StepTypes.label:
                    this.index++;
                    break;
                case StepTypes.ifClosed:
                    var t = Api.getTurnoutState((this.step.data as iIfClosed).address)
                    if (t) {
                        this.index++
                    } else {
                        this.gotoNextEndOrElse();
                    }
                    break;
                case StepTypes.ifOpen:
                    var t = Api.getTurnoutState((this.step.data as iIfClosed).address)
                    if (!t) {
                        this.index++
                    } else {
                        this.gotoNextEndOrElse();
                    }
                    break;
                case StepTypes.else:
                    this.gotoNextEndOrElse();
                    break;
                case StepTypes.endIf:
                    this.index++
                    break;
                case StepTypes.goto:
                    this.gotoLabel((this.step.data as iGoto).text)
                    break;
                case StepTypes.break:
                    if (this.status != TaskStatus.stopped) {
                        this.status = TaskStatus.stopped
                        toastManager.showToast("Break", "warning")
                    }
                    break;


            }
        }
    }

    logStep(step: iStep): string {
        switch (step.type) {
            case StepTypes.setLoco:
                return (`setLoco: ${(step.data as iLocoStep).address}`)
            case StepTypes.setTurnout:
                return (`setTurnout: ${(step.data as iSetTurnoutStep).address} closed: ${(step.data as iSetTurnoutStep).closed}`)
            case StepTypes.forward:
                return (`forward: ${(step.data as iForwardStep).speed}`)
            case StepTypes.reverse:
                return (`reverse: ${(step.data as iForwardStep).speed}`)
            case StepTypes.stopLoco:
                return (`stopLoco`)
            case StepTypes.delay:
                return (`delay: ${(step.data as iDelayStep).ms}`)
            case StepTypes.waitForSensor:
                return (`waitForSensor: ${(step.data as iWaitForSensor).address} on: ${(step.data as iWaitForSensor).on}`)
            case StepTypes.setFunction:
                return (`setFunction: ${(step.data as iFunctionStep).fn} on: ${(step.data as iFunctionStep).on}`)
                break;
            case StepTypes.restart:
                return (`<b style="color: yellow">restart</b>`)
            case StepTypes.playSound:
                return (`playSound: ${(step.data as iPlaySound).fname}`)
            case StepTypes.setRoute:
                return (`setRoute: ${(step.data as iRouteStep).routeName}`)
            case StepTypes.startAtMinutes:
                return (`startAtMinutes: ${(step.data as iStartAtMinutes).minutes}`)
            case StepTypes.waitForMinutes:
                return (`waitForMinute: ${(step.data as iWaitForMinute).minute}`)
            case StepTypes.label:
                return (`label: ${(step.data as iLabel).text}`)
            case StepTypes.ifClosed:
                return (`<b>ifClosed</b>: ${(step.data as iIfClosed).address}`)
            case StepTypes.ifOpen:
                return (`<b>ifOpen:</b> ${(step.data as iIfOpen).address}`)
            case StepTypes.else:
                return (`<b>else</b>`)
            case StepTypes.endIf:
                return (`<b>endIf</b>`)
            case StepTypes.goto:
                return (`<b>goto:</b> ${(step.data as iGoto).text}`)
            case StepTypes.break:
                return (`<b style="color: yellow">break:</b> ${(step.data as iBreak).text}`)

        }
        return "Unknown"
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
                //this.status = TaskStatus.completted
                this.status = TaskStatus.stopped
            }
        }
    }

    restart() {
        this.steps.push({ type: StepTypes.restart, data: {} })
    }

    taskStart() {
        console.log(`TASK: ${this.name} started!`)
        this.index = 0;
        this.prevIndex = -1;
        this.prevSpeed = 0;
        this.delayEnd = 0;
        this.status = TaskStatus.running
        //this.stopOnComplete = false;
        toastManager.showToast(Tasks.icon + ` TASK: ${this.name} started!`, "success")
    }

    taskFinish() {
        this.finishOnComplete = !this.finishOnComplete;
    }


    taskStop() {
        if (this.status != TaskStatus.stopped) {
            toastManager.showToast(Tasks.icon + ` TASK: ${this.name} stopped!`, "info")
        }
        this.status = TaskStatus.stopped
        this.delayEnd = 0;

        Api.setLocoSpeed(this.locoAddress, 0)

    }

    resumeTask() {
        if (this.step?.type == StepTypes.break && this.index < this.steps.length - 1) {
            this.index++
        }

        this.status = TaskStatus.running
        this.delayEnd = 0;
        if (this.prevSpeed > 0) {
            Api.setLocoSpeed(this.locoAddress, this.prevSpeed)
        }
    }


    private _stopOnComplete: boolean = false;
    public get finishOnComplete(): boolean {
        return this._stopOnComplete;
    }
    public set finishOnComplete(v: boolean) {
        this._stopOnComplete = v;
        window.dispatchEvent(
            new CustomEvent("taskChangedEvent", {
                detail: this,
                bubbles: true,
                composed: true,
            })
        );
    }


    private _status: TaskStatus = TaskStatus.stopped;
    public get status(): TaskStatus {
        return this._status;
    }
    public set status(v: TaskStatus) {
        this._status = v;
        window.dispatchEvent(
            new CustomEvent("taskChangedEvent", {
                detail: this,
                bubbles: true,
                composed: true,
            })
        );
    }

    private _index: number = 0;
    public get index(): number {
        return this._index;
    }
    public set index(v: number) {
        this._index = v;
        this.delayEnd = 0;
        window.dispatchEvent(
            new CustomEvent("taskChangedEvent", {
                detail: this,
                bubbles: true,
                composed: true,
            })
        );
    }

}