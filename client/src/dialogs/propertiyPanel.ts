import { RailView, View } from "../editor/view";
import { BitElement } from "../components/bitElement";
import { TurnoutDoublePropertiesElement, TurnoutLeftPropertiesElement, TurnoutRightPropertiesElement, TurnoutYPropertiesElement } from "../components/turnoutPropertiesElement";
import { TurnoutDoubleElement, TurnoutElement, TurnoutLeftElement, TurnoutRightElement, TurnoutYShapeElement } from "../editor/turnout";
// import { DialogResult } from "../controls/dialog";
import { RouteListElementProperties } from "../components/routeListElementProperties";
import { RouteSwitchElement } from "../editor/route";
import { TrackElement } from "../editor/track";
import { TrackPropertiesElement } from "../components/trackPropertiesElement";
import { TrackEndElement } from "../editor/trackend";
import { TrackCornerElement } from "../editor/corner";
import { TrackCurveElement } from "../editor/curve";
import { Signal2Element, Signal3Element, Signal4Element, } from "../editor/signals";
import { BlockPropertiesElement } from "../components/blockPropertiesElement";
import { BlockElement } from "../editor/block";
import { LocomotiveComboBox } from "../components/locoComboboxElement";
import { Signal2PropertiesElement, Signal3PropertiesElement, Signal4PropertiesElement, } from "../components/signal2PropertiesElement";
import { TurnoutLeftCanvasElement } from "../components/canvasElement";
import { LabelPropertiesElement } from "../components/labelPropertiesElement";
import { Label2Element } from "../editor/label";
import { AudioButtonPropertiesElement } from "../components/audioButtonPropetiesElement";
import { AudioButtonShapeElement } from "../editor/audioButton";
import { ButtonPropertiesElement } from "../components/buttonPropertiesElement";
import { ButtonShapeElement } from "../editor/button";
import { SensorPropertiesElement } from "../components/sensorPropertiesElement";
import { SensorShapeElement } from "../editor/sensor";
import { TrackCrossingShapeElement } from "../editor/crossing";
import { SchedulerButtonPropertiesElement } from "../components/schedulerButtonPropertiesElement";
import { SchedulerButtonShapeElement } from "../editor/schedulerButton";

console.log(TurnoutLeftPropertiesElement)
console.log(RouteListElementProperties)
console.log(TrackPropertiesElement)
console.log(BlockPropertiesElement)
console.log(LabelPropertiesElement)
console.log(LocomotiveComboBox)
console.log(Signal2PropertiesElement)
console.log(TurnoutLeftCanvasElement)
console.log(ButtonPropertiesElement)
console.log(SensorPropertiesElement)
console.log(AudioButtonPropertiesElement)
console.log(SchedulerButtonPropertiesElement)

export class PropertyPanel extends HTMLElement {

    // callback?: (sender: PropertyPanel, res: DialogResult) => void | undefined;
    shadow: ShadowRoot;
    btnClose: any;
    propTitle: any;
    container: HTMLDivElement;
    turnoutLeftPropertiesElement: TurnoutLeftPropertiesElement;
    turnoutRightPropertiesElement: TurnoutRightPropertiesElement;
    turnoutYPropertiesElement: TurnoutYPropertiesElement;
    signal2PropertiesElement: Signal2PropertiesElement;
    signal3PropertiesElement: Signal3PropertiesElement;
    signal4PropertiesElement: Signal4PropertiesElement;
    blockPropertiesElement: BlockPropertiesElement;
    labelPropertiesElement: LabelPropertiesElement;
    trackPropertiesElement: TrackPropertiesElement;
    turnoutDoublePropertiesElement: TurnoutDoublePropertiesElement;
    routeListElementProperties: RouteListElementProperties;
    buttonPropertiesElement: ButtonPropertiesElement;
    sensorPropertiesElement: SensorPropertiesElement;
    audioButtonPropertiesElement: AudioButtonPropertiesElement;
    schedulerButtonPropertiesElement: SchedulerButtonPropertiesElement;

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadow.innerHTML = `
 <style>
    html, body {
        height: 100%;
        margin: 0;
    }

    #propertyPanel {
        display: flex;
        flex-direction: column;
        width: calc(100% - 20px);
        
        margin: 6px;
        
    }

    #btnClose {
        width: 24px;
        height: 24px;
        float: right;
        cursor: pointer;
    }

    #containerWrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    #container {
        flex: 1; /* Kitölti a maradék helyet */
        display: flex;
        flex-direction: column;
        width: calc(100% - 0px);
        margin-bottom: 10px;
        padding: 0;
        
        overflow-y: auto;
    }

    #container div {
        margin-top: 36px;
    }

    #container {
    }
    
    .hidden {
        visibility: hidden;
    }

        @import url("css/bootstrap.min.css");
        @import url("css/properties.css");

      :host {
            color-scheme: dark; /* Aktiválja a sötét témát */
        }
</style>

<div id="containerWrapper" >
    <div id="propertyPanel">
        <div style="width: 100%; background-color: #333; float: left;">
            <div id="title" style="float: left; color: white; padding-left: 4px;">TITLE</div>
            <svg id="btnClose" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                <path
                    d="M19,3H16.3H7.7H5A2,2 0 0,0 3,5V7.7V16.4V19A2,2 0 0,0 5,21H7.7H16.4H19A2,2 0 0,0 21,19V16.3V7.7V5A2,2 0 0,0 19,3M15.6,17L12,13.4L8.4,17L7,15.6L10.6,12L7,8.4L8.4,7L12,10.6L15.6,7L17,8.4L13.4,12L17,15.6L15.6,17Z" />
            </svg>
        </div>
    </div>

    <div id="container">
    </div>
</div>

           `

