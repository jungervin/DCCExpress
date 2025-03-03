define(["require", "exports", "../controls/dialog", "../../../common/src/dcc", "../helpers/globals"], function (require, exports, dialog_1, dcc_1, globals_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CommandCenterSettingsDialog = void 0;
    class CommandCenterSettingsDialog extends dialog_1.Dialog {
        constructor() {
            var _a, _b;
            super(800, 600, "Command Center Settings");
            const tabControl = new dialog_1.TabControl();
            const tab1 = tabControl.addTab("Command Center");
            //tab1.getElement().innerHTML = "<h6>App settings<h6>";
            // const tab2 = tabControl.addTab("Command Center");
            // tab2.getElement().innerHTML = "<h6>Command Center Settings<h6>";
            this.addBody(tabControl);
            {
                const label1 = new dialog_1.Label("Command Center");
                tab1.addComponent(label1);
                const ccCombobox = new dialog_1.Combobox([
                    { label: "Select an option", value: "" },
                    { label: "Z21", value: dcc_1.CommandCenterTypes.Z21.toString() },
                    { label: "DCC-Ex TCP", value: dcc_1.CommandCenterTypes.DCCExTCP.toString() },
                    { label: "DCC-Ex Serial", value: dcc_1.CommandCenterTypes.DCCExSerial.toString() },
                ]);
                ccCombobox.onchange = (sender) => {
                    label2.visible = label3.visible = ccIp.visible = ccPort.visible = sender.value == dcc_1.CommandCenterTypes.Z21.toString() ||
                        sender.value == dcc_1.CommandCenterTypes.DCCExTCP.toString();
                    label4.visible = ccSerialPort.visible = sender.value == dcc_1.CommandCenterTypes.DCCExSerial.toString();
                };
                tab1.addComponent(ccCombobox);
                const label2 = new dialog_1.Label("Ip Address");
                tab1.addComponent(label2);
                const ccIp = new dialog_1.Input((_b = (_a = globals_1.Globals.Settings) === null || _a === void 0 ? void 0 : _a.CommandCenter) === null || _b === void 0 ? void 0 : _b.ip);
                ccIp.onchange = (sender) => {
                    globals_1.Globals.Settings.CommandCenter.ip = sender.value;
                };
                tab1.addComponent(ccIp);
                const label3 = new dialog_1.Label("Port");
                tab1.addComponent(label3);
                const ccPort = new dialog_1.Input(globals_1.Globals.Settings.CommandCenter.port.toString());
                ccPort.onchange = (sender) => {
                    globals_1.Globals.Settings.CommandCenter.port = parseInt(sender.value);
                };
                tab1.addComponent(ccPort);
                const label4 = new dialog_1.Label("Serial Port");
                tab1.addComponent(label4);
                const ccSerialPort = new dialog_1.Input(globals_1.Globals.Settings.CommandCenter.serialPort);
                ccSerialPort.onchange = (sender) => {
                    globals_1.Globals.Settings.CommandCenter.serialPort = sender.value;
                };
                tab1.addComponent(ccSerialPort);
                ccCombobox.value = globals_1.Globals.Settings.CommandCenter.type.toString();
                const label5 = new dialog_1.Label("Turnout Active Time [ms]");
                tab1.addComponent(label5);
                const turnoutActiveTime = new dialog_1.InputNumber();
                turnoutActiveTime.maxValue = 5000;
                turnoutActiveTime.value = globals_1.Globals.Settings.CommandCenter.turnoutActiveTime;
                turnoutActiveTime.onchange = (sender) => {
                    globals_1.Globals.Settings.CommandCenter.turnoutActiveTime = sender.value;
                };
                tab1.addComponent(turnoutActiveTime);
                const label6 = new dialog_1.Label("Accessory Active Time [ms]");
                tab1.addComponent(label6);
                const baActiveTime = new dialog_1.InputNumber();
                baActiveTime.maxValue = 5000;
                baActiveTime.value = globals_1.Globals.Settings.CommandCenter.basicAccessoryDecoderActiveTime;
                baActiveTime.onchange = (sender) => {
                    globals_1.Globals.Settings.CommandCenter.basicAccessoryDecoderActiveTime = sender.value;
                };
                tab1.addComponent(baActiveTime);
            }
            // ======= FIELD ================
            // {
            //     const fieldCombobox = new Combobox([
            //         { label: "Select an option", value: "" },
            //         { label: "Z21", value: CommandCenterTypes.Z21.toString() },
            //         { label: "DCC-Ex TCP", value: CommandCenterTypes.DCCExTCP.toString() },
            //         { label: "DCC-Ex Serial", value: CommandCenterTypes.DCCExSerial.toString() },
            //     ]);
            //     fieldCombobox.onchange = (sender) => {
            //         fieldIp.visible = fieldPort.visible = sender.value == CommandCenterTypes.Z21.toString() ||
            //             sender.value == CommandCenterTypes.DCCExTCP.toString()
            //             fieldSerialPort.visible = sender.value == CommandCenterTypes.DCCExSerial.toString()
            //     };
            //     tab3.addComponent(fieldCombobox);
            //     const fieldIp = new Input("IP Address")
            //     fieldIp.visible = false;
            //     tab3.addComponent(fieldIp)
            //     const fieldPort = new Input("Port")
            //     fieldPort.visible = false;
            //     tab3.addComponent(fieldPort)
            //     const fieldSerialPort = new Input("Serial Port")
            //     fieldSerialPort.visible = false;
            //     tab3.addComponent(fieldSerialPort)
            //     fieldCombobox.value = settings.fieldCommandCenter.type.toString()
            // }
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
    exports.CommandCenterSettingsDialog = CommandCenterSettingsDialog;
});
