define(["require", "exports", "../controls/dialog"], function (require, exports, dialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MessageDialog = void 0;
    class MessageDialog extends dialog_1.Dialog {
        constructor(title, msg, buttons = [], defaultButton = "") {
            super(600, 160, title);
            const p = document.createElement("h6");
            p.innerHTML = msg;
            this.bodyElement.appendChild(p);
            buttons.forEach((text) => {
                const btn = new dialog_1.Button(text);
                if (text != defaultButton) {
                    btn.backround = dialog_1.ThemeColors.secondary;
                }
                btn.onclick = () => {
                    this.dialogResultText = text;
                    this.close();
                };
                this.addFooter(btn);
            });
        }
    }
    exports.MessageDialog = MessageDialog;
});
