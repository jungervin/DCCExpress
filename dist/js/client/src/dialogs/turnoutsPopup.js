define(["require", "exports", "../controls/dialog", "../components/canvasElement"], function (require, exports, dialog_1, canvasElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.turnoutDoublePopup = void 0;
    class turnoutDoublePopup extends dialog_1.Popup {
        constructor(turnout) {
            super();
            this.turnout = turnout;
            const t1 = new canvasElement_1.TurnoutDoubleCanvasElement();
            t1.initFrom(turnout, true, false);
            t1.onclick = () => {
                this.turnout.t1Closed = true;
                this.turnout.t2Closed = false;
                this.turnout.send();
                this.hide();
                // window.dispatchEvent(propertiesChangedEvent)
                window.invalidate();
            };
            this.addContent(t1);
            const t2 = new canvasElement_1.TurnoutDoubleCanvasElement();
            t2.initFrom(turnout, true, true);
            t2.onclick = () => {
                this.turnout.t1Closed = true;
                this.turnout.t2Closed = true;
                this.turnout.send();
                this.hide();
                window.invalidate();
            };
            this.addContent(t2);
            const t3 = new canvasElement_1.TurnoutDoubleCanvasElement();
            t3.initFrom(turnout, false, true);
            t3.onclick = () => {
                this.turnout.t1Closed = false;
                this.turnout.t2Closed = true;
                this.turnout.send();
                this.hide();
                window.invalidate();
            };
            this.addContent(t3);
            const t4 = new canvasElement_1.TurnoutDoubleCanvasElement();
            t4.initFrom(turnout, false, false);
            t4.onclick = () => {
                this.turnout.t1Closed = false;
                this.turnout.t2Closed = false;
                this.turnout.send();
                this.hide();
                window.invalidate();
            };
            this.addContent(t4);
        }
    }
    exports.turnoutDoublePopup = turnoutDoublePopup;
});
