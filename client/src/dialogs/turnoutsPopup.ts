import { TurnoutDoubleElement } from "../editor/turnout";
import { Popup } from "../controls/dialog";
import { TurnoutDoubleCanvasElement } from "../components/canvasElement";
import { propertiesChangedEvent } from "../editor/view";

export class turnoutDoublePopup extends Popup {
    // t1: TurnoutDoubleCanvasElement;
    // t2: TurnoutDoubleCanvasElement;
    // t3: TurnoutDoubleCanvasElement;
    // t4: TurnoutDoubleCanvasElement;
    turnout: TurnoutDoubleElement;
    constructor(turnout: TurnoutDoubleElement) {
        super()
        this.turnout = turnout;
        const t1 = new TurnoutDoubleCanvasElement()
        t1.initFrom(turnout, true, false)
        t1.onclick = () => {
            this.turnout!.t1Closed = true
            this.turnout!.t2Closed = false
            this.turnout!.send()
            this.hide()
            // window.dispatchEvent(propertiesChangedEvent)
            window.invalidate()
        }
        this.addContent(t1)

        const t2 = new TurnoutDoubleCanvasElement()
        t2.initFrom(turnout, true, true)
        t2.onclick = () => {
            this.turnout!.t1Closed = true
            this.turnout!.t2Closed = true
            this.turnout!.send()
            this.hide()
            window.invalidate()
        }
        this.addContent(t2)

        const t3 = new TurnoutDoubleCanvasElement()
        t3.initFrom(turnout, false, true)
        t3.onclick = () => {
            this.turnout!.t1Closed = false
            this.turnout!.t2Closed = true
            this.turnout!.send()
            this.hide()
            window.invalidate()
        }
        this.addContent(t3)

        const t4 = new TurnoutDoubleCanvasElement()
        t4.initFrom(turnout, false, false)
        t4.onclick = () => {
            this.turnout!.t1Closed = false
            this.turnout!.t2Closed = false
            this.turnout!.send()
            this.hide()
            window.invalidate()
        }
        this.addContent(t4)
    }
}
