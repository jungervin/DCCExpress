
import { Dispatcher } from "../editor/dispatcher";
import { Button, Dialog, InputNumber, TextArea } from "../controls/dialog";
import { Globals } from "../helpers/globals";

export class CodeEditor extends Dialog {
    textarea: TextArea;
    btnOk: Button;
    btnCancel: Button;
    interval: InputNumber;
    constructor() {
        super(900, window.innerHeight - 200, "Dispatcher.js Preview")

        this.textarea = new TextArea("Code")
        if(Dispatcher.scriptContent) {
            this.textarea.value = Dispatcher.scriptContent
        } else {
            this.textarea.value = "Click on the Dispatcher icon to load the srcipt"
        }
        this.textarea.setHeight(580)
        this.addBody(this.textarea)

        this.interval = new InputNumber()
        this.interval.minValue = 100;
        this.interval.maxValue = 10000;
        this.interval.value = Globals.Settings.Dispacher.interval
        this.interval.onchange = (sender) => {
            Globals.Settings.Dispacher.interval = sender.value
        }
        this.addBody(this.interval)

        this.btnOk = new Button("OK")
        this.btnOk.onclick = () => {
            Dispatcher.scriptContent = this.textarea.value
            this.close()
            if(Dispatcher.active) {
                Dispatcher.active = false;
                Dispatcher.active = true;
            }
        }
        this.addFooter(this.btnOk)

        this.btnCancel = new Button("Cancel")
        this.btnCancel.onclick = () => {
            this.close()
        }
        this.addFooter(this.btnCancel)
    }


}