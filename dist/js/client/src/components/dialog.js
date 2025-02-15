define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Table = exports.GroupBox = exports.Combobox = exports.RadioGroup = exports.Checkbox = exports.Button = exports.InputNumber = exports.Input = exports.Dialog = exports.DialogResult = void 0;
    const Colors = {
        white: 'white',
        black: 'black',
        whitesmoke: 'whitesmoke',
        blue: "#0d6efd",
        indigo: "#6610f2",
        purple: "#6f42c1",
        pink: "#d63384",
        red: "#dc3545",
        orange: "#fd7e14",
        yellow: "#ffc107",
        green: "#198754",
        teal: "#20c997",
        cyan: "#0dcaf0",
    };
    const Grayscale = {
        white: "#fff",
        gray100: "#f8f9fa",
        gray200: "#e9ecef",
        gray300: "#dee2e6",
        gray400: "#ced4da",
        gray500: "#adb5bd",
        gray600: "#6c757d",
        gray700: "#495057",
        gray800: "#343a40",
        gray900: "#212529",
        black: "#000",
    };
    const ThemeColors = {
        primary: Colors.blue,
        secondary: Grayscale.gray600,
        success: Colors.green,
        info: Colors.cyan,
        warning: Colors.yellow,
        danger: Colors.red,
        light: Grayscale.gray100,
        dark: Grayscale.gray900,
    };
    var DialogResult;
    (function (DialogResult) {
        DialogResult[DialogResult["ok"] = 0] = "ok";
        DialogResult[DialogResult["cancel"] = 1] = "cancel";
        DialogResult[DialogResult["yes"] = 2] = "yes";
        DialogResult[DialogResult["no"] = 3] = "no";
    })(DialogResult || (exports.DialogResult = DialogResult = {}));
    ;
    class Dialog {
        constructor(width, height, title) {
            this.dialogResult = DialogResult.cancel;
            this.overlayElement = document.createElement("div");
            this.overlayElement.style.position = "fixed";
            this.overlayElement.style.top = "0";
            this.overlayElement.style.left = "0";
            this.overlayElement.style.width = "100%";
            this.overlayElement.style.height = "100%";
            this.overlayElement.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
            //this.overlayElement.style.zIndex = "999";
            // Dialógusablak fő elem
            this.dialogElement = document.createElement("div");
            this.dialogElement.style.position = "fixed";
            this.dialogElement.style.top = "50%";
            this.dialogElement.style.left = "50%";
            this.dialogElement.style.transform = "translate(-50%, -60%)";
            this.dialogElement.style.width = `${width}px`;
            this.dialogElement.style.height = `${height}px`;
            this.dialogElement.style.backgroundColor = "white";
            this.dialogElement.style.boxShadow = "0px 0px 16px rgba(0, 0, 0, 0.5)";
            this.dialogElement.style.borderRadius = "8px";
            this.dialogElement.style.display = "flex";
            this.dialogElement.style.flexDirection = "column";
            this.dialogElement.style.overflow = "hidden";
            //this.dialogElement.style.zIndex = "1000";
            // Fejléc rész
            this.headerElement = document.createElement("div");
            this.headerElement.style.padding = "8px";
            this.headerElement.style.fontSize = "18px";
            this.headerElement.style.fontWeight = "bold";
            this.headerElement.style.backgroundColor = "#f1f1f1";
            this.headerElement.style.borderBottom = "1px solid #ccc";
            this.headerElement.textContent = title;
            this.dialogElement.appendChild(this.headerElement);
            // Tartalom (body) rész
            this.bodyElement = document.createElement("div");
            this.bodyElement.style.flex = "1";
            this.bodyElement.style.padding = "8px";
            this.bodyElement.style.overflowY = "auto";
            this.dialogElement.appendChild(this.bodyElement);
            // Lábléc (footer) rész
            this.footerElement = document.createElement("div");
            this.footerElement.style.padding = "8px";
            this.footerElement.style.backgroundColor = "#f1f1f1";
            this.footerElement.style.borderTop = "1px solid #ccc";
            this.footerElement.style.display = "flex";
            this.footerElement.style.justifyContent = "flex-end";
            this.dialogElement.appendChild(this.footerElement);
            // Bezáró gomb
            const closeButton = document.createElement("button");
            closeButton.textContent = "×";
            closeButton.style.position = "absolute";
            closeButton.style.top = "8px";
            closeButton.style.right = "8px";
            closeButton.style.border = "none";
            closeButton.style.background = "transparent";
            closeButton.style.fontSize = "20px";
            closeButton.style.cursor = "pointer";
            closeButton.addEventListener("click", () => this.close());
            this.dialogElement.appendChild(closeButton);
            document.body.appendChild(this.overlayElement);
            document.body.appendChild(this.dialogElement);
            window.addEventListener('keydown', (e) => {
                if (e.key.toLowerCase() == 'escape') {
                    this.dialogResult = DialogResult.cancel;
                    this.close();
                }
                if (e.key.toLowerCase() == 'enter') {
                    this.dialogResult = DialogResult.ok;
                    this.close();
                }
            });
        }
        addBody(component) {
            this.bodyElement.appendChild(component.getElement());
        }
        addFooter(component) {
            this.footerElement.appendChild(component.getElement());
        }
        close() {
            if (this.onclose) {
                this.onclose(this);
            }
            this.dialogElement.remove();
            this.overlayElement.remove();
        }
    }
    exports.Dialog = Dialog;
    class Input {
        constructor(labelText) {
            this.label = document.createElement("label");
            this.label.textContent = labelText;
            this.label.style.display = "block";
            this.label.style.marginBottom = "8px";
            this.input = document.createElement("input");
            this.input.type = "text";
            this.input.style.width = "100%";
            this.input.style.padding = "4px";
            this.input.style.marginBottom = "8px";
            this.input.style.border = "1px solid #ccc";
            this.input.style.borderRadius = "4px";
            this.input.addEventListener("input", () => {
                if (this.onchange) {
                    this.onchange(this);
                }
            });
            this.label.appendChild(this.input);
        }
        set value(val) {
            this.input.value = val;
        }
        get value() {
            return this.input.value;
        }
        getElement() {
            return this.label;
        }
    }
    exports.Input = Input;
    class InputNumber {
        constructor(labelText) {
            this.label = document.createElement("label");
            this.label.textContent = labelText;
            this.label.style.display = "block";
            this.label.style.marginBottom = "8px";
            this.input = document.createElement("input");
            this.input.type = "number";
            this.input.style.width = "100%";
            this.input.style.padding = "4px";
            this.input.style.marginBottom = "8px";
            this.input.style.border = "1px solid #ccc";
            this.input.style.borderRadius = "4px";
            this.minValue = 0;
            this.maxValue = 100;
            this.input.addEventListener("change", () => {
                if (this.value < this.minValue) {
                    this.value = this.minValue;
                }
                else if (this.value > this.maxValue) {
                    this.value = this.maxValue;
                }
                if (this.onchange) {
                    this.onchange(this);
                }
            });
            this.label.appendChild(this.input);
        }
        set value(val) {
            if (val < this.minValue) {
                val = this.minValue;
            }
            else if (val > this.maxValue) {
                val = this.maxValue;
            }
            this.input.value = val.toString();
        }
        get value() {
            return parseInt(this.input.value);
        }
        get minValue() {
            var v = parseInt(this.input.getAttribute("min"));
            return v;
        }
        set minValue(v) {
            this.input.setAttribute("min", v.toString());
        }
        get maxValue() {
            var v = parseInt(this.input.getAttribute("max"));
            return v;
        }
        set maxValue(v) {
            this.input.setAttribute("max", v.toString());
        }
        getElement() {
            return this.label;
        }
    }
    exports.InputNumber = InputNumber;
    class Button {
        constructor(text) {
            this._foreground = Colors.black;
            this._backround = "#007bff";
            this.button = document.createElement("button");
            this.button.textContent = text;
            this.button.style.padding = "4px 10px";
            this.button.style.border = "none";
            this.button.style.backgroundColor = "#007bff";
            this.button.style.color = "white";
            this.button.style.borderRadius = "4px";
            this.button.style.cursor = "pointer";
            this.button.style.marginRight = "8px";
            this.button.addEventListener("click", () => {
                if (this.onclick) {
                    this.onclick();
                }
            });
        }
        get foreground() {
            return this._foreground;
        }
        set foreground(v) {
            this._foreground = v;
            this.button.style.color = v;
        }
        get backround() {
            return this._backround;
        }
        set backround(v) {
            this._backround = v;
            this.button.style.backgroundColor = v;
        }
        getElement() {
            return this.button;
        }
    }
    exports.Button = Button;
    class Checkbox {
        constructor(labelText) {
            this.container = document.createElement("div");
            this.container.style.display = "flex";
            this.container.style.alignItems = "center";
            this.container.style.marginBottom = "8px";
            this.checkbox = document.createElement("input");
            this.checkbox.type = "checkbox";
            this.checkbox.style.marginRight = "8px";
            this.checkbox.style.cursor = 'pointer';
            this.checkbox.id = `checkbox-${Math.random().toString(36).substr(2, 9)}`;
            this.checkbox.addEventListener("change", () => {
                if (this.onchange) {
                    this.onchange(this);
                }
            });
            this.label = document.createElement("label");
            this.label.textContent = labelText;
            this.label.setAttribute("for", this.checkbox.id);
            this.label.style.cursor = 'pointer';
            this.container.appendChild(this.checkbox);
            this.container.appendChild(this.label);
        }
        set checked(val) {
            this.checkbox.checked = val;
        }
        get checked() {
            return this.checkbox.checked;
        }
        getElement() {
            return this.container;
        }
    }
    exports.Checkbox = Checkbox;
    class RadioGroup {
        constructor(name) {
            this.radios = [];
            this.name = name;
            this.container = document.createElement("div");
            this.container.style.marginBottom = "8px";
            this.container.style.border = 'solid 1px gainsboro';
            this.container.style.borderRadius = '5px';
        }
        addOption(labelText, value) {
            const wrapper = document.createElement("div");
            wrapper.style.margin = '8px';
            wrapper.style.display = "flex";
            wrapper.style.alignItems = "center";
            wrapper.style.marginBottom = "8px";
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = this.name;
            radio.value = value;
            radio.style.marginRight = "8px";
            radio.style.cursor = 'pointer';
            radio.id = `checkbox-${Math.random().toString(36).substr(2, 9)}`;
            const label = document.createElement("label");
            label.textContent = labelText;
            label.style.cursor = 'pointer';
            label.setAttribute("for", radio.id);
            wrapper.appendChild(radio);
            wrapper.appendChild(label);
            this.container.appendChild(wrapper);
            this.radios.push(radio);
        }
        get selectedValue() {
            const selected = this.radios.find((radio) => radio.checked);
            return selected ? selected.value : null;
        }
        getElement() {
            return this.container;
        }
    }
    exports.RadioGroup = RadioGroup;
    class Combobox {
        constructor(options) {
            this.select = document.createElement("select");
            this.select.style.width = "100%";
            this.select.style.padding = "4px";
            this.select.style.marginBottom = "8px";
            this.select.style.border = "1px solid #ccc";
            this.select.style.borderRadius = "4px";
            options.forEach((option) => {
                const opt = document.createElement("option");
                opt.value = option.value;
                opt.textContent = option.label;
                this.select.appendChild(opt);
            });
            this.select.addEventListener("change", () => {
                if (this.onchange) {
                    this.onchange(this);
                }
            });
        }
        set value(val) {
            this.select.value = val;
        }
        get value() {
            return this.select.value;
        }
        getElement() {
            return this.select;
        }
    }
    exports.Combobox = Combobox;
    class GroupBox {
        constructor(labelText) {
            this.container = document.createElement("div");
            this.container.style.marginBottom = "8px";
            this.fieldset = document.createElement("fieldset");
            this.fieldset.style.border = "1px solid #ccc";
            this.fieldset.style.borderRadius = "4px";
            this.fieldset.style.padding = "8px";
            this.legend = document.createElement("legend");
            this.legend.textContent = labelText;
            this.legend.style.fontSize = '1em';
            // this.legend.style.fontWeight = "bold";
            this.fieldset.appendChild(this.legend);
            this.container.appendChild(this.fieldset);
        }
        add(component) {
            this.fieldset.appendChild(component.getElement());
        }
        getElement() {
            return this.container;
        }
    }
    exports.GroupBox = GroupBox;
    class Table {
        constructor(headers) {
            this.table = document.createElement("table");
            this.table.style.width = "100%";
            this.table.style.borderCollapse = "collapse";
            this.table.style.marginBottom = "16px";
            this.thead = this.table.createTHead();
            const headerRow = this.thead.insertRow();
            headers.forEach(headerText => {
                const th = document.createElement("th");
                th.textContent = headerText;
                th.style.border = "1px solid #ccc";
                th.style.padding = "8px";
                th.style.textAlign = "left";
                headerRow.appendChild(th);
            });
            this.tbody = this.table.createTBody();
        }
        addRow(values) {
            const row = this.tbody.insertRow();
            values.forEach(value => {
                const td = document.createElement("td");
                td.textContent = value;
                td.style.border = "1px solid #ccc";
                td.style.padding = "8px";
                row.appendChild(td);
            });
        }
        getElement() {
            return this.table;
        }
    }
    exports.Table = Table;
});
// // Példa a használatra
// const dialog = new Dialog(800, 600, "dialog");
// const table = new Table(["Egy", "Kettő"])
// table.addRow(["1", "2"])
// table.addRow(["3", "4"])
// dialog.addBody(table)
// const input = new Input("Enter your name:");
// input.value = "Hello";
// input.onchange = (self) => {
//     console.log("Input changed to:", self.value);
// };
// dialog.addBody(input);
// const checkbox = new Checkbox("Accept terms and conditions");
// checkbox.checked = false;
// checkbox.onchange = (self) => {
//     console.log("Checkbox state:", self.checked);
// };
// dialog.addBody(checkbox);
// const radioGroup = new RadioGroup("options1");
// radioGroup.addOption("Option 1", "1");
// radioGroup.addOption("Option 2", "2");
// radioGroup.addOption("Option 3", "3");
// dialog.addBody(radioGroup);
// const radioGroup2 = new RadioGroup("options2");
// radioGroup2.addOption("Option 1", "1");
// radioGroup2.addOption("Option 2", "2");
// radioGroup2.addOption("Option 3", "3");
// dialog.addBody(radioGroup2);
// const combobox = new Combobox([
//     { label: "Select an option", value: "" },
//     { label: "Option A", value: "A" },
//     { label: "Option B", value: "B" },
//     { label: "Option C", value: "C" },
// ]);
// combobox.onchange = (self) => {
//     console.log("Combobox selected value:", self.value);
// };
// dialog.addBody(combobox);
// const groupBox = new GroupBox("Additional Information");
// const groupInput = new Input("Additional Field:");
// groupInput.onchange = (self) => {
//     console.log("Group Input changed to:", self.value);
// };
// groupBox.add(groupInput);
// dialog.addBody(groupBox);
// const btnCancel = new Button("Cancel");
// btnCancel.backround = Colors.red;
// btnCancel.foreground = Colors.white;
// btnCancel.onclick = () => {
//     dialog.close();
// };
// dialog.addFooter(btnCancel);
// const button = new Button("OK");
// button.onclick = () => {
//     dialog.close();
// };
// dialog.addFooter(button);
// const dialog2 = new Dialog(400, 200, "dialog");
// const input2 = new Input("Enter your name:");
// input2.value = "Hello";
// input2.onchange = (self) => {
//     console.log("Input changed to:", self.value);
// };
// dialog2.addBody(input2);
// const button2 = new Button("OK");
// button2.onclick = () => {
//     console.log(
//         "Button clicked with input value:",
//         input.value,
//         "checkbox state:",
//         checkbox.checked,
//         "radio selected value:",
//         radioGroup.selectedValue,
//         "combobox value:",
//         combobox.value
//     );
//     dialog2.close();
// };
// dialog2.addFooter(button2);
