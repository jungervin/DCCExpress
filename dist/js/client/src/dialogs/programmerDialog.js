define(["require", "exports", "../controls/dialog"], function (require, exports, dialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProgrammerDialog = void 0;
    class ProgrammerDialog extends dialog_1.Dialog {
        constructor() {
            super(800, 600, "Programmer");
            const tabcontrol = new dialog_1.TabControl();
            this.addBody(tabcontrol);
            this.mkDCCPanel(tabcontrol);
            this.mkDigiToolsPanel(tabcontrol);
        }
        mkDCCPanel(tabcontrol) {
            const tab = tabcontrol.addTab("DCC");
        }
        mkDigiToolsPanel(tabcontrol) {
            const tab = tabcontrol.addTab("DigiTools");
            tab.addComponent(new dialog_1.Label('<h4 style="width:100%;text-align: center;background-color: yellow;padding:8px;border-radius:4px;border: solid 1px black">⚠️Is your device in programming mode?⚠️</h4>'));
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
    }
    exports.ProgrammerDialog = ProgrammerDialog;
});
