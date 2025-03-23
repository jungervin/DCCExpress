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
    stopLoco = "stopLoco",
    delay = "delay",
    waitForSensor = "waitForSensor",
    setFunction = "setFunction",
    restart = "restart",
    setRoute = "setRoute",
    waitForMinutes = "waitForMinutes",
    startAtMinutes = "startAtMinutes",
    playSound = "playSound",

    //playSoundRandom egy tömb elemeit játsza le de ez lehet a dispatcherbe kell


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
    ifSensorIsOff = "ifSensorIsOff",
    setBlockLocoAddress = "setBlockLocoAddress",
    ifBlockIsFree = "ifBlockIsFree",
    ifBlockIsNotFree = "ifBlockIsNotFree",
    setLocoAddressFromBlock = "setLocoAddressFromBlock",
    waitForMinute = "waitForMinute",
    ifMoving = "ifMoving",
    ifStopped = "ifStopped",
    ifForward = "ifForward",
    ifReverse = "ifReverse",
    waitForStop = "waitForStop",
    waitForStart = "waitForStart",
    ifSpeedGreaterThan = "ifSpeedGreaterThan",
    ifSpeedLessThan = "ifSpeedLessThan"
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

interface iSetBlock {
    blockName: string
}
interface iSetBlockLocoAddress {
    blockName: string
    locoAddress: number
}

interface iSetLocoAddressFromBlock {
    blockName: string
}

interface iIfBlockIsFree {
    blockName: string
}

interface iIfBlockIsNotFree {
    blockName: string
}

interface iIfSpeedGreaterThan {
    speed: number
}

interface iIfSpeedLessThan {
    speed: number
}
// interface iIfMoving {
//     locoAddress: number
// }

// interface iIfStopped {
//     locoAddress: number
// }

// interface iIfForward {
//     locoAddress: number
// }

