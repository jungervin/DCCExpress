
import { Dispatcher } from "../editor/dispatcher";
import { Button, Dialog, TextArea } from "../controls/dialog";
import { Globals } from "../helpers/globals";

export class CodeEditor extends Dialog {
    textarea: TextArea;
    btnOk: Button;
    constructor() {
        super(900, window.innerHeight - 200, "dispatcher.js Preview")

        this.textarea = new TextArea("Code")
        
        // if(Dispatcher.scriptContent) {
        //     this.textarea.value = Dispatcher.scriptContent
        // } else {
        //     this.textarea.value = "Click on the Dispatcher icon to load the srcipt"
        // }

        Globals.fetchTextData("/dispatcher.js").then((text: any) => {
            this.textarea.value = text
        }).catch((res: any) => {
            alert("Colud not load: /dispatcher.js")
        })

        this.textarea.getElement().style.flex = "1"
        this.textarea.getElement().style.boxSizing = "border-box"
        this.textarea.getElement().style.height = "99%"
        this.textarea.getElement().style.margin = "0"
        
        this.addBody(this.textarea)

        this.btnOk = new Button("CLOSE")
        this.btnOk.onclick = () => {
            this.close()
        }
        this.addFooter(this.btnOk)
    }
}