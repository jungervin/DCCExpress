define(["require", "exports", "../controls/dialog", "../helpers/globals"], function (require, exports, dialog_1, globals_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeEditor = void 0;
    class CodeEditor extends dialog_1.Dialog {
        constructor() {
            super(900, 700, "Code Preview");
            this.bodyElement.style.overflowY = "hidden";
            const label = new dialog_1.Label("ℹ️ VS Code is recommended for editing! ℹ️");
            this.addBody(label);
            const height = (this.height - 190) + "px";
            const tabControl = new dialog_1.TabControl();
            this.addBody(tabControl);
            const tab1 = tabControl.addTab("Dispatcher.js");
            tab1.getElement().style.height = height;
            this.dispatcherTextArea = new dialog_1.TextArea("Code");
            tab1.addComponent(this.dispatcherTextArea);
            globals_1.Globals.fetchTextData("/dispatcher.js").then((text) => {
                this.dispatcherTextArea.value = text;
            }).catch((res) => {
                alert("Colud not load: /dispatcher.js");
            });
            this.dispatcherTextArea.getElement().style.flex = "1";
            this.dispatcherTextArea.getElement().style.boxSizing = "border-box";
            this.dispatcherTextArea.getElement().style.height = height;
            this.dispatcherTextArea.getElement().style.margin = "0";
            const tab2 = tabControl.addTab("Scheduler.js");
            this.schedulerTextArea = new dialog_1.TextArea("Code");
            tab2.addComponent(this.schedulerTextArea);
            globals_1.Globals.fetchTextData("/scheduler.js").then((text) => {
                this.schedulerTextArea.value = text;
            }).catch((res) => {
                alert("Colud not load: /scheduler.js");
            });
            this.schedulerTextArea.getElement().style.flex = "1";
            this.schedulerTextArea.getElement().style.boxSizing = "border-box";
            this.schedulerTextArea.getElement().style.height = height;
            this.schedulerTextArea.getElement().style.margin = "0";
            this.btnOk = new dialog_1.Button("CLOSE");
            this.btnOk.onclick = () => {
                this.close();
            };
            this.addFooter(this.btnOk);
        }
    }
    exports.CodeEditor = CodeEditor;
});
