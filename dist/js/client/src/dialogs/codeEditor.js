define(["require", "exports", "../controls/dialog", "../helpers/globals"], function (require, exports, dialog_1, globals_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeEditor = void 0;
    class CodeEditor extends dialog_1.Dialog {
        constructor() {
            super(900, window.innerHeight - 200, "dispatcher.js Preview");
            this.textarea = new dialog_1.TextArea("Code");
            // if(Dispatcher.scriptContent) {
            //     this.textarea.value = Dispatcher.scriptContent
            // } else {
            //     this.textarea.value = "Click on the Dispatcher icon to load the srcipt"
            // }
            globals_1.Globals.fetchTextData("/dispatcher.js").then((text) => {
                this.textarea.value = text;
            }).catch((res) => {
                alert("Colud not load: /dispatcher.js");
            });
            this.textarea.getElement().style.flex = "1";
            this.textarea.getElement().style.boxSizing = "border-box";
            this.textarea.getElement().style.height = "99%";
            this.textarea.getElement().style.margin = "0";
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
