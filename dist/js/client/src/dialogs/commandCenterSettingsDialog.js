define(["require", "exports", "../controls/dialog", "../../../common/src/dcc", "../helpers/globals", "../helpers/ws"], function (require, exports, dialog_1, dcc_1, globals_1, ws_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CommandCenterSettingsDialog = void 0;
    class CommandCenterSettingsDialog extends dialog_1.Dialog {
        constructor() {
            super(800, 600, "Command Center Settings");
            const tabControl = new dialog_1.TabControl();
            const tab1 = tabControl.addTab("Command Center");
            //tab1.getElement().innerHTML = "<h6>App settings<h6>";
            // const tab2 = tabControl.addTab("Command Center");
            // tab2.getElement().innerHTML = "<h6>Command Center Settings<h6>";
            this.addBody(tabControl);
            const label1 = new dialog_1.Label("Command Center");
            tab1.addComponent(label1);
            const ccCombobox = new dialog_1.Combobox([
                { label: "Select an option", value: "" },
                { label: "Z21", value: dcc_1.CommandCenterTypes.Z21.toString() },
                { label: "DCC-Ex TCP", value: dcc_1.CommandCenterTypes.DCCExTCP.toString() },
                { label: "DCC-Ex Serial", value: dcc_1.CommandCenterTypes.DCCExSerial.toString() },
            ]);
            ccCombobox.onchange = (sender) => {
                switch (sender.value) {
                    case dcc_1.CommandCenterTypes.Z21.toString():
                        if (globals_1.Globals.CommandCenterSetting.type == dcc_1.CommandCenterTypes.Z21) {
                            const z21 = globals_1.Globals.CommandCenterSetting.commandCenter;
                            ccIp.value = z21.ip;
                            ccPort.value = z21.port.toString();
                            turnoutActiveTime.value = z21.turnoutActiveTime;
                            baActiveTime.value = z21.basicAccessoryDecoderActiveTime;
                        }
                        else {
                            ccIp.value = "192.168.0.70";
                            ccPort.value = "21105";
                            turnoutActiveTime.value = 500;
                            baActiveTime.value = 100;
                        }
                        break;
                    case dcc_1.CommandCenterTypes.DCCExTCP.toString():
                        if (globals_1.Globals.CommandCenterSetting.type == dcc_1.CommandCenterTypes.DCCExTCP) {
                            const dtcp = globals_1.Globals.CommandCenterSetting.commandCenter;
                            ccIp.value = dtcp.ip;
                            ccPort.value = dtcp.port.toString();
                            initTextAreaElement.value = dtcp.init;
                        }
                        else {
                            ccIp.value = "";
                            ccPort.value = "2560";
                            initTextAreaElement.value = "";
                        }
                        // turnoutActiveTime.value = dtcp.turnoutActiveTime
                        // baActiveTime.value = dtcp.basicAccessoryDecoderActiveTime
                        break;
                    case dcc_1.CommandCenterTypes.DCCExSerial.toString():
                        if (globals_1.Globals.CommandCenterSetting.type == dcc_1.CommandCenterTypes.DCCExSerial) {
                            const dserial = globals_1.Globals.CommandCenterSetting.commandCenter;
                            ccSerialPort.value = dserial.port.toString();
                            initTextAreaElement.value = dserial.init;
                        }
                        else {
                            ccSerialPort.value = "";
                        }
                        // turnoutActiveTime.value = dtcp.turnoutActiveTime
                        // baActiveTime.value = dtcp.basicAccessoryDecoderActiveTime
                        break;
                }
                label2.visible = label3.visible = ccIp.visible = ccPort.visible =
                    (sender.value == dcc_1.CommandCenterTypes.Z21.toString() || sender.value == dcc_1.CommandCenterTypes.DCCExTCP.toString());
                label4.visible = ccSerialPort.visible = sender.value == dcc_1.CommandCenterTypes.DCCExSerial.toString();
                dccExPanel.visible = (sender.value == dcc_1.CommandCenterTypes.DCCExTCP.toString() || sender.value == dcc_1.CommandCenterTypes.DCCExSerial.toString());
                label5.visible =
                    turnoutActiveTime.visible =
                        label6.visible =
                            baActiveTime.visible =
                                sender.value == dcc_1.CommandCenterTypes.Z21.toString();
            };
            tab1.addComponent(ccCombobox);
            const label2 = new dialog_1.Label("Ip Address");
            tab1.addComponent(label2);
            const ccIp = new dialog_1.Input("");
            ccIp.onchange = (sender) => {
                //Globals.Settings.CommandCenter.ip = sender.value
            };
            tab1.addComponent(ccIp);
            const label3 = new dialog_1.Label("Port");
            tab1.addComponent(label3);
            const ccPort = new dialog_1.Input("");
            ccPort.onchange = (sender) => {
                //Globals.Settings.CommandCenter.port = parseInt(sender.value)
            };
            tab1.addComponent(ccPort);
            const label4 = new dialog_1.Label("Serial Port");
            tab1.addComponent(label4);
            const ccSerialPort = new dialog_1.Input("");
            ccSerialPort.onchange = (sender) => {
                //Globals.Settings.CommandCenter.serialPort = sender.value
            };
            tab1.addComponent(ccSerialPort);
            const label5 = new dialog_1.Label("Turnout Active Time [ms]");
            tab1.addComponent(label5);
            const turnoutActiveTime = new dialog_1.InputNumber();
            turnoutActiveTime.maxValue = 5000;
            turnoutActiveTime.value = 0;
            turnoutActiveTime.onchange = (sender) => {
                //Globals.CommandCenterSetting.commandCenter..turnoutActiveTime = sender.value
            };
            tab1.addComponent(turnoutActiveTime);
            const label6 = new dialog_1.Label("Accessory Active Time [ms]");
            tab1.addComponent(label6);
            const baActiveTime = new dialog_1.InputNumber();
            baActiveTime.maxValue = 5000;
            baActiveTime.value = 0;
            baActiveTime.onchange = (sender) => {
                //Globals.Settings.CommandCenter.basicAccessoryDecoderActiveTime = sender.value
            };
            tab1.addComponent(baActiveTime);
            const dccExPanel = new dialog_1.Panel();
            tab1.addComponent(dccExPanel);
            const initLabelElem = new dialog_1.Label("Init Devices (e.g: &lt;T 1 1&gt;&lt;Z 10 1&gt;)");
            dccExPanel.addComponent(initLabelElem);
            const initTextAreaElement = new dialog_1.TextArea("");
            dccExPanel.addComponent(initTextAreaElement);
            const initButtonElement = new dialog_1.Button("INIT");
            dccExPanel.addComponent(initButtonElement);
            initButtonElement.onclick = () => {
                ws_1.wsClient.send({ type: dcc_1.ApiCommands.writeDccExDirectCommand, data: { command: initTextAreaElement.value } });
            };
            const btnOk = new dialog_1.Button("OK");
            btnOk.onclick = () => {
                switch (ccCombobox.value) {
                    case dcc_1.CommandCenterTypes.Z21.toString():
                        globals_1.Globals.CommandCenterSetting = {
                            type: dcc_1.CommandCenterTypes.Z21,
                            commandCenter: {
                                ip: ccIp.value,
                                port: parseInt(ccPort.value),
                                turnoutActiveTime: turnoutActiveTime.value,
                                basicAccessoryDecoderActiveTime: baActiveTime.value,
                            }
                        };
                        ws_1.wsClient.send({ type: dcc_1.ApiCommands.saveCommandCenter, data: globals_1.Globals.CommandCenterSetting });
                        break;
                    case dcc_1.CommandCenterTypes.DCCExTCP.toString():
                        globals_1.Globals.CommandCenterSetting = {
                            type: dcc_1.CommandCenterTypes.DCCExTCP,
                            commandCenter: {
                                ip: ccIp.value,
                                port: parseInt(ccPort.value),
                                init: initTextAreaElement.value,
                            }
                        };
                        ws_1.wsClient.send({ type: dcc_1.ApiCommands.saveCommandCenter, data: globals_1.Globals.CommandCenterSetting });
                        break;
                    case dcc_1.CommandCenterTypes.DCCExSerial.toString():
                        globals_1.Globals.CommandCenterSetting = {
                            type: dcc_1.CommandCenterTypes.DCCExSerial,
                            commandCenter: {
                                port: ccSerialPort.value,
                                init: initTextAreaElement.value,
                            }
                        };
                        ws_1.wsClient.send({ type: dcc_1.ApiCommands.saveCommandCenter, data: globals_1.Globals.CommandCenterSetting });
                        break;
                }
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
            ccCombobox.value = globals_1.Globals.CommandCenterSetting.type.toString();
        }
    }
    exports.CommandCenterSettingsDialog = CommandCenterSettingsDialog;
});
