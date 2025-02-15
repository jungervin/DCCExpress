define(["require", "exports", "../editor/signals", "../components/canvasElement", "../controls/dialog"], function (require, exports, signals_1, canvasElement_1, dialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dlgSignal4Select = exports.dlgSignal3Select = exports.dlgSignal2Select = void 0;
    class dlgSignal2Select extends dialog_1.Popup {
        constructor(signal) {
            super();
            this.signalGreen = new canvasElement_1.Signal2CanvasElement();
            this.signalGreen.signal.trackElem.visible = false;
            this.signalGreen.onclick = () => {
                this.hide();
                //signal.send(signal.valueGreen)
                signal.sendGreen();
            };
            this.signalGreen.signal.state = signals_1.SignalStates.green;
            this.addContent(this.signalGreen);
            this.signalRed = new canvasElement_1.Signal2CanvasElement();
            this.signalRed.signal.trackElem.visible = false;
            this.signalRed.signal.state = signals_1.SignalStates.red;
            this.signalRed.onclick = () => {
                this.hide();
                //signal.send(signal.valueRed)
                signal.sendRed();
            };
            this.addContent(this.signalRed);
        }
    }
    exports.dlgSignal2Select = dlgSignal2Select;
    class dlgSignal3Select extends dialog_1.Popup {
        constructor(signal) {
            super();
            this.signalGreen = new canvasElement_1.Signal3CanvasElement();
            this.signalGreen.signal.trackElem.visible = false;
            this.signalGreen.onclick = () => {
                this.hide();
                signal.sendGreen();
            };
            this.signalGreen.signal.state = signals_1.SignalStates.green;
            this.addContent(this.signalGreen);
            this.signalRed = new canvasElement_1.Signal3CanvasElement();
            this.signalRed.signal.trackElem.visible = false;
            this.signalRed.signal.state = signals_1.SignalStates.red;
            this.signalRed.onclick = () => {
                this.hide();
                signal.sendRed();
            };
            this.addContent(this.signalRed);
            this.signalYellow = new canvasElement_1.Signal3CanvasElement();
            this.signalYellow.signal.trackElem.visible = false;
            this.signalYellow.signal.state = signals_1.SignalStates.yellow;
            this.signalYellow.onclick = () => {
                this.hide();
                signal.sendYellow();
            };
            this.addContent(this.signalYellow);
        }
    }
    exports.dlgSignal3Select = dlgSignal3Select;
    class dlgSignal4Select extends dialog_1.Popup {
        constructor(signal) {
            super();
            this.signalGreen = new canvasElement_1.Signal4CanvasElement();
            this.signalGreen.signal.trackElem.visible = false;
            this.signalGreen.onclick = () => {
                this.hide();
                //signal.send(signal.valueGreen)
                signal.sendGreen();
            };
            this.signalGreen.signal.state = signals_1.SignalStates.green;
            this.addContent(this.signalGreen);
            this.signalRed = new canvasElement_1.Signal4CanvasElement();
            this.signalRed.signal.trackElem.visible = false;
            this.signalRed.signal.state = signals_1.SignalStates.red;
            this.signalRed.onclick = () => {
                this.hide();
                //signal.send(signal.valueRed)            
                signal.sendRed();
            };
            this.addContent(this.signalRed);
            this.signalYellow = new canvasElement_1.Signal4CanvasElement();
            this.signalYellow.signal.trackElem.visible = false;
            this.signalYellow.signal.state = signals_1.SignalStates.yellow;
            this.signalYellow.onclick = () => {
                this.hide();
                //signal.send(signal.valueYellow)
                signal.sendYellow();
            };
            this.addContent(this.signalYellow);
            this.signalWhite = new canvasElement_1.Signal4CanvasElement();
            this.signalWhite.signal.trackElem.visible = false;
            this.signalWhite.signal.state = signals_1.SignalStates.white;
            this.signalWhite.onclick = () => {
                this.hide();
                //signal.send(signal.valueWhite)
                signal.sendWhite();
            };
            this.addContent(this.signalWhite);
        }
    }
    exports.dlgSignal4Select = dlgSignal4Select;
});
