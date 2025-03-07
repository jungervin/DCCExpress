define(["require", "exports", "../controls/dialog", "../helpers/globals"], function (require, exports, dialog_1, globals_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AppSettingsDialog = void 0;
    class AppSettingsDialog extends dialog_1.Dialog {
        constructor() {
            var _a, _b;
            super(800, 600, "Settings");
            const tabControl = new dialog_1.TabControl();
            const tab1 = tabControl.addTab("App");
            tab1.getElement().innerHTML = "<h6>App settings<h6>";
            this.addBody(tabControl);
            const label0 = new dialog_1.Label("Dispatcher Interval Time");
            tab1.addComponent(label0);
            this.intervalElement = new dialog_1.InputNumber();
            this.intervalElement.minValue = 100;
            this.intervalElement.maxValue = 10000;
            this.intervalElement.value = globals_1.Globals.Settings.Dispacher.interval;
            tab1.addComponent(this.intervalElement);
            this.showGrid = new dialog_1.Checkbox("Show Grid");
            this.showGrid.checked = globals_1.Globals.Settings.EditorSettings.ShowGrid;
            tab1.addComponent(this.showGrid);
            this.showAddress = new dialog_1.Checkbox("Show Address");
            this.showAddress.checked = globals_1.Globals.Settings.EditorSettings.ShowAddress;
            tab1.addComponent(this.showAddress);
            this.showSingleLamp = new dialog_1.Checkbox("Display railway signals as single-lamp");
            this.showSingleLamp.checked = globals_1.Globals.Settings.EditorSettings.DispalyAsSingleLamp;
            tab1.addComponent(this.showSingleLamp);
            const fastClockGroup = new dialog_1.GroupBox("Fast Clock");
            tab1.addComponent(fastClockGroup);
            this.showClock = new dialog_1.Checkbox("Show Clock");
            this.showClock.checked = (_a = globals_1.Globals.Settings.EditorSettings.ShowClock) !== null && _a !== void 0 ? _a : false;
            fastClockGroup.add(this.showClock);
            const label1 = new dialog_1.Label("Factor x(1..5)");
            fastClockGroup.add(label1);
            this.fastClockFactor = new dialog_1.InputNumber();
            this.fastClockFactor.minValue = 1;
            this.fastClockFactor.maxValue = 5;
            this.fastClockFactor.value = (_b = globals_1.Globals.Settings.EditorSettings.fastClockFactor) !== null && _b !== void 0 ? _b : 1;
            fastClockGroup.add(this.fastClockFactor);
            const btnOk = new dialog_1.Button("OK");
            btnOk.onclick = () => {
                this.dialogResult = dialog_1.DialogResult.ok;
                this.close();
            };
            this.addFooter(btnOk);
            const btnCancel = new dialog_1.Button("CANCEL");
            btnCancel.backround = dialog_1.ThemeColors.secondary;
            btnCancel.onclick = () => {
                this.dialogResult = dialog_1.DialogResult.cancel;
                this.close();
            };
            this.addFooter(btnCancel);
        }
    }
    exports.AppSettingsDialog = AppSettingsDialog;
});
