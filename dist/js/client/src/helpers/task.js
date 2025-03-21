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
        StepTypes["stopLoco"] = "stop";
        StepTypes["delay"] = "delay";
        StepTypes["waitForSensor"] = "waitForSensor";
        StepTypes["setFunction"] = "setFunction";
        StepTypes["restart"] = "restart";
        StepTypes["setRoute"] = "setRoute";
        StepTypes["waitForMinutes"] = "waitForMinutes";
        StepTypes["startAtMinutes"] = "startAtMinutes";
        StepTypes["playSound"] = "playSound";
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
    })(StepTypes || (exports.StepTypes = StepTypes = {}));
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
            // this.timer = setInterval(() => {
            //     var running = false;
            //     this.tasks.forEach(t => {
            //         t.proc()
            //         this.running ||= t.status == TaskStatus.running
            //     })
            this.tasks = [];
            //timer: NodeJS.Timeout;
            this.running = false;
            this.prevRuning = false;
            //     if (!this.running != running) {
            //         this.running = running
            //         window.dispatchEvent(tasksCompleteEvent)
            //     }
            // }, 50)
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
        stopAllTask() {
            console.log('stopAllTask()');
            this.tasks.forEach(t => {
                t.taskStop();
            });
        }
        stopOnCompletion() {
            console.log('stopAllTask()');
            this.tasks.forEach(t => {
                t.finishOnComplete = true;
            });
        }
        startAllTask() {
            console.log('startAllTask()');
            this.tasks.forEach(t => {
                if (t.autoStart) {
                    t.taskStart();
                }
                else {
                    t.status = TaskStatus.stopped;
                }
            });
        }
        restartAllTask() {
            console.log('restartAllTask()');
            this.tasks.forEach(t => {
                t.restart();
            });
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
            this.ident = 0;
            //    stopOnComplete: boolean = true;
            this.prevSpeed = 0;
            this._stopOnComplete = false;
            this._status = TaskStatus.stopped;
            this._index = 0;
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
        gotoNextElse() {
            const i = this.steps.findIndex((step, i) => {
                return (i > this.index && step.type == StepTypes.else);
            });
            if (i >= 0) {
                this.index = i;
            }
            else {
                this.status = TaskStatus.stopped;
                toastManager_1.toastManager.showToast("Could not find any endIf! STOPPED");
            }
        }
        gotoNextEndOrElse() {
            const i = this.steps.findIndex((step, i) => {
                return (i >= this.index && (step.type == StepTypes.endIf || step.type == StepTypes.else));
            });
            if (i >= 0) {
                const step = this.steps[i];
                this.index = i;
                if (step.type == StepTypes.else) {
                    this.index++;
                }
            }
            else {
                this.status = TaskStatus.stopped;
                toastManager_1.toastManager.showToast("Could not find any else or endIf! STOPPED", "error");
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
                        this.gotoNextEndOrElse();
                        break;
                    case StepTypes.endIf:
                        this.index++;
                        break;
                    case StepTypes.goto:
                        this.gotoLabel(this.step.data.text);
                        break;
                    case StepTypes.break:
                        if (this.status != TaskStatus.stopped) {
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
                }
            }
        }
        logStep(step) {
            switch (step.type) {
                case StepTypes.setLoco:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`setLoco: ${step.data.address}`);
                case StepTypes.setTurnout:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`setTurnout: ${step.data.address} closed: ${step.data.closed}`);
                case StepTypes.forward:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`forward: ${step.data.speed}`);
                case StepTypes.reverse:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`reverse: ${step.data.speed}`);
                case StepTypes.stopLoco:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`stopLoco`);
                case StepTypes.delay:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`delay: ${step.data.ms}`);
                case StepTypes.waitForSensor:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`waitForSensor: ${step.data.address} on: ${step.data.on}`);
                case StepTypes.setFunction:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`setFunction: ${step.data.fn} on: ${step.data.on}`);
                    break;
                case StepTypes.restart:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">restart</b>`);
                case StepTypes.playSound:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`playSound: ${step.data.fname}`);
                case StepTypes.setRoute:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`setRoute: ${step.data.routeName}`);
                case StepTypes.startAtMinutes:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`startAtMinutes: ${step.data.minutes}`);
                case StepTypes.waitForMinutes:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`waitForMinute: ${step.data.minute}`);
                case StepTypes.label:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b>label</b>: ${step.data.text}`);
                case StepTypes.ifClosed:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">ifClosed</b>: ${step.data.address}`);
                case StepTypes.ifOpen:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">ifOpen:</b> ${step.data.address}`);
                case StepTypes.else:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">else:</b>`);
                case StepTypes.endIf:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">endIf</b>`);
                case StepTypes.goto:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b>goto:</b> ${step.data.text}`);
                case StepTypes.break:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b>break:</b> ${step.data.text}`);
                case StepTypes.setOutput:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`setOutput: ${step.data.address} on: ${step.data.on}`);
                case StepTypes.ifOutputIsOn:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">ifOutputIsOn:</b> ${step.data.address}`);
                case StepTypes.ifOutputIsOff:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">ifOutputIsOff:</b> ${step.data.address}`);
                case StepTypes.setAccessory:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`setAccessory: ${step.data.address} on: ${step.data.on}`);
                case StepTypes.ifAccessoryIsOn:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">ifAccessoryIsOn:</b> ${step.data.address}`);
                case StepTypes.ifAccessoryIsOff:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">ifAccessoryIsOff:</b> ${step.data.address}`);
                case StepTypes.setSignalGreen:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`setSignalGreen: ${step.data.address}`);
                case StepTypes.ifSignalIsGreen:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">ifSignalIsGreen:</b> ${step.data.address}`);
                case StepTypes.setSignalRed:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`setSignalRed: ${step.data.address}`);
                case StepTypes.ifSignalIsRed:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">ifSignalIsRed:</b> ${step.data.address}`);
                case StepTypes.setSignalYellow:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`setSignalYellow: ${step.data.address}`);
                case StepTypes.ifSignalIsYellow:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">ifSignalIsYellow:</b> ${step.data.address}`);
                case StepTypes.ifSensorIsOn:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">ifSensorIsOn:</b> ${step.data.address}`);
                case StepTypes.ifSensorIsOff:
                    return (0, utility_1.htmlSpaces)(step.ident) + (`<b style="color: yellow">ifSensorIsOff:</b> ${step.data.address}`);
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
            // if (this.step?.type == StepTypes.break && this.index < this.steps.length - 1) {
            //     this.index++
            // }
            this.index++;
            this.status = TaskStatus.running;
            this.delayEnd = 0;
            if (this.prevSpeed > 0) {
                api_1.Api.setLocoSpeed(this.locoAddress, this.prevSpeed);
            }
        }
        get finishOnComplete() {
            return this._stopOnComplete;
        }
        set finishOnComplete(v) {
            this._stopOnComplete = v;
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
    }
    exports.Task = Task;
});
