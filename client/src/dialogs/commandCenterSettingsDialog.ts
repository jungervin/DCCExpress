import { SignalStates } from "../editor/signals";
import { Signal2CanvasElement } from "../components/canvasElement";
import { Checkbox, Dialog, Input, Button, InputNumber, DialogResult, TabControl, Combobox, Label, GroupBox, ThemeColors } from "../controls/dialog";
import { Dispatcher } from "../editor/dispatcher";

import { CommandCenterTypes } from "../../../common/src/dcc";
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



        {
            const label1 = new Label("Command Center")
            tab1.addComponent(label1)

            const ccCombobox = new Combobox([
                { label: "Select an option", value: "" },
                { label: "Z21", value: CommandCenterTypes.Z21.toString() },
                { label: "DCC-Ex TCP", value: CommandCenterTypes.DCCExTCP.toString() },
                { label: "DCC-Ex Serial", value: CommandCenterTypes.DCCExSerial.toString() },
            ]);
            ccCombobox.onchange = (sender) => {
                label2.visible = label3.visible = ccIp.visible = ccPort.visible = sender.value == CommandCenterTypes.Z21.toString() ||
                    sender.value == CommandCenterTypes.DCCExTCP.toString()
                label4.visible = ccSerialPort.visible = sender.value == CommandCenterTypes.DCCExSerial.toString()
            };
            tab1.addComponent(ccCombobox);

            const label2 = new Label("Ip Address")
            tab1.addComponent(label2)

            const ccIp = new Input(Globals.Settings?.CommandCenter?.ip)
            ccIp.onchange = (sender) => {
                Globals.Settings.CommandCenter.ip = sender.value
            }
            tab1.addComponent(ccIp)

            const label3 = new Label("Port")
            tab1.addComponent(label3)

            const ccPort = new Input(Globals.Settings.CommandCenter.port.toString())
            ccPort.onchange = (sender) => {
                Globals.Settings.CommandCenter.port = parseInt(sender.value)
            }
            tab1.addComponent(ccPort)
            
            const label4 = new Label("Serial Port")
            tab1.addComponent(label4)
            
            const ccSerialPort = new Input(Globals.Settings.CommandCenter.serialPort)
            ccSerialPort.onchange = (sender) => {
                Globals.Settings.CommandCenter.serialPort = sender.value
            }
            tab1.addComponent(ccSerialPort)

            ccCombobox.value = Globals.Settings.CommandCenter.type.toString()


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


        const btnOk = new Button("OK")
        btnOk.onclick = () => {
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

    }

    // signal(signal: any) {
    //     throw new Error("Method not implemented.");
    // }
}