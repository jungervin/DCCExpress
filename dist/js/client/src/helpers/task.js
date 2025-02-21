define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Task = void 0;
    var StepTypes;
    (function (StepTypes) {
        StepTypes[StepTypes["loco"] = 0] = "loco";
        StepTypes[StepTypes["delay"] = 1] = "delay";
        StepTypes[StepTypes["function"] = 2] = "function";
    })(StepTypes || (StepTypes = {}));
    class Task {
        constructor(name) {
            this.index = 0;
            this.prevIndex = -1;
            this.steps = [];
            this.locoAddress = 0;
            this.name = name;
        }
        addLoco(address) {
            this.steps.push({ type: StepTypes.loco, data: { address: address } });
        }
        addDelay(ms) {
            this.steps.push({ type: StepTypes.delay, data: { ms: ms } });
        }
        delay(ms) {
            this.delayTimer = setTimeout(() => {
                this.index++;
            }, ms);
        }
        procStep(step) {
            switch (step.type) {
                case StepTypes.loco:
                    this.locoAddress = step.data.address;
                    console.log(`TASK: ${this.name} loco: ${this.locoAddress} added!`);
                    this.index++;
                    break;
                case StepTypes.delay:
                    const ms = step.data.ms;
                    console.log(`TASK: ${this.name} delay: ${ms} started!`);
                    this.delayTimer = setTimeout(() => {
                        this.index++;
                        console.log(`TASK: ${this.name} delay finished!`);
                    }, ms);
                    break;
                case StepTypes.function:
                    this.index++;
                    break;
            }
        }
        proc() {
            if (this.index != this.prevIndex) {
                if (this.index < this.steps.length) {
                    const step = this.steps[this.index];
                    this.procStep(step);
                    this.prevIndex = this.index;
                }
                else {
                    console.log(`TASK: ${this.name} finished!`);
                }
            }
            this.timer = setTimeout(() => {
                this.proc();
            }, 50);
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
