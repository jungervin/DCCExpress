import { send } from "process";

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
} as const;

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
} as const;

export const ThemeColors = {
    primary: Colors.blue,
    secondary: Grayscale.gray600,
    success: Colors.green,
    info: Colors.cyan,
    warning: Colors.yellow,
    danger: Colors.red,
    light: Grayscale.gray100,
    dark: Grayscale.gray900,
} as const;

export enum DialogResult {
    ok,
    cancel,
    yes,
    no
};

export class Popup {
    private popupElement: HTMLDivElement;
    private overlayElement: HTMLDivElement;
    x: number = 0;
    y: number = 0;

    constructor() {

        this.overlayElement = document.createElement("div");
        this.overlayElement.style.position = "fixed";
        this.overlayElement.style.top = "0";
        this.overlayElement.style.left = "0";
        this.overlayElement.style.width = "100%";
        this.overlayElement.style.height = "100%";
        this.overlayElement.style.backgroundColor = "rgba(0, 0, 0, 0.2)";


        this.popupElement = document.createElement("div");
        this.popupElement.style.position = "absolute";
        this.popupElement.style.backgroundColor = "white";
        this.popupElement.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        this.popupElement.style.border = "1px solid #ccc";
        this.popupElement.style.borderRadius = "8px";
        this.popupElement.style.padding = "6px 6px 0px 6px";
        this.popupElement.style.visibility = 'hidden'
        this.popupElement.style.display = "block"; 

        document.body.appendChild(this.overlayElement);
        document.body.appendChild(this.popupElement);

        this.overlayElement.onclick = ((e: MouseEvent) => {
            this.hide();
        });
    }

    setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
        var r = this.popupElement.getBoundingClientRect();
        x = x - r.width / 2
        y += 20
        this.popupElement.style.left = `${x}px`;
        this.popupElement.style.top = `${y}px`;
    }

    addContent(element: HTMLElement): void {
        this.popupElement.appendChild(element);
    }

    show(): void {
        this.popupElement.style.visibility = "visible";
    }

    hide(): void {
        this.overlayElement.remove();
        this.popupElement.remove();
    }
}

export class Dialog {
    dialogElement: HTMLDivElement;
    private headerElement: HTMLDivElement;
    bodyElement: HTMLDivElement;
    private footerElement: HTMLDivElement;
    private overlayElement: HTMLDivElement;
    public dialogResult: DialogResult = DialogResult.cancel
    public dialogResultText = "";
    onclose?: (sender: Dialog) => void;
    width: number;
    height: number;

    constructor(width: number, height: number, title: string) {

        this.width = width
        this.height = height
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
        this.dialogElement.id = "dialogElement"
        this.dialogElement.style.position = "fixed";
        this.dialogElement.style.top = "50%";
        this.dialogElement.style.left = "50%";
        this.dialogElement.style.transform = "translate(-50%, -50%)";
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
        this.bodyElement.id = "bodyElement"
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
        closeButton.style.top = "4px";
        closeButton.style.right = "8px";
        closeButton.style.border = "none";
        closeButton.style.background = "transparent";
        closeButton.style.fontSize = "20px";
        closeButton.style.fontWeight = "bold";
        closeButton.style.cursor = "pointer";
        closeButton.addEventListener("click", () => this.close());
        this.dialogElement.appendChild(closeButton);


        // const btnClose = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        // btnClose.setAttribute('d', "M19,3H16.3H7.7H5A2,2 0 0,0 3,5V7.7V16.4V19A2,2 0 0,0 5,21H7.7H16.4H19A2,2 0 0,0 21,19V16.3V7.7V5A2,2 0 0,0 19,3M15.6,17L12,13.4L8.4,17L7,15.6L10.6,12L7,8.4L8.4,7L12,10.6L15.6,7L17,8.4L13.4,12L17,15.6L15.6,17Z");

        // btnClose.setAttribute('viewbox', "0 0 24 24")
        // btnClose.setAttribute('fill', 'white')
        // btnClose.style.position = "absolute";
        // btnClose.style.top = "8px";
        // btnClose.style.right = "8px";
        // btnClose.style.border = "none";
        // // btnClose.style.background = "transparent";
        // btnClose.style.fontSize = "20px";
        // btnClose.style.cursor = "pointer";
        // btnClose.addEventListener("click", () => this.close());
        // this.dialogElement.appendChild(btnClose)



        document.body.appendChild(this.overlayElement);
        document.body.appendChild(this.dialogElement);

        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() == 'escape') {
                this.dialogResult = DialogResult.cancel
                this.close()
            }

