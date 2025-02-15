define(["require", "exports", "../editor/dispatcher", "../controls/dialog"], function (require, exports, dispatcher_1, dialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeEditor = void 0;
    class CodeEditor extends dialog_1.Dialog {
        constructor() {
            super(900, window.innerHeight - 160, "Editor");
            this.textarea = new dialog_1.TextArea("Code");
            this.textarea.value = dispatcher_1.Dispatcher.code;
            this.textarea.setHeight(580);
            this.addBody(this.textarea);
            this.btnOk = new dialog_1.Button("OK");
            this.btnOk.onclick = () => {
                dispatcher_1.Dispatcher.code = this.textarea.value;
                //this.close()
            };
            this.addFooter(this.btnOk);
            this.btnCancel = new dialog_1.Button("Cancel");
            this.btnCancel.onclick = () => {
                this.close();
            };
            this.addFooter(this.btnCancel);
        }
    }
    exports.CodeEditor = CodeEditor;
});