// interface iIfReverse {
//     locoAddress: number
// }



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

    startAutoStart() {
        console.log('startAutoStartTask()')
        this.tasks.forEach(t => {
            if (t.autoStart) {
                t.taskStart()
            }
        })
    }

    startAllTask() {
        console.log('startAllTask()')
        this.tasks.forEach(t => {
            t.taskStart()
        })
    }

    stopAllTask() {
        console.log('stopAllTask()')
        this.tasks.forEach(t => {
            t.taskStop()
        })
    }

    resumeAllTask() {
        console.log('resumeAllTask()')
        this.tasks.forEach(t => {
            t.resumeTask()
        })
    }

    finishAllTask(finish: boolean) {
        console.log('finishAllTask()')
        this.tasks.forEach(t => {
            t.finishOnComplete = finish;
            //t.taskFinish()
        })
    }

    get allRuning(): number {
        if (this.tasks.length > 0) {
            var i = 0
            this.tasks.forEach((t) => {
                if (t.status == TaskStatus.running) {
                    i++
                }
            })
            return i / this.tasks.length
        }
        else {
            return 0;
        }
    }

    get allFinish(): number {
        if (this.tasks.length > 0) {
            var i = 0
            
            this.tasks.forEach((t) => {
                if (t.finishOnComplete) {
                    i++
                }
            })
            return i / this.tasks.length
        }
        else {
            return 0;
        }
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

    skipBreak = false;
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

    setBlockLocoAddress(blockName: string, locoAddress: number) {
        this.steps.push({ type: StepTypes.setBlockLocoAddress, data: { blockName, locoAddress } as iSetBlockLocoAddress, ident: this.ident } as iStep)
    }

    getLocoFromBlock(blockName: string) {
        this.steps.push({ type: StepTypes.setLocoAddressFromBlock, data: { blockName } as iSetLocoAddressFromBlock, ident: this.ident } as iStep)
    }

    ifBlockIsFree(blockName: string) {
        this.steps.push({ type: StepTypes.ifBlockIsFree, data: { blockName } as iIfBlockIsFree, ident: this.ident++ } as iStep)
    }

    ifBlockIsNotFree(blockName: string) {
        this.steps.push({ type: StepTypes.ifBlockIsNotFree, data: { blockName } as iIfBlockIsNotFree, ident: this.ident++ } as iStep)
    }

    ifMoving() {
        this.steps.push({ type: StepTypes.ifMoving, data: {}, ident: this.ident++ } as iStep)
    }

    ifStopped() {
        this.steps.push({ type: StepTypes.ifStopped, data: {}, ident: this.ident++ } as iStep)
    }

    ifForward() {
        this.steps.push({ type: StepTypes.ifForward, data: {}, ident: this.ident++ } as iStep)
    }

    ifReverse() {
        this.steps.push({ type: StepTypes.ifReverse, data: {}, ident: this.ident++ } as iStep)
    }

    waitForStop() {
        this.steps.push({ type: StepTypes.waitForStop, data: {}, ident: this.ident } as iStep)
    }

    waitForStart() {
        this.steps.push({ type: StepTypes.waitForStart, data: {}, ident: this.ident } as iStep)
    }

    ifSpeedGreaterThan(speed: number) {
        this.steps.push({ type: StepTypes.ifSpeedGreaterThan, data: {}, ident: this.ident++ } as iStep)
    }

    ifSpeedLessThan(speed: number) {
        this.steps.push({ type: StepTypes.ifSpeedLessThan, data: {}, ident: this.ident++ } as iStep)
    }


    gotoElse2() {
    }
    gotoEnd() {
        let depth = 0;

        while (++this.index < this.steps.length) {
            const step: iStep = this.steps[this.index]
            if (step.type.startsWith("if")) {
                depth++
            }
            else if (step.type == StepTypes.endIf) {
                if (depth == 0) {
                    break;
                }
                depth--;
            }
        }

        if (depth > 0) {
            this.status = TaskStatus.stopped
            toastManager.showToast("Could not find any endIf()! STOPPED")
        }
    }

    gotoNextEndOrElse() {
        let depth = 0;

        while (++this.index < this.steps.length) {
            const step: iStep = this.steps[this.index]
            if (step.type.startsWith("if")) {
                depth++
            }
            else if (step.type == StepTypes.endIf) {
                if (depth == 0) {
                    break;
                }
                depth--;
            } else if (step.type == StepTypes.else && depth == 0) {
                this.break;
            }
        }

        if (depth > 0) {
            this.status = TaskStatus.stopped
            toastManager.showToast("Could not find any else! STOPPED")
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

                case StepTypes.ifMoving:
                    const l4 = Api.getLoco(this.locoAddress)
                    if (l4) {
                        if (l4.speed > 0) {
                            this.index++
                        } else {
                            this.gotoNextEndOrElse()
                        }
                    } else {
                        this.status = TaskStatus.stopped
                        toastManager.showToast(`Could not find loco by address: ${this.locoAddress}`)
                    }
                    break;

                case StepTypes.ifStopped:
                    const l5 = Api.getLoco(this.locoAddress)
                    if (l5) {
                        if (l5.speed == 0) {
                            this.index++
                        } else {
                            this.gotoNextEndOrElse()
                        }
                    } else {
                        this.status = TaskStatus.stopped
                        toastManager.showToast(`Could not find loco by address: ${this.locoAddress}`)
                    }
                    break;

                case StepTypes.ifForward:
                    const l6 = Api.getLoco(this.locoAddress)
                    if (l6) {
                        if (l6.direction == Z21Directions.forward) {
                            this.index++
                        } else {
                            this.gotoNextEndOrElse()
                        }
                    } else {
                        this.status = TaskStatus.stopped
                        toastManager.showToast(`Could not find loco by address: ${this.locoAddress}`)
                    }
                    break;

                case StepTypes.ifReverse:
                    const l7 = Api.getLoco(this.locoAddress)
                    if (l7) {
                        if (l7.direction == Z21Directions.reverse) {
                            this.index++
                        } else {
                            this.gotoNextEndOrElse()
                        }
                    } else {
                        this.status = TaskStatus.stopped
                        toastManager.showToast(`Could not find loco by address: ${this.locoAddress}`)
                    }
                    break;

                case StepTypes.waitForStart:
                    const l8 = Api.getLoco(this.locoAddress)
                    if (l8) {
                        if (l8.speed > 0) {
                            this.index++
                        }
                    } else {
                        this.status = TaskStatus.stopped
                        toastManager.showToast(`Could not find loco by address: ${this.locoAddress}`)
                    }
                    break;

                case StepTypes.waitForStop:
                    const l9 = Api.getLoco(this.locoAddress)
                    if (l9) {
                        if (l9.speed == 0) {
                            this.index++
                        }
                    } else {
                        this.status = TaskStatus.stopped
                        toastManager.showToast(`Could not find loco by address: ${this.locoAddress}`)
                    }
                    break;

                case StepTypes.ifSpeedGreaterThan:
                    const l10 = Api.getLoco(this.locoAddress)
                    if (l10) {
                        if (l10.speed > (this.step.data as iIfSpeedGreaterThan).speed) {
                            this.index++
                        }
                    } else {
                        this.status = TaskStatus.stopped
                        toastManager.showToast(`Could not find loco by address: ${this.locoAddress}`)
                    }
                    break;

                case StepTypes.ifSpeedLessThan:
                    const l11 = Api.getLoco(this.locoAddress)
                    if (l11) {
                        if (l11.speed > (this.step.data as iIfSpeedLessThan).speed) {
                            this.index++
                        }
                    } else {
                        this.status = TaskStatus.stopped
                        toastManager.showToast(`Could not find loco by address: ${this.locoAddress}`)
                    }
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
                    this.gotoEnd()
                    break;

                case StepTypes.endIf:
                    this.index++
                    break;

                case StepTypes.goto:
                    this.gotoLabel((this.step.data as iGoto).text)
                    break;

                case StepTypes.break:
                    if (this.skipBreak) {
                        this.index++
                    }
                    else if (this.status != TaskStatus.stopped) {
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

                case StepTypes.setBlockLocoAddress:
                    const b = this.step.data as iSetBlockLocoAddress
                    Api.setBlockLocoAddress(b.blockName, this.locoAddress)
                    this.index++
                    break;

                case StepTypes.ifBlockIsFree:
                    const l1 = Api.getLocoAddressFromBlock((this.step.data as iIfBlockIsFree).blockName)
                    if (l1 === 0) {
                        this.index++
                    } else {
                        this.gotoNextEndOrElse()
                    }
                    break;

                case StepTypes.ifBlockIsNotFree:
                    const l2 = Api.getLocoAddressFromBlock((this.step.data as iIfBlockIsFree).blockName)
                    if (l2 > 0) {
                        this.index++
                    } else {
                        this.gotoNextEndOrElse()
                    }
                    break;

                case StepTypes.setLocoAddressFromBlock:
                    const l3 = Api.getLocoAddressFromBlock((this.step.data as iSetLocoAddressFromBlock).blockName)
                    if (l3 > 0) {
                        this.locoAddress = l3
                        this.index++
                    } else {
                        this.status = TaskStatus.stopped
                        toastManager.showToast("Could not find loco! STOPPED", "error")
                    }
                    break;

            }
        }
    }

    logStep(step: iStep): string {
        switch (step.type) {
            case StepTypes.setLoco:
                return htmlSpaces(step.ident) + `${StepTypes.setLoco}: ${(step.data as iLocoStep).address}`
            case StepTypes.setTurnout:
                return htmlSpaces(step.ident) + `${StepTypes.setTurnout}: ${(step.data as iSetTurnoutStep).address} closed: ${(step.data as iSetTurnoutStep).closed}`
            case StepTypes.forward:
                return htmlSpaces(step.ident) + `${StepTypes.forward}: ${(step.data as iForwardStep).speed}`
            case StepTypes.reverse:
                return htmlSpaces(step.ident) + `${StepTypes.reverse}: ${(step.data as iForwardStep).speed}`
            case StepTypes.stopLoco:
                return htmlSpaces(step.ident) + `${StepTypes.stopLoco}`
            case StepTypes.delay:
                return htmlSpaces(step.ident) + `${StepTypes.delay}: ${(step.data as iDelayStep).ms}`
            case StepTypes.waitForSensor:
                return htmlSpaces(step.ident) + `${StepTypes.waitForSensor}: ${(step.data as iWaitForSensor).address} on: ${(step.data as iWaitForSensor).on}`
            case StepTypes.setFunction:
                return htmlSpaces(step.ident) + `${StepTypes.setFunction}: ${(step.data as iFunctionStep).fn} on: ${(step.data as iFunctionStep).on}`
                break;
            case StepTypes.restart:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.restart}</b>`)
            case StepTypes.playSound:
                return htmlSpaces(step.ident) + StepTypes.playSound + `: ${(step.data as iPlaySound).fname}`
            case StepTypes.setRoute:
                return htmlSpaces(step.ident) + StepTypes.setRoute + `: ${(step.data as iRouteStep).routeName}`
            case StepTypes.startAtMinutes:
                return htmlSpaces(step.ident) + StepTypes.startAtMinutes + `: ${(step.data as iStartAtMinutes).minutes}`
            case StepTypes.waitForMinutes:
                return htmlSpaces(step.ident) + StepTypes.waitForMinute + `: ${(step.data as iWaitForMinute).minute}`
            case StepTypes.label:
                return htmlSpaces(step.ident) + (`<b>${StepTypes.label}</b>: ${(step.data as iLabel).text}`)
            case StepTypes.ifClosed:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.ifClosed}</b>: ${(step.data as iIfClosed).address}`)
            case StepTypes.ifOpen:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.ifOpen}:</b> ${(step.data as iIfOpen).address}`)
            case StepTypes.else:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.else}:</b>`)
            case StepTypes.endIf:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.endIf}</b>`)
            case StepTypes.goto:
                return htmlSpaces(step.ident) + (`<b>${StepTypes.goto}:</b> ${(step.data as iGoto).text}`)
            case StepTypes.break:
                return htmlSpaces(step.ident) + (`<b>${StepTypes.break}</b> ${(step.data as iBreak).text}`)

            case StepTypes.setOutput:
                return htmlSpaces(step.ident) + (`${StepTypes.setOutput}: ${(step.data as iSetOutput).address} on: ${(step.data as iSetOutput).on}`)
            case StepTypes.ifOutputIsOn:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.ifOutputIsOn}:</b> ${(step.data as iIfOutputIsOn).address}`)
            case StepTypes.ifOutputIsOff:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.ifOutputIsOff}:</b> ${(step.data as iIfOutputIsOff).address}`)

            case StepTypes.setAccessory:
                return htmlSpaces(step.ident) + (`${StepTypes.setAccessory}: ${(step.data as iSetAccessory).address} on: ${(step.data as iSetAccessory).on}`)
            case StepTypes.ifAccessoryIsOn:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.ifAccessoryIsOn}:</b> ${(step.data as iIfAccessoryIsOn).address}`)
            case StepTypes.ifAccessoryIsOff:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.ifAccessoryIsOff}:</b> ${(step.data as iIfAccessoryIsOff).address}`)

            case StepTypes.setSignalGreen:
                return htmlSpaces(step.ident) + (`${StepTypes.setSignalGreen}: ${(step.data as iSetSignalGreen).address}`)
            case StepTypes.ifSignalIsGreen:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.ifSignalIsGreen}:</b> ${(step.data as iIfSignalIsGreen).address}`)

            case StepTypes.setSignalRed:
                return htmlSpaces(step.ident) + (`${StepTypes.setSignalRed}: ${(step.data as iSetSignalRed).address}`)
            case StepTypes.ifSignalIsRed:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.ifSignalIsRed}:</b> ${(step.data as iIfSignalIsRed).address}`)

            case StepTypes.setSignalYellow:
                return htmlSpaces(step.ident) + (`${StepTypes.setSignalYellow}: ${(step.data as iSetSignalYellow).address}`)
            case StepTypes.ifSignalIsYellow:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.ifSignalIsYellow}:</b> ${(step.data as iIfSignalIsYellow).address}`)

            case StepTypes.ifSensorIsOn:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.ifSensorIsOn}:</b> ${(step.data as iIfSensorIsOn).address}`)
            case StepTypes.ifSensorIsOff:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.ifSensorIsOff}:</b> ${(step.data as iIfSensorIsOff).address}`)

            case StepTypes.setBlockLocoAddress:
                return htmlSpaces(step.ident) + (`${StepTypes.setBlockLocoAddress}: ${(step.data as iSetBlockLocoAddress).blockName} loco: ${this.locoAddress}`)
            case StepTypes.setLocoAddressFromBlock:
                return htmlSpaces(step.ident) + (`${StepTypes.setLocoAddressFromBlock} ${(step.data as iSetBlock).blockName}`)
            case StepTypes.ifBlockIsFree:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.ifBlockIsFree}:</b> ${(step.data as iIfBlockIsFree).blockName}`)
            case StepTypes.ifBlockIsNotFree:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.ifBlockIsNotFree}:</b> ${(step.data as iIfBlockIsNotFree).blockName}`)

            case StepTypes.ifMoving:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.ifMoving}:</b>`)
            case StepTypes.ifStopped:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.ifStopped}:</b>`)
            case StepTypes.ifForward:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.ifForward}:</b>`)
            case StepTypes.ifReverse:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.ifReverse}:</b>`)

            case StepTypes.waitForStart:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.waitForStart}:</b>`)
            case StepTypes.waitForStop:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.waitForStop}:</b>`)
            case StepTypes.ifSpeedGreaterThan:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.ifSpeedGreaterThan}: ${(step.data as iIfSpeedGreaterThan).speed}</b>`)
            case StepTypes.waitForStop:
                return htmlSpaces(step.ident) + (`<b style="color: yellow">${StepTypes.ifSpeedLessThan}: ${(step.data as iIfSpeedLessThan).speed}</b>`)


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
        this.status = TaskStatus.running
        this.delayEnd = 0;
        if (this.step?.type == StepTypes.break) {
            this.index++
        }
        //this.proc()
        //this.index++


        if (this.prevSpeed > 0) {
            Api.setLocoSpeed(this.locoAddress, this.prevSpeed)
        }
    }


    private _finishOnComplete: boolean = false;
    public get finishOnComplete(): boolean {
        return this._finishOnComplete;
    }
    public set finishOnComplete(v: boolean) {
        this._finishOnComplete = v;
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


    private _ident: number = 0;
    public get ident(): number {
        return this._ident;
    }
    public set ident(v: number) {
        this._ident = Math.max(0, v);
    }


}