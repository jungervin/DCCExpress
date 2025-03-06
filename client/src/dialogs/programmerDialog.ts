import { Button, Dialog, GroupBox, InputNumber, Label, Panel, TabControl } from "../controls/dialog";

export class ProgrammerDialog extends Dialog {

    constructor() {
        super(800, 600, "Programmer");

        const tabcontrol = new TabControl();
        this.addBody(tabcontrol);

        this.mkDCCPanel(tabcontrol);
        this.mkDigiToolsPanel(tabcontrol);

    }

    mkDCCPanel(tabcontrol: TabControl) {
        const tab =tabcontrol.addTab("DCC")
        
    }
    mkDigiToolsPanel(tabcontrol: TabControl) {
        const tab =tabcontrol.addTab("DigiTools")

        tab.addComponent(new Label('<h4 style="width:100%;text-align: center;background-color: yellow;padding:8px;border-radius:4px;border: solid 1px black">⚠️Is your device in programming mode?⚠️</h4>'));

        
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
}