define(["require", "exports", "../controls/dialog", "../helpers/ws", "../../../common/src/dcc", "../controls/toastManager"], function (require, exports, dialog_1, ws_1, dcc_1, toastManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProgrammerDialog = void 0;
    class ProgrammerDialog extends dialog_1.Dialog {
        constructor() {
            super(800, 740, "Programmer");
            this.writeBitElements = {};
            this.readBitElements = {};
            this.bodyElement.style.fontSize = "14px";
            const tabcontrol = new dialog_1.TabControl();
            this.addBody(tabcontrol);
            this.mkDCCPanel(tabcontrol);
            this.mkDigiToolsPanel(tabcontrol);
        }
        writeValidate() {
            var v = parseInt(this.writeValueInputElement.value);
            this.btnWriteElement.enabled = !Number.isNaN(v) && !Number.isNaN(this.writeCVInputElement.value);
            if (this.pomCheckboxElement.checked) {
                this.btnWriteElement.enabled = this.writeAddressElement.value > 0;
            }
        }
        mkDCCPanel(tabcontrol) {
            const html = `
<p style="width:100%;text-align: center;background-color: yellow;padding:4px;border-radius:4px;border: solid 1px black">'        
⚠️The locomotive should be on the programming track!⚠️<br>
⚠️The buttons will activate the PROG output.⚠️<br>
For now, it only works on DCC-EX v5.4!        
</p>
        `;
            const tab = tabcontrol.addTab("DCC");
            tab.addComponent(new dialog_1.Label(html));
            const help = '<p style="font-size:14px"><a href="https://www.nmra.org/sites/default/files/standards/sandrp/Draft/DCC/s-9.2.2_configuration_variables_for_dcc_draft.pdf" target="blank">🚂NMRA Standard CV List🚀</a></p>';
            tab.addComponent(new dialog_1.Label(help));
            this.pomCheckboxElement = new dialog_1.Checkbox(" <b>Write Configuration Variable on main track (POM)<b>");
            tab.addComponent(this.pomCheckboxElement);
            this.pomCheckboxElement.onchange = () => {
                readGroupBoxElement.getElement().style.display = this.pomCheckboxElement.checked ? "none" : "block";
                labelAddressElement.getElement().style.display = !this.pomCheckboxElement.checked ? "none" : "block";
                this.writeAddressElement.getElement().style.display = !this.pomCheckboxElement.checked ? "none" : "block";
                this.writeValidate();
            };
            const writeGroupBoxElement = new dialog_1.GroupBox("Write CV");
            tab.addComponent(writeGroupBoxElement);
            const labelAddressElement = new dialog_1.Label("Address");
            labelAddressElement.getElement().style.display = "none";
            writeGroupBoxElement.add(labelAddressElement);
            this.writeAddressElement = new dialog_1.InputNumber(0, 9999);
            this.writeAddressElement.getElement().style.display = "none";
            writeGroupBoxElement.add(this.writeAddressElement);
            this.writeAddressElement.onchange = (e) => {
                this.writeValidate();
            };
            this.writeAddressElement.getElement().onkeyup = (e) => {
                this.writeValidate();
            };
            writeGroupBoxElement.add(new dialog_1.Label("CV"));
            this.writeCVInputElement = new dialog_1.InputNumber(0, 9999);
            writeGroupBoxElement.add(this.writeCVInputElement);
            this.writeCVInputElement.onchange = (e) => {
                this.writeValidate();
            };
            this.writeCVInputElement.getElement().onkeyup = (e) => {
                this.writeValidate();
            };
            const valueLabel = new dialog_1.Label("Value: ");
            writeGroupBoxElement.add(valueLabel);
            this.writeValueInputElement = new dialog_1.Input("0");
            this.writeValueInputElement.getElement().onkeyup = () => {
                var vv = parseInt(this.writeValueInputElement.value);
                if (vv > 255) {
                    this.writeValueInputElement.value = '255';
                }
                else if (vv < 0) {
                    this.writeValueInputElement.value = '0';
                }
                for (var i = 0; i < 8; i++) {
                    this.writeBitElements[i].value = ((vv >> i) & 1) > 0;
                }
                //this.btnWriteElement!.enabled = !Number.isNaN(vv)
                this.writeValidate();
            };
            this.writeValueInputElement.onchange = (inp) => {
                this.writeValidate();
            };
            writeGroupBoxElement.add(this.writeValueInputElement);
            var dd = document.createElement('div');
            dd.style.display = "flex";
            dd.style.alignItems = "start";
            dd.style.gap = "1px";
            for (var i = 7; i >= 0; i--) {
                this.writeBitElements[i] = document.createElement("bit-element");
                this.writeBitElements[i].style.scale = "0.7";
                this.writeBitElements[i].onclick = (e) => {
                    var vv = 0;
                    var bit = e.target;
                    bit.value = !bit.value;
                    for (var i = 0; i < 8; i++) {
                        var bv = this.writeBitElements[i].value ? 1 : 0;
                        vv |= (bv << i);
                    }
                    this.writeValueInputElement.value = vv.toString();
                    this.writeValidate();
                };
                dd.appendChild(this.writeBitElements[i]);
            }
            writeGroupBoxElement.fieldset.appendChild(dd);
            this.btnWriteElement = new dialog_1.Button("Write");
            this.btnWriteElement.enabled = false;
            writeGroupBoxElement.add(this.btnWriteElement);
            this.btnWriteElement.onclick = () => {
                if (this.writeCVInputElement.value >= 0) {
                    readCVInputElement.value = -1;
                    readValueInputNumberElement.value = -1;
                    const cv = this.writeCVInputElement.value;
                    const value = parseInt(this.writeValueInputElement.value);
                    var err = "";
                    if (Number.isNaN(cv) || cv < 0) {
                        err += "Invalid value of Write CV !\n";
                    }
                    if (Number.isNaN(value) || value < 0 || value > 255) {
                        err += "Invalid value of Write value! (0..255)\n";
                    }
                    if (this.pomCheckboxElement.checked) {
                        const address = this.writeAddressElement.value;
                        if (Number.isNaN(address) || address < 0 || value > 9999) {
                            err += "Invalid value of Write value! (0..9999)\n";
                        }
                        if (err == "") {
                            ws_1.wsClient.send({ type: dcc_1.ApiCommands.writeDccExDirectCommand, data: { command: `<1 PROG><w ${address} ${cv} ${value}>` } });
                        }
                        else
                            alert(err);
                    }
                    else {
                        if (err == "") {
                            ws_1.wsClient.send({ type: dcc_1.ApiCommands.writeDccExDirectCommand, data: { command: `<1 PROG><W ${cv} ${value}>` } });
                        }
                        else
                            alert(err);
                    }
                }
            };
            const readGroupBoxElement = new dialog_1.GroupBox("Read CV");
            tab.addComponent(readGroupBoxElement);
            readGroupBoxElement.add(new dialog_1.Label("CV"));
            const readCVInputElement = new dialog_1.InputNumber(-1, 9999);
            readCVInputElement.value = 1;
            readGroupBoxElement.add(readCVInputElement);
            readGroupBoxElement.add(new dialog_1.Label("Value"));
            const readValueInputNumberElement = new dialog_1.InputNumber(-1, 255);
            readValueInputNumberElement.getElement().readOnly = true;
            readValueInputNumberElement.getElement().style.backgroundColor = "whitesmoke";
            readGroupBoxElement.add(readValueInputNumberElement);
            readValueInputNumberElement.onchange = ((inp) => {
                var vv = inp.value;
                for (var i = 0; i < 8; i++) {
                    this.readBitElements[i].value = ((vv >> i) & 1) > 0;
                }
            });
            var dd = document.createElement('div');
            readGroupBoxElement.fieldset.appendChild(dd);
            dd.style.display = "flex";
            dd.style.alignItems = "start";
            dd.style.gap = "1px";
            for (var i = 7; i >= 0; i--) {
                this.readBitElements[i] = document.createElement("bit-element");
                this.readBitElements[i].style.scale = "0.7";
                this.readBitElements[i].onclick = (e) => { };
                dd.appendChild(this.readBitElements[i]);
                this.readBitElements[i].style.cursor = "default";
            }
            const btnReadElement = new dialog_1.Button("Read");
            readGroupBoxElement.add(btnReadElement);
            btnReadElement.onclick = () => {
                if (readCVInputElement.value >= 0) {
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.writeDccExDirectCommand, data: { command: '<1 PROG><R ' + readCVInputElement.value + '>' } });
                }
            };
            window.directCommandResponse = (data) => {
                const params = data.response.split(" ");
                if (params.length > 1) {
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.writeDccExDirectCommand, data: { command: '<0 PROG>' } });
                    const cv = parseInt(params[1]);
                    const v = parseInt(params[2]);
                    if (v >= 0) {
                        readCVInputElement.value = cv;
                        readValueInputNumberElement.value = v;
                        toastManager_1.toastManager.showToast("👍CV read successful!", "success");
                        for (var i = 0; i < 8; i++) {
                            this.readBitElements[i].value = ((v >> i) & 1) > 0;
                        }
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
    }
    exports.ProgrammerDialog = ProgrammerDialog;
});
