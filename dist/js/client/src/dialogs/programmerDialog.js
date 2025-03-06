define(["require", "exports", "../controls/dialog", "../helpers/ws", "../../../common/src/dcc", "../controls/toastManager"], function (require, exports, dialog_1, ws_1, dcc_1, toastManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProgrammerDialog = void 0;
    class ProgrammerDialog extends dialog_1.Dialog {
        constructor() {
            super(800, 660, "Programmer");
            this.bodyElement.style.fontSize = "12px";
            const tabcontrol = new dialog_1.TabControl();
            this.addBody(tabcontrol);
            this.mkDCCPanel(tabcontrol);
            this.mkDigiToolsPanel(tabcontrol);
            // wsClient.send({ type: ApiCommands.setProgPower, data: { on: true } as iPowerInfo });
            // this.onclose = () => {
            //     wsClient.send({ type: ApiCommands.setProgPower, data: { on: false } as iPowerInfo });
            // }
        }
        mkDCCPanel(tabcontrol) {
            const html = `
<p style="width:100%;text-align: center;background-color: yellow;padding:4px;border-radius:4px;border: solid 1px black">'        
⚠️The locomotive should be on the programming track!⚠️<br>
⚠️The buttons activate the PROG output.⚠️<br>
For now, it only works on DCC-EX!        
</p>
        `;
            const tab = tabcontrol.addTab("DCC");
            tab.addComponent(new dialog_1.Label(html));
            const panel = new dialog_1.GroupBox("Write CV");
            tab.addComponent(panel);
            panel.add(new dialog_1.Label("CV"));
            const cv = new dialog_1.InputNumber(0, 9999);
            panel.add(cv);
            panel.add(new dialog_1.Label("Value"));
            const value = new dialog_1.InputNumber(0, 255);
            panel.add(value);
            const writeCV = new dialog_1.Button("Write CV");
            panel.add(writeCV);
            writeCV.onclick = () => {
                if (cv.value >= 0) {
                    readCV.value = -1;
                    readValue.value = -1;
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.writeDccExDirectCommand, data: { command: '<1 PROG><W ' + cv.value + ' ' + value.value + '>' } });
                }
            };
            const readPanel = new dialog_1.GroupBox("Read CV");
            //panel.getElement().style.backgroundColor = "whitesmoke";
            tab.addComponent(readPanel);
            readPanel.add(new dialog_1.Label("CV"));
            const readCV = new dialog_1.InputNumber(-1, 9999);
            readCV.value = 1;
            readPanel.add(readCV);
            readPanel.add(new dialog_1.Label("Value"));
            const readValue = new dialog_1.InputNumber(-1, 255);
            readValue.getElement().readOnly = true;
            readValue.getElement().style.backgroundColor = "lightgray";
            readPanel.add(readValue);
            const readCV29 = new dialog_1.Button("Read CV");
            readPanel.add(readCV29);
            readCV29.onclick = () => {
                if (readCV.value >= 0) {
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.writeDccExDirectCommand, data: { command: '<1 PROG><R ' + readCV.value + '>' } });
                }
            };
            // const writeCV29 = new Button("Write CV29 9");
            // panel.add(writeCV29);
            // writeCV29.onclick = () => {
            //     wsClient.send({ type: ApiCommands.writeDccExDirectCommand, data: { command: '<W 29 9>' } as iDccExDirectCommand});
            // }
            window.directCommandResponse = (data) => {
                const params = data.response.split(" ");
                if (params.length > 1) {
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.writeDccExDirectCommand, data: { command: '<0 PROG>' } });
                    const cv = parseInt(params[1]);
                    const v = parseInt(params[2]);
                    if (v >= 0) {
                        readCV.value = cv;
                        readValue.value = v;
                        toastManager_1.toastManager.showToast("👍CV read successful!", "success");
                    }
                    else {
                        toastManager_1.toastManager.showToast("⚠️CV read failed!", "error");
                    }
                }
            };
        }
        mkDigiToolsPanel(tabcontrol) {
            const tab = tabcontrol.addTab("DigiTools");
            tab.addComponent(new dialog_1.Label('<p style="width:100%;text-align: center;background-color: yellow;padding:8px;border-radius:4px;border: solid 1px black">⚠️Is your device in programming mode?⚠️</p>'));
            const panel = new dialog_1.GroupBox("DigiSwitch");
            //panel.getElement().style.backgroundColor = "whitesmoke";
            tab.addComponent(panel);
            panel.add(new dialog_1.Label('Address or Switching time <a href="https://digitools.hu/termek/digiswitch-8/" target="blank">Manual</a>'));
            const address = new dialog_1.InputNumber(0, 9999);
            panel.add(address);
            const btnLeftSide = new dialog_1.Button("Set Left Side");
            panel.add(btnLeftSide);
            const btnRightSide = new dialog_1.Button("Set Right Side");
            panel.add(btnRightSide);
            const panel2 = new dialog_1.GroupBox("DigiSignal");
            //panel2.getElement().style.backgroundColor = "whitesmoke";
            tab.addComponent(panel2);
            panel2.add(new dialog_1.Label('Address  <a href="https://digitools.hu/termek/digisignal-x4yyy/" target="blank">Manual</a>'));
            const address2 = new dialog_1.InputNumber(0, 9999);
            panel2.add(address2);
            const btnLeftSide2 = new dialog_1.Button("Set Left Side");
            panel2.add(btnLeftSide2);
            const btnRightSide2 = new dialog_1.Button("Set Right Side");
            panel2.add(btnRightSide2);
        }
        process(data) {
            const params = data.response.split(" ");
            if (params.length > 1) {
                const cv = parseInt(params[1]);
                const value = parseInt(params[2]);
                console.log("CV", cv, "Value", value);
            }
        }
    }
    exports.ProgrammerDialog = ProgrammerDialog;
});
