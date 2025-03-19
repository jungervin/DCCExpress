import { drawRectangle } from "../helpers/graphics";
import { TurnoutDoubleElement, TurnoutElement, TurnoutLeftElement, TurnoutRightElement, TurnoutYShapeElement } from "../editor/turnout";
import { View } from "../editor/view";
import { TrackElement } from "../editor/track";
import { TrackEndElement } from "../editor/trackend";
import { TrackCornerElement } from "../editor/corner";
import { TrackCurveElement } from "../editor/curve";
import { Signal2Element, Signal3Element, Signal4Element } from "../editor/signals";
import { RouteSwitchElement } from "../editor/route";
import { Component } from "../controls/dialog";
import { ButtonShapeElement } from "../editor/button";
import { SensorShapeElement } from "../editor/sensor";
import { EmergencyButtonShapeElement } from "../editor/emergencyButton";
import { AudioButtonShapeElement } from "../editor/audioButton";
import { Label2Element } from "../editor/label";
import { BlockElement } from "../editor/block";
import { TreeShapeElement } from "../editor/tree";
import { TrackCrossingShapeElement } from "../editor/crossing";
import { SchedulerButtonShapeElement } from "../editor/schedulerButton";

export class CanvasElement extends HTMLElement {
    ctx?: CanvasRenderingContext2D
    canvas: HTMLCanvasElement;
    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })
        shadow.innerHTML = `
            <style>
                #canvas {
                    cursor: pointer
                }
            </style>
            <canvas id="canvas" width="60", height="60"><canvas>
        `
        this.canvas = shadow.getElementById('canvas') as HTMLCanvasElement
        this.ctx = this.canvas.getContext('2d')!
        //this.draw()
    }

    draw() {
        this.ctx!.reset()
        drawRectangle(this.ctx!, 0, 0, 60, 60)
        this.ctx!.translate(10, 10)
    }
}

customElements.define("canvas-element", CanvasElement)

export class CanvasShapeElement extends CanvasElement {
    shape?: View;
    constructor() {
        super()
    }

    initFrom(shape: View) {
        this.shape = shape
        this.shape.angle = shape.angle
    }

    draw() {
        super.draw()
        this.shape?.drawXy(0, 0, this.ctx!)
    }
}
customElements.define("canvas-shape-element", CanvasShapeElement)

export class TrackCanvasElement extends CanvasElement {
    track?: TrackElement;
    constructor() {
        super()
        this.track = new TrackElement("", 0, 0, "")
        this.track.angle = 0
        this.draw()
    }

    draw() {
        super.draw()
        this.track?.draw(this.ctx!)
    }
}
customElements.define("track-canvas-element", TrackCanvasElement)

export class TrackEndCanvasElement extends CanvasElement {
    track?: TrackEndElement;
    constructor() {
        super()
        this.track = new TrackEndElement("", 0, 0, "")
        this.track.angle = 0
        this.draw()
    }

    draw() {
        super.draw()
        this.track?.draw(this.ctx!)
    }
}
customElements.define("track-end-canvas-element", TrackEndCanvasElement)

export class TrackCornerCanvasElement extends CanvasElement {
    track?: TrackCornerElement;
    constructor() {
        super()
        this.track = new TrackCornerElement("", 0, 0, "")
        this.track.angle = 0
        this.draw()
    }

    draw() {
        super.draw()
        this.track?.draw(this.ctx!)
    }
}
customElements.define("track-corner-canvas-element", TrackCornerCanvasElement)

export class TrackCurveCanvasElement extends CanvasElement {
    track?: TrackCurveElement;
    constructor() {
        super()
        this.track = new TrackCurveElement("", 0, 0, "")
        this.track.angle = 0
        this.draw()
    }

    draw() {
        super.draw()
        this.track?.draw(this.ctx!)
    }
}
customElements.define("track-curve-canvas-element", TrackCurveCanvasElement)

export class TrackCrossingCanvasElement extends CanvasElement {
    track?: TrackCrossingShapeElement;
    constructor() {
        super()
        this.track = new TrackCrossingShapeElement("", 0, 0, "")
        this.track.angle = 0
        this.draw()
    }

    draw() {
        super.draw()
        this.track?.draw(this.ctx!)
    }
}
customElements.define("track-crossing-canvas-element", TrackCrossingCanvasElement)


export class TurnoutLeftCanvasElement extends CanvasElement {
    turnout?: TurnoutElement;
    constructor() {
        super()
        this.turnout = new TurnoutLeftElement("", 0, 0, 0, "")
        this.turnout.angle = 0
        this.draw()
    }
    initFrom(turnout: TurnoutLeftElement, t1Closed: boolean) {
        //this.turnout!.cc = turnout.cc
        this.turnout!.t1ClosedValue = turnout.t1ClosedValue
        this.turnout!.t1OpenValue = turnout.t1OpenValue
        this.turnout!.t1Closed = t1Closed
        this.draw()
    }
    draw() {
        super.draw()
        this.turnout?.draw(this.ctx!)
    }
}
customElements.define("turnout-left-canvas-element", TurnoutLeftCanvasElement)