            // Csak ha lesz defult button!
            // if (e.key.toLowerCase() == 'enter') {
            //     this.dialogResult = DialogResult.ok
            //     this.close()
            // }
        })
    }

    addBody(component: Component): void {
        this.bodyElement.appendChild(component.getElement());
    }

    addFooter(component: Component): void {
        this.footerElement.appendChild(component.getElement());
    }

    removeElementsAfter(referenceElement: HTMLElement) {
        const bodyChildren = Array.from(document.body.children);
        const startIndex = bodyChildren.indexOf(referenceElement);

        if (startIndex === -1) {
            console.warn("Reference element not found in body.");
            return;
        }

        for (let i = startIndex + 1; i < bodyChildren.length; i++) {
            document.body.removeChild(bodyChildren[i]);
        }
    }
    close(): void {
        if (this.onclose) {
            this.onclose(this)
        }

        this.removeElementsAfter(this.dialogElement)
        this.dialogElement.remove();
        this.overlayElement.remove();
    }
}

export interface Component {
    getElement(): HTMLElement;
}

export abstract class UIComponent implements Component{
    getElement(): HTMLElement {
        throw new Error("Method not implemented.");
    }
    
    //getElement(): HTMLElement 

    private _visible: boolean = true;
    public get visible(): boolean {
        return this._visible
    }
    public set visible(v: boolean) {
        this._visible = v
        this.getElement().style.display = v ? 'block' : 'none'
    }
}


export class Label extends UIComponent {
    label: HTMLLabelElement;
    constructor(text: string) {
        super()
        this.label = document.createElement("label");
        this.label.innerHTML = text;
        this.label.style.display = "block";
        this.label.style.marginBottom = "0px";
        // this.label.style.backgroundColor = "red"

    }

    getElement(): HTMLElement {
        return this.label;
    }

    addComponent(component: UIComponent): void {
        this.label.appendChild(component.getElement());
    }
    setText(text: string) {
        this.label.innerHTML = text;
    }
}

export class Input extends UIComponent {
    private input: HTMLInputElement;
    onchange?: (sender: Input) => void;

    constructor(text: string) {
        super();

        this.input = document.createElement("input");
        this.input.type = "text";
        this.input.style.width = "100%";
        this.input.style.padding = "4px";
        this.input.style.marginBottom = "8px";
        this.input.style.border = "1px solid #ccc";
        this.input.style.borderRadius = "4px";
        this.input.value = text

        this.input.addEventListener("input", () => {
            if (this.onchange) {
                this.onchange(this);
            }
        });
    }

    set value(val: string) {
        this.input.value = val;
    }

    get value(): string {
        return this.input.value;
    }

    getElement(): HTMLElement {
        return this.input;
    }
}

export class InputNumber extends UIComponent {
    private input: HTMLInputElement;
    onchange?: (sender: InputNumber) => void | undefined;

    constructor(min: number = 0, max: number = 100) {
        super()
        this.input = document.createElement("input");
        this.input.type = "number";
        this.input.style.width = "100%";
        this.input.style.padding = "4px";
        this.input.style.marginBottom = "8px";
        this.input.style.border = "1px solid #ccc";
        this.input.style.borderRadius = "4px";
        this.minValue = min
        this.maxValue = max

        this.input.addEventListener("change", () => {
            if (this.value < this.minValue) {
                this.value = this.minValue
            } else if (this.value > this.maxValue) {
                this.value = this.maxValue
            }

            if (this.onchange) {
                this.onchange(this);
            }
        });
    }

