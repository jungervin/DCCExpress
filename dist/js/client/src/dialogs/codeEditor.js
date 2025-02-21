define(["require", "exports", "../editor/dispatcher", "../controls/dialog"], function (require, exports, dispatcher_1, dialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeEditor = void 0;
    class CodeEditor extends dialog_1.Dialog {
        constructor() {
            super(900, window.innerHeight - 200, "Dispatcher.js Preview");
            this.textarea = new dialog_1.TextArea("Code");
            if (dispatcher_1.Dispatcher.scriptContent) {
                this.textarea.value = dispatcher_1.Dispatcher.scriptContent;
            }
            else {
                this.textarea.value = "Click on the Dispatcher icon to load the srcipt";
            }
            this.textarea.setHeight("98%");
            this.addBody(this.textarea);
            this.btnOk = new dialog_1.Button("CLOSE");
            this.btnOk.onclick = () => {
                this.close();
            };
            this.addFooter(this.btnOk);
        }
    }
    exports.CodeEditor = CodeEditor;
});
