import { iStep, Task, TaskStatus } from "../helpers/task";
import { SchedulerButtonShapeElement } from "../editor/schedulerButton";
import { Api } from "../helpers/api";

export class SchedulerButtonPropertiesElement extends HTMLElement {
    shadow: ShadowRoot;
    labelTextElement: HTMLInputElement | null;
    button?: SchedulerButtonShapeElement;
    taskDivElement: HTMLElement;
    btnStart: HTMLButtonElement;
    btnStop: HTMLButtonElement;
    btnResume: HTMLButtonElement;
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

                <div class="igroup">
                 
                    <div style="margin-top: 8px">Steps</div>
                    
                    <div style="height: 460px; overflow: auto" id="steps">
                    </div>
                    <div id="buttons" style="margin: 10px 0">
                    <div id="status" style="padding: 4px; border: solid 1px gray;border-radius: 4px; margin: 4px 0" >Status: </div>
                    <button id="btnStart" class="btn btn-secondary">START</button>
                    <button id="btnStop" class="btn btn-secondary">STOP</button>
                    <button id="btnResume" class="btn btn-secondary">RESUME</button>
                    <!--<button id="btnAbort" class="btn btn-secondary">ABORT</button>-->
                    </div>
                </div>
            </div>
        `
        const statusElement = this.shadow.getElementById('status') as HTMLElement
        this.labelTextElement = this.shadow.getElementById('taskname') as HTMLInputElement
        this.taskDivElement = this.shadow.getElementById('steps') as HTMLElement
        this.btnStart = this.shadow.getElementById("btnStart") as HTMLButtonElement
        this.btnStart.onclick = (e) => {
            Api.tasks.startTask(this.button!.taskName)
        }

        this.btnStop = this.shadow.getElementById("btnStop") as HTMLButtonElement
        this.btnStop.onclick = (e) => {
            Api.tasks.stopTask(this.button!.taskName)
        }

        this.btnResume = this.shadow.getElementById("btnResume") as HTMLButtonElement
        this.btnResume.onclick = (e) => {
            Api.tasks.resumeTask(this.button!.taskName)
        }
        // this.btnAbort = this.shadow.getElementById("btnAbort") as HTMLButtonElement
        // this.btnAbort.onclick = (e) => {
        //     Api.tasks.abortTask(this.button!.taskName)
        // }

        window.addEventListener('taskChangedEvent', (e: Event) => {
            var task = (e as CustomEvent).detail

            statusElement.innerHTML = task.status

            this.renderTask()
            if (task.status == TaskStatus.running) {
                this.btnStart.classList.add("btn-primary")
            } else {
                this.btnStart.classList.remove("btn-primary")
            }
            if (task.status == TaskStatus.stopped) {
                this.btnStop.classList.add("btn-primary")
            } else {
                this.btnStop.classList.remove("btn-primary")
            }


            // if (btn) {
            //     if (btn.status != task.status) {
            //         btn.status = task.status
            //         this.draw();
            //     }
            // }
        })

    }

    setButton(button: SchedulerButtonShapeElement) {

        this.button = button;
        this.labelTextElement!.value = button.taskName!
        this.labelTextElement!.onchange = (e) => {
            this.button!.taskName = this.labelTextElement!.value
            window.invalidate()
        }
        this.renderTask()
    }

    renderTask() {
        this.taskDivElement.innerHTML = ""
        if (this.button) {

            const task = Api.tasks.getTask(this.button.taskName)

            if (task) {
                const table = document.createElement("table")
                table.style.width = "100%"
                table.style.cursor = "pointer"

                var i = 0;
                task.steps.forEach((s: iStep, i: number) => {
                    const row = document.createElement('tr')
                    row.dataset.index = i.toString()
                    table.appendChild(row)

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
                    const bg = isActive ? "lime" : "gray";
                    const fg = isActive ? "black" : "white";

                    const col1 = document.createElement("td");
                    row.appendChild(col1);
                    col1.style.color = fg;
                    col1.style.backgroundColor = bg;
                    col1.innerHTML = isActive ? ">>" : "";

                    const col2 = document.createElement("td");
                    row.appendChild(col2);
                    col2.style.color = fg;
                    col2.style.backgroundColor = bg;
                    col2.innerHTML = task.logStep(s);
                })

                table.addEventListener("dblclick", (event) => {
                    const targetRow = (event.target as HTMLElement).closest("tr");
                    if (targetRow && targetRow.dataset.index) {
                        task.index = parseInt(targetRow.dataset.index, 10);
                        this.renderTask(); // Frissítjük a nézetet
                    }
                });


                this.taskDivElement.appendChild(table)
            }
            else {
                this.taskDivElement.innerHTML = "I can't find the scheduler file, or it is not loaded!"
            }
        }
    }
}
customElements.define("scheduler-button-properties-element", SchedulerButtonPropertiesElement)