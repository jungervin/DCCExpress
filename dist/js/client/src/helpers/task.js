define(["require", "exports", "../controls/toastManager", "../../../common/src/dcc", "./api", "./globals"], function (require, exports, toastManager_1, dcc_1, api_1, globals_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Task = exports.Tasks = exports.TaskStatus = exports.tasksCompleteEvent = void 0;
    exports.tasksCompleteEvent = new Event("tasksCompleteEvent");
    var StepTypes;
    (function (StepTypes) {
        StepTypes["setLoco"] = "setLoco";
        StepTypes["setTurnout"] = "setTurnout";
        StepTypes["forward"] = "foward";
        StepTypes["reverse"] = "reverse";
        StepTypes["stopLoco"] = "stop";
        StepTypes["delay"] = "delay";
        StepTypes["waitForSensor"] = "waitForSensor";
        StepTypes["setFunction"] = "setFunction";
        StepTypes["restart"] = "restart";
        StepTypes["setRoute"] = "setRoute";
        StepTypes["waitForMinutes"] = "waitForMinutes";
        StepTypes["startAtMinutes"] = "startAtMinutes";
    })(StepTypes || (StepTypes = {}));
    var TaskStatus;
    (function (TaskStatus) {
        TaskStatus[TaskStatus["running"] = 0] = "running";
        TaskStatus[TaskStatus["paused"] = 1] = "paused";
        TaskStatus[TaskStatus["stopped"] = 2] = "stopped";
        TaskStatus[TaskStatus["finished"] = 3] = "finished";
    })(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
    class Tasks {
        //private worker: Worker;
        constructor() {
            this.tasks = [];
            this.running = false;
            this.prevRuning = false;
            this.timer = setInterval(() => {
                var running = false;
                this.tasks.forEach(t => {
                    t.proc();
                    this.running || (this.running = t.status == TaskStatus.running);
                });
                if (!this.running != running) {
                    this.running = running;
                    window.dispatchEvent(exports.tasksCompleteEvent);
                }
            }, 50);
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
                t.stopOnComplete = true;
            });
        }
        startAllTask() {
            console.log('startAllTask()');
            this.tasks.forEach(t => {
                t.taskStart();
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
            this.index = 0;
            this.prevIndex = -1;
            this.steps = [];
            //delayTimer?: NodeJS.Timeout | undefined;
            // timer?: NodeJS.Timeout | undefined;
            this.locoAddress = 0;
            this.num = 0;
            this.delayEnd = 0;
            this.status = TaskStatus.stopped;
            this.stopOnComplete = true;
            this.name = name;
        }
        setLoco(address) {
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
        setFunctionMs(fn, on, wait) {
            this.setFunction(fn, on);
            this.delay(wait);
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
        setRoute(route) {
            this.steps.push({ type: StepTypes.setRoute, data: { routeName: route } });
        }
        waitForMinutes(minute) {
            this.steps.push({ type: StepTypes.waitForMinutes, data: { minute: minute } });
        }
        startAtMinutes(minutes) {
            this.steps.push({ type: StepTypes.startAtMinutes, data: { minutes: minutes } });
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
                        //console.log(`TASK: ${this.name} foward: ${speed} started!`)
                        api_1.Api.setLoco(this.locoAddress, speed, dcc_1.Z21Directions.forward);
                        this.index++;
                        break;
                    case StepTypes.reverse:
                        const rspeed = this.step.data.speed;
                        //console.log(`TASK: ${this.name} reverse: ${rspeed} started!`)
                        api_1.Api.setLoco(this.locoAddress, rspeed, dcc_1.Z21Directions.reverse);
                        this.index++;
                        break;
                    case StepTypes.stopLoco:
                        //console.log(`TASK: ${this.name} stop started!`)
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
                        if (!this.stopOnComplete) {
                            this.index = 0;
                            this.prevIndex = -1;
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
                }
            }
        }
        logStep(step) {
            switch (step.type) {
                case StepTypes.setLoco:
                    console.log(`TASK: ${this.name} index: ${this.index} loco: ${step.data.address}`);
                    break;
                case StepTypes.setTurnout:
                    console.log(`TASK: ${this.name} index: ${this.index} setTurnout: ${step.data.address} closed: ${step.data.closed}`);
                    break;
                case StepTypes.forward:
                    console.log(`TASK: ${this.name} index: ${this.index} foward: ${step.data.speed}`);
                    break;
                case StepTypes.reverse:
                    console.log(`TASK: ${this.name} index: ${this.index} reverse: ${step.data.speed}`);
                    break;
                case StepTypes.stopLoco:
                    console.log(`TASK: ${this.name} index: ${this.index} stop`);
                    break;
                case StepTypes.delay:
                    console.log(`TASK: ${this.name} index: ${this.index} delay: ${step.data.ms}`);
                    break;
                case StepTypes.waitForSensor:
                    console.log(`TASK: ${this.name} index: ${this.index} waitForSensor: ${step.data.address}`);
                    break;
                case StepTypes.setFunction:
                    console.log(`TASK: ${this.name} index: ${this.index} function: ${step.data.fn}`);
                    break;
                case StepTypes.restart:
                    console.log(`TASK: ${this.name} index: ${this.index} restart`);
                    break;
            }
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
                    this.status = TaskStatus.finished;
                }
            }
        }
        restart() {
            this.steps.push({ type: StepTypes.restart, data: {} });
        }
        taskStart() {
            console.log(`TASK: ${this.name} started!`);
            this.stopLoco();
            this.index = 0;
            this.prevIndex = -1;
            this.status = TaskStatus.running;
            this.stopOnComplete = false;
            toastManager_1.toastManager.showToast(Tasks.icon + ` TASK: ${this.name} started!`, "success");
        }
        taskStop() {
            if (this.status != TaskStatus.stopped) {
                toastManager_1.toastManager.showToast(Tasks.icon + ` TASK: ${this.name} stopped!`, "info");
            }
            this.status = TaskStatus.stopped;
            this.stopLoco();
        }
    }
    exports.Task = Task;
});
