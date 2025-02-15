define(["require", "exports", "../components/dialog"], function (require, exports, dialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AppSettingsDialog = void 0;
    class AppSettingsDialog extends dialog_1.Dialog {
        constructor() {
            super(400, 300, "Settings");
            this.gridSize = new dialog_1.InputNumber("Grid size:");
            this.gridSize.minValue = 30;
            this.gridSize.maxValue = 40;
            this.gridSize.value = 20;
            this.addBody(this.gridSize);
            this.showAddress = new dialog_1.Checkbox("Show address");
            this.addBody(this.showAddress);
            const btnCancel = new dialog_1.Button("Cancel");
            btnCancel.onclick = () => {
                this.dialogResult = dialog_1.DialogResult.cancel;
                this.close();
            };
            this.addFooter(btnCancel);
            const btnOk = new dialog_1.Button("OK");
            btnOk.onclick = () => {
                this.dialogResult = dialog_1.DialogResult.ok;
                this.close();
            };
            this.addFooter(btnOk);
        }
    }
    exports.AppSettingsDialog = AppSettingsDialog;
});
