define(["require", "exports", "../components/turnoutPropertiesElement", "../editor/turnout", "../components/routeListElementProperties", "../editor/route", "../editor/track", "../components/trackPropertiesElement", "../editor/trackend", "../editor/corner", "../editor/curve", "../editor/signals", "../components/blockPropertiesElement", "../editor/block", "../components/locoComboboxElement", "../components/signal2PropertiesElement", "../components/canvasElement", "../components/labelPropertiesElement", "../editor/label", "../components/audioButtonPropetiesElement", "../editor/audioButton", "../components/buttonPropertiesElement", "../editor/button", "../components/sensorPropertiesElement", "../editor/sensor", "../editor/crossing", "../components/schedulerButtonPropertiesElement", "../editor/schedulerButton"], function (require, exports, turnoutPropertiesElement_1, turnout_1, routeListElementProperties_1, route_1, track_1, trackPropertiesElement_1, trackend_1, corner_1, curve_1, signals_1, blockPropertiesElement_1, block_1, locoComboboxElement_1, signal2PropertiesElement_1, canvasElement_1, labelPropertiesElement_1, label_1, audioButtonPropetiesElement_1, audioButton_1, buttonPropertiesElement_1, button_1, sensorPropertiesElement_1, sensor_1, crossing_1, schedulerButtonPropertiesElement_1, schedulerButton_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PropertyPanel = void 0;
    console.log(turnoutPropertiesElement_1.TurnoutLeftPropertiesElement);
    console.log(routeListElementProperties_1.RouteListElementProperties);
    console.log(trackPropertiesElement_1.TrackPropertiesElement);
    console.log(blockPropertiesElement_1.BlockPropertiesElement);
    console.log(labelPropertiesElement_1.LabelPropertiesElement);
    console.log(locoComboboxElement_1.LocomotiveComboBox);
    console.log(signal2PropertiesElement_1.Signal2PropertiesElement);
    console.log(canvasElement_1.TurnoutLeftCanvasElement);
    console.log(buttonPropertiesElement_1.ButtonPropertiesElement);
    console.log(sensorPropertiesElement_1.SensorPropertiesElement);
    console.log(audioButtonPropetiesElement_1.AudioButtonPropertiesElement);
    console.log(schedulerButtonPropertiesElement_1.SchedulerButtonPropertiesElement);
    class PropertyPanel extends HTMLElement {
        constructor() {
            super();
            this._visible = false;
            this._selectedObject = undefined;
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

           `;
            this.propTitle = this.shadowRoot.getElementById("title");
            this.btnClose = this.shadowRoot.getElementById("btnClose");
            this.container = this.shadowRoot.getElementById("container");
            this.signal2PropertiesElement = document.createElement("signal2-properties-element");
            this.signal3PropertiesElement = document.createElement("signal3-properties-element");
            this.signal4PropertiesElement = document.createElement("signal4-properties-element");
            this.blockPropertiesElement = document.createElement("block-properties-element");
            this.labelPropertiesElement = document.createElement("label-properties-element");
            this.trackPropertiesElement = document.createElement("track-properties-element");
            this.turnoutLeftPropertiesElement = document.createElement("turnout-left-properties-element");
            this.turnoutRightPropertiesElement = document.createElement("turnout-right-properties-element");
            this.turnoutYPropertiesElement = document.createElement("turnout-y-properties-element");
            this.turnoutDoublePropertiesElement = document.createElement("turnout-double-properties-element");
            this.routeListElementProperties = document.createElement('route-list-element-properties');
            this.buttonPropertiesElement = document.createElement('button-properties-element');
            this.sensorPropertiesElement = document.createElement('sensor-properties-element');
            this.audioButtonPropertiesElement = document.createElement('audio-button-properties-element');
            this.schedulerButtonPropertiesElement = document.createElement('scheduler-button-properties-element');
        }
        open() {
            this.propTitle.innerHTML = "Property Panel";
            this.classList.add("show");
        }
        hide() {
            this.propTitle.innerHTML = "Property Panel";
            this.classList.remove("show");
        }
        get visible() {
            return this._visible;
        }
        set visible(v) {
            this._visible = v;
            if (this._visible) {
                this.open();
            }
            else {
                this.hide();
            }
        }
        get selectedObject() {
            return this._selectedObject;
        }
        set selectedObject(v) {
            if (this.selectedObject && v) {
                if (this._selectedObject.UUID == v.UUID) {
                    return;
                }
            }
            this._selectedObject = v;
            if (this._selectedObject) {
                this.container.classList.add('hidden');
                this.container.innerHTML = "";
                if (Object.getPrototypeOf(v) == signals_1.Signal2Element.prototype) {
                    this.container.appendChild(this.signal2PropertiesElement);
                    this.signal2PropertiesElement.setSignal(this.selectedObject);
                }
                else if (Object.getPrototypeOf(v) == signals_1.Signal3Element.prototype) {
                    this.container.appendChild(this.signal3PropertiesElement);
                    this.signal3PropertiesElement.setSignal(this.selectedObject);
                }
                else if (Object.getPrototypeOf(v) == signals_1.Signal4Element.prototype) {
                    this.container.appendChild(this.signal4PropertiesElement);
                    this.signal4PropertiesElement.setSignal(this.selectedObject);
                }
                else if (Object.getPrototypeOf(v) == block_1.BlockElement.prototype) {
                    this.container.appendChild(this.blockPropertiesElement);
                    this.blockPropertiesElement.setBlock(this.selectedObject);
                }
                else if (Object.getPrototypeOf(v) == label_1.Label2Element.prototype) {
                    this.container.appendChild(this.labelPropertiesElement);
                    this.labelPropertiesElement.setLabel(this.selectedObject);
                }
                else if (Object.getPrototypeOf(v) == button_1.ButtonShapeElement.prototype) {
                    this.container.appendChild(this.buttonPropertiesElement);
                    this.buttonPropertiesElement.setButton(this.selectedObject);
                }
                else if (Object.getPrototypeOf(v) == sensor_1.SensorShapeElement.prototype) {
                    this.container.appendChild(this.sensorPropertiesElement);
                    this.sensorPropertiesElement.setSensor(this.selectedObject);
                }
                else if (Object.getPrototypeOf(v) == audioButton_1.AudioButtonShapeElement.prototype) {
                    this.container.appendChild(this.audioButtonPropertiesElement);
                    this.audioButtonPropertiesElement.setButton(this.selectedObject);
                }
                else if (Object.getPrototypeOf(v) == schedulerButton_1.SchedulerButtonShapeElement.prototype) {
                    this.container.appendChild(this.schedulerButtonPropertiesElement);
                    this.schedulerButtonPropertiesElement.setButton(this.selectedObject);
                }
                else if (Object.getPrototypeOf(v) == track_1.TrackElement.prototype) {
                    this.container.appendChild(this.trackPropertiesElement);
                    this.trackPropertiesElement.setTrack(this.selectedObject);
                }
                else if (Object.getPrototypeOf(v) == trackend_1.TrackEndElement.prototype) {
                    this.container.appendChild(this.trackPropertiesElement);
                    this.trackPropertiesElement.setTrack(this.selectedObject);
                }
                else if (Object.getPrototypeOf(v) == corner_1.TrackCornerElement.prototype) {
                    this.container.appendChild(this.trackPropertiesElement);
                    this.trackPropertiesElement.setTrack(this.selectedObject);
                }
                else if (Object.getPrototypeOf(v) == curve_1.TrackCurveElement.prototype) {
                    this.container.appendChild(this.trackPropertiesElement);
                    this.trackPropertiesElement.setTrack(this.selectedObject);
                }
                else if (Object.getPrototypeOf(v) == crossing_1.TrackCrossingShapeElement.prototype) {
                    this.container.appendChild(this.trackPropertiesElement);
                    this.trackPropertiesElement.setTrack(this.selectedObject);
                }
                else if (Object.getPrototypeOf(v) == turnout_1.TurnoutLeftElement.prototype) {
                    this.turnoutLeftPropertiesElement.setTurnout(this.selectedObject);
                    this.container.appendChild(this.turnoutLeftPropertiesElement);
                }
                else if (Object.getPrototypeOf(v) == turnout_1.TurnoutRightElement.prototype) {
                    this.turnoutRightPropertiesElement.setTurnout(this.selectedObject);
                    this.container.appendChild(this.turnoutRightPropertiesElement);
                }
                else if (Object.getPrototypeOf(v) == turnout_1.TurnoutYShapeElement.prototype) {
                    this.turnoutYPropertiesElement.setTurnout(this.selectedObject);
                    this.container.appendChild(this.turnoutYPropertiesElement);
                }
                else if (Object.getPrototypeOf(v) == turnout_1.TurnoutDoubleElement.prototype) {
                    this.container.appendChild(this.turnoutDoublePropertiesElement);
                    this.turnoutDoublePropertiesElement.setTurnout(this.selectedObject);
                }
                else if (Object.getPrototypeOf(v) == route_1.RouteSwitchElement.prototype) {
                    this.container.appendChild(this.routeListElementProperties);
                    this.routeListElementProperties.setRouteSwitch(v);
                }
                setTimeout(() => {
                    requestAnimationFrame(() => {
                        this.container.classList.remove('hidden');
                    });
                }, 100);
            }
            else {
                this.container.innerHTML = "";
            }
        }
        update() {
            if (this.selectedObject) {
                this.selectedObject = this.selectedObject;
            }
        }
    }
    exports.PropertyPanel = PropertyPanel;
    customElements.define("property-panel", PropertyPanel);
});
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
