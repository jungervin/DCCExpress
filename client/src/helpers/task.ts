import { toastManager } from "../controls/toastManager";
import { Z21Directions } from "../../../common/src/dcc";
import { Api } from "./api";
import { Globals } from "./globals";
import { text } from "stream/consumers";
import { htmlSpaces } from "./utility";


export const tasksCompleteEvent = new Event("tasksCompleteEvent");

export enum StepTypes {
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
    break = "break",
    setOutput = "setOutput",
    ifOutputIsOn = "ifOutputIsOn",
    ifOutputIsOff = "ifOutputIsOff",
    setAccessory = "setAccessory",
    ifAccessoryIsOn = "ifAccessoryIsOn",
    ifAccessoryIsOff = "ifAccessoryIsOff",
    setSignalGreen = "setSignalGreen",
    ifSignalIsGreen = "ifSignalIsGreen",
    setSignalRed = "setSignalRed",
    ifSignalIsRed = "ifSignalIsRed",
    setSignalYellow = "setSignalYellow",
    ifSignalIsYellow = "ifSignalIsYellow",
    setSignalWhite = "setSignalWhite",
    ifSignalIsWhite = "ifSignalIsWhite",
    ifSensorIsOn = "ifSensorIsOn",
    ifSensorIsOff = "ifSensorIsOff"
}
export interface iStep {
    type: StepTypes,
    data: object,
    ident: number
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

interface iSetOutput {
    address: number,
    on: boolean
}

interface iIfOutputIsOn {
    address: number
}

interface iIfOutputIsOff {
    address: number
}


interface iSetAccessory {
    address: number,
    on: boolean
}

interface iIfAccessoryIsOn {
    address: number
}

interface iIfAccessoryIsOff {
    address: number
}

interface iSetSignalGreen {
    address: number
}

interface iIfSignalIsGreen {
    address: number
}

interface iSetSignalRed {
    address: number
}

interface iIfSignalIsRed {
    address: number
}

interface iSetSignalYellow {
    address: number
}

interface iIfSignalIsYellow {
    address: number
}

interface iSetSignalWhite {
    address: number
}

interface iIfSignalIsWhite {
    address: number
}

interface iIfSensorIsOn {
    address: number
}

interface iIfSensorIsOff {
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
    stepByStep = false
    ident: number = 0;
    //    stopOnComplete: boolean = true;
    prevSpeed: number = 0;
    constructor(name: string) {
        this.name = name
    }

    setLoco(address: number) {
        this.locoAddress = address
        this.steps.push({ type: StepTypes.setLoco, data: { address: address } as iLocoStep, ident: this.ident } as iStep)
    }

    setTurnout(address: number, closed: boolean) {
        this.steps.push({ type: StepTypes.setTurnout, data: { address: address, closed: closed } as iSetTurnoutStep, ident: this.ident } as iStep)
    }

    setTurnoutMs(address: number, closed: boolean, wait: number) {
        this.setTurnout(address, closed)
        this.delay(wait)
    }

    forward(speed: number) {
        this.steps.push({ type: StepTypes.forward, data: { speed: speed } as iForwardStep, ident: this.ident } as iStep)
    }
    reverse(speed: number) {
        this.steps.push({ type: StepTypes.reverse, data: { speed: speed } as iForwardStep, ident: this.ident } as iStep)
    }
    stopLoco() {
        this.steps.push({ type: StepTypes.stopLoco, data: { speed: 0 }, ident: this.ident } as iStep)
    }

    setFunction(fn: number, on: boolean): void {
        this.steps.push({ type: StepTypes.setFunction, data: { fn: fn, on: on } as iFunctionStep, ident: this.ident } as iStep)
    }

    setFunctionMs(fn: number, on: boolean, duration: number): void {
        this.setFunction(fn, on)
        this.delay(duration)
        this.setFunction(fn, !on)
    }

    delay(ms: number) {
        this.steps.push({ type: StepTypes.delay, data: { ms: ms } as iDelayStep, ident: this.ident } as iStep)
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
        this.steps.push({ type: StepTypes.waitForSensor, data: { address: address, on: on } as iWaitForSensor, ident: this.ident } as iStep)
    }

    setRoute(routeName: string) {
        this.steps.push({ type: StepTypes.setRoute, data: { routeName: routeName } as iRouteStep, ident: this.ident } as iStep)
    }

    waitForMinutes(minute: number) {
        this.steps.push({ type: StepTypes.waitForMinutes, data: { minute: minute } as iWaitForMinute, ident: this.ident } as iStep)
    }

    startAtMinutes(minutes: number[]) {
        this.steps.push({ type: StepTypes.startAtMinutes, data: { minutes: minutes }, ident: this.ident })
    }

