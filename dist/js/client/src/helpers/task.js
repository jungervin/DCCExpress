define(["require", "exports", "../controls/toastManager", "../../../common/src/dcc", "./api", "./globals"], function (require, exports, toastManager_1, dcc_1, api_1, globals_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Task = exports.Tasks = exports.TaskStatus = exports.tasksCompleteEvent = void 0;
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
    })(StepTypes || (StepTypes = {}));
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
            //    stopOnComplete: boolean = true;
            this.prevSpeed = 0;
            this._stopOnComplete = false;
            this._status = TaskStatus.stopped;
            this._index = 0;
            this.name = name;
        }
        setLoco(address) {
            this.locoAddress = address;
            this.steps.push({ type: StepTypes.setLoco, data: { address: address } });
        }
        setTurnout(address, closed) {
            this.steps.push({ type: StepTypes.setTurnout, data: { address: address, closed: closed } });
        }
        setTurnoutMs(address, closed, wait) {
            this.setTurnout(address, closed);
            this.delay(wait);
        }
        forward(speed) {
            this.steps.push({ type: StepTypes.forward, data: { speed: speed } });
        }
        reverse(speed) {
            this.steps.push({ type: StepTypes.reverse, data: { speed: speed } });
        }
        stopLoco() {
            this.steps.push({ type: StepTypes.stopLoco, data: { speed: 0 } });
        }
        setFunction(fn, on) {
            this.steps.push({ type: StepTypes.setFunction, data: { fn: fn, on: on } });
        }
        setFunctionMs(fn, on, duration) {
            this.setFunction(fn, on);
            this.delay(duration);
            this.setFunction(fn, !on);
        }
        delay(ms) {
            this.steps.push({ type: StepTypes.delay, data: { ms: ms } });
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
            this.steps.push({ type: StepTypes.waitForSensor, data: { address: address, on: on } });
        }
        setRoute(routeName) {
            this.steps.push({ type: StepTypes.setRoute, data: { routeName: routeName } });
        }
        waitForMinutes(minute) {
            this.steps.push({ type: StepTypes.waitForMinutes, data: { minute: minute } });
        }
        startAtMinutes(minutes) {
            this.steps.push({ type: StepTypes.startAtMinutes, data: { minutes: minutes } });
        }
        playSound(fname) {
            this.steps.push({ type: StepTypes.playSound, data: { fname: fname } });
        }
        label(text) {
            this.steps.push({ type: StepTypes.label, data: { text: text } });
        }
        ifClosed(address) {
            this.steps.push({ type: StepTypes.ifClosed, data: { address } });
        }
        ifOpen(address) {
            this.steps.push({ type: StepTypes.ifOpen, data: { address } });
        }
        endIf() {
            this.steps.push({ type: StepTypes.endIf, data: {} });
        }
        else() {
            this.steps.push({ type: StepTypes.else, data: {} });
        }
        goto(label) {
            this.steps.push({ type: StepTypes.goto, data: { text: label } });
        }
        break(text = "") {
            this.steps.push({ type: StepTypes.break, data: { text: text } });
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
                return (i > this.index && (step.type == StepTypes.endIf || step.type == StepTypes.else));
            });
            if (i >= 0) {
                this.index = i;
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
                        if (api_1.Api.getSensor(sensor.address) == sensor.on) {
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
                            toastManager_1.toastManager.showToast("Break", "warning");
                        }
                        break;
                }
            }
        }
        logStep(step) {
            switch (step.type) {
                case StepTypes.setLoco:
                    return (`setLoco: ${step.data.address}`);
                case StepTypes.setTurnout:
                    return (`setTurnout: ${step.data.address} closed: ${step.data.closed}`);
                case StepTypes.forward:
                    return (`forward: ${step.data.speed}`);
                case StepTypes.reverse:
                    return (`reverse: ${step.data.speed}`);
                case StepTypes.stopLoco:
                    return (`stopLoco`);
                case StepTypes.delay:
                    return (`delay: ${step.data.ms}`);
                case StepTypes.waitForSensor:
                    return (`waitForSensor: ${step.data.address}`);
                case StepTypes.setFunction:
                    return (`setFunction: ${step.data.fn} on: ${step.data.on}`);
                    break;
                case StepTypes.restart:
                    return (`<b style="color: yellow">restart</b>`);
                case StepTypes.playSound:
                    return (`playSound: ${step.data.fname}`);
                case StepTypes.setRoute:
                    return (`setRoute: ${step.data.routeName}`);
                case StepTypes.startAtMinutes:
                    return (`startAtMinutes: ${step.data.minutes}`);
                case StepTypes.waitForMinutes:
                    return (`waitForMinute: ${step.data.minute}`);
                case StepTypes.label:
                    return (`label: ${step.data.text}`);
                case StepTypes.ifClosed:
                    return (`<b>ifClosed</b>: ${step.data.address}`);
                case StepTypes.ifOpen:
                    return (`<b>ifOpen:</b> ${step.data.address}`);
                case StepTypes.else:
                    return (`<b>else</b>`);
                case StepTypes.endIf:
                    return (`<b>endIf</b>`);
                case StepTypes.goto:
                    return (`<b>goto:</b> ${step.data.text}`);
                case StepTypes.break:
                    return (`<b style="color: yellow">break:</b> ${step.data.text}`);
            }
            return "Unknown";
        }
        proc() {
            if (this.status == TaskStatus.running) {
                if (this.index < this.steps.length) {
                    if (this.index != this.prevIndex) {
                        this.prevIndex = this.index;
                        this.step = this.steps[this.index];
                        this.logStep(this.step);
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
            if (((_a = this.step) === null || _a === void 0 ? void 0 : _a.type) == StepTypes.break && this.index < this.steps.length - 1) {
                this.index++;
            }
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
