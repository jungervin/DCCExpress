define(["require", "exports", "../helpers/task", "../helpers/api"], function (require, exports, task_1, api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SchedulerButtonPropertiesElement = void 0;
    class SchedulerButtonPropertiesElement extends HTMLElement {
        // btnAbort: HTMLButtonElement;
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: 'open' });
            this.shadow.innerHTML = `
            <style>
                @import url("css/bootstrap.min.css");
                @import url("css/properties.css");
                p {
                    color: #ccc;
                }
            </style>
            <div class="container">
                <div class="igroup">
                    <p><small>⚠️The tasks must be loaded, and the task name must exist in scheduler.js.<br>
                    🚂Stop .. Double-click on the desired row .. Resume</small></p>
                    <div>Task Name</div>
                    <div>
                        <input id="taskname" type="text" style="width:100%" value="">
                    </div>
                </div>

                <div class="igroupi">
                 
                    <div style="margin-top: 8px">Steps</div>
                    
                    <div style="height: 420px; overflow: auto; border-radius: 4px;background-color: black" id="steps">
                    </div>
                    <div id="buttons" style="margin: 10px 0">
                    <div id="status" style="background-color: #202020; padding: 4px; border: solid 1px gray;border-radius: 4px; margin: 4px 0" >Status: </div>
                    <button id="btnStart" class="btn btn-secondary">START</button>
                    <button id="btnStop" class="btn btn-secondary">STOP</button>
                    <button id="btnResume" class="btn btn-secondary">RESUME</button>
                    <button id="btnFinish" class="btn btn-secondary">FINISH</button>
                    </div>
                </div>
            </div>
        `;
            this.statusElement = this.shadow.getElementById('status');
            this.labelTextElement = this.shadow.getElementById('taskname');
            this.taskDivElement = this.shadow.getElementById('steps');
            this.btnStart = this.shadow.getElementById("btnStart");
            this.btnStart.onclick = (e) => {
                api_1.Api.tasks.startTask(this.button.taskName);
            };
            this.btnStop = this.shadow.getElementById("btnStop");
            this.btnStop.onclick = (e) => {
                api_1.Api.tasks.stopTask(this.button.taskName);
            };
            this.btnResume = this.shadow.getElementById("btnResume");
            this.btnResume.onclick = (e) => {
                api_1.Api.tasks.resumeTask(this.button.taskName);
            };
            this.btnFinish = this.shadow.getElementById("btnFinish");
            this.btnFinish.onclick = (e) => {
                api_1.Api.tasks.finishTask(this.button.taskName);
            };
            window.addEventListener('taskChangedEvent', (e) => {
                this.renderTask();
            });
        }
        setButton(button) {
            this.button = button;
            this.labelTextElement.value = button.taskName;
            this.labelTextElement.onchange = (e) => {
                this.button.taskName = this.labelTextElement.value;
                window.invalidate();
            };
            this.renderTask();
        }
        renderTask() {
            if (!this.button) {
                return;
            }
            const task = api_1.Api.tasks.getTask(this.button.taskName);
            if (task) {
                this.statusElement.innerHTML = task.status + (task.finishOnComplete ? " 🏁FINISH" : "");
                if (task.status == task_1.TaskStatus.running) {
                    this.btnStart.classList.add("btn-primary");
                }
                else {
                    this.btnStart.classList.remove("btn-primary");
                }
                if (task.status == task_1.TaskStatus.stopped) {
                    this.btnStop.classList.add("btn-primary");
                }
                else {
                    this.btnStop.classList.remove("btn-primary");
                }
            }
            this.taskDivElement.innerHTML = "";
            if (this.button) {
                const task = api_1.Api.tasks.getTask(this.button.taskName);
                if (task) {
                    const table = document.createElement("table");
                    table.style.width = "100%";
                    table.style.cursor = "pointer";
                    var i = 0;
                    task.steps.forEach((s, i) => {
                        const row = document.createElement('tr');
                        row.dataset.index = i.toString();
                        table.appendChild(row);
                        // const bg = task.index == i ? "lime" : "gray"
                        // const fg = task.index == i ? "black" : "white"
                        // const col1 = document.createElement('td')
                        // row.appendChild(col1)
                        // col1.style.color = fg
                        // col1.style.backgroundColor = bg
                        // col1.innerHTML = task.index == i ? ">>" : ""
                        // const col2 = document.createElement('td')
                        // row.appendChild(col2)
                        // col2.style.color = fg
                        // col2.style.backgroundColor = bg
                        // col2.innerHTML = task.logStep(s)
                        // i++
                        const isActive = task.index === i;
                        var bg = isActive ? "lime" : "#202020";
                        var fg = isActive ? "black" : "white";
                        const col1 = document.createElement("td");
                        row.appendChild(col1);
                        if (isActive) {
                            col1.innerHTML = ">>";
                        }
                        switch (s.type) {
                            case task_1.StepTypes.setLoco:
                            case task_1.StepTypes.reverse:
                            case task_1.StepTypes.forward:
                            case task_1.StepTypes.stopLoco:
                                col1.innerHTML = "🚂";
                                break;
                            // case StepTypes.delay:
                            // case StepTypes.waitForSensor:
                            //     col1.innerHTML = "⌛"
                            //     break;
                            // case StepTypes.startAtMinutes:
                            //     col1.innerHTML = "🕔"
                            //     break;
                            // case StepTypes.setFunction:
                            //     col1.innerHTML = "🎛️"
                            //     break;
                            // case StepTypes.playSound:
                            //     col1.innerHTML = "🔊"
                            //     break;
                            // case StepTypes.setRoute:
                            // case StepTypes.setTurnout:
                            //     col1.innerHTML = "🔀"
                            //     break;
                            // case StepTypes.setSignalGreen:
                            // case StepTypes.setSignalRed:
                            // case StepTypes.setSignalYellow:
                            // case StepTypes.setSignalWhite:
                            //     col1.innerHTML = "🚦"
                            //     break;
                            case task_1.StepTypes.break:
                                col1.innerHTML = "🔴";
                                if (isActive) {
                                    bg = "red";
                                    fg = "yellow";
                                }
                                break;
                            case task_1.StepTypes.goto:
                                col1.innerHTML = "⬅️";
                                break;
                            case task_1.StepTypes.label:
                                col1.innerHTML = "➡️";
                                break;
                            // case StepTypes.setAccessory:
                            // case StepTypes.setOutput:
                            //     col1.innerHTML = "🟢"
                            //     break;
                        }
                        col1.style.color = fg;
                        col1.style.backgroundColor = bg;
                        const col2 = document.createElement("td");
                        row.appendChild(col2);
                        col2.style.color = fg;
                        col2.style.backgroundColor = bg;
                        col2.innerHTML = task.logStep(s);
                    });
                    table.addEventListener("dblclick", (event) => {
                        const targetRow = event.target.closest("tr");
                        if (targetRow && targetRow.dataset.index) {
                            task.index = parseInt(targetRow.dataset.index, 10);
                            this.renderTask(); // Frissítjük a nézetet
                        }
                    });
                    this.taskDivElement.appendChild(table);
                }
                else {
                    this.taskDivElement.innerHTML = "I can't find the scheduler file, or it is not loaded!";
                }
            }
        }
    }
    exports.SchedulerButtonPropertiesElement = SchedulerButtonPropertiesElement;
    customElements.define("scheduler-button-properties-element", SchedulerButtonPropertiesElement);
});