    set value(val: number) {
        if (val < this.minValue) {
            val = this.minValue
        } else if (val > this.maxValue) {
            val = this.maxValue
        }
        this.input.value = val.toString();
    }

    get value(): number {
        return parseInt(this.input.value);
    }

    get minValue(): number {
        var v = parseInt(this.input.getAttribute("min")!)
        return v
    }

    set minValue(v: number) {
        this.input.setAttribute("min", v.toString())
    }

    get maxValue(): number {
        var v = parseInt(this.input.getAttribute("max")!)
        return v
    }

    set maxValue(v: number) {
        this.input.setAttribute("max", v.toString())
    }

    getElement(): HTMLElement {
        return this.input;
    }
}

export class TextArea extends UIComponent {
    private textarea: HTMLTextAreaElement;
    onchange?: (sender: TextArea) => void;

    constructor(text: string) {
        super()

        this.textarea = document.createElement("textarea");
        this.textarea.style.width = "100%";
        this.textarea.style.height = "150px"; 
        this.textarea.style.padding = "4px";
        this.textarea.style.marginBottom = "8px";
        this.textarea.style.border = "1px solid #ccc";
        this.textarea.style.borderRadius = "4px";
        this.textarea.style.fontFamily = "monospace";

        this.textarea.addEventListener("keydown", (event) => {
            if (event.key === "Tab") {
                event.preventDefault(); 
                this.insertTab();
            }
        });

        this.textarea.addEventListener("input", () => {
            if (this.onchange) {
                this.onchange(this);
            }
        });

        this.textarea.value = text
    }

    set value(val: string) {
        this.textarea.value = val;
    }

    get value(): string {
        return this.textarea.value;
    }

    private insertTab() {
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;

        const value = this.textarea.value;
        this.textarea.value = value.substring(0, start) + "\t" + value.substring(end);

        this.textarea.selectionStart = this.textarea.selectionEnd = start + 1;
    }

    getElement(): HTMLElement {
        return this.textarea;
    }

    setHeight(h: string) {
        this.textarea.style.height = h;
    }
}

export class Button extends UIComponent {
    private button: HTMLButtonElement;
    onclick?: () => void;
    originalBackground: string;
    constructor(text: string) {
        super()
        this.button = document.createElement("button");
        this.button.textContent = text;
        this.button.style.padding = "4px 10px";
        this.button.style.border = "none";
        this.button.style.backgroundColor = "#007bff";
        this.button.style.backgroundColor = ThemeColors.primary;
        this.button.style.color = "white";
        this.button.style.borderRadius = "4px";
        this.button.style.cursor = "pointer";
        this.button.style.marginRight = "8px";
        this.button.style.opacity = "0.85"
        this.button.addEventListener("click", () => {
            if (this.onclick) {
                this.onclick();
            }
        });

        this.originalBackground = this.button.style.backgroundColor;
        this.button.addEventListener("mouseenter", () => {
            this.button.style.opacity = "1"
        });

        this.button.addEventListener("mouseleave", () => {
            this.button.style.backgroundColor = this.originalBackground;
            
            this.button.style.opacity = "0.85"
        });
    }



    private _foreground: string = Colors.black;
    public get foreground(): string {
        return this._foreground;
    }
    public set foreground(v: string) {
        this._foreground = v;
        this.button.style.color = v;
    }

    private _backround: string = "#007bff";
    public get backround(): string {
        return this._backround;
    }
    public set backround(v: string) {
        this._backround = v;
        this.button.style.backgroundColor = v;
        this.originalBackground = v;
    }

    
    private _enabled : boolean = true;
    public get enabled() : boolean {
        return this._enabled;
    }
    public set enabled(v : boolean) {
        this._enabled = v;
        this.button.disabled = !v
        this.backround = !v ? ThemeColors.secondary : ThemeColors.primary
    }
    