    playSound(fname: string) {
        this.steps.push({ type: StepTypes.playSound, data: { fname: fname } as iPlaySound, ident: this.ident } as iStep)
    }

    label(text: string) {
        this.steps.push({ type: StepTypes.label, data: { text: text } as iLabel, ident: this.ident } as iStep)
    }

    ifClosed(address: number) {
        this.steps.push({ type: StepTypes.ifClosed, data: { address } as iIfClosed, ident: this.ident++ } as iStep)
    }

    ifOpen(address: number) {
        this.steps.push({ type: StepTypes.ifOpen, data: { address } as iIfOpen, ident: this.ident } as iStep)
    }

    endIf() {
        this.steps.push({ type: StepTypes.endIf, data: {}, ident: this.ident - 1 } as iStep)
        this.ident-- 
    }

    else() {
        this.steps.push({ type: StepTypes.else, data: {}, ident: this.ident - 1 } as iStep)
    }

    goto(label: string) {
        this.steps.push({ type: StepTypes.goto, data: { text: label } as iGoto, ident: this.ident } as iStep)
    }

    break(text: string = "") {
        this.steps.push({ type: StepTypes.break, data: { text: text } as iBreak, ident: this.ident } as iStep)
    }

    setOutput(address: number, on: boolean) {
        this.steps.push({ type: StepTypes.setOutput, data: { address: address, on: on } as iSetOutput, ident: this.ident } as iStep)
    }

    ifOutputIsOn(address: number) {
        this.steps.push({ type: StepTypes.ifOutputIsOn, data: { address: address } as iIfOutputIsOn, ident: this.ident++ } as iStep)
    }

    ifOutputIsOff(address: number) {
        this.steps.push({ type: StepTypes.ifOutputIsOff, data: { address: address } as iIfOutputIsOff, ident: this.ident++ } as iStep)
    }

    setAccessory(address: number, on: boolean) {
        this.steps.push({ type: StepTypes.setAccessory, data: { address: address, on: on } as iSetAccessory, ident: this.ident } as iStep)
    }

    ifAccessoryIsOn(address: number) {
        this.steps.push({ type: StepTypes.ifAccessoryIsOn, data: { address: address } as iIfAccessoryIsOn, ident: this.ident++ } as iStep)
    }

    ifAccessoryIsOff(address: number) {
        this.steps.push({ type: StepTypes.ifAccessoryIsOff, data: { address: address } as iIfAccessoryIsOff, ident: this.ident++ } as iStep)
    }

    setSignalGreen(address: number) {
        this.steps.push({ type: StepTypes.setSignalGreen, data: { address: address } as iSetSignalGreen, ident: this.ident } as iStep)
    }
    ifSignalIsGreen(address: number) {
        this.steps.push({ type: StepTypes.ifSignalIsGreen, data: { address: address } as iIfSignalIsGreen, ident: this.ident++ } as iStep)
    }

    setSignalRed(address: number) {
        this.steps.push({ type: StepTypes.setSignalRed, data: { address: address } as iSetSignalRed, ident: this.ident } as iStep)
    }
    ifSignalIsRed(address: number) {
        this.steps.push({ type: StepTypes.ifSignalIsRed, data: { address: address } as iIfSignalIsRed, ident: this.ident++ } as iStep)
    }

    setSignalYellow(address: number) {
        this.steps.push({ type: StepTypes.setSignalYellow, data: { address: address } as iSetSignalYellow, ident: this.ident } as iStep)
    }
    ifSignalIsYellow(address: number) {
        this.steps.push({ type: StepTypes.ifSignalIsYellow, data: { address: address } as iIfSignalIsYellow, ident: this.ident++ } as iStep)
    }

    setSignalWhite(address: number) {
        this.steps.push({ type: StepTypes.setSignalWhite, data: { address: address } as iSetSignalWhite, ident: this.ident } as iStep)
    }
    ifSignalIsWhite(address: number) {
        this.steps.push({ type: StepTypes.ifSignalIsWhite, data: { address: address } as iIfSignalIsWhite, ident: this.ident++ } as iStep)
    }

