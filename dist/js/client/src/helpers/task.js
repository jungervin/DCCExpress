define(["require", "exports", "../../../common/src/dcc", "./api"], function (require, exports, dcc_1, api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Task = exports.TaskStatus = void 0;
    var StepTypes;
    (function (StepTypes) {
        StepTypes[StepTypes["loco"] = 0] = "loco";
        StepTypes[StepTypes["foward"] = 1] = "foward";
        StepTypes[StepTypes["reverse"] = 2] = "reverse";
        StepTypes[StepTypes["stop"] = 3] = "stop";
        StepTypes[StepTypes["delay"] = 4] = "delay";
        StepTypes[StepTypes["waitForSensor"] = 5] = "waitForSensor";
        StepTypes[StepTypes["function"] = 6] = "function";
        StepTypes[StepTypes["restart"] = 7] = "restart";
    })(StepTypes || (StepTypes = {}));
    var TaskStatus;
    (function (TaskStatus) {
        TaskStatus[TaskStatus["running"] = 0] = "running";
        TaskStatus[TaskStatus["paused"] = 1] = "paused";
        TaskStatus[TaskStatus["stopped"] = 2] = "stopped";
        TaskStatus[TaskStatus["finished"] = 3] = "finished";
    })(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
    class Task {
        constructor(name) {
            this.index = 0;
            this.prevIndex = -1;
            this.steps = [];
            this.locoAddress = 0;
            this.num = 0;
            this.delayEnd = 0;
            this.status = TaskStatus.stopped;
            this.name = name;
        }
        setLoco(address) {
            this.steps.push({ type: StepTypes.loco, data: { address: address } });
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
                        console.log(`TASK: ${this.name} loco: ${this.locoAddress} added!`);
                        this.index++;
                        break;
                    case StepTypes.foward:
                        const speed = this.step.data.speed;
                        console.log(`TASK: ${this.name} foward: ${speed} started!`);
                        api_1.Api.setLoco(this.locoAddress, speed, dcc_1.Z21Directions.forward);
                        this.index++;
                        break;
                    case StepTypes.reverse:
                        const rspeed = this.step.data.speed;
                        console.log(`TASK: ${this.name} reverse: ${rspeed} started!`);
                        api_1.Api.setLoco(this.locoAddress, rspeed, dcc_1.Z21Directions.reverse);
                        this.index++;
                        break;
                    case StepTypes.stop:
                        console.log(`TASK: ${this.name} stop started!`);
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
                            console.log(`TASK: ${this.name} delay: ${ms} started!`);
                            this.delayEnd = performance.now() + ms;
                        }
                        else if (performance.now() > this.delayEnd) {
                            this.index++;
                            this.delayEnd = 0;
                            console.log(`TASK: ${this.name} delay finished!`);
                        }
                        break;
                    case StepTypes.waitForSensor:
                        const sensor = this.step.data;
                        console.log(`TASK: ${this.name} waitForSensor:${sensor.address} value: ${sensor.on}!`);
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
                        console.log(`TASK: ${this.name} restart!`);
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
                    this.step = this.steps[this.index];
                }
                else {
                }
                this.procStep();
                this.timer = setTimeout(() => {
                    this.proc();
                }, 50);
            }
            else {
                console.log(`TASK: ${this.name} finished! Exit!`);
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
            this.proc();
        }
        taskStop() {
            this.status = TaskStatus.stopped;
            // Ez lehet kellene
            //this.stop()
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = undefined;
            }
            if (this.delayTimer) {
                clearTimeout(this.delayTimer);
                this.delayTimer = undefined;
            }
        }
    }
    exports.Task = Task;
});
