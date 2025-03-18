import { CanvasShapeElement } from "../components/canvasElement.js";
import { Dialog, DialogResult, TabControl } from "../controls/dialog.js";
import { drawModes } from "../editor/editor.js";

export class ShapesDialog extends Dialog {
    selectedDrawMode: drawModes | undefined;

    constructor() {
        super(800, 600, "Elements")

        const tabControl = new TabControl();
        this.addBody(tabControl)

        const tab1 = tabControl.addTab("Defaults");

        // tab1.getElement().innerHTML = "<h6>App settings<h6>";
        // const tbRail = document.createElement("track-canvas-element")
        // tab1.getElement().appendChild(tbRail)
        // tbRail.onclick = (e) => {

        // }

        // const tbTrackEnd = document.createElement("track-end-canvas-element")
        // tab1.getElement().appendChild(tbTrackEnd)
        // tbTrackEnd.onclick = (e) => {

        // }
        tab1.getElement().innerHTML = this.getTemplate()



    }
    init() {

        document.getElementById("tbTrack")!.onclick = (e: MouseEvent) => {
            this.dialogResult = DialogResult.ok
            this.selectedDrawMode = drawModes.track
            this.close()
        }

        document.getElementById("tbTrackEnd")!.onclick = (e: MouseEvent) => {
            this.dialogResult = DialogResult.ok
            this.selectedDrawMode = drawModes.trackEnd
            this.close()
        }

        document.getElementById("tbTrackCorner")!.onclick = (e: MouseEvent) => {
            this.dialogResult = DialogResult.ok
            this.selectedDrawMode = drawModes.trackCorner
            this.close()
        }

        document.getElementById("tbTrackCurve")!.onclick = (e: MouseEvent) => {
            this.dialogResult = DialogResult.ok
            this.selectedDrawMode = drawModes.trackCurve
            this.close()
        }

        document.getElementById("tbTrackCrossing")!.onclick = (e: MouseEvent) => {
            this.dialogResult = DialogResult.ok
            this.selectedDrawMode = drawModes.trackCrossing
            this.close()
        }

        document.getElementById("tbTurnoutLeft")!.onclick = (e: MouseEvent) => {
            this.dialogResult = DialogResult.ok
            this.selectedDrawMode = drawModes.turnoutLeft
            this.close()
        }
        document.getElementById("tbTurnoutRight")!.onclick = (e: MouseEvent) => {
            this.dialogResult = DialogResult.ok
            this.selectedDrawMode = drawModes.turnoutRight
            this.close()
        }
        document.getElementById("tbTurnoutY")!.onclick = (e: MouseEvent) => {
            this.dialogResult = DialogResult.ok
            this.selectedDrawMode = drawModes.turnoutY
            this.close()
        }
        document.getElementById("tbTurnoutDouble")!.onclick = (e: MouseEvent) => {
            this.dialogResult = DialogResult.ok
            this.selectedDrawMode = drawModes.turnoutDouble
            this.close()
        }
        document.getElementById("tbSignal2")!.onclick = (e: MouseEvent) => {
            this.dialogResult = DialogResult.ok
            this.selectedDrawMode = drawModes.signal2
            this.close()
        }
        document.getElementById("tbSignal3")!.onclick = (e: MouseEvent) => {
            this.dialogResult = DialogResult.ok
            this.selectedDrawMode = drawModes.signal3
            this.close()
        }
        document.getElementById("tbSignal4")!.onclick = (e: MouseEvent) => {
            this.dialogResult = DialogResult.ok
            this.selectedDrawMode = drawModes.signal4
            this.close()
        }

        document.getElementById("tbRouteSwitch")!.onclick = (e: MouseEvent) => {
            this.dialogResult = DialogResult.ok
            this.selectedDrawMode = drawModes.routeSwitch
            this.close()
        }

        document.getElementById("tbButton")!.onclick = (e: MouseEvent) => {
            this.dialogResult = DialogResult.ok
            this.selectedDrawMode = drawModes.button
            this.close()
        }

        document.getElementById("tbAudioButton")!.onclick = (e: MouseEvent) => {
            this.dialogResult = DialogResult.ok
            this.selectedDrawMode = drawModes.audiobutton
            this.close()
        }
        document.getElementById("tbEmergencyButton")!.onclick = (e: MouseEvent) => {
            this.dialogResult = DialogResult.ok
            this.selectedDrawMode = drawModes.emergencybutton
            this.close()
        }

        document.getElementById("tbTree")!.onclick = (e: MouseEvent) => {
            this.dialogResult = DialogResult.ok
            this.selectedDrawMode = drawModes.tree
            this.close()
        }

        document.getElementById("tbBlock")!.onclick = (e: MouseEvent) => {
            this.dialogResult = DialogResult.ok
            this.selectedDrawMode = drawModes.block
            this.close()
        }
        document.getElementById("tbLabel2")!.onclick = (e: MouseEvent) => {
            this.dialogResult = DialogResult.ok
            this.selectedDrawMode = drawModes.label2
            this.close()
        }
        document.getElementById("tbSensor")!.onclick = (e: MouseEvent) => {
            this.dialogResult = DialogResult.ok
            this.selectedDrawMode = drawModes.sensor
            this.close()
        }
    }

