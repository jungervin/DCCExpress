define(["require", "exports", "../../../common/src/dcc", "./api"], function (require, exports, dcc_1, api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Task = exports.Tasks = exports.TaskStatus = void 0;
    var StepTypes;
    (function (StepTypes) {
        StepTypes["loco"] = "loco";
        StepTypes["setTurnout"] = "setTurnout";
        StepTypes["foward"] = "foward";
        StepTypes["reverse"] = "reverse";
        StepTypes["stop"] = "stop";
        StepTypes["delay"] = "delay";
        StepTypes["waitForSensor"] = "waitForSensor";
        StepTypes["function"] = "function";
        StepTypes["restart"] = "restart";
    })(StepTypes || (StepTypes = {}));
    var TaskStatus;
    (function (TaskStatus) {
        TaskStatus[TaskStatus["running"] = 0] = "running";
        TaskStatus[TaskStatus["paused"] = 1] = "paused";
        TaskStatus[TaskStatus["stopped"] = 2] = "stopped";
        TaskStatus[TaskStatus["finished"] = 3] = "finished";
    })(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
    class Tasks {
        constructor() {
            this.tasks = [];
            this.timer = setInterval(() => {
                this.tasks.forEach(t => { t.proc(); });
            }, 50);
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
    }
    exports.Tasks = Tasks;
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
            this.name = name;
        }
        setLoco(address) {
            this.steps.push({ type: StepTypes.loco, data: { address: address } });
        }
        setTurnout(address, closed) {
            this.steps.push({ type: StepTypes.setTurnout, data: { address: address, closed: closed } });
        }
        foward(speed) {
            this.steps.push({ type: StepTypes.foward, data: { speed: speed } });
        }
        reverse(speed) {
            this.steps.push({ type: StepTypes.reverse, data: { speed: speed } });
        }
        stop() {
            this.steps.push({ type: StepTypes.stop, data: { speed: 0 } });
        }
        setFunction(fn, on) {
            this.steps.push({ type: StepTypes.function, data: { fn: fn, on: on } });
        }
        delay(ms) {
            this.steps.push({ type: StepTypes.delay, data: { ms: ms } });
        }
        waitForSensor(address, on) {
            this.steps.push({ type: StepTypes.waitForSensor, data: { address: address, on: on } });
        }
        procStep() {
            if (this.step) {
                switch (this.step.type) {
                    case StepTypes.loco:
                        this.locoAddress = this.step.data.address;
                        //console.log(`TASK: ${this.name} loco: ${this.locoAddress} added!`)
                        this.index++;
                        break;
                    case StepTypes.setTurnout:
                        const turnout = this.step.data;
                        api_1.Api.setTurnout(turnout.address, turnout.closed);
                        this.index++;
                        break;
                    case StepTypes.foward:
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
                    case StepTypes.stop:
                        //console.log(`TASK: ${this.name} stop started!`)
                        api_1.Api.setLocoSpeed(this.locoAddress, 0);
                        this.index++;
                        break;
                    case StepTypes.delay:
                        // Ez helyett inkább 
                        //  delayEnd = now() + ms használj!
                        // amikor defejeződik a delayEnd pedig null legyen
                        const ms = this.step.data.ms;
                        // console.log(`TASK: ${this.name} delay: ${ms} started!`)
                        // this.delayTimer = setTimeout(() => {
                        //     this.index++;
                        //     console.log(`TASK: ${this.name} delay finished!`)
                        // }, ms)
                        if (this.delayEnd <= 0) {
                            //console.log(`TASK: ${this.name} delay: ${ms} started!`)
                            this.delayEnd = performance.now() + ms;
                        }
                        else if (performance.now() > this.delayEnd) {
                            this.index++;
                            this.delayEnd = 0;
                            //console.log(`TASK: ${this.name} delay finished!`)
                        }
                        break;
                    case StepTypes.waitForSensor:
                        const sensor = this.step.data;
                        if (api_1.Api.getSensor(sensor.address) == sensor.on) {
                            this.index++;
                            console.log(`TASK: ${this.name} waitForSensor:${sensor.address} finished!`);
                        }
                        break;
                    case StepTypes.function:
                        const f = this.step.data;
                        api_1.Api.setLocoFunction(this.locoAddress, f.fn, f.on);
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
        logStep(step) {
            switch (step.type) {
                case StepTypes.loco:
                    console.log(`TASK: ${this.name} index: ${this.index} loco: ${step.data.address}`);
                    break;
                case StepTypes.setTurnout:
                    console.log(`TASK: ${this.name} index: ${this.index} setTurnout: ${step.data.address} closed: ${step.data.closed}`);
                    break;
                case StepTypes.foward:
                    console.log(`TASK: ${this.name} index: ${this.index} foward: ${step.data.speed}`);
                    break;
                case StepTypes.reverse:
                    console.log(`TASK: ${this.name} index: ${this.index} reverse: ${step.data.speed}`);
                    break;
                case StepTypes.stop:
                    console.log(`TASK: ${this.name} index: ${this.index} stop`);
                    break;
                case StepTypes.delay:
                    console.log(`TASK: ${this.name} index: ${this.index} delay: ${step.data.ms}`);
                    break;
                case StepTypes.waitForSensor:
                    console.log(`TASK: ${this.name} index: ${this.index} waitForSensor: ${step.data.address}`);
                    break;
                case StepTypes.function:
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
            this.stop();
            this.index = 0;
            this.prevIndex = -1;
            this.status = TaskStatus.running;
            //this.proc();
        }
        taskStop() {
            this.status = TaskStatus.stopped;
            // stop the loco
            this.stop();
        }
    }
    exports.Task = Task;
});