    ifSensorIsOn(address: number) {
        this.steps.push({ type: StepTypes.ifSensorIsOn, data: { address: address } as iIfSensorIsOn, ident: this.ident++ } as iStep)
    }
    ifSensorIsOff(address: number) {
        this.steps.push({ type: StepTypes.ifSensorIsOff, data: { address: address } as iIfSensorIsOff, ident: this.ident++ } as iStep)
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
            return (i >= this.index && (step.type == StepTypes.endIf || step.type == StepTypes.else))
        })
        if (i >= 0) {
            const step = this.steps[i] as iStep
            this.index = i
            if (step.type == StepTypes.else) {
                this.index++;
            }

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
                    if (Api.getSensorValue(sensor.address) == sensor.on) {
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
                        //toastManager.showToast("Break", "warning")
                    }
                    break;
                case StepTypes.setOutput:
                    const o = this.step.data as iSetOutput
                    Api.setOutput(o.address, o.on)
                    this.index++;
                    break;
                case StepTypes.ifOutputIsOn:
                    const oon = this.step.data as iIfOutputIsOn
                    if (Api.getOutput(oon.address)) {
                        this.index++;
                    } else {
                        this.gotoNextEndOrElse()
                    }
                    break;
                case StepTypes.ifOutputIsOff:
                    const ooff = this.step.data as iIfOutputIsOff
                    if (!Api.getOutput(ooff.address)) {
                        this.index++;
                    } else {
                        this.gotoNextEndOrElse()
                    }
                    break;

                case StepTypes.setAccessory:
                    const a = this.step.data as iSetAccessory
                    Api.setAccessory(a.address, a.on)
                    this.index++;
                    break;
                case StepTypes.ifAccessoryIsOn:
                    const aon = this.step.data as iIfAccessoryIsOn
                    if (Api.getAccessory(aon.address)) {
                        this.index++;
                    } else {
                        this.gotoNextEndOrElse()
                    }
                    break;
                case StepTypes.ifAccessoryIsOff:
                    const aoff = this.step.data as iIfAccessoryIsOff
                    if (!Api.getAccessory(aoff.address)) {
                        this.index++;
                    } else {
                        this.gotoNextEndOrElse()
                    }
                    break;

                case StepTypes.setSignalGreen:
                    Api.setSignalGreen((this.step.data as iSetSignalGreen).address)
                    this.index++
                    break;
                case StepTypes.ifSignalIsGreen:
                    if (Api.getSignalIsGreen((this.step.data as iIfSignalIsGreen).address)) {
                        this.index++;
                    } else {
                        this.gotoNextEndOrElse()
                    }
                    break;

                case StepTypes.setSignalRed:
                    Api.setSignalRed((this.step.data as iSetSignalRed).address)
                    this.index++
                    break;
                case StepTypes.ifSignalIsRed:
                    if (Api.getSignalIsRed((this.step.data as iIfSignalIsRed).address)) {
                        this.index++;
                    } else {
                        this.gotoNextEndOrElse()
                    }
                    break;

                case StepTypes.setSignalYellow:
                    Api.setSignalYellow((this.step.data as iSetSignalYellow).address)
                    this.index++
                    break;
                case StepTypes.ifSignalIsYellow:
                    if (Api.getSignalIsYellow((this.step.data as iIfSignalIsYellow).address)) {
                        this.index++;
                    } else {
                        this.gotoNextEndOrElse()
                    }
                    break;

                case StepTypes.setSignalWhite:
                    Api.setSignalWhite((this.step.data as iSetSignalWhite).address)
                    this.index++
                    break;
                case StepTypes.ifSignalIsWhite:
                    if (Api.getSignalIsWhite((this.step.data as iIfSignalIsWhite).address)) {
                        this.index++;
                    } else {
                        this.gotoNextEndOrElse()
                    }
                    break;
                case StepTypes.ifSensorIsOn:
                    if (Api.getSensorValue((this.step.data as iIfSignalIsWhite).address)) {
                        this.index++;
                    } else {
                        this.gotoNextEndOrElse()
                    }
                    break;
                case StepTypes.ifSensorIsOff:
                    if (!Api.getSensorValue((this.step.data as iIfSignalIsWhite).address)) {
                        this.index++;
                    } else {
                        this.gotoNextEndOrElse()
                    }
                    break;


            }
        }
    }

    logStep(step: iStep): string {
        switch (step.type) {
            case StepTypes.setLoco:
                return htmlSpaces(step.ident) + (`setLoco: ${(step.data as iLocoStep).address}`)
            case StepTypes.setTurnout:
                return htmlSpaces(step.ident) + (`setTurnout: ${(step.data as iSetTurnoutStep).address} closed: ${(step.data as iSetTurnoutStep).closed}`)
            case StepTypes.forward:
                return htmlSpaces(step.ident) + (`forward: ${(step.data as iForwardStep).speed}`)
            case StepTypes.reverse:
                return htmlSpaces(step.ident) + (`reverse: ${(step.data as iForwardStep).speed}`)
            case StepTypes.stopLoco:
                return htmlSpaces(step.ident) + (`stopLoco`)
            case StepTypes.delay:
                return htmlSpaces(step.ident) + (`delay: ${(step.data as iDelayStep).ms}`)
            case StepTypes.waitForSensor:
                return htmlSpaces(step.ident) + (`waitForSensor: ${(step.data as iWaitForSensor).address} on: ${(step.data as iWaitForSensor).on}`)
            case StepTypes.setFunction:
                return htmlSpaces(step.ident) + (`setFunction: ${(step.data as iFunctionStep).fn} on: ${(step.data as iFunctionStep).on}`)
                break;
            case StepTypes.restart:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">restart</b>`)
            case StepTypes.playSound:
                return htmlSpaces(step.ident) + (`playSound: ${(step.data as iPlaySound).fname}`)
            case StepTypes.setRoute:
                return htmlSpaces(step.ident) + (`setRoute: ${(step.data as iRouteStep).routeName}`)
            case StepTypes.startAtMinutes:
                return htmlSpaces(step.ident) + (`startAtMinutes: ${(step.data as iStartAtMinutes).minutes}`)
            case StepTypes.waitForMinutes:
                return htmlSpaces(step.ident) + (`waitForMinute: ${(step.data as iWaitForMinute).minute}`)
            case StepTypes.label:
                return htmlSpaces(step.ident) + (`<b>label</b>: ${(step.data as iLabel).text}`)
            case StepTypes.ifClosed:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">ifClosed</b>: ${(step.data as iIfClosed).address}`)
            case StepTypes.ifOpen:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">ifOpen:</b> ${(step.data as iIfOpen).address}`)
            case StepTypes.else:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">else:</b>`)
            case StepTypes.endIf:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">endIf</b>`)
            case StepTypes.goto:
                return htmlSpaces(step.ident) + (`<b>goto:</b> ${(step.data as iGoto).text}`)
            case StepTypes.break:
                return htmlSpaces(step.ident) + (`<b>break:</b> ${(step.data as iBreak).text}`)

            case StepTypes.setOutput:
                return htmlSpaces(step.ident) + (`setOutput: ${(step.data as iSetOutput).address} on: ${(step.data as iSetOutput).on}`)
            case StepTypes.ifOutputIsOn:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">ifOutputIsOn:</b> ${(step.data as iIfOutputIsOn).address}`)
            case StepTypes.ifOutputIsOff:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">ifOutputIsOff:</b> ${(step.data as iIfOutputIsOff).address}`)

            case StepTypes.setAccessory:
                return htmlSpaces(step.ident) + (`setAccessory: ${(step.data as iSetAccessory).address} on: ${(step.data as iSetAccessory).on}`)
            case StepTypes.ifAccessoryIsOn:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">ifAccessoryIsOn:</b> ${(step.data as iIfAccessoryIsOn).address}`)
            case StepTypes.ifAccessoryIsOff:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">ifAccessoryIsOff:</b> ${(step.data as iIfAccessoryIsOff).address}`)

            case StepTypes.setSignalGreen:
                return htmlSpaces(step.ident) + (`setSignalGreen: ${(step.data as iSetSignalGreen).address}`)
            case StepTypes.ifSignalIsGreen:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">ifSignalIsGreen:</b> ${(step.data as iIfSignalIsGreen).address}`)

            case StepTypes.setSignalRed:
                return htmlSpaces(step.ident) + (`setSignalRed: ${(step.data as iSetSignalRed).address}`)
            case StepTypes.ifSignalIsRed:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">ifSignalIsRed:</b> ${(step.data as iIfSignalIsRed).address}`)

            case StepTypes.setSignalYellow:
                return htmlSpaces(step.ident) + (`setSignalYellow: ${(step.data as iSetSignalYellow).address}`)
            case StepTypes.ifSignalIsYellow:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">ifSignalIsYellow:</b> ${(step.data as iIfSignalIsYellow).address}`)

            case StepTypes.ifSensorIsOn:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">ifSensorIsOn:</b> ${(step.data as iIfSensorIsOn).address}`)
            case StepTypes.ifSensorIsOff:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">ifSensorIsOff:</b> ${(step.data as iIfSensorIsOff).address}`)

        }
        return "Unknown"
    }
    proc() {
        if (this.status == TaskStatus.running) {
            if (this.index < this.steps.length) {
                if (this.index != this.prevIndex) {
                    // if(this.stepByStep) {
                    //     this.status = TaskStatus.stopped
                    // }
                    this.prevIndex = this.index;
                    this.step = this.steps[this.index]
            
                    //this.logStep(this.step!)
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
        // if (this.step?.type == StepTypes.break && this.index < this.steps.length - 1) {
        //     this.index++
        // }

        this.index++
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
        if (v >= this.steps.length) {
            this._index = this.steps.length - 1
        }


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