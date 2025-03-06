import { Alert } from "bootstrap";
import { Button, Dialog, GroupBox, InputNumber, Label, Panel, TabControl } from "../controls/dialog";
import { wsClient } from "../helpers/ws";
import { ApiCommands, iDccExDirectCommand, iDccExDirectCommandResponse, iPowerInfo } from "../../../common/src/dcc";
import { read } from "fs";
import { toastManager } from "../controls/toastManager";

export class ProgrammerDialog extends Dialog {

    constructor() {
        super(800, 660, "Programmer");

        this.bodyElement.style.fontSize = "12px";
        const tabcontrol = new TabControl();
        this.addBody(tabcontrol);

        this.mkDCCPanel(tabcontrol);
        this.mkDigiToolsPanel(tabcontrol);


        // wsClient.send({ type: ApiCommands.setProgPower, data: { on: true } as iPowerInfo });
        // this.onclose = () => {
        //     wsClient.send({ type: ApiCommands.setProgPower, data: { on: false } as iPowerInfo });
        // }

    }

    mkDCCPanel(tabcontrol: TabControl) {

        const html = `
<p style="width:100%;text-align: center;background-color: yellow;padding:4px;border-radius:4px;border: solid 1px black">'        
⚠️The locomotive should be on the programming track!⚠️<br>
⚠️The buttons will activate the PROG output.⚠️<br>
For now, it only works on DCC-EX!        
</p>
        `
        const tab = tabcontrol.addTab("DCC")
        tab.addComponent(new Label(html));

        const help = '<p style="font-size:14px"><a href="https://www.nmra.org/sites/default/files/standards/sandrp/Draft/DCC/s-9.2.2_configuration_variables_for_dcc_draft.pdf" target="blank">🚂NMRA Standard CV List🚀</a></p>';
        tab.addComponent(new Label(help));

        const panel = new GroupBox("Write CV");
        tab.addComponent(panel);
        panel.add(new Label("CV"));
        const cv = new InputNumber(0, 9999);
        panel.add(cv);
        panel.add(new Label("Value"));
        const value = new InputNumber(0, 255);
        panel.add(value);
        const writeCV = new Button("Write CV");
        panel.add(writeCV);
        writeCV.onclick = () => {
            if (cv.value >= 0) {
                readCV.value = -1;
                readValue.value = -1;

                wsClient.send({ type: ApiCommands.writeDccExDirectCommand, data: { command: '<1 PROG><W ' + cv.value + ' ' + value.value + '>' } as iDccExDirectCommand });
            }
        }

        const readPanel = new GroupBox("Read CV");
        //panel.getElement().style.backgroundColor = "whitesmoke";
        tab.addComponent(readPanel);
        readPanel.add(new Label("CV"));
        const readCV = new InputNumber(-1, 9999);
        readCV.value = 1;
        readPanel.add(readCV);

        readPanel.add(new Label("Value"));
        const readValue = new InputNumber(-1, 255);

        (readValue.getElement() as HTMLInputElement).readOnly = true;
        (readValue.getElement() as HTMLInputElement).style.backgroundColor = "lightgray";
        readPanel.add(readValue);

        const readCV29 = new Button("Read CV");
        readPanel.add(readCV29);

        readCV29.onclick = () => {
            if (readCV.value >= 0) {
                wsClient.send({ type: ApiCommands.writeDccExDirectCommand, data: { command: '<1 PROG><R ' + readCV.value + '>' } as iDccExDirectCommand });
            }

        }

        // const writeCV29 = new Button("Write CV29 9");
        // panel.add(writeCV29);
        // writeCV29.onclick = () => {
        //     wsClient.send({ type: ApiCommands.writeDccExDirectCommand, data: { command: '<W 29 9>' } as iDccExDirectCommand});
        // }




        window.directCommandResponse = (data: iDccExDirectCommandResponse) => {
            const params = data.response.split(" ");
            if (params.length > 1) {
                wsClient.send({ type: ApiCommands.writeDccExDirectCommand, data: { command: '<0 PROG>' } as iDccExDirectCommand });
                const cv = parseInt(params[1]);
                const v = parseInt(params[2]);
                if (v >= 0) {
                    readCV.value = cv;
                    readValue.value = v;
                    toastManager.showToast("👍CV read successful!", "success");
                } else {
                    toastManager.showToast("⚠️CV read failed!", "error");
                }
            }
        }

    }
    mkDigiToolsPanel(tabcontrol: TabControl) {
        const tab = tabcontrol.addTab("DigiTools")

        tab.addComponent(new Label('<p style="width:100%;text-align: center;background-color: yellow;padding:8px;border-radius:4px;border: solid 1px black">⚠️Is your device in programming mode?⚠️</p>'));


        const panel = new GroupBox("DigiSwitch");
        //panel.getElement().style.backgroundColor = "whitesmoke";
        tab.addComponent(panel);

        panel.add(new Label('Address or Switching time <a href="https://digitools.hu/termek/digiswitch-8/" target="blank">Manual</a>'));
        const address = new InputNumber(0, 9999);
        panel.add(address);

        const btnLeftSide = new Button("Set Left Side");
        panel.add(btnLeftSide);
        const btnRightSide = new Button("Set Right Side");
        panel.add(btnRightSide);


        const panel2 = new GroupBox("DigiSignal");
        //panel2.getElement().style.backgroundColor = "whitesmoke";
        tab.addComponent(panel2);


        panel2.add(new Label('Address  <a href="https://digitools.hu/termek/digisignal-x4yyy/" target="blank">Manual</a>'));
        const address2 = new InputNumber(0, 9999);
        panel2.add(address2);

        const btnLeftSide2 = new Button("Set Left Side");
        panel2.add(btnLeftSide2);
        const btnRightSide2 = new Button("Set Right Side");
        panel2.add(btnRightSide2);

    }

    process(data: iDccExDirectCommandResponse) {
        const params = data.response.split(" ");
        if (params.length > 1) {
            const cv = parseInt(params[1]);
            const value = parseInt(params[2]);
            console.log("CV", cv, "Value", value);
        }
    }
}