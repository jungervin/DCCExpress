define(["require", "exports", "../controls/toastManager", "../../../common/src/dcc", "./api", "./globals", "./utility"], function (require, exports, toastManager_1, dcc_1, api_1, globals_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Task = exports.Tasks = exports.TaskStatus = exports.StepTypes = exports.tasksCompleteEvent = void 0;
    exports.tasksCompleteEvent = new Event("tasksCompleteEvent");
    var StepTypes;
    (function (StepTypes) {
        StepTypes["setLoco"] = "setLoco";
        StepTypes["setTurnout"] = "setTurnout";
        StepTypes["forward"] = "forward";
        StepTypes["reverse"] = "reverse";
        StepTypes["stopLoco"] = "stopLoco";
        StepTypes["delay"] = "delay";
        StepTypes["waitForSensor"] = "waitForSensor";
        StepTypes["setFunction"] = "setFunction";
        StepTypes["restart"] = "restart";
        StepTypes["setRoute"] = "setRoute";
        StepTypes["waitForMinutes"] = "waitForMinutes";
        StepTypes["startAtMinutes"] = "startAtMinutes";
        StepTypes["playSound"] = "playSound";
        //playSoundRandom egy tömb elemeit játsza le de ez lehet a dispatcherbe kell
        StepTypes["label"] = "label";
        StepTypes["ifFree"] = "ifFree";
        StepTypes["goto"] = "goto";
        StepTypes["ifClosed"] = "ifClosed";
        StepTypes["ifOpen"] = "ifOpen";
        StepTypes["else"] = "else";
        StepTypes["endIf"] = "endIf";
        StepTypes["break"] = "break";
        StepTypes["setOutput"] = "setOutput";
        StepTypes["ifOutputIsOn"] = "ifOutputIsOn";
        StepTypes["ifOutputIsOff"] = "ifOutputIsOff";
        StepTypes["setAccessory"] = "setAccessory";
        StepTypes["ifAccessoryIsOn"] = "ifAccessoryIsOn";
        StepTypes["ifAccessoryIsOff"] = "ifAccessoryIsOff";
        StepTypes["setSignalGreen"] = "setSignalGreen";
        StepTypes["ifSignalIsGreen"] = "ifSignalIsGreen";
        StepTypes["setSignalRed"] = "setSignalRed";
        StepTypes["ifSignalIsRed"] = "ifSignalIsRed";
        StepTypes["setSignalYellow"] = "setSignalYellow";
        StepTypes["ifSignalIsYellow"] = "ifSignalIsYellow";
        StepTypes["setSignalWhite"] = "setSignalWhite";
        StepTypes["ifSignalIsWhite"] = "ifSignalIsWhite";
        StepTypes["ifSensorIsOn"] = "ifSensorIsOn";
        StepTypes["ifSensorIsOff"] = "ifSensorIsOff";
        StepTypes["setBlockLocoAddress"] = "setBlockLocoAddress";
        StepTypes["ifBlockIsFree"] = "ifBlockIsFree";
        StepTypes["ifBlockIsNotFree"] = "ifBlockIsNotFree";
        StepTypes["setLocoAddressFromBlock"] = "setLocoAddressFromBlock";
        StepTypes["waitForMinute"] = "waitForMinute";
        StepTypes["ifMoving"] = "ifMoving";
        StepTypes["ifStopped"] = "ifStopped";
        StepTypes["ifForward"] = "ifForward";
        StepTypes["ifReverse"] = "ifReverse";
        StepTypes["waitForStop"] = "waitForStop";
        StepTypes["waitForStart"] = "waitForStart";
        StepTypes["ifSpeedGreaterThan"] = "ifSpeedGreaterThan";
        StepTypes["ifSpeedLessThan"] = "ifSpeedLessThan";
    })(StepTypes || (exports.StepTypes = StepTypes = {}));
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
    var TaskStatus;
    (function (TaskStatus) {
        TaskStatus["running"] = "\uD83D\uDE82 RUNNING";
        TaskStatus["paused"] = "paused";
        TaskStatus["stopped"] = "\uD83D\uDED1 STOPPED";
        TaskStatus["completted"] = "completted";
    })(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
    class Tasks {
        //private worker: Worker;
        constructor() {
            this.tasks = [];
            //timer: NodeJS.Timeout;
            this.running = false;
            this.prevRuning = false;
        }
        exec() {
            var running = false;
            this.tasks.forEach(t => {
                t.proc();
                this.running || (this.running = t.status == TaskStatus.running);
            });
            if (!this.running != running) {
                this.running = running;
                window.dispatchEvent(exports.tasksCompleteEvent);
            }
        }
        addTask(name) {
            console.log(`addTask: ${name}`);
            const task = new Task(name);
            this.tasks.push(task);
            return task;
        }
        startTask(name) {
            console.log(`startTask: ${name}`);
            const task = this.getTask(name);
            if (task) {
                task.taskStart();
            }
        }
        stopTask(name) {
            console.log(`stopTask: ${name}`);
            const task = this.getTask(name);
            if (task) {
                task.taskStop();
            }
        }
        resumeTask(name) {
            console.log(`resumeTask: ${name}`);
            const task = this.getTask(name);
            if (task) {
                task.resumeTask();
            }
        }
        finishTask(name) {
            console.log(`abortTask: ${name}`);
            const task = this.getTask(name);
            if (task) {
                task.taskFinish();
            }
        }
        getTask(name) {
            console.log(`getTask: ${name}`);
            return this.tasks.find(t => t.name == name);
        }
        getTasks() {
            return this.tasks;
        }
        getTaskNames() {
            return this.tasks.map(t => t.name);
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
            console.log('startAutoStartTask()');
            this.tasks.forEach(t => {
                if (t.autoStart) {
                    t.taskStart();
                }
            });
        }
        startAllTask() {
            console.log('startAllTask()');
            this.tasks.forEach(t => {
                t.taskStart();
            });
        }
        stopAllTask() {
            console.log('stopAllTask()');
            this.tasks.forEach(t => {
                t.taskStop();
            });
        }
        resumeAllTask() {
            console.log('resumeAllTask()');
            this.tasks.forEach(t => {
                t.resumeTask();
            });
        }
        finishAllTask(finish) {
            console.log('finishAllTask()');
            this.tasks.forEach(t => {
                t.finishOnComplete = finish;
                //t.taskFinish()
            });
        }
        get allRuning() {
            if (this.tasks.length > 0) {
                var i = 0;
                this.tasks.forEach((t) => {
                    if (t.status == TaskStatus.running) {
                        i++;
                    }
                });
                return i / this.tasks.length;
            }
            else {
                return 0;
            }
        }
        get allFinish() {
            if (this.tasks.length > 0) {
                var i = 0;
                this.tasks.forEach((t) => {
                    if (t.finishOnComplete) {
                        i++;
                    }
                });
                return i / this.tasks.length;
            }
            else {
                return 0;
            }
        }
        save() {
            globals_1.Globals.saveJson("tasks.json", this.tasks);
        }
    }
    exports.Tasks = Tasks;
    Tasks.icon = '<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24"><title>Tasks</title><path d="M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z" /></svg>';
    class Task {
        constructor(name) {
            this.prevIndex = -1;
            this.steps = [];
            //delayTimer?: NodeJS.Timeout | undefined;
            // timer?: NodeJS.Timeout | undefined;
            this.locoAddress = 0;
            this.num = 0;
            this.delayEnd = 0;
            this.autoStart = false;
            this.stepByStep = false;
            this.skipBreak = false;
            //    stopOnComplete: boolean = true;
            this.prevSpeed = 0;
            this._finishOnComplete = false;
            this._status = TaskStatus.stopped;
            this._index = 0;
            this._ident = 0;
            this.name = name;
        }
        setLoco(address) {
            this.locoAddress = address;
            this.steps.push({ type: StepTypes.setLoco, data: { address: address }, ident: this.ident });
        }
        setTurnout(address, closed) {
            this.steps.push({ type: StepTypes.setTurnout, data: { address: address, closed: closed }, ident: this.ident });
        }
        setTurnoutMs(address, closed, wait) {
            this.setTurnout(address, closed);
            this.delay(wait);
        }
        forward(speed) {
            this.steps.push({ type: StepTypes.forward, data: { speed: speed }, ident: this.ident });
        }
        reverse(speed) {
            this.steps.push({ type: StepTypes.reverse, data: { speed: speed }, ident: this.ident });
        }
        stopLoco() {
            this.steps.push({ type: StepTypes.stopLoco, data: { speed: 0 }, ident: this.ident });
        }
        setFunction(fn, on) {
            this.steps.push({ type: StepTypes.setFunction, data: { fn: fn, on: on }, ident: this.ident });
        }
        setFunctionMs(fn, on, duration) {
            this.setFunction(fn, on);
            this.delay(duration);
            this.setFunction(fn, !on);
        }
        delay(ms) {
            this.steps.push({ type: StepTypes.delay, data: { ms: ms }, ident: this.ident });
        }
        waitMs(min, max) {
            const ms = Math.floor(Math.random() * (max - min + 1) + min);
            this.delay(ms);
        }
        waitSec(min, max) {
            const ms = Math.floor(Math.random() * (max - min + 1) + min) * 1000;
            this.delay(ms);
        }
        waitForSensor(address, on) {
            this.steps.push({ type: StepTypes.waitForSensor, data: { address: address, on: on }, ident: this.ident });
        }
        setRoute(routeName) {
            this.steps.push({ type: StepTypes.setRoute, data: { routeName: routeName }, ident: this.ident });
        }
        waitForMinutes(minute) {
            this.steps.push({ type: StepTypes.waitForMinutes, data: { minute: minute }, ident: this.ident });
        }
        startAtMinutes(minutes) {
            this.steps.push({ type: StepTypes.startAtMinutes, data: { minutes: minutes }, ident: this.ident });
        }
        playSound(fname) {
            this.steps.push({ type: StepTypes.playSound, data: { fname: fname }, ident: this.ident });
        }
        label(text) {
            this.steps.push({ type: StepTypes.label, data: { text: text }, ident: this.ident });
        }
        ifClosed(address) {
            this.steps.push({ type: StepTypes.ifClosed, data: { address }, ident: this.ident++ });
        }
        ifOpen(address) {
            this.steps.push({ type: StepTypes.ifOpen, data: { address }, ident: this.ident });
        }
        endIf() {
            this.steps.push({ type: StepTypes.endIf, data: {}, ident: this.ident - 1 });
            this.ident--;
        }
        else() {
            this.steps.push({ type: StepTypes.else, data: {}, ident: this.ident - 1 });
        }
        goto(label) {
            this.steps.push({ type: StepTypes.goto, data: { text: label }, ident: this.ident });
        }
        break(text = "") {
            this.steps.push({ type: StepTypes.break, data: { text: text }, ident: this.ident });
        }
        setOutput(address, on) {
            this.steps.push({ type: StepTypes.setOutput, data: { address: address, on: on }, ident: this.ident });
        }
        ifOutputIsOn(address) {
            this.steps.push({ type: StepTypes.ifOutputIsOn, data: { address: address }, ident: this.ident++ });
        }
        ifOutputIsOff(address) {
            this.steps.push({ type: StepTypes.ifOutputIsOff, data: { address: address }, ident: this.ident++ });
        }
        setAccessory(address, on) {
            this.steps.push({ type: StepTypes.setAccessory, data: { address: address, on: on }, ident: this.ident });
        }
        ifAccessoryIsOn(address) {
            this.steps.push({ type: StepTypes.ifAccessoryIsOn, data: { address: address }, ident: this.ident++ });
        }
        ifAccessoryIsOff(address) {
            this.steps.push({ type: StepTypes.ifAccessoryIsOff, data: { address: address }, ident: this.ident++ });
        }
        setSignalGreen(address) {
            this.steps.push({ type: StepTypes.setSignalGreen, data: { address: address }, ident: this.ident });
        }
        ifSignalIsGreen(address) {
            this.steps.push({ type: StepTypes.ifSignalIsGreen, data: { address: address }, ident: this.ident++ });
        }
        setSignalRed(address) {
            this.steps.push({ type: StepTypes.setSignalRed, data: { address: address }, ident: this.ident });
        }
        ifSignalIsRed(address) {
            this.steps.push({ type: StepTypes.ifSignalIsRed, data: { address: address }, ident: this.ident++ });
        }
        setSignalYellow(address) {
            this.steps.push({ type: StepTypes.setSignalYellow, data: { address: address }, ident: this.ident });
        }
        ifSignalIsYellow(address) {
            this.steps.push({ type: StepTypes.ifSignalIsYellow, data: { address: address }, ident: this.ident++ });
        }
        setSignalWhite(address) {
            this.steps.push({ type: StepTypes.setSignalWhite, data: { address: address }, ident: this.ident });
        }
        ifSignalIsWhite(address) {
            this.steps.push({ type: StepTypes.ifSignalIsWhite, data: { address: address }, ident: this.ident++ });
        }
        ifSensorIsOn(address) {
            this.steps.push({ type: StepTypes.ifSensorIsOn, data: { address: address }, ident: this.ident++ });
        }
        ifSensorIsOff(address) {
            this.steps.push({ type: StepTypes.ifSensorIsOff, data: { address: address }, ident: this.ident++ });
        }
        setBlockLocoAddress(blockName, locoAddress) {
            this.steps.push({ type: StepTypes.setBlockLocoAddress, data: { blockName, locoAddress }, ident: this.ident });
        }
        getLocoFromBlock(blockName) {
            this.steps.push({ type: StepTypes.setLocoAddressFromBlock, data: { blockName }, ident: this.ident });
        }
        ifBlockIsFree(blockName) {
            this.steps.push({ type: StepTypes.ifBlockIsFree, data: { blockName }, ident: this.ident++ });
        }
        ifBlockIsNotFree(blockName) {
            this.steps.push({ type: StepTypes.ifBlockIsNotFree, data: { blockName }, ident: this.ident++ });
        }
        ifMoving() {
            this.steps.push({ type: StepTypes.ifMoving, data: {}, ident: this.ident++ });
        }
        ifStopped() {
            this.steps.push({ type: StepTypes.ifStopped, data: {}, ident: this.ident++ });
        }
        ifForward() {
            this.steps.push({ type: StepTypes.ifForward, data: {}, ident: this.ident++ });
        }
        ifReverse() {
            this.steps.push({ type: StepTypes.ifReverse, data: {}, ident: this.ident++ });
        }
        waitForStop() {
            this.steps.push({ type: StepTypes.waitForStop, data: {}, ident: this.ident });
        }
        waitForStart() {
            this.steps.push({ type: StepTypes.waitForStart, data: {}, ident: this.ident });
        }
        ifSpeedGreaterThan(speed) {
            this.steps.push({ type: StepTypes.ifSpeedGreaterThan, data: {}, ident: this.ident++ });
        }
        ifSpeedLessThan(speed) {
            this.steps.push({ type: StepTypes.ifSpeedLessThan, data: {}, ident: this.ident++ });
        }
        gotoElse2() {
        }
        gotoEnd() {
            let depth = 0;
            while (++this.index < this.steps.length) {
                const step = this.steps[this.index];
                if (step.type.startsWith("if")) {
                    depth++;
                }
                else if (step.type == StepTypes.endIf) {
                    if (depth == 0) {
                        break;
                    }
                    depth--;
                }
            }
            if (depth > 0) {
                this.status = TaskStatus.stopped;
                toastManager_1.toastManager.showToast("Could not find any endIf()! STOPPED");
            }
        }
        gotoNextEndOrElse() {
            let depth = 0;
            while (++this.index < this.steps.length) {
                const step = this.steps[this.index];
                if (step.type.startsWith("if")) {
                    depth++;
                }
                else if (step.type == StepTypes.endIf) {
                    if (depth == 0) {
                        break;
                    }
                    depth--;
                }
                else if (step.type == StepTypes.else && depth == 0) {
                    this.break;
                }
            }
            if (depth > 0) {
                this.status = TaskStatus.stopped;
                toastManager_1.toastManager.showToast("Could not find any else! STOPPED");
            }
        }
        gotoLabel(label) {
            const i = this.steps.findIndex((step, i) => {
                return (step.type == StepTypes.label && label == step.data.text);
            });
            if (i >= 0) {
                this.index = i;
            }
            else {
                this.status = TaskStatus.stopped;
                toastManager_1.toastManager.showToast(`Could not find label named: ${label}! STOPPED`, "error");
            }
        }
        procStep() {
            if (this.step) {
                switch (this.step.type) {
                    case StepTypes.setLoco:
                        this.locoAddress = this.step.data.address;
                        //console.log(`TASK: ${this.name} loco: ${this.locoAddress} added!`)
                        this.index++;
                        break;
                    case StepTypes.ifMoving:
                        const l4 = api_1.Api.getLoco(this.locoAddress);
                        if (l4) {
                            if (l4.speed > 0) {
                                this.index++;
                            }
                            else {
                                this.gotoNextEndOrElse();
                            }
                        }
                        else {
                            this.status = TaskStatus.stopped;
                            toastManager_1.toastManager.showToast(`Could not find loco by address: ${this.locoAddress}`);
                        }
                        break;
                    case StepTypes.ifStopped:
                        const l5 = api_1.Api.getLoco(this.locoAddress);
                        if (l5) {
                            if (l5.speed == 0) {
                                this.index++;
                            }
                            else {
                                this.gotoNextEndOrElse();
                            }
                        }
                        else {
                            this.status = TaskStatus.stopped;
                            toastManager_1.toastManager.showToast(`Could not find loco by address: ${this.locoAddress}`);
                        }
                        break;
                    case StepTypes.ifForward:
                        const l6 = api_1.Api.getLoco(this.locoAddress);
                        if (l6) {
                            if (l6.direction == dcc_1.Z21Directions.forward) {
                                this.index++;
                            }
                            else {
                                this.gotoNextEndOrElse();
                            }
                        }
                        else {
                            this.status = TaskStatus.stopped;
                            toastManager_1.toastManager.showToast(`Could not find loco by address: ${this.locoAddress}`);
                        }
                        break;
                    case StepTypes.ifReverse:
                        const l7 = api_1.Api.getLoco(this.locoAddress);
                        if (l7) {
                            if (l7.direction == dcc_1.Z21Directions.reverse) {
                                this.index++;
                            }
                            else {
                                this.gotoNextEndOrElse();
                            }
                        }
                        else {
                            this.status = TaskStatus.stopped;
                            toastManager_1.toastManager.showToast(`Could not find loco by address: ${this.locoAddress}`);
                        }
                        break;
                    case StepTypes.waitForStart:
                        const l8 = api_1.Api.getLoco(this.locoAddress);
                        if (l8) {
                            if (l8.speed > 0) {
                                this.index++;
                            }
                        }
                        else {
                            this.status = TaskStatus.stopped;
                            toastManager_1.toastManager.showToast(`Could not find loco by address: ${this.locoAddress}`);
                        }
                        break;
                    case StepTypes.waitForStop:
                        const l9 = api_1.Api.getLoco(this.locoAddress);
                        if (l9) {
                            if (l9.speed == 0) {
                                this.index++;
                            }
                        }
                        else {
                            this.status = TaskStatus.stopped;
                            toastManager_1.toastManager.showToast(`Could not find loco by address: ${this.locoAddress}`);
                        }
                        break;
                    case StepTypes.ifSpeedGreaterThan:
                        const l10 = api_1.Api.getLoco(this.locoAddress);
                        if (l10) {
                            if (l10.speed > this.step.data.speed) {
                                this.index++;
                            }
                        }
                        else {
                            this.status = TaskStatus.stopped;
                            toastManager_1.toastManager.showToast(`Could not find loco by address: ${this.locoAddress}`);
                        }
                        break;
                    case StepTypes.ifSpeedLessThan:
                        const l11 = api_1.Api.getLoco(this.locoAddress);
                        if (l11) {
                            if (l11.speed > this.step.data.speed) {
                                this.index++;
                            }
                        }
                        else {
                            this.status = TaskStatus.stopped;
                            toastManager_1.toastManager.showToast(`Could not find loco by address: ${this.locoAddress}`);
                        }
                        break;
                    case StepTypes.setTurnout:
                        const turnout = this.step.data;
                        api_1.Api.setTurnout(turnout.address, turnout.closed);
                        this.index++;
                        break;
                    case StepTypes.forward:
                        const speed = this.step.data.speed;
                        this.prevSpeed = speed;
                        api_1.Api.setLoco(this.locoAddress, speed, dcc_1.Z21Directions.forward);
                        this.index++;
                        break;
                    case StepTypes.reverse:
                        const rspeed = this.step.data.speed;
                        this.prevSpeed = rspeed;
                        api_1.Api.setLoco(this.locoAddress, rspeed, dcc_1.Z21Directions.reverse);
                        this.index++;
                        break;
                    case StepTypes.stopLoco:
                        this.prevSpeed = 0;
                        api_1.Api.setLocoSpeed(this.locoAddress, 0);
                        this.index++;
                        break;
                    case StepTypes.delay:
                        const ms = this.step.data.ms;
                        if (this.delayEnd <= 0) {
                            this.delayEnd = performance.now() + ms;
                        }
                        else if (performance.now() > this.delayEnd) {
                            this.index++;
                            this.delayEnd = 0;
                        }
                        break;
                    case StepTypes.waitForSensor:
                        const sensor = this.step.data;
                        if (api_1.Api.getSensorValue(sensor.address) == sensor.on) {
                            this.index++;
                            console.log(`TASK: ${this.name} waitForSensor:${sensor.address} finished!`);
                        }
                        break;
                    case StepTypes.setFunction:
                        const f = this.step.data;
                        api_1.Api.setLocoFunction(this.locoAddress, f.fn, f.on);
                        this.index++;
                        break;
                    case StepTypes.setRoute:
                        const route = this.step.data;
                        api_1.Api.setRoute(route.routeName);
                        this.index++;
                        break;
                    case StepTypes.restart:
                        if (!this.finishOnComplete) {
                            this.index = 0;
                            this.prevIndex = -1;
                        }
                        else {
                            this.status = TaskStatus.stopped;
                        }
                        break;
                    case StepTypes.waitForMinutes:
                        const minute = this.step.data.minute;
                        const clock = api_1.Api.getClock();
                        if (clock && clock.currentTime.getMinutes() % minute == 0) {
                            this.index++;
                            console.log(`TASK: ${this.name} waitForMinute:${minute} finished!`);
                        }
                        break;
                    case StepTypes.startAtMinutes:
                        const minutes = this.step.data.minutes;
                        const clocka = api_1.Api.getClock();
                        if (clocka) {
                            const min = clocka.currentTime.getMinutes();
                            if (minutes.includes(min)) {
                                this.index++;
                                console.log(`TASK: ${this.name} startAtMinutes:${min} finished!`);
                            }
                        }
                        break;
                    case StepTypes.playSound:
                        const fname = this.step.data.fname;
                        api_1.Api.playSound(fname);
                        this.index++;
                        break;
                    case StepTypes.label:
                        this.index++;
                        break;
                    case StepTypes.ifClosed:
                        var t = api_1.Api.getTurnoutState(this.step.data.address);
                        if (t) {
                            this.index++;
                        }
                        else {
                            this.gotoNextEndOrElse();
                        }
                        break;
                    case StepTypes.ifOpen:
                        var t = api_1.Api.getTurnoutState(this.step.data.address);
                        if (!t) {
                            this.index++;
                        }
                        else {
                            this.gotoNextEndOrElse();
                        }
                        break;
                    case StepTypes.else:
                        this.gotoEnd();
                        break;
                    case StepTypes.endIf:
                        this.index++;
                        break;
                    case StepTypes.goto:
                        this.gotoLabel(this.step.data.text);
                        break;
                    case StepTypes.break:
                        if (this.skipBreak) {
                            this.index++;
                        }
                        else if (this.status != TaskStatus.stopped) {
                            this.status = TaskStatus.stopped;
                            //toastManager.showToast("Break", "warning")
                        }
                        break;
                    case StepTypes.setOutput:
                        const o = this.step.data;
                        api_1.Api.setOutput(o.address, o.on);
                        this.index++;
                        break;
                    case StepTypes.ifOutputIsOn:
                        const oon = this.step.data;
                        if (api_1.Api.getOutput(oon.address)) {
                            this.index++;
                        }
                        else {
                            this.gotoNextEndOrElse();
                        }
                        break;
                    case StepTypes.ifOutputIsOff:
                        const ooff = this.step.data;
                        if (!api_1.Api.getOutput(ooff.address)) {
                            this.index++;
                        }
                        else {
                            this.gotoNextEndOrElse();
                        }
                        break;
                    case StepTypes.setAccessory:
                        const a = this.step.data;
                        api_1.Api.setAccessory(a.address, a.on);
                        this.index++;
                        break;
                    case StepTypes.ifAccessoryIsOn:
                        const aon = this.step.data;
                        if (api_1.Api.getAccessory(aon.address)) {
                            this.index++;
                        }
                        else {
                            this.gotoNextEndOrElse();
                        }
                        break;
                    case StepTypes.ifAccessoryIsOff:
                        const aoff = this.step.data;
                        if (!api_1.Api.getAccessory(aoff.address)) {
                            this.index++;
                        }
                        else {
                            this.gotoNextEndOrElse();
                        }
                        break;
                    case StepTypes.setSignalGreen:
                        api_1.Api.setSignalGreen(this.step.data.address);
                        this.index++;
                        break;
                    case StepTypes.ifSignalIsGreen:
                        if (api_1.Api.getSignalIsGreen(this.step.data.address)) {
                            this.index++;
                        }
                        else {
                            this.gotoNextEndOrElse();
                        }
                        break;
                    case StepTypes.setSignalRed:
                        api_1.Api.setSignalRed(this.step.data.address);
                        this.index++;
                        break;
                    case StepTypes.ifSignalIsRed:
                        if (api_1.Api.getSignalIsRed(this.step.data.address)) {
                            this.index++;
                        }
                        else {
                            this.gotoNextEndOrElse();
                        }
                        break;
                    case StepTypes.setSignalYellow:
                        api_1.Api.setSignalYellow(this.step.data.address);
                        this.index++;
                        break;
                    case StepTypes.ifSignalIsYellow:
                        if (api_1.Api.getSignalIsYellow(this.step.data.address)) {
                            this.index++;
                        }
                        else {
                            this.gotoNextEndOrElse();
                        }
                        break;
                    case StepTypes.setSignalWhite:
                        api_1.Api.setSignalWhite(this.step.data.address);
                        this.index++;
                        break;
                    case StepTypes.ifSignalIsWhite:
                        if (api_1.Api.getSignalIsWhite(this.step.data.address)) {
                            this.index++;
                        }
                        else {
                            this.gotoNextEndOrElse();
                        }
                        break;
                    case StepTypes.ifSensorIsOn:
                        if (api_1.Api.getSensorValue(this.step.data.address)) {
                            this.index++;
                        }
                        else {
                            this.gotoNextEndOrElse();
                        }
                        break;
                    case StepTypes.ifSensorIsOff:
                        if (!api_1.Api.getSensorValue(this.step.data.address)) {
                            this.index++;
                        }
                        else {
                            this.gotoNextEndOrElse();
                        }
                        break;
                    case StepTypes.setBlockLocoAddress:
                        const b = this.step.data;
                        api_1.Api.setBlockLocoAddress(b.blockName, this.locoAddress);
                        this.index++;
                        break;
                    case StepTypes.ifBlockIsFree:
                        const l1 = api_1.Api.getLocoAddressFromBlock(this.step.data.blockName);
                        if (l1 === 0) {
                            this.index++;
                        }
                        else {
                            this.gotoNextEndOrElse();
                        }
                        break;
                    case StepTypes.ifBlockIsNotFree:
                        const l2 = api_1.Api.getLocoAddressFromBlock(this.step.data.blockName);
                        if (l2 > 0) {
                            this.index++;
                        }
                        else {
                            this.gotoNextEndOrElse();
                        }
                        break;
                    case StepTypes.setLocoAddressFromBlock:
                        const l3 = api_1.Api.getLocoAddressFromBlock(this.step.data.blockName);
                        if (l3 > 0) {
                            this.locoAddress = l3;
                            this.index++;
                        }
                        else {
                            this.status = TaskStatus.stopped;
                            toastManager_1.toastManager.showToast("Could not find loco! STOPPED", "error");
                        }
                        break;
                }
            }
        }
        logStep(step) {
            switch (step.type) {
                case StepTypes.setLoco:
                    return (0, utility_1.htmlSpaces)(step.ident) + `${StepTypes.setLoco}: ${step.data.address}`;
                case StepTypes.setTurnout:
                    return (0, utility_1.htmlSpaces)(step.ident) + `${StepTypes.setTurnout}: ${step.data.address} closed: ${step.data.closed}`;
                case StepTypes.forward:
                    return (0, utility_1.htmlSpaces)(step.ident) + `${StepTypes.forward}: ${step.data.speed}`;
                case StepTypes.reverse:
                    return (0, utility_1.htmlSpaces)(step.ident) + `${StepTypes.reverse}: ${step.data.speed}`;
                case StepTypes.stopLoco:
                    return (0, utility_1.htmlSpaces)(step.ident) + `${StepTypes.stopLoco}`;
                case StepTypes.delay:
                    return (0, utility_1.htmlSpaces)(step.ident) + `${StepTypes.delay}: ${step.data.ms}`;
                case StepTypes.waitForSensor:
                    return (0, utility_1.htmlSpaces)(step.ident) + `${StepTypes.waitForSensor}: ${step.data.address} on: ${step.data.on}`;
                case StepTypes.setFunction:
                    return (0, utility_1.htmlSpaces)(step.ident) + `${StepTypes.setFunction}: ${step.data.fn} on: ${step.data.on}`;
                    break;
                case StepTypes.restart:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.restart}</b>`);
                case StepTypes.playSound:
                    return (0, utility_1.htmlSpaces)(step.ident) + StepTypes.playSound + `: ${step.data.fname}`;
                case StepTypes.setRoute:
                    return (0, utility_1.htmlSpaces)(step.ident) + StepTypes.setRoute + `: ${step.data.routeName}`;
                case StepTypes.startAtMinutes:
                    return (0, utility_1.htmlSpaces)(step.ident) + StepTypes.startAtMinutes + `: ${step.data.minutes}`;
                case StepTypes.waitForMinutes:
                    return (0, utility_1.htmlSpaces)(step.ident) + StepTypes.waitForMinute + `: ${step.data.minute}`;
                case StepTypes.label:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b>${StepTypes.label}</b>: ${step.data.text}`);
                case StepTypes.ifClosed:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.ifClosed}</b>: ${step.data.address}`);
                case StepTypes.ifOpen:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.ifOpen}:</b> ${step.data.address}`);
                case StepTypes.else:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.else}:</b>`);
                case StepTypes.endIf:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.endIf}</b>`);
                case StepTypes.goto:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b>${StepTypes.goto}:</b> ${step.data.text}`);
                case StepTypes.break:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b>${StepTypes.break}</b> ${step.data.text}`);
                case StepTypes.setOutput:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`${StepTypes.setOutput}: ${step.data.address} on: ${step.data.on}`);
                case StepTypes.ifOutputIsOn:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.ifOutputIsOn}:</b> ${step.data.address}`);
                case StepTypes.ifOutputIsOff:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.ifOutputIsOff}:</b> ${step.data.address}`);
                case StepTypes.setAccessory:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`${StepTypes.setAccessory}: ${step.data.address} on: ${step.data.on}`);
                case StepTypes.ifAccessoryIsOn:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.ifAccessoryIsOn}:</b> ${step.data.address}`);
                case StepTypes.ifAccessoryIsOff:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.ifAccessoryIsOff}:</b> ${step.data.address}`);
                case StepTypes.setSignalGreen:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`${StepTypes.setSignalGreen}: ${step.data.address}`);
                case StepTypes.ifSignalIsGreen:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.ifSignalIsGreen}:</b> ${step.data.address}`);
                case StepTypes.setSignalRed:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`${StepTypes.setSignalRed}: ${step.data.address}`);
                case StepTypes.ifSignalIsRed:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.ifSignalIsRed}:</b> ${step.data.address}`);
                case StepTypes.setSignalYellow:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`${StepTypes.setSignalYellow}: ${step.data.address}`);
                case StepTypes.ifSignalIsYellow:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.ifSignalIsYellow}:</b> ${step.data.address}`);
                case StepTypes.ifSensorIsOn:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.ifSensorIsOn}:</b> ${step.data.address}`);
                case StepTypes.ifSensorIsOff:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.ifSensorIsOff}:</b> ${step.data.address}`);
                case StepTypes.setBlockLocoAddress:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`${StepTypes.setBlockLocoAddress}: ${step.data.blockName} loco: ${this.locoAddress}`);
                case StepTypes.setLocoAddressFromBlock:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`${StepTypes.setLocoAddressFromBlock} ${step.data.blockName}`);
                case StepTypes.ifBlockIsFree:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.ifBlockIsFree}:</b> ${step.data.blockName}`);
                case StepTypes.ifBlockIsNotFree:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.ifBlockIsNotFree}:</b> ${step.data.blockName}`);
                case StepTypes.ifMoving:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.ifMoving}:</b>`);
                case StepTypes.ifStopped:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.ifStopped}:</b>`);
                case StepTypes.ifForward:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.ifForward}:</b>`);
                case StepTypes.ifReverse:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.ifReverse}:</b>`);
                case StepTypes.waitForStart:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.waitForStart}:</b>`);
                case StepTypes.waitForStop:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.waitForStop}:</b>`);
                case StepTypes.ifSpeedGreaterThan:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.ifSpeedGreaterThan}: ${step.data.speed}</b>`);
                case StepTypes.waitForStop:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">${StepTypes.ifSpeedLessThan}: ${step.data.speed}</b>`);
            }
            return "Unknown";
        }
        proc() {
            if (this.status == TaskStatus.running) {
                if (this.index < this.steps.length) {
                    if (this.index != this.prevIndex) {
                        // if(this.stepByStep) {
                        //     this.status = TaskStatus.stopped
                        // }
                        this.prevIndex = this.index;
                        this.step = this.steps[this.index];
                        //this.logStep(this.step!)
                        //console.log(`TASK: ${this.name} index: ${this.index} step: ${this.step!.type}`)
                    }
                    if (this.status == TaskStatus.running) {
                        this.procStep();
                    }
                }
                else {
                    console.log(`TASK: ${this.name} finished! Exit!`);
                    //this.status = TaskStatus.completted
                    this.status = TaskStatus.stopped;
                }
            }
        }
        restart() {
            this.steps.push({ type: StepTypes.restart, data: {} });
        }
        taskStart() {
            console.log(`TASK: ${this.name} started!`);
            this.index = 0;
            this.prevIndex = -1;
            this.prevSpeed = 0;
            this.delayEnd = 0;
            this.status = TaskStatus.running;
            //this.stopOnComplete = false;
            toastManager_1.toastManager.showToast(Tasks.icon + ` TASK: ${this.name} started!`, "success");
        }
        taskFinish() {
            this.finishOnComplete = !this.finishOnComplete;
        }
        taskStop() {
            if (this.status != TaskStatus.stopped) {
                toastManager_1.toastManager.showToast(Tasks.icon + ` TASK: ${this.name} stopped!`, "info");
            }
            this.status = TaskStatus.stopped;
            this.delayEnd = 0;
            api_1.Api.setLocoSpeed(this.locoAddress, 0);
        }
        resumeTask() {
            var _a;
            this.status = TaskStatus.running;
            this.delayEnd = 0;
            if (((_a = this.step) === null || _a === void 0 ? void 0 : _a.type) == StepTypes.break) {
                this.index++;
            }
            //this.proc()
            //this.index++
            if (this.prevSpeed > 0) {
                api_1.Api.setLocoSpeed(this.locoAddress, this.prevSpeed);
            }
        }
        get finishOnComplete() {
            return this._finishOnComplete;
        }
        set finishOnComplete(v) {
            this._finishOnComplete = v;
            window.dispatchEvent(new CustomEvent("taskChangedEvent", {
                detail: this,
                bubbles: true,
                composed: true,
            }));
        }
        get status() {
            return this._status;
        }
        set status(v) {
            this._status = v;
            window.dispatchEvent(new CustomEvent("taskChangedEvent", {
                detail: this,
                bubbles: true,
                composed: true,
            }));
        }
        get index() {
            return this._index;
        }
        set index(v) {
            this._index = v;
            if (v >= this.steps.length) {
                this._index = this.steps.length - 1;
            }
            this.delayEnd = 0;
            window.dispatchEvent(new CustomEvent("taskChangedEvent", {
                detail: this,
                bubbles: true,
                composed: true,
            }));
        }
        get ident() {
            return this._ident;
        }
        set ident(v) {
            this._ident = Math.max(0, v);
        }
    }
    exports.Task = Task;
});
