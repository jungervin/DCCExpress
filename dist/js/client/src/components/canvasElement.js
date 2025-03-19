define(["require", "exports", "../helpers/graphics", "../editor/turnout", "../editor/track", "../editor/trackend", "../editor/corner", "../editor/curve", "../editor/signals", "../editor/route", "../editor/button", "../editor/sensor", "../editor/emergencyButton", "../editor/audioButton", "../editor/label", "../editor/block", "../editor/tree", "../editor/crossing", "../editor/schedulerButton"], function (require, exports, graphics_1, turnout_1, track_1, trackend_1, corner_1, curve_1, signals_1, route_1, button_1, sensor_1, emergencyButton_1, audioButton_1, label_1, block_1, tree_1, crossing_1, schedulerButton_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SchedulerButtonCanvasElement = exports.BlockCanvasElement = exports.TreeCanvasElement = exports.LabelCanvasElement = exports.SensorCanvasElement = exports.EmergencyButtonCanvasElement = exports.AudioButtonCanvasElement = exports.ButtonCanvasElement = exports.RouteSwitchCanvasElement = exports.Signal4CanvasElement = exports.Signal3CanvasElement = exports.Signal2CanvasElement = exports.TurnoutDoubleCanvasElement = exports.TurnoutYCanvasElement = exports.TurnoutRightCanvasElement = exports.TurnoutLeftCanvasElement = exports.TrackCrossingCanvasElement = exports.TrackCurveCanvasElement = exports.TrackCornerCanvasElement = exports.TrackEndCanvasElement = exports.TrackCanvasElement = exports.CanvasShapeElement = exports.CanvasElement = void 0;
    class CanvasElement extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = `
            <style>
                #canvas {
                    cursor: pointer
                }
            </style>
            <canvas id="canvas" width="60", height="60"><canvas>
        `;
            this.canvas = shadow.getElementById('canvas');
            this.ctx = this.canvas.getContext('2d');
            //this.draw()
        }
        draw() {
            this.ctx.reset();
            (0, graphics_1.drawRectangle)(this.ctx, 0, 0, 60, 60);
            this.ctx.translate(10, 10);
        }
    }
    exports.CanvasElement = CanvasElement;
    customElements.define("canvas-element", CanvasElement);
    class CanvasShapeElement extends CanvasElement {
        constructor() {
            super();
        }
        initFrom(shape) {
            this.shape = shape;
            this.shape.angle = shape.angle;
        }
        draw() {
            var _a;
            super.draw();
            (_a = this.shape) === null || _a === void 0 ? void 0 : _a.drawXy(0, 0, this.ctx);
        }
    }
    exports.CanvasShapeElement = CanvasShapeElement;
    customElements.define("canvas-shape-element", CanvasShapeElement);
    class TrackCanvasElement extends CanvasElement {
        constructor() {
            super();
            this.track = new track_1.TrackElement("", 0, 0, "");
            this.track.angle = 0;
            this.draw();
        }
        draw() {
            var _a;
            super.draw();
            (_a = this.track) === null || _a === void 0 ? void 0 : _a.draw(this.ctx);
        }
    }
    exports.TrackCanvasElement = TrackCanvasElement;
    customElements.define("track-canvas-element", TrackCanvasElement);
    class TrackEndCanvasElement extends CanvasElement {
        constructor() {
            super();
            this.track = new trackend_1.TrackEndElement("", 0, 0, "");
            this.track.angle = 0;
            this.draw();
        }
        draw() {
            var _a;
            super.draw();
            (_a = this.track) === null || _a === void 0 ? void 0 : _a.draw(this.ctx);
        }
    }
    exports.TrackEndCanvasElement = TrackEndCanvasElement;
    customElements.define("track-end-canvas-element", TrackEndCanvasElement);
    class TrackCornerCanvasElement extends CanvasElement {
        constructor() {
            super();
            this.track = new corner_1.TrackCornerElement("", 0, 0, "");
            this.track.angle = 0;
            this.draw();
        }
        draw() {
            var _a;
            super.draw();
            (_a = this.track) === null || _a === void 0 ? void 0 : _a.draw(this.ctx);
        }
    }
    exports.TrackCornerCanvasElement = TrackCornerCanvasElement;
    customElements.define("track-corner-canvas-element", TrackCornerCanvasElement);
    class TrackCurveCanvasElement extends CanvasElement {
        constructor() {
            super();
            this.track = new curve_1.TrackCurveElement("", 0, 0, "");
            this.track.angle = 0;
            this.draw();
        }
        draw() {
            var _a;
            super.draw();
            (_a = this.track) === null || _a === void 0 ? void 0 : _a.draw(this.ctx);
        }
    }
    exports.TrackCurveCanvasElement = TrackCurveCanvasElement;
    customElements.define("track-curve-canvas-element", TrackCurveCanvasElement);
    class TrackCrossingCanvasElement extends CanvasElement {
        constructor() {
            super();
            this.track = new crossing_1.TrackCrossingShapeElement("", 0, 0, "");
            this.track.angle = 0;
            this.draw();
        }
        draw() {
            var _a;
            super.draw();
            (_a = this.track) === null || _a === void 0 ? void 0 : _a.draw(this.ctx);
        }
    }
    exports.TrackCrossingCanvasElement = TrackCrossingCanvasElement;
    customElements.define("track-crossing-canvas-element", TrackCrossingCanvasElement);
    class TurnoutLeftCanvasElement extends CanvasElement {
        constructor() {
            super();
            this.turnout = new turnout_1.TurnoutLeftElement("", 0, 0, 0, "");
            this.turnout.angle = 0;
            this.draw();
        }
        initFrom(turnout, t1Closed) {
            //this.turnout!.cc = turnout.cc
            this.turnout.t1ClosedValue = turnout.t1ClosedValue;
            this.turnout.t1OpenValue = turnout.t1OpenValue;
            this.turnout.t1Closed = t1Closed;
            this.draw();
        }
        draw() {
            var _a;
            super.draw();
            (_a = this.turnout) === null || _a === void 0 ? void 0 : _a.draw(this.ctx);
        }
    }
    exports.TurnoutLeftCanvasElement = TurnoutLeftCanvasElement;
    customElements.define("turnout-left-canvas-element", TurnoutLeftCanvasElement);
    class TurnoutRightCanvasElement extends CanvasElement {
        constructor() {
            super();
            this.turnout = new turnout_1.TurnoutRightElement("", 0, 0, 0, "");
            this.turnout.angle = 0;
            this.draw();
        }
        initFrom(turnout, t1Closed) {
            // this.turnout!.cc = turnout.cc
            this.turnout.t1ClosedValue = turnout.t1ClosedValue;
            this.turnout.t1OpenValue = turnout.t1OpenValue;
            this.turnout.t1Closed = t1Closed;
            this.draw();
        }
        draw() {
            var _a;
            super.draw();
            (_a = this.turnout) === null || _a === void 0 ? void 0 : _a.draw(this.ctx);
        }
    }
    exports.TurnoutRightCanvasElement = TurnoutRightCanvasElement;
    customElements.define("turnout-right-canvas-element", TurnoutRightCanvasElement);
    class TurnoutYCanvasElement extends CanvasElement {
        constructor() {
            super();
            this.turnout = new turnout_1.TurnoutYShapeElement("", 0, 0, 0, "");
            this.turnout.angle = 0;
            this.draw();
        }
        initFrom(turnout, t1Closed) {
            // this.turnout!.cc = turnout.cc
            this.turnout.t1ClosedValue = turnout.t1ClosedValue;
            this.turnout.t1OpenValue = turnout.t1OpenValue;
            this.turnout.t1Closed = t1Closed;
            this.draw();
        }
        draw() {
            var _a;
            super.draw();
            (_a = this.turnout) === null || _a === void 0 ? void 0 : _a.draw(this.ctx);
        }
    }
    exports.TurnoutYCanvasElement = TurnoutYCanvasElement;
    customElements.define("turnout-y-canvas-element", TurnoutYCanvasElement);
    class TurnoutDoubleCanvasElement extends CanvasElement {
        constructor() {
            super();
            this.turnout = new turnout_1.TurnoutDoubleElement("", 0, 0, 0, 0, "");
            this.turnout.angle = 0;
            this.draw();
        }
        initFrom(turnout, t1Closed, t2Closed) {
            //this.turnout!.cc = turnout.cc
            this.turnout.t1ClosedValue = turnout.t1ClosedValue;
            this.turnout.t1OpenValue = turnout.t1OpenValue;
            this.turnout.t2ClosedValue = turnout.t2ClosedValue;
            this.turnout.t2OpenValue = turnout.t2OpenValue;
            this.turnout.t1Closed = t1Closed;
            this.turnout.t2Closed = t2Closed;
            this.turnout.angle = turnout.angle;
            this.draw();
        }
        draw() {
            var _a;
            super.draw();
            (_a = this.turnout) === null || _a === void 0 ? void 0 : _a.draw(this.ctx);
        }
    }
    exports.TurnoutDoubleCanvasElement = TurnoutDoubleCanvasElement;
    customElements.define("turnout-double-canvas-element", TurnoutDoubleCanvasElement);
    class Signal2CanvasElement extends CanvasElement {
        constructor() {
            super();
            this.signal = new signals_1.Signal2Element("", 0, 0, 0, "");
            this.signal.angle = 90;
        }
        draw() {
            var _a;
            super.draw();
            (_a = this.signal) === null || _a === void 0 ? void 0 : _a.draw(this.ctx);
        }
        connectedCallback() {
            this.signal.lightsAll = this.getAttribute('lightsAll') == 'true';
            this.draw();
        }
        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case 'lightsAll':
                    this.signal.lightsAll = newValue == 'true';
                    break;
            }
        }
        getElement() {
            return this;
        }
    }
    exports.Signal2CanvasElement = Signal2CanvasElement;
    Signal2CanvasElement.observedAttributes = ["lightsAll"];
    customElements.define("signal2-canvas-element", Signal2CanvasElement);
    class Signal3CanvasElement extends CanvasElement {
        constructor() {
            super();
            this.signal = new signals_1.Signal3Element("", 0, 0, 0, "");
            this.signal.aspect = 3;
            this.signal.angle = 90;
        }
        draw() {
            var _a;
            super.draw();
            (_a = this.signal) === null || _a === void 0 ? void 0 : _a.draw(this.ctx);
        }
        connectedCallback() {
            this.signal.lightsAll = this.getAttribute('lightsAll') == 'true';
            this.draw();
        }
        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case 'lightsAll':
                    this.signal.lightsAll = newValue == 'true';
                    break;
            }
        }
    }
    exports.Signal3CanvasElement = Signal3CanvasElement;
    Signal3CanvasElement.observedAttributes = ["lightsAll"];
    customElements.define("signal3-canvas-element", Signal3CanvasElement);
    class Signal4CanvasElement extends CanvasElement {
        constructor() {
            super();
            this.signal = new signals_1.Signal4Element("", 0, 0, 0, "");
            this.signal.aspect = 4;
            this.signal.angle = 90;
        }
        draw() {
            var _a;
            super.draw();
            (_a = this.signal) === null || _a === void 0 ? void 0 : _a.draw(this.ctx);
        }
        connectedCallback() {
            this.signal.lightsAll = this.getAttribute('lightsAll') == 'true';
            this.draw();
        }
        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case 'lightsAll':
                    this.signal.lightsAll = newValue == 'true';
                    break;
            }
        }
    }
    exports.Signal4CanvasElement = Signal4CanvasElement;
    Signal4CanvasElement.observedAttributes = ["lightsAll"];
    customElements.define("signal4-canvas-element", Signal4CanvasElement);
    class RouteSwitchCanvasElement extends CanvasElement {
        constructor() {
            super();
            this.route = new route_1.RouteSwitchElement("", 0, 0, "");
            this.route.angle = 0;
        }
        connectedCallback() {
            this.draw();
        }
        draw() {
            var _a;
            super.draw();
            (_a = this.route) === null || _a === void 0 ? void 0 : _a.draw(this.ctx);
        }
    }
    exports.RouteSwitchCanvasElement = RouteSwitchCanvasElement;
    customElements.define("route-switch-canvas-element", RouteSwitchCanvasElement);
    class ButtonCanvasElement extends CanvasElement {
        constructor() {
            super();
            this.button = new button_1.ButtonShapeElement("", 0, 0, 0, "");
            this.button.angle = 0;
        }
        connectedCallback() {
            this.draw();
        }
        draw() {
            super.draw();
            this.button.draw(this.ctx);
        }
    }
    exports.ButtonCanvasElement = ButtonCanvasElement;
    customElements.define("button-canvas-element", ButtonCanvasElement);
    class AudioButtonCanvasElement extends CanvasElement {
        constructor() {
            super();
            this.button = new audioButton_1.AudioButtonShapeElement("", 0, 0, "");
            this.button.angle = 0;
        }
        connectedCallback() {
            this.draw();
        }
        draw() {
            super.draw();
            this.button.draw(this.ctx);
        }
    }
    exports.AudioButtonCanvasElement = AudioButtonCanvasElement;
    customElements.define("audio-button-canvas-element", AudioButtonCanvasElement);
    class EmergencyButtonCanvasElement extends CanvasElement {
        constructor() {
            super();
            this.button = new emergencyButton_1.EmergencyButtonShapeElement("", 0, 0, "");
            this.button.angle = 0;
        }
        connectedCallback() {
            this.draw();
        }
        draw() {
            super.draw();
            this.button.draw(this.ctx);
        }
    }
    exports.EmergencyButtonCanvasElement = EmergencyButtonCanvasElement;
    customElements.define("emergency-button-canvas-element", EmergencyButtonCanvasElement);
    class SensorCanvasElement extends CanvasElement {
        constructor() {
            super();
            this.sensor = new sensor_1.SensorShapeElement("", 0, 0, 0, "");
            this.sensor.angle = 0;
        }
        connectedCallback() {
            this.draw();
        }
        draw() {
            super.draw();
            this.sensor.draw(this.ctx);
        }
    }
    exports.SensorCanvasElement = SensorCanvasElement;
    customElements.define("sensor-canvas-element", SensorCanvasElement);
    class LabelCanvasElement extends CanvasElement {
        constructor() {
            super();
            this.label = new label_1.Label2Element("", 0, 0, "");
            this.label.text = "LABEL";
            this.label.angle = 0;
        }
        connectedCallback() {
            this.draw();
        }
        draw() {
            super.draw();
            this.label.draw(this.ctx);
        }
    }
    exports.LabelCanvasElement = LabelCanvasElement;
    customElements.define("label-canvas-element", LabelCanvasElement);
    class TreeCanvasElement extends CanvasElement {
        constructor() {
            super();
            this.tree = new tree_1.TreeShapeElement("", 0, 0, "");
            this.tree.angle = 0;
        }
        connectedCallback() {
            this.draw();
        }
        draw() {
            super.draw();
            this.tree.draw(this.ctx);
        }
    }
    exports.TreeCanvasElement = TreeCanvasElement;
    customElements.define("tree-canvas-element", TreeCanvasElement);
    class BlockCanvasElement extends CanvasElement {
        constructor() {
            super();
            this.block = new block_1.BlockElement("", 0, 0, "");
            this.block.text = "LABEL";
            this.block.angle = 0;
        }
        connectedCallback() {
            this.draw();
        }
        draw() {
            super.draw();
            this.ctx.save();
            this.ctx.scale(0.5, 1);
            this.ctx.translate(20, 0);
            this.block.draw(this.ctx);
            this.ctx.restore();
        }
    }
    exports.BlockCanvasElement = BlockCanvasElement;
    customElements.define("block-canvas-element", BlockCanvasElement);
    class SchedulerButtonCanvasElement extends CanvasElement {
        constructor() {
            super();
            this.element = new schedulerButton_1.SchedulerButtonShapeElement("", 0, 0, "");
            this.element.angle = 0;
        }
        connectedCallback() {
            this.draw();
        }
        draw() {
            super.draw();
            this.element.draw(this.ctx);
        }
    }
    exports.SchedulerButtonCanvasElement = SchedulerButtonCanvasElement;
    customElements.define("scheduler-button-canvas-element", SchedulerButtonCanvasElement);
});