    getTemplate() {
        return `
<div class="modal-dialog" style="width: 90%; align-items: left">
    <div class="modal-content">
                <div class="modal-body" style="font-size: small;">
                    <div class="row">
                        <div class="col-2 text-center">
                            <track-canvas-element id="tbTrack"></track-canvas-element>
                            <div>Rail</div>
                        </div>
                        <div class="col-2 text-center">
                            <track-end-canvas-element id="tbTrackEnd"></track-end-canvas-element>
                            <div>Rail End</div>
                        </div>
                        <div class="col-2 text-center">
                            <track-corner-canvas-element id="tbTrackCorner"></track-corner-canvas-element>
                            <div>Corner</div>
                        </div>
                        <div class="col-2 text-center">
                            <track-curve-canvas-element id="tbTrackCurve"></track-curve-canvas-element>
                            <div>Curve</div>
                        </div>
                        <div class="col-2 text-center">
                            <track-crossing-canvas-element id="tbTrackCrossing"></track-crossing-canvas-element>
                            <div>Crossing</div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-2 text-center">
                            <turnout-left-canvas-element id="tbTurnoutLeft"></turnout-left-canvas-element>
                            <div>Turnout Left</div>
                        </div>
                        <div class="col-2 text-center">
                            <turnout-right-canvas-element id="tbTurnoutRight"></turnout-right-canvas-element>
                            <div>Turnout Right</div>
                        </div>
                        <div class="col-2 text-center">
                            <turnout-y-canvas-element id="tbTurnoutY"></turnout-y-canvas-element>
                            <div>Turnout Y</div>
                        </div>
                        <div class="col-2 text-center">
                            <turnout-double-canvas-element id="tbTurnoutDouble"></turnout-double-canvas-element>
                            <div>Turnout Double</div>
                        </div>
                    </div>


                    <div class="row">
                        <div class="col-2 text-center">
                            <signal2-canvas-element id="tbSignal2" lightsAll="true"></signal2-canvas-element>
                            <div>Signal 2</div>
                        </div>
                        <div class="col-2 text-center">
                            <signal3-canvas-element id="tbSignal3" lightsAll="true"></signal3-canvas-element>
                            <div>Signal 3</div>
                        </div>
                        <div class="col-2 text-center">
                            <signal4-canvas-element id="tbSignal4" lightsAll="true"></signal4-canvas-element>
                            <div>Signal 4</div>
                        </div>
                    </div>


                    <div class="row">
                    </div>
                    <div class="row">
                        <div class="col-2 text-center">
                            <route-switch-canvas-element id="tbRouteSwitch"></route-switch-canvas-element>
                            <div>Route Switch</div>
                        </div>

                        <div class="col-2 text-center">
                            <sensor-canvas-element id="tbSensor"></sensor-canvas-element>
                            <div>Sensor</div>
                        </div>
                        <div class="col-2 text-center">
                            <button-canvas-element id="tbButton"></button-canvas-element>
                            <div>Button</div>
                        </div>
                        <div class="col-2 text-center">
                            <audio-button-canvas-element id="tbAudioButton"></audio-button-canvas-element>
                            <div>Audio</div>
                        </div>
                        <div class="col-2 text-center">
                            <emergency-button-canvas-element id="tbEmergencyButton"></emergency-button-canvas-element>
                            <div>Emergency Button</div>
                        </div>
                        <div class="col-2 text-center">
                            <label-canvas-element id="tbLabel2"></label-canvas-element>
                            <div>Label</div>
                        </div>

                        <div class="col-2 text-center">
                            <block-canvas-element id="tbBlock"></block-canvas-element>
                            <div>Block</div>
                        </div>

                        <div class="col-2 text-center">
                            <tree-canvas-element id="tbTree"></tree-canvas-element>
                            <div>Tree</div>
                        </div>


                    </div>
                    <div class="row">
                        <div class="col-auto">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-auto">
                            <!-- <button id="tbLabel2" class="btn btn-light">Label</button> -->
                            <!-- <button id="tbTree" class="btn btn-light">Tree</button> -->
                        </div>
                    </div>

        </div>
    </div>
</div>
`
    }
}