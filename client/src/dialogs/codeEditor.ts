
import { Button, Dialog, Label, TabControl, TextArea } from "../controls/dialog";
import { Globals } from "../helpers/globals";

export class CodeEditor extends Dialog {
    dispatcherTextArea: TextArea;
    btnOk: Button;
    schedulerTextArea: TextArea;
    constructor() {
        super(900, 700, "Code Preview")
        
        this.bodyElement.style.overflowY = "hidden"
        const label = new Label("ℹ️ VS Code is recommended for editing! ℹ️")
        this.addBody(label)

        const height = (this.height - 190) + "px"

        const tabControl = new TabControl()
        this.addBody(tabControl)
        const tab1 = tabControl.addTab("Dispatcher.js")
        tab1.getElement().style.height = height
        
        this.dispatcherTextArea = new TextArea("Code")
        tab1.addComponent(this.dispatcherTextArea)

        Globals.fetchTextData("/dispatcher.js").then((text: any) => {
            this.dispatcherTextArea.value = text
        }).catch((res: any) => {
            alert("Colud not load: /dispatcher.js")
        })

        
        this.dispatcherTextArea.getElement().style.flex = "1"
        this.dispatcherTextArea.getElement().style.boxSizing = "border-box"
        this.dispatcherTextArea.getElement().style.height = height
        this.dispatcherTextArea.getElement().style.margin = "0"
        

        const tab2 = tabControl.addTab("Scheduler.js")

        this.schedulerTextArea = new TextArea("Code")
        tab2.addComponent(this.schedulerTextArea)

        Globals.fetchTextData("/scheduler.js").then((text: any) => {
            this.schedulerTextArea.value = text
        }).catch((res: any) => {
            alert("Colud not load: /scheduler.js")
        })

        
        this.schedulerTextArea.getElement().style.flex = "1"
        this.schedulerTextArea.getElement().style.boxSizing = "border-box"
        this.schedulerTextArea.getElement().style.height = height
        this.schedulerTextArea.getElement().style.margin = "0"

        this.btnOk = new Button("CLOSE")
        this.btnOk.onclick = () => {
            this.close()
        }
        this.addFooter(this.btnOk)
    }
}