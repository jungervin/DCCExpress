import { Checkbox, Dialog, Button, InputNumber, DialogResult, TabControl, Label, GroupBox, ThemeColors } from "../controls/dialog";
import { Globals } from "../helpers/globals";

export class AppSettingsDialog extends Dialog {
    //gridSize: InputNumber;
    showAddress: Checkbox;
    // signalRed: Signal2CanvasElement;
    // signalGreen: Signal2CanvasElement;
    // intervalElement: InputNumber;
    showGrid: Checkbox;
    showClock: Checkbox;
    fastClockFactor: InputNumber;
    showSingleLamp: Checkbox;
    constructor() {
        super(800, 600, "Settings")

        const tabControl = new TabControl();

        const tab1 = tabControl.addTab("App");
        tab1.getElement().innerHTML = "<h6>App settings<h6>";

        this.addBody(tabControl);

        // const label0 = new Label("Dispatcher Interval Time")
        // tab1.addComponent(label0)

        // this.intervalElement = new InputNumber()
        // this.intervalElement.minValue = 100;
        // this.intervalElement.maxValue = 10000;
        // this.intervalElement.value = Globals.Settings.Dispacher.interval
        // tab1.addComponent(this.intervalElement)

        this.showGrid = new Checkbox("Show Grid")
        this.showGrid.checked = Globals.Settings.EditorSettings.ShowGrid
        tab1.addComponent(this.showGrid)

        this.showAddress = new Checkbox("Show Address")
        this.showAddress.checked = Globals.Settings.EditorSettings.ShowAddress
        tab1.addComponent(this.showAddress)

        this.showSingleLamp = new Checkbox("Display railway signals as single-lamp")
        this.showSingleLamp.checked = Globals.Settings.EditorSettings.DispalyAsSingleLamp
        tab1.addComponent(this.showSingleLamp)

        

        const fastClockGroup = new GroupBox("Fast Clock")
        tab1.addComponent(fastClockGroup)
        this.showClock = new Checkbox("Show Clock")
        this.showClock.checked = Globals.Settings.EditorSettings.ShowClock ?? false
        fastClockGroup.add(this.showClock)

        const label1 = new Label("Factor x(1..5)")
        fastClockGroup.add(label1)

        this.fastClockFactor = new InputNumber()
        this.fastClockFactor.minValue = 1
        this.fastClockFactor.maxValue = 5
        this.fastClockFactor.value = Globals.Settings.EditorSettings.fastClockFactor ?? 1
        fastClockGroup.add(this.fastClockFactor)
        
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