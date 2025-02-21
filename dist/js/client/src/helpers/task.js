define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Task = void 0;
    var StepTypes;
    (function (StepTypes) {
        StepTypes[StepTypes["loco"] = 0] = "loco";
        StepTypes[StepTypes["delay"] = 1] = "delay";
        StepTypes[StepTypes["waitForSensor"] = 2] = "waitForSensor";
        StepTypes[StepTypes["function"] = 3] = "function";
    })(StepTypes || (StepTypes = {}));
    class Task {
        constructor(name) {
            this.index = 0;
            this.prevIndex = -1;
            this.steps = [];
            this.locoAddress = 0;
            this.num = 0;
            this.delayEnd = 0;
            this.name = name;
        }
        setLoco(address) {
            this.steps.push({ type: StepTypes.loco, data: { address: address } });
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
                        this.num++;
                        if (this.num == 100) {
                            this.index++;
                            this.num = 0;
                            console.log(`TASK: ${this.name} waitForSensor:${sensor.address} finished!`);
                        }
                        break;
                    case StepTypes.function:
                        this.index++;
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
        start() {
            console.log(`TASK: ${this.name} started!`);
            this.stop();
            this.index = 0;
            this.prevIndex = -1;
            this.proc();
        }
        stop() {
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
