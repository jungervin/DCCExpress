import { Signal3Element, Signal4Element, SignalStates } from "../editor/signals";
import { Signal2CanvasElement, Signal3CanvasElement, Signal4CanvasElement } from "../components/canvasElement";
import { Popup } from "../controls/dialog";
import { Signal2Element } from "../editor/signals";

export class dlgSignal2Select extends Popup {
    signalRed: Signal2CanvasElement;
    signalGreen: Signal2CanvasElement;
    constructor(signal: Signal2Element) {
        super()
        this.signalGreen = new Signal2CanvasElement()
        this.signalGreen.signal!.trackElem.visible = false
        this.signalGreen.onclick = () => {
            this.hide()
            //signal.send(signal.valueGreen)
            signal.sendGreen()
        }
        this.signalGreen.signal!.state = SignalStates.green
        this.addContent(this.signalGreen)

        this.signalRed = new Signal2CanvasElement()
        this.signalRed.signal!.trackElem.visible = false
        this.signalRed.signal!.state = SignalStates.red
        this.signalRed.onclick = () => {
            this.hide()
            //signal.send(signal.valueRed)
            signal.sendRed()
        }
        this.addContent(this.signalRed)
    }
}

export class dlgSignal3Select extends Popup {
    signalRed: Signal3CanvasElement;
    signalGreen: Signal3CanvasElement;
    signalYellow: Signal3CanvasElement;
    constructor(signal: Signal3Element) {
        super()
        this.signalGreen = new Signal3CanvasElement()
        this.signalGreen.signal!.trackElem.visible = false
        this.signalGreen.onclick = () => {
            this.hide()
            signal.sendGreen()
        }
        this.signalGreen.signal!.state = SignalStates.green
        this.addContent(this.signalGreen)

        this.signalRed = new Signal3CanvasElement()
        this.signalRed.signal!.trackElem.visible = false
        this.signalRed.signal!.state = SignalStates.red
        this.signalRed.onclick = () => {
            this.hide()
            signal.sendRed()
        }
        this.addContent(this.signalRed)

        this.signalYellow = new Signal3CanvasElement()
        this.signalYellow.signal!.trackElem.visible = false
        this.signalYellow.signal!.state = SignalStates.yellow
        this.signalYellow.onclick = () => {
            this.hide()
            signal.sendYellow()
        }
        this.addContent(this.signalYellow)

    }
}

export class dlgSignal4Select extends Popup {
    signalRed: Signal4CanvasElement;
    signalGreen: Signal4CanvasElement;
    signalYellow: Signal4CanvasElement;
    signalWhite: Signal4CanvasElement;
    constructor(signal: Signal4Element) {
        super()
        
        this.signalGreen = new Signal4CanvasElement()
        this.signalGreen.signal!.trackElem.visible = false
        this.signalGreen.onclick = () => {
            this.hide()
            //signal.send(signal.valueGreen)
            signal.sendGreen()
        }
        this.signalGreen.signal!.state = SignalStates.green
        this.addContent(this.signalGreen)

        this.signalRed = new Signal4CanvasElement()
        this.signalRed.signal!.trackElem.visible = false
        this.signalRed.signal!.state = SignalStates.red
        this.signalRed.onclick = () => {
            this.hide()
            //signal.send(signal.valueRed)            
            signal.sendRed()

        }
        this.addContent(this.signalRed)

        this.signalYellow = new Signal4CanvasElement()
        this.signalYellow.signal!.trackElem.visible = false
        this.signalYellow.signal!.state = SignalStates.yellow
        this.signalYellow.onclick = () => {
            this.hide()
            //signal.send(signal.valueYellow)
            signal.sendYellow()
        }
        this.addContent(this.signalYellow)

        this.signalWhite = new Signal4CanvasElement()
        this.signalWhite.signal!.trackElem.visible = false
        this.signalWhite.signal!.state = SignalStates.white
        this.signalWhite.onclick = () => {
            this.hide()
            //signal.send(signal.valueWhite)
            signal.sendWhite()
        }
        this.addContent(this.signalWhite)

    }
}