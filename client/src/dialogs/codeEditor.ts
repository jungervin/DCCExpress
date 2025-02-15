
import { Dispatcher } from "../editor/dispatcher";
import { Button, Dialog, InputNumber, TextArea } from "../controls/dialog";
import { Globals } from "../helpers/globals";

export class CodeEditor extends Dialog {
    textarea: TextArea;
    btnOk: Button;
    btnCancel: Button;
    interval: InputNumber;
    constructor() {
        super(900, window.innerHeight - 160, "Editor")

        this.textarea = new TextArea("Code")
        this.textarea.value = Dispatcher.scriptContent
        this.textarea.setHeight(520)
        this.addBody(this.textarea)

        this.interval = new InputNumber()
        this.interval.minValue = 100;
        this.interval.maxValue = 10000;
        this.interval.value = Globals.ServerSettings.Dispacher.interval
        this.interval.onchange = (sender) => {
            Globals.ServerSettings.Dispacher.interval = sender.value
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