    getElement(): HTMLElement {
        return this.button;
    }
}

export class Checkbox extends UIComponent {
    private container: HTMLDivElement;
    private checkbox: HTMLInputElement;
    private label: HTMLLabelElement;
    onchange?: (sender: Checkbox) => void;
    constructor(labelText: string) {
        super();
        this.container = document.createElement("div");
        this.container.style.display = "flex";
        this.container.style.alignItems = "center";
        this.container.style.marginBottom = "8px";

        this.checkbox = document.createElement("input");
        this.checkbox.type = "checkbox";
        this.checkbox.style.marginRight = "8px";
        this.checkbox.style.cursor = 'pointer'

        this.checkbox.id = `checkbox-${Math.random().toString(36).substr(2, 9)}`;

        this.checkbox.addEventListener("change", () => {
            if (this.onchange) {
                this.onchange(this);
            }
        });

        this.label = document.createElement("label");
        this.label.innerHTML = labelText;
        this.label.setAttribute("for", this.checkbox.id)
        this.label.style.cursor = 'pointer'

        this.container.appendChild(this.checkbox);
        this.container.appendChild(this.label);
    }

    set checked(val: boolean) {
        this.checkbox.checked = val;
    }

    get checked(): boolean {
        return this.checkbox.checked;
    }

    getElement(): HTMLElement {
        return this.container;
    }
}

export class RadioGroup extends UIComponent {
    private container: HTMLDivElement;
    private radios: HTMLInputElement[] = [];
    private name: string;

    constructor(name: string) {
        super()
        this.name = name;
        this.container = document.createElement("div");
        this.container.style.marginBottom = "8px";

        this.container.style.border = 'solid 1px gainsboro'
        this.container.style.borderRadius = '5px'
    }

    addOption(labelText: string, value: string): void {
        const wrapper = document.createElement("div");
        wrapper.style.margin = '8px'
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.marginBottom = "8px";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = this.name;
        radio.value = value;
        radio.style.marginRight = "8px";
        radio.style.cursor = 'pointer'
        radio.id = `checkbox-${Math.random().toString(36).substr(2, 9)}`;

        const label = document.createElement("label");
        label.textContent = labelText;
        label.style.cursor = 'pointer'
        label.setAttribute("for", radio.id)

        wrapper.appendChild(radio);
        wrapper.appendChild(label);
        this.container.appendChild(wrapper);
        this.radios.push(radio);
    }

    get selectedValue(): string | null {
        const selected = this.radios.find((radio) => radio.checked);
        return selected ? selected.value : null;
    }

    getElement(): HTMLElement {
        return this.container;
    }
}

export class Combobox extends UIComponent {
    private select: HTMLSelectElement;

    onchange?: (sender: Combobox) => void;
    // container: HTMLDivElement;
    // label: HTMLLabelElement;

    constructor(options: { label: string; value: string }[]) {
        super();
        // this.container = document.createElement("div");
        // this.container.style.display = "flex";
        // this.container.style.alignItems = "center";
        // this.container.style.marginBottom = "0px";
        // this.container.style.backgroundColor = "red"

        // this.label = document.createElement("label");
        // this.label.textContent = labelText;
        // this.label.style.display = "block";
        // this.label.style.marginBottom = "8px";


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

        // this.label.appendChild(this.select)
        // this.container.appendChild(this.label)
    }

    set value(val: string) {
        this.select.value = val;
        if(this.onchange) {
            this.onchange(this)
        }
    }

    get value(): string {
        return this.select.value;
    }

    getElement(): HTMLElement {
        return this.select;
    }
}

export class GroupBox extends UIComponent {
    public container: HTMLDivElement;
    private legend: HTMLLegendElement;
    public fieldset: HTMLFieldSetElement;

