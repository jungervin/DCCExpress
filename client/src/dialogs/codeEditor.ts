
import { Dispatcher } from "../editor/dispatcher";
import { Button, Dialog, TextArea } from "../controls/dialog";

export class CodeEditor extends Dialog {
    textarea: TextArea;
    btnOk: Button;
    constructor() {
        super(900, window.innerHeight - 200, "Dispatcher.js Preview")

        this.textarea = new TextArea("Code")
        if(Dispatcher.scriptContent) {
            this.textarea.value = Dispatcher.scriptContent
        } else {
            this.textarea.value = "Click on the Dispatcher icon to load the srcipt"
        }
        this.textarea.setHeight("98%")
        this.addBody(this.textarea)

        this.btnOk = new Button("CLOSE")
        this.btnOk.onclick = () => {
            this.close()
        }
        this.addFooter(this.btnOk)
    }
}