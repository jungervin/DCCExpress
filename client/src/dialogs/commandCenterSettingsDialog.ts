import { SignalStates } from "../editor/signals";
import { Signal2CanvasElement } from "../components/canvasElement";
import { Checkbox, Dialog, Input, Button, InputNumber, DialogResult, TabControl, Combobox, Label, GroupBox, ThemeColors } from "../controls/dialog";
import { Dispatcher } from "../editor/dispatcher";

import { CommandCenterTypes, FileNames, iCommandCenter, iDCCExSerial, iDCCExTcp, iZ21CommandCenter } from "../../../common/src/dcc";
import { Globals } from "../helpers/globals";

export class CommandCenterSettingsDialog extends Dialog {
    constructor() {
        super(800, 600, "Command Center Settings")

        const tabControl = new TabControl();

        const tab1 = tabControl.addTab("Command Center");
        //tab1.getElement().innerHTML = "<h6>App settings<h6>";

        // const tab2 = tabControl.addTab("Command Center");
        // tab2.getElement().innerHTML = "<h6>Command Center Settings<h6>";

        this.addBody(tabControl);


        const label1 = new Label("Command Center")
        tab1.addComponent(label1)

        const ccCombobox = new Combobox([
            { label: "Select an option", value: "" },
            { label: "Z21", value: CommandCenterTypes.Z21.toString() },
            { label: "DCC-Ex TCP", value: CommandCenterTypes.DCCExTCP.toString() },
            { label: "DCC-Ex Serial", value: CommandCenterTypes.DCCExSerial.toString() },
        ]);
        ccCombobox.onchange = (sender) => {

            switch (sender.value) {
                case CommandCenterTypes.Z21.toString():
                    if (Globals.CommandCenterSetting.type == CommandCenterTypes.Z21) {
                        const z21 = Globals.CommandCenterSetting.commandCenter as iZ21CommandCenter
                        ccIp.value = z21.ip
                        ccPort.value = z21.port.toString()
                        turnoutActiveTime.value = z21.turnoutActiveTime
                        baActiveTime.value = z21.basicAccessoryDecoderActiveTime
                    }
                    else {
                        ccIp.value = "192.168.0.70"
                        ccPort.value ="21105"
                        turnoutActiveTime.value = 500
                        baActiveTime.value = 100
                    }
                    break;

                case CommandCenterTypes.DCCExTCP.toString():
                    if (Globals.CommandCenterSetting.type == CommandCenterTypes.DCCExTCP) {
                        const dtcp = Globals.CommandCenterSetting.commandCenter as iDCCExTcp
                        ccIp.value = dtcp.ip
                        ccPort.value = dtcp.port.toString()
                    } else {
                        ccIp.value = ""
                        ccPort.value = "2560"
                    }
                    // turnoutActiveTime.value = dtcp.turnoutActiveTime
                    // baActiveTime.value = dtcp.basicAccessoryDecoderActiveTime
                    break;
            }


            label2.visible = label3.visible = ccIp.visible = ccPort.visible = sender.value == CommandCenterTypes.Z21.toString() ||
                sender.value == CommandCenterTypes.DCCExTCP.toString()
            label4.visible = ccSerialPort.visible = sender.value == CommandCenterTypes.DCCExSerial.toString()
        };
        tab1.addComponent(ccCombobox);

        const label2 = new Label("Ip Address")
        tab1.addComponent(label2)

        const ccIp = new Input("")
        ccIp.onchange = (sender) => {
            //Globals.Settings.CommandCenter.ip = sender.value
        }
        tab1.addComponent(ccIp)

        const label3 = new Label("Port")
        tab1.addComponent(label3)

        const ccPort = new Input("")
        ccPort.onchange = (sender) => {
            //Globals.Settings.CommandCenter.port = parseInt(sender.value)
        }
        tab1.addComponent(ccPort)

        const label4 = new Label("Serial Port")
        tab1.addComponent(label4)

        const ccSerialPort = new Input("")
        ccSerialPort.onchange = (sender) => {
            //Globals.Settings.CommandCenter.serialPort = sender.value
        }
        tab1.addComponent(ccSerialPort)

        const label5 = new Label("Turnout Active Time [ms]")
        tab1.addComponent(label5)
        const turnoutActiveTime = new InputNumber()
        turnoutActiveTime.maxValue = 5000
        turnoutActiveTime.value = Globals.Settings.CommandCenter.turnoutActiveTime
        turnoutActiveTime.onchange = (sender) => {
            Globals.Settings.CommandCenter.turnoutActiveTime = sender.value
        }
        tab1.addComponent(turnoutActiveTime)

        const label6 = new Label("Accessory Active Time [ms]")
        tab1.addComponent(label6)
        const baActiveTime = new InputNumber()
        baActiveTime.maxValue = 5000
        baActiveTime.value = Globals.Settings.CommandCenter.basicAccessoryDecoderActiveTime
        baActiveTime.onchange = (sender) => {
            Globals.Settings.CommandCenter.basicAccessoryDecoderActiveTime = sender.value
        }
        tab1.addComponent(baActiveTime)



        const btnOk = new Button("OK")
        btnOk.onclick = () => {
            switch (ccCombobox.value) {
                case CommandCenterTypes.Z21.toString():
                    const z21 = {
                        type: CommandCenterTypes.Z21,
                        commandCenter: {
                            ip: ccIp.value,
                            port: parseInt(ccPort.value),
                            turnoutActiveTime: turnoutActiveTime.value,
                            basicAccessoryDecoderActiveTime: baActiveTime.value,
                        } as iZ21CommandCenter
                    } as iCommandCenter
                    Globals.saveJson(FileNames.CommandCenterSettings, z21)

                    break;

                case CommandCenterTypes.DCCExTCP.toString():
                    const dccextcp = {
                        type: CommandCenterTypes.DCCExTCP,
                        commandCenter: {
                            ip: ccIp.value,
                            port: parseInt(ccPort.value),
                            init: "",
                        } as iDCCExTcp
                    } as iCommandCenter
                    Globals.saveJson(FileNames.CommandCenterSettings, dccextcp)
                    break;

                case CommandCenterTypes.DCCExSerial.toString():
                    const dccexserial = {
                        type: CommandCenterTypes.DCCExSerial,
                        commandCenter: {
                            port: ccPort.value,
                        } as iDCCExSerial
                    } as iCommandCenter
                    Globals.saveJson(FileNames.CommandCenterSettings, dccexserial)
                    break;
            }

            this.dialogResult = DialogResult.ok

            this.close()
        }
        this.addFooter(btnOk)

        const btnCancel = new Button("CANCEL")
        btnCancel.backround = ThemeColors.secondary
        btnCancel.onclick = () => {
            this.dialogResult = DialogResult.cancel
            this.close()
        }

        this.addFooter(btnCancel)

        ccCombobox.value = Globals.CommandCenterSetting.type.toString()

    }
}