        this.propTitle = this.shadowRoot!.getElementById("title") as any
        this.btnClose = this.shadowRoot!.getElementById("btnClose") as any

        this.container = this.shadowRoot!.getElementById("container") as HTMLDivElement
        this.signal2PropertiesElement = document.createElement("signal2-properties-element") as Signal2PropertiesElement
        this.signal3PropertiesElement = document.createElement("signal3-properties-element") as Signal3PropertiesElement
        this.signal4PropertiesElement = document.createElement("signal4-properties-element") as Signal4PropertiesElement
        this.blockPropertiesElement = document.createElement("block-properties-element") as BlockPropertiesElement
        this.labelPropertiesElement = document.createElement("label-properties-element") as LabelPropertiesElement
        this.trackPropertiesElement = document.createElement("track-properties-element") as TrackPropertiesElement
        this.turnoutLeftPropertiesElement = document.createElement("turnout-left-properties-element") as TurnoutLeftPropertiesElement
        this.turnoutRightPropertiesElement = document.createElement("turnout-right-properties-element") as TurnoutRightPropertiesElement
        this.turnoutYPropertiesElement = document.createElement("turnout-y-properties-element") as TurnoutYPropertiesElement
        this.turnoutDoublePropertiesElement = document.createElement("turnout-double-properties-element") as TurnoutDoublePropertiesElement
        this.routeListElementProperties = document.createElement('route-list-element-properties') as RouteListElementProperties
        this.buttonPropertiesElement = document.createElement('button-properties-element') as ButtonPropertiesElement
        this.sensorPropertiesElement = document.createElement('sensor-properties-element') as SensorPropertiesElement
        this.audioButtonPropertiesElement = document.createElement('audio-button-properties-element') as AudioButtonPropertiesElement
        this.schedulerButtonPropertiesElement = document.createElement('scheduler-button-properties-element') as SchedulerButtonPropertiesElement
    }

    private open() {
        this.propTitle.innerHTML = "Property Panel"
        this.classList.add("show")
    }
    private hide() {
        this.propTitle.innerHTML = "Property Panel"
        this.classList.remove("show")
    }

    
    private _visible : boolean = false;
    public get visible() : boolean {
        return this._visible;
    }

    public set visible(v : boolean) {
        this._visible = v;
        if(this._visible) {
            this.open()
        } else {
            this.hide()
        }
    }

    private _selectedObject?: View = undefined;
    public get selectedObject(): View {
        return this._selectedObject!;
    }
    public set selectedObject(v: View | undefined) {

        if (this.selectedObject && v) {
            if (this._selectedObject!.UUID == v.UUID) {
                return
            }
        }

        this._selectedObject = v;

        if (this._selectedObject) {
            this.container.classList.add('hidden')
            this.container.innerHTML = ""

            if (Object.getPrototypeOf(v) == Signal2Element.prototype) {
                this.container.appendChild(this.signal2PropertiesElement)
                this.signal2PropertiesElement.setSignal(this.selectedObject as Signal2Element)
            }
            else if (Object.getPrototypeOf(v) == Signal3Element.prototype) {
                this.container.appendChild(this.signal3PropertiesElement)
                this.signal3PropertiesElement.setSignal(this.selectedObject as Signal3Element)
            }
            else if (Object.getPrototypeOf(v) == Signal4Element.prototype) {
                this.container.appendChild(this.signal4PropertiesElement)
                this.signal4PropertiesElement.setSignal(this.selectedObject as Signal4Element)
            }
            else if (Object.getPrototypeOf(v) == BlockElement.prototype) {
                this.container.appendChild(this.blockPropertiesElement)
                this.blockPropertiesElement.setBlock(this.selectedObject as BlockElement)
            }
            else if (Object.getPrototypeOf(v) == Label2Element.prototype) {
                this.container.appendChild(this.labelPropertiesElement)
                this.labelPropertiesElement.setLabel(this.selectedObject as Label2Element)
            }
            else if (Object.getPrototypeOf(v) == ButtonShapeElement.prototype) {
                this.container.appendChild(this.buttonPropertiesElement)
                this.buttonPropertiesElement.setButton(this.selectedObject as ButtonShapeElement)
            }
            else if (Object.getPrototypeOf(v) == SensorShapeElement.prototype) {
                this.container.appendChild(this.sensorPropertiesElement)
                this.sensorPropertiesElement.setSensor(this.selectedObject as SensorShapeElement)
            }
            else if (Object.getPrototypeOf(v) == AudioButtonShapeElement.prototype) {
                this.container.appendChild(this.audioButtonPropertiesElement)
                this.audioButtonPropertiesElement.setButton(this.selectedObject as AudioButtonShapeElement)
            }
            else if (Object.getPrototypeOf(v) == SchedulerButtonShapeElement.prototype) {
                this.container.appendChild(this.schedulerButtonPropertiesElement)
                this.schedulerButtonPropertiesElement.setButton(this.selectedObject as SchedulerButtonShapeElement)
            }
            else if (Object.getPrototypeOf(v) == TrackElement.prototype) {
                this.container.appendChild(this.trackPropertiesElement)
                this.trackPropertiesElement.setTrack(this.selectedObject as RailView)
            }
            else if (Object.getPrototypeOf(v) == TrackEndElement.prototype) {
                this.container.appendChild(this.trackPropertiesElement)
                this.trackPropertiesElement.setTrack(this.selectedObject as RailView)
            }
            else if (Object.getPrototypeOf(v) == TrackCornerElement.prototype) {
                this.container.appendChild(this.trackPropertiesElement)
                this.trackPropertiesElement.setTrack(this.selectedObject as RailView)
            }
            else if (Object.getPrototypeOf(v) == TrackCurveElement.prototype) {
                this.container.appendChild(this.trackPropertiesElement)
                this.trackPropertiesElement.setTrack(this.selectedObject as RailView)
            }
            else if (Object.getPrototypeOf(v) == TrackCrossingShapeElement.prototype) {
                this.container.appendChild(this.trackPropertiesElement)
                this.trackPropertiesElement.setTrack(this.selectedObject as RailView)
            }
            else if (Object.getPrototypeOf(v) == TurnoutLeftElement.prototype) {
                this.turnoutLeftPropertiesElement.setTurnout(this.selectedObject as TurnoutLeftElement)
                this.container.appendChild(this.turnoutLeftPropertiesElement)
            }
            else if (Object.getPrototypeOf(v) == TurnoutRightElement.prototype) {
                this.turnoutRightPropertiesElement.setTurnout(this.selectedObject as TurnoutRightElement)
                this.container.appendChild(this.turnoutRightPropertiesElement)
            }
            else if (Object.getPrototypeOf(v) == TurnoutYShapeElement.prototype) {
                this.turnoutYPropertiesElement.setTurnout(this.selectedObject as TurnoutYShapeElement)
                this.container.appendChild(this.turnoutYPropertiesElement)
            }
            else if (Object.getPrototypeOf(v) == TurnoutDoubleElement.prototype) {
                this.container.appendChild(this.turnoutDoublePropertiesElement)
                this.turnoutDoublePropertiesElement.setTurnout(this.selectedObject as TurnoutDoubleElement)
            } else if (Object.getPrototypeOf(v) == RouteSwitchElement.prototype) {               
                this.container.appendChild(this.routeListElementProperties)
                this.routeListElementProperties.setRouteSwitch(v as RouteSwitchElement)
            }

            setTimeout(() => {
                requestAnimationFrame(() => {
                    this.container.classList.remove('hidden')
                })
            }, 100)

        } else {
            this.container.innerHTML = ""
        }
    }

    update() {
        if (this.selectedObject) {
            this.selectedObject = this.selectedObject
        }
    }

}

customElements.define("property-panel", PropertyPanel)


// export class TurnoutRightElementProperties extends PropertyPanel {

//     getTemplate(): string {
//         return '<div>Turnout Right</div>'
//     }
// }
// customElements.define("turnout-right-properties", TurnoutRightElementProperties)


// export class TurnoutLeftElementProperties extends PropertyPanel {

//     getTemplate(): string {
//         return '<div>Turnout Left</div>'
//     }
// }
// customElements.define("turnout-left-properties", TurnoutLeftElementProperties)

// export class TurnoutDoubleElementProperties extends PropertyPanel {

//     getTemplate(): string {
//         return '<div>Turnout Double</div>'
//     }
// }
// customElements.define("turnout-double-properties", TurnoutDoubleElementProperties)

// export class RouteSwitchElementProperties extends PropertyPanel {

//     getTemplate(): string {
//         return '<div>Route Switch</div>'
//     }
// }
// customElements.define("route-switch-properties", RouteSwitchElementProperties)