export class TurnoutRightCanvasElement extends CanvasElement {
    turnout?: TurnoutElement;
    constructor() {
        super()
        this.turnout = new TurnoutRightElement("", 0, 0, 0, "")
        this.turnout.angle = 0
        this.draw()
    }

    initFrom(turnout: TurnoutRightElement, t1Closed: boolean) {
       // this.turnout!.cc = turnout.cc
        this.turnout!.t1ClosedValue = turnout.t1ClosedValue
        this.turnout!.t1OpenValue = turnout.t1OpenValue
        this.turnout!.t1Closed = t1Closed
        this.draw()
    }


    draw() {
        super.draw()
        this.turnout?.draw(this.ctx!)
    }
}
customElements.define("turnout-right-canvas-element", TurnoutRightCanvasElement)


export class TurnoutYCanvasElement extends CanvasElement {
    turnout?: TurnoutElement;
    constructor() {
        super()
        this.turnout = new TurnoutYShapeElement("", 0, 0, 0, "")
        this.turnout.angle = 0
        this.draw()
    }

    initFrom(turnout: TurnoutYShapeElement, t1Closed: boolean) {
       // this.turnout!.cc = turnout.cc
        this.turnout!.t1ClosedValue = turnout.t1ClosedValue
        this.turnout!.t1OpenValue = turnout.t1OpenValue
        this.turnout!.t1Closed = t1Closed
        this.draw()
    }


    draw() {
        super.draw()
        this.turnout?.draw(this.ctx!)
    }
}
customElements.define("turnout-y-canvas-element", TurnoutYCanvasElement)

export class TurnoutDoubleCanvasElement extends CanvasElement {
    turnout?: TurnoutDoubleElement;
    constructor() {
        super()
        this.turnout = new TurnoutDoubleElement("", 0, 0, 0, 0, "")
        this.turnout.angle = 0
        this.draw()
    }

    initFrom(turnout: TurnoutDoubleElement, t1Closed: boolean, t2Closed: boolean) {
        //this.turnout!.cc = turnout.cc
        this.turnout!.t1ClosedValue = turnout.t1ClosedValue
        this.turnout!.t1OpenValue = turnout.t1OpenValue
        this.turnout!.t2ClosedValue = turnout.t2ClosedValue
        this.turnout!.t2OpenValue = turnout.t2OpenValue
        this.turnout!.t1Closed = t1Closed
        this.turnout!.t2Closed = t2Closed
        this.turnout!.angle = turnout.angle
        this.draw()
    }
    draw() {
        super.draw()
        this.turnout?.draw(this.ctx!)
    }
}
customElements.define("turnout-double-canvas-element", TurnoutDoubleCanvasElement)

export class Signal2CanvasElement extends CanvasElement implements Component {
    signal?: Signal2Element;
    constructor() {
        super()
        this.signal = new Signal2Element("", 0, 0, 0, "")
        this.signal.angle = 90
        
    }

    draw() {
        super.draw()
        this.signal?.draw(this.ctx!)
    }
    connectedCallback() {
        this.signal!.lightsAll = this.getAttribute('lightsAll') == 'true'
        this.draw()
    }
    static observedAttributes = ["lightsAll"];
    attributeChangedCallback(name: string, oldValue:string, newValue:string) {
        switch(name) {
            case 'lightsAll': this.signal!.lightsAll = newValue == 'true'
            break
        }
        
      }
      getElement(): HTMLElement {
        return this;
    }

}
customElements.define("signal2-canvas-element", Signal2CanvasElement)

export class Signal3CanvasElement extends CanvasElement {
    signal?: Signal3Element;
    constructor() {
        super()
        this.signal = new Signal3Element("", 0, 0, 0, "")
        this.signal.aspect = 3
        this.signal.angle = 90
    }

    draw() {
        super.draw()
        this.signal?.draw(this.ctx!)
    }

    connectedCallback() {
        this.signal!.lightsAll = this.getAttribute('lightsAll') == 'true'
        this.draw()
    }
    static observedAttributes = ["lightsAll"];
    attributeChangedCallback(name: string, oldValue:string, newValue:string) {
        switch(name) {
            case 'lightsAll': this.signal!.lightsAll = newValue == 'true'
            break
        }
        
      }

}
customElements.define("signal3-canvas-element", Signal3CanvasElement)

export class Signal4CanvasElement extends CanvasElement {
    signal?: Signal4Element;
    constructor() {
        super()
        this.signal = new Signal4Element("", 0, 0, 0, "")
        this.signal.aspect = 4
        this.signal.angle = 90
        
    }

    draw() {
        super.draw()
        this.signal?.draw(this.ctx!)
    }

    connectedCallback() {
        this.signal!.lightsAll = this.getAttribute('lightsAll') == 'true'
        this.draw()
    }
    static observedAttributes = ["lightsAll"];
    attributeChangedCallback(name: string, oldValue:string, newValue:string) {
        switch(name) {
            case 'lightsAll': this.signal!.lightsAll = newValue == 'true'
            break
        }
        
      }

}
customElements.define("signal4-canvas-element", Signal4CanvasElement)

export class RouteSwitchCanvasElement extends CanvasElement {
    route?: RouteSwitchElement;
    constructor() {
        super()
        this.route = new RouteSwitchElement("", 0, 0,  "")
        this.route.angle = 0
        
    }

    connectedCallback() {
        this.draw()
    }
    draw() {
        super.draw()
        this.route?.draw(this.ctx!)
    }
}
customElements.define("route-switch-canvas-element", RouteSwitchCanvasElement)

export class ButtonCanvasElement extends CanvasElement {
    button: ButtonShapeElement;
    constructor() {
        super()
        this.button = new ButtonShapeElement("", 0, 0, 0,  "")
        this.button.angle = 0
    }

    connectedCallback() {
        this.draw()
    }
    draw() {
        super.draw()
        this.button.draw(this.ctx!)
    }   
}
customElements.define("button-canvas-element", ButtonCanvasElement)

export class AudioButtonCanvasElement extends CanvasElement {
    button: AudioButtonShapeElement;
    constructor() {
        super()
        this.button = new AudioButtonShapeElement("", 0, 0,  "")
        this.button.angle = 0
    }

    connectedCallback() {
        this.draw()
    }
    draw() {
        super.draw()
        this.button.draw(this.ctx!)
    }
}
customElements.define("audio-button-canvas-element", AudioButtonCanvasElement)

export class EmergencyButtonCanvasElement extends CanvasElement {
    button: EmergencyButtonShapeElement;
    constructor() {
        super()
        this.button = new EmergencyButtonShapeElement("", 0, 0,  "")
        this.button.angle = 0
    }

    connectedCallback() {
        this.draw()
    }
    draw() {
        super.draw()
        this.button.draw(this.ctx!)
    }
    
}
customElements.define("emergency-button-canvas-element", EmergencyButtonCanvasElement)

export class SensorCanvasElement extends CanvasElement {
    sensor: SensorShapeElement;
    constructor() {
        super()
        this.sensor = new SensorShapeElement("", 0, 0, 0,  "")
        this.sensor.angle = 0
    }

    connectedCallback() {
        this.draw()
    }
    draw() {
        super.draw()
        this.sensor.draw(this.ctx!)
    }
    
}
customElements.define("sensor-canvas-element", SensorCanvasElement)

export class LabelCanvasElement extends CanvasElement {
    label: Label2Element;
    constructor() {
        super()
        this.label = new Label2Element("", 0, 0,  "")
        this.label.text = "LABEL"
        this.label.angle = 0
    }

    connectedCallback() {
        this.draw()
    }
    draw() {
        super.draw()
        this.label.draw(this.ctx!)
    }
}
customElements.define("label-canvas-element", LabelCanvasElement)

export class TreeCanvasElement extends CanvasElement {
    tree: TreeShapeElement;
    constructor() {
        super()
        this.tree = new TreeShapeElement("", 0, 0,  "")
        this.tree.angle = 0
    }

    connectedCallback() {
        this.draw()
    }
    draw() {
        super.draw()
        this.tree.draw(this.ctx!)
    }
}
customElements.define("tree-canvas-element", TreeCanvasElement)


export class BlockCanvasElement extends CanvasElement {
    block: BlockElement;
    constructor() {
        super()
        this.block = new BlockElement("", 0, 0,  "")
        this.block.text = "LABEL"
        this.block.angle = 0
    }

    connectedCallback() {
        this.draw()
    }
    draw() {
        super.draw()
        this.ctx!.save()
        this.ctx!.scale(0.5, 1)
        this.ctx!.translate(20,0)
        this.block.draw(this.ctx!)
        this.ctx!.restore()
    }
}
customElements.define("block-canvas-element", BlockCanvasElement)

export class SchedulerButtonCanvasElement extends CanvasElement {
    element: SchedulerButtonShapeElement;
    constructor() {
        super()
        this.element = new SchedulerButtonShapeElement("", 0, 0,  "")
        this.element.angle = 0
    }

    connectedCallback() {
        this.draw()
    }
    draw() {
        super.draw()
        this.element.draw(this.ctx!)
    }
}
customElements.define("scheduler-button-canvas-element", SchedulerButtonCanvasElement)