    constructor(labelText: string) {
        super()
        this.container = document.createElement("div");
        this.container.style.marginBottom = "8px";

        this.fieldset = document.createElement("fieldset");
        this.fieldset.style.border = "1px solid #ccc";
        this.fieldset.style.borderRadius = "4px";
        this.fieldset.style.padding = "8px";

        this.legend = document.createElement("legend");
        this.legend.textContent = labelText;
        this.legend.style.fontSize = '1em'
        this.legend.style.fontWeight = "bold";

        this.fieldset.appendChild(this.legend);
        this.container.appendChild(this.fieldset);
    }

    add(component: Component): void {
        this.fieldset.appendChild(component.getElement());
    }

    getElement(): HTMLElement {
        return this.container;
    }
}

export class Table extends UIComponent {
    private table: HTMLTableElement;
    private thead: HTMLTableSectionElement;
    private tbody: HTMLTableSectionElement;

    constructor(headers: string[]) {
        super()
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

    addRow(values: string[]): void {
        const row = this.tbody.insertRow();
        values.forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            td.style.border = "1px solid #ccc";
            td.style.padding = "8px";
            row.appendChild(td);
        });
    }

    getElement(): HTMLElement {
        return this.table;
    }
}

export class Panel extends UIComponent {
    private panelElement: HTMLDivElement;

    constructor() {
        super()
        this.panelElement = document.createElement("div");
        //this.panelElement.style.display = "flex";
        this.panelElement.style.height = "100%";

    }

    getElement(): HTMLDivElement {
        return this.panelElement;
    }

    addComponent(component: UIComponent): void {
        this.panelElement.appendChild(component.getElement());
    }
}

export class TabControl extends UIComponent{
    private container: HTMLDivElement;
    private tabHeader: HTMLDivElement;
    private tabContent: HTMLDivElement;
    private tabs: Map<string, Panel> = new Map();
    private activeTab?: string;

    constructor() {
        super()
        this.container = document.createElement("div");
        this.container.style.display = "flex";
        this.container.style.flexDirection = "column";
        //this.container.style.height = "100%";

        this.tabHeader = document.createElement("div");
        this.tabHeader.style.display = "flex";
        this.tabHeader.style.borderBottom = "1px solid #ccc";
        this.tabHeader.style.gap = "2px";

        this.tabContent = document.createElement("div");
        this.tabContent.style.flex = "1";
        this.tabContent.style.padding = "8px";
        this.tabContent.style.height = "100%";
        this.tabContent.style.overflow = "auto";

        this.container.appendChild(this.tabHeader);
        this.container.appendChild(this.tabContent);
    }

    getElement(): HTMLDivElement {
        return this.container;
    }

    addTab(title: string): Panel {
        const panel = new Panel();
        panel.visible = false;
        this.tabs.set(title, panel);

        const tabButton = document.createElement("button");
        tabButton.textContent = title;
        tabButton.style.border = "none";
        tabButton.style.background = "#f1f1f1";
        tabButton.style.padding = "4px 10px";
        //tabButton.style.minWidth = '72px'
        tabButton.style.cursor = "pointer";
        tabButton.style.borderTopLeftRadius = "6px";
        tabButton.style.borderTopRightRadius = "6px";
        tabButton.style.borderTop = "2px solid darkgray";
        tabButton.addEventListener("click", () => this.activateTab(title));

        this.tabHeader.appendChild(tabButton);
        this.tabContent.appendChild(panel.getElement());

        if (!this.activeTab) {
            this.activateTab(title);
        }

        return panel;
    }

    activateTab(title: string): void {
        if (this.activeTab && this.tabs.has(this.activeTab)) {
            const prevTab = this.tabs.get(this.activeTab)!;
            prevTab.visible = false;
            (this.tabHeader.children as HTMLCollectionOf<HTMLButtonElement>)[Array.from(this.tabs.keys()).indexOf(this.activeTab)].style.borderTop = "2px solid darkgray";
        }
        this.activeTab = title;
        this.tabs.get(title)!.visible = true;
        (this.tabHeader.children as HTMLCollectionOf<HTMLButtonElement>)[Array.from(this.tabs.keys()).indexOf(title)].style.borderTop = "4px solid " + Colors.blue;
    }
}