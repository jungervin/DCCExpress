
import { Button, Dialog, ThemeColors } from "../controls/dialog";

export class MessageDialog extends Dialog {

    constructor(title: string, msg: string, buttons: string[] = [], defaultButton: string = "") {
        super(600, 160, title)

        const p = document.createElement("h6")
        p.innerHTML = msg
        this.bodyElement.appendChild(p)

        buttons.forEach((text) => {
            const btn = new Button(text)
            if(text != defaultButton) {
                btn.backround = ThemeColors.secondary
            }
            btn.onclick = () => {
                this.dialogResultText = text

                this.close()
            }
            this.addFooter(btn)
        })
    }
}