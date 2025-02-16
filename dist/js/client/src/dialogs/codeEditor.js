define(["require", "exports", "../editor/dispatcher", "../controls/dialog", "../helpers/globals"], function (require, exports, dispatcher_1, dialog_1, globals_1) {
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
            this.textarea.setHeight(580);
            this.addBody(this.textarea);
            this.interval = new dialog_1.InputNumber();
            this.interval.minValue = 100;
            this.interval.maxValue = 10000;
            this.interval.value = globals_1.Globals.ServerSettings.Dispacher.interval;
            this.interval.onchange = (sender) => {
                globals_1.Globals.ServerSettings.Dispacher.interval = sender.value;
            };
            this.addBody(this.interval);
            this.btnOk = new dialog_1.Button("OK");
            this.btnOk.onclick = () => {
                dispatcher_1.Dispatcher.scriptContent = this.textarea.value;
                this.close();
                if (dispatcher_1.Dispatcher.active) {
                    dispatcher_1.Dispatcher.active = false;
                    dispatcher_1.Dispatcher.active = true;
                }
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
