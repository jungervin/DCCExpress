import { protocol, Socket } from "socket.io-client";
import { TrackElement } from "./track";
import { RectangleElement } from "./rectangle";
import { Toolbar } from "./toolbar";
import { TurnoutDoubleElement, TurnoutElement, TurnoutLeftElement, TurnoutRightElement } from "./turnout";
import { RailView, View, RailStates } from "./view";
import { Views } from "./views";
import * as bootstrap from "bootstrap";
import { TrackCurveElement } from "./curve";
import { TrackCornerElement } from "./corner";
import { Signal2Element, Signal3Element, Signal4Element } from "./signals";
import { TrackEndElement } from "./trackend";
// import { GridState, UndoRedoManager } from "./undoman";
import { RouteSwitchElement } from "./route";
import { Dialog, DialogResult, Popup, ThemeColors } from "../controls/dialog";
import { ApiCommands, getUUID, iSetBasicAccessory, iData, iSetTurnout, turnouts } from "../../../common/src/dcc";
//import { IOConn } from "../helpers/iocon";
import { PropertyPanel } from "../dialogs/propertiyPanel";
import { BlockElement } from "./block";
import { Globals } from "../helpers/globals";
import { AppSettingsDialog } from "../dialogs/AppSettingsDialog";
import { dlgSignal2Select, dlgSignal3Select, dlgSignal4Select } from "../dialogs/dlgSignal2Select";
import { turnoutDoublePopup } from "../dialogs/turnoutsPopup";
import { wsClient } from "../helpers/ws";
import { Label2Element } from "./label";
import { moveDown, moveToEnd, moveToStart } from "../helpers/utility";
import { moveUp } from "../helpers/utility";
import { CodeEditor } from "../dialogs/codeEditor";
import { Dispatcher } from "./dispatcher";
import { LocoControlPanel } from "../components/controlPanel";
import { ButtonShapeElement } from "./button";
import { AudioButtonShapeElement } from "./audioButton";
import { getDistance } from "../helpers/math";
import { FastClock } from "./clock";
import { EmergencyButtonShapeElement } from "./emergencyButton";
import { TreeShapeElement } from "./tree";

console.log(PropertyPanel)

export enum drawModes {
    pointer = 1,
    track,
    trackEnd,
    turnoutLeft,
    turnoutRight,
    turnoutDouble,
    rect,
    remove,
    trackCorner,
    trackCurve,
    signal2,
    signal3,
    signal4,
    signal5,
    routeSwitch,
    none,
    block,
    label2,
    button,
    audiobutton,
    emergencybutton,
    tree,
}

export class CustomCanvas extends HTMLElement {
    canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D | undefined;

    views: Views = new Views()
    statusbar?: HTMLDivElement;
    downX: number = 0;
    downY: number = 0;
    lastX: number = 0;
    lastY: number = 0;
    mouseX: number = 0;
    mouseY: number = 0;
    scale: number = 1;
    toolbar: Toolbar | undefined;

    //socket: Socket | undefined
    shapesModal: bootstrap.Modal | undefined;

    cursorTrackElement: TrackElement | undefined;
    cursorTrackEndElement: TrackEndElement | undefined;
    cursorTrackCornerElement: TrackCurveElement | undefined;
    cursorTrackCurveElement: TrackCornerElement | undefined;
    cursorTurnoutRightElement: TurnoutRightElement | undefined;
    cursorTurnoutLeftElement: TurnoutLeftElement | undefined;
    cursorTurnoutDoubleElement: TurnoutDoubleElement | undefined;
    cursorSignal2Element: Signal2Element | undefined;
    cursorSignal3Element: Signal3Element | undefined;
    cursorSignal4Element: Signal4Element | undefined;
    cursorButtonElement: ButtonShapeElement | undefined;
    // cursorSignal5Element: Signal5Element | undefined;
    //turnoutModal: bootstrap.Modal | undefined;
    turnoutAddress: HTMLInputElement | undefined;
    turnoutInverted: HTMLInputElement | undefined;
    btnOkTurnout: HTMLElement | undefined;
    originX: number;
    originY: number;
    //drawEnabled: boolean = true;
    width: number = 0;
    height: number = 0;
    sidePanelLeft: HTMLDivElement | undefined;
    btnSidePanelLeftClose: HTMLDivElement | undefined;
    routeSwitchElement: RouteSwitchElement | undefined;
    cursorBlockElement: BlockElement | undefined;
    propertyPanel: PropertyPanel | undefined;
    dragEnabled: boolean = false;
    globalX: number = 0;
    globalY: number = 0;
    cursorLabel2Element?: Label2Element;
    locoControlPanel?: LocoControlPanel;
    cursorAudioButtonElement?: AudioButtonShapeElement;
    cursorEmergencyButtonElement: EmergencyButtonShapeElement | undefined;
    cursorTreeShapeElement: TreeShapeElement | undefined;
    private pointerMap = new Map<number, { x: number; y: number }>(); // Pointer ID-k mentése
    private lastDistance = 0;
    fastClock?: FastClock | null;



    constructor() {
        super();
        this.originX = 0
        this.originY = 0
        //this.views = new Views()
        this.canvas = document.createElement('canvas');

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `<style>canvas { border: 1px solid #000; display: block; margin:0; padding: 0}</style>`;
        shadow.appendChild(this.canvas);

        window.addEventListener('propertiesChanged', () => {
            this.draw()
        })

        window.invalidate = () => {
            this.draw()
        }

        window.powerChanged = (power) => {
            this.locoControlPanel!.power = power
            this.draw()
        }

        window.addEventListener("mousemove", (e: MouseEvent) => {
            this.globalX = e.clientX
            this.globalY = e.clientY
        })

        this.canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });

    }

    connectedCallback() {
        this.width = parseInt(this.getAttribute('width') || '100vw');
        this.height = parseInt(this.getAttribute('height') || '100vw');
        this.canvas.width = this.parentElement!.offsetWidth;
        this.canvas.height = this.parentElement!.offsetHeight;
        this.ctx = this.canvas.getContext('2d')!;
        this.fastClock = new FastClock(this.ctx!)

        this.drawGrid();
        this.propertyPanel = document.getElementById("EditorPropertyPanel") as PropertyPanel
    }

    init() {

        //this.fastClock!.setScaleFactor(Globals.Settings.EditorSettings.fastClockFactor)

        this.statusbar = document.getElementById("statusbar") as HTMLDivElement

        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('wheel', (e) => this.handleMouseWheel(e));

        this.cursorTrackElement = new TrackElement("", 0, 0, "cursor");
        this.cursorTrackElement.isSelected = true
        this.cursorTrackEndElement = new TrackEndElement("", 0, 0, "cursor");
        this.cursorTrackEndElement.isSelected = true
        this.cursorTrackCornerElement = new TrackCornerElement("", 0, 0, "cursor");
        this.cursorTrackCornerElement.isSelected = true
        this.cursorTrackCurveElement = new TrackCurveElement("", 0, 0, "cursor");
        this.cursorTrackCurveElement.isSelected = true
        this.cursorTurnoutRightElement = new TurnoutRightElement("", 0, 0, 0, "cursor");
        this.cursorTurnoutRightElement.isSelected = true
        this.cursorTurnoutLeftElement = new TurnoutLeftElement("", 0, 0, 0, "cursor");
        this.cursorTurnoutLeftElement.isSelected = true
        this.cursorTurnoutDoubleElement = new TurnoutDoubleElement("", 0, 0, 0, 0, "cursor");
        this.cursorTurnoutDoubleElement.isSelected = true
        this.cursorSignal2Element = new Signal2Element("", 10, 0, 0, "cursor");
        this.cursorSignal2Element.isSelected = true
        this.cursorSignal3Element = new Signal3Element("", 10, 0, 0, "cursor");
        this.cursorSignal3Element.isSelected = true
        this.cursorSignal4Element = new Signal4Element("", 10, 0, 0, "cursor");
        this.cursorSignal4Element.isSelected = true

        this.cursorButtonElement = new ButtonShapeElement("", 0, 0, 0, "cursor");
        this.cursorButtonElement.isSelected = true;
        this.cursorAudioButtonElement = new AudioButtonShapeElement("", 0, 0, "cursor");
        this.cursorAudioButtonElement.isSelected = true;
        this.cursorEmergencyButtonElement = new EmergencyButtonShapeElement("", 0, 0, "cursor");
        this.cursorEmergencyButtonElement.isSelected = true;

        // this.cursorSignal5Element = new Signal5Element("", 10, 0, 0, "cursor");
        // this.cursorSignal5Element.isSelected = true
        this.routeSwitchElement = new RouteSwitchElement("", 0, 0, "cursor");
        this.routeSwitchElement.isSelected = true
        this.cursorBlockElement = new BlockElement("", 0, 0, "cursor")
        this.cursorBlockElement.text = "---"
        this.cursorBlockElement.isSelected = true
        this.cursorLabel2Element = new Label2Element("", 0, 0, "cursor")
        this.cursorLabel2Element.text = "LABEL"
        this.cursorLabel2Element.isSelected = true
        this.cursorTreeShapeElement = new TreeShapeElement("", 0, 0, "cursor")
        this.cursorTreeShapeElement.isSelected = true


        const shapesModalElement = document.getElementById("shapesModal") as HTMLElement;
        this.shapesModal = new bootstrap.Modal(shapesModalElement);

        if (this.toolbar) {
        } else {
            alert("A toolbar nincs beállítva!")
        }

        document.getElementById("tbTrack")!.onclick = (e: MouseEvent) => {
            this.shapesModal!.hide()
            this.unselectAll()
            this.drawMode = drawModes.track
            this.cursorElement = this.cursorTrackElement!
            this.cursorElement!.draw(this.ctx!)
        }

        document.getElementById("tbTrackEnd")!.onclick = (e: MouseEvent) => {
            this.shapesModal!.hide()
            this.unselectAll()
            this.drawMode = drawModes.trackEnd
            this.cursorElement = this.cursorTrackEndElement!
        }

        document.getElementById("tbTrackCorner")!.onclick = (e: MouseEvent) => {
            this.shapesModal!.hide()
            this.unselectAll()
            this.drawMode = drawModes.trackCorner
            this.cursorElement = this.cursorTrackCornerElement!
        }

        document.getElementById("tbTrackCurve")!.onclick = (e: MouseEvent) => {
            this.shapesModal!.hide()
            this.unselectAll()
            this.drawMode = drawModes.trackCurve
            this.cursorElement = this.cursorTrackCurveElement!
        }

        document.getElementById("tbTurnoutLeft")!.onclick = (e: MouseEvent) => {
            this.shapesModal!.hide()
            this.unselectAll()
            this.drawMode = drawModes.turnoutLeft
            this.cursorElement = this.cursorTurnoutLeftElement!
        }
        document.getElementById("tbTurnoutRight")!.onclick = (e: MouseEvent) => {
            this.shapesModal!.hide()
            this.unselectAll()
            this.drawMode = drawModes.turnoutRight
            this.cursorElement = this.cursorTurnoutRightElement!
        }
        document.getElementById("tbTurnoutDouble")!.onclick = (e: MouseEvent) => {
            this.shapesModal!.hide()
            this.unselectAll()
            this.drawMode = drawModes.turnoutDouble
            this.cursorElement = this.cursorTurnoutDoubleElement!
        }
        document.getElementById("tbSignal2")!.onclick = (e: MouseEvent) => {
            this.shapesModal!.hide()
            this.unselectAll()
            this.drawMode = drawModes.signal2
            this.cursorElement = this.cursorSignal2Element!
        }
        document.getElementById("tbSignal3")!.onclick = (e: MouseEvent) => {
            this.shapesModal!.hide()
            this.unselectAll()
            this.drawMode = drawModes.signal3
            this.cursorElement = this.cursorSignal3Element!
        }
        document.getElementById("tbSignal4")!.onclick = (e: MouseEvent) => {
            this.shapesModal!.hide()
            this.unselectAll()
            this.drawMode = drawModes.signal4
            this.cursorElement = this.cursorSignal4Element!
        }

        document.getElementById("tbRouteSwitch")!.onclick = (e: MouseEvent) => {
            this.shapesModal!.hide()
            this.unselectAll()
            this.drawMode = drawModes.routeSwitch
            this.cursorElement = this.routeSwitchElement!
        }

        document.getElementById("tbButton")!.onclick = (e: MouseEvent) => {
            this.shapesModal!.hide()
            this.unselectAll()
            this.drawMode = drawModes.button
            this.cursorElement = this.cursorButtonElement!
            this.cursorElement!.draw(this.ctx!)
        }

        document.getElementById("tbAudioButton")!.onclick = (e: MouseEvent) => {
            this.shapesModal!.hide()
            this.unselectAll()
            this.drawMode = drawModes.audiobutton
            this.cursorElement = this.cursorAudioButtonElement!
            this.cursorElement!.draw(this.ctx!)
        }
        document.getElementById("tbEmergencyButton")!.onclick = (e: MouseEvent) => {
            this.shapesModal!.hide()
            this.unselectAll()
            this.drawMode = drawModes.emergencybutton
            this.cursorElement = this.cursorEmergencyButtonElement
            this.cursorElement!.draw(this.ctx!)
        }

        // document.getElementById("tbTree")!.onclick = (e: MouseEvent) => {
        //     this.shapesModal!.hide()
        //     this.unselectAll()
        //     this.drawMode = drawModes.tree
        //     this.cursorElement = this.cursorTreeShapeElement
        //     this.cursorElement!.draw(this.ctx!)
        // }

        document.getElementById("tbBlock")!.onclick = (e: MouseEvent) => {
            this.shapesModal!.hide()
            this.unselectAll()
            this.drawMode = drawModes.block
            this.cursorElement = this.cursorBlockElement!
        }
        document.getElementById("tbLabel2")!.onclick = (e: MouseEvent) => {
            this.shapesModal!.hide()
            this.unselectAll()
            this.drawMode = drawModes.label2
            this.cursorElement = this.cursorLabel2Element!
        }

        this.drawEnabled = localStorage.getItem("drawEnabled") == "true"
        this.toolbar!.btnEdit.onclick = (e: MouseEvent) => {
            this.drawEnabled = !this.drawEnabled
        }


        this.toolbar!.btnSave.onclick = (e: MouseEvent) => {
            this.save()
        }

        this.toolbar!.btnPointer.onclick = (e: MouseEvent) => {
            this.toolbar!.currentButton = (this.toolbar!.btnPointer)
            this.drawMode = drawModes.pointer
            this.cursorElement = undefined
            this.draw()
        }
        this.toolbar!.btnShapes.onclick = (e: MouseEvent) => {
            this.toolbar!.currentButton = (this.toolbar!.btnShapes)
            this.shapesModal!.show()
        }
        this.toolbar!.btnRemove.onclick = (e: MouseEvent) => {
            this.toolbar!.currentButton = (this.toolbar!.btnRemove)
            this.unselectAll()
            this.drawMode = drawModes.remove
            this.cursorElement = undefined
            this.draw()
        }
        this.toolbar!.btnFitToPage.onclick = (e: MouseEvent) => {
            this.originX = 0;
            this.originY = 0;
            var r = { x1: 1000, y1: 1000, x2: 0, y2: 0 }

            this.views.elements.forEach((elem: View) => {
                if (elem.x < r.x1) {
                    r.x1 = elem.x
                }
                if (elem.x > r.x2) {
                    r.x2 = elem.x
                }
                if (elem.y < r.y1) {
                    r.y1 = elem.y
                }
                if (elem.y > r.y2) {
                    r.y2 = elem.y
                }
            });

            console.log("RECT:", r)
            var rw = Math.floor((r.x2 - r.x1) / 2)
            var rh = Math.floor((r.y2 - r.y1) / 2)
            var cw = Math.floor((this.canvas.width / this.scale / this.gridSizeX) / 2)
            var ch = Math.floor((this.canvas.height / this.scale / this.gridSizeY) / 2)
            var dx = Math.floor(r.x1 + rw - cw)
            var dy = Math.floor(r.y1 + rh - ch)
            this.width = this.canvas.width / this.scale
            this.height = this.canvas.height / this.scale
            this.views.elements.forEach((elem: View) => {
                elem.x -= dx + 1
                elem.y -= dy + 1
            })
            this.draw()
        }

        this.toolbar!.btnRotateRight.onclick = (e: MouseEvent) => {
            if (this.selectedElement) {
                this.selectedElement.rotateRight()
                this.draw()
            }
        }
        this.toolbar!.btnRotateRight.classList.add("disabled")

        this.toolbar!.btnMoveToTop.onclick = (e: MouseEvent) => {
            if (this.selectedElement) {
                var i = this.views.elements.indexOf(this.selectedElement)
                moveToStart(this.views.elements, i)
                this.draw()
            }
        }
        this.toolbar!.btnMoveToTop.classList.add("disabled")

        this.toolbar!.btnMoveToBottom.onclick = (e: MouseEvent) => {
            if (this.selectedElement) {
                var i = this.views.elements.indexOf(this.selectedElement)
                moveToEnd(this.views.elements, i)
                this.draw()
            }
        }
        this.toolbar!.btnMoveToBottom.classList.add("disabled")

        document.addEventListener('keydown', (e) => {
            const target = e.target as HTMLElement;
            if (target.localName == 'property-panel') {
                // Ne csinálj semmit, ha az esemény egy szerkeszthető mezőben történt
                return;
            }

            if (e.key === 'r' || e.key === 'R') {
                if (this.cursorElement && this.cursorElement.canRotate) {
                    this.cursorElement.rotateRight()
                    this.draw()

                }
                else if (this.selectedElement && this.selectedElement.canRotate) {
                    this.selectedElement.rotateRight()
                    this.draw()
                    this.selectedElement.draw(this.ctx!)
                }
            }
            else if (e.key.toLowerCase() == 'delete') {
                if (this.selectedElement) {
                    this.removeElement(this.selectedElement)
                }
            }
            else if (e.key.toLowerCase() == 'escape') {
                this.drawMode = drawModes.pointer
            }
        })

        this.propertyPanel!.btnClose.onclick = ((e: MouseEvent) => {
            this.propertyPanelVisibility = false
        })

        this.propertyPanelVisibility = localStorage.getItem("propertyPanelVisibility") == "true"
        this.toolbar!.btnProperties!.onclick = (e: MouseEvent) => {
            this.propertyPanelVisibility = !this.propertyPanelVisibility
        }


        this.toolbar!.btnAppSettings.onclick = (e: MouseEvent) => {
            const d = new AppSettingsDialog()
            d.onclose = (sender) => {
                if (d.dialogResult == DialogResult.ok) {
                    Globals.Settings.EditorSettings.ShowGrid = d.showGrid.checked
                    Globals.Settings.EditorSettings.ShowAddress = d.showAddress.checked
                    Globals.Settings.Dispacher.interval = d.intervalElement.value
                    Globals.Settings.EditorSettings.ShowClock = d.showClock.checked
                    this.fastClock!.visible = d.showClock.checked
                    Globals.Settings.EditorSettings.fastClockFactor = d.fastClockFactor.value
                    this.fastClock!.setScaleFactor(d.fastClockFactor.value)
                    Globals.saveJson("/settings.json", Globals.Settings)
                    //this.draw()
                    this.showAddresses(Globals.Settings.EditorSettings.ShowAddress)
                }
            }
        }

        Dispatcher.onchange = () => {
            if (Dispatcher.active) {
                this.toolbar!.btnDispatcher.classList.add("active")
            } else {
                this.toolbar!.btnDispatcher.classList.remove("active")
            }
        }
        Dispatcher.onerror = (msg, err) => {
            alert(msg + '\n\n' + err)
            Dispatcher.active = false;
        }

        this.toolbar!.btnDispatcher.onclick = (e: MouseEvent) => {
            Dispatcher.active = !Dispatcher.active;
        }
        this.toolbar!.btnCodeEditor.onclick = (e: MouseEvent) => {
            const codeEditor = new CodeEditor()
        }

        this.toolbar!.btnLoco.onclick = (e: MouseEvent) => {
            this.locoControlPanelVisibility = !this.locoControlPanelVisibility
        }
        this.sidePanelLeft = document.getElementById('sidePanelLeft') as HTMLDivElement;
        this.btnSidePanelLeftClose = document.getElementById('btnSidePanelLeftClose') as HTMLDivElement;
        this.btnSidePanelLeftClose.onclick = (e: MouseEvent) => {
            this.locoControlPanelVisibility = false
        }
        this.locoControlPanel = document.getElementById('locoControlPanel') as LocoControlPanel
        this.locoControlPanelVisibility = localStorage.getItem("locoControlPanelVisibility") == "true"

    }
    showAddresses(show: boolean) {
        this.views.getTurnoutElements().forEach((t) => {
            t.showAddress = show;
        })
        this.views.getSignalElements().forEach((t) => {
            t.showAddress = show;
        })
        this.draw()
    }


    private _drawEnabled: boolean = false;
    public get drawEnabled(): boolean {
        return this._drawEnabled;
    }
    public set drawEnabled(v: boolean) {
        this._drawEnabled = v;
        localStorage.setItem("drawEnabled", v ? "true" : "false")
        this.toolbar!.toolbarEdit.style.display = this.drawEnabled ? "block" : "none"
        this.toolbar!.toolbarPlay.style.display = !this.drawEnabled ? "block" : "none"
        if (!this.drawEnabled) {
            this.unselectAll();
            this.cursorElement = undefined
            //this.propertyPanel!.visible = false
            this.propertyPanelVisibility = v
            this.toolbar?.btnProperties.classList.remove("active")
            this.toolbar!.btnEdit.classList.remove("active")
        }
        else {
            this.toolbar!.btnEdit.classList.add("active")
        }

    }


    
    private _locoControlPanelVisibility : boolean = false;
    public get locoControlPanelVisibility() : boolean {
        return this._locoControlPanelVisibility;
    }
    public set locoControlPanelVisibility(v : boolean) {
        this._locoControlPanelVisibility = v;
        localStorage.setItem("locoControlPanelVisibility", v ? "true" : "false")

        if (v) {
            this.toolbar!.btnLoco.classList.add("active")
            this.sidePanelLeft!.classList.remove('hide');
            this.sidePanelLeft!.classList.add('show');
        } else {
            this.toolbar!.btnLoco.classList.remove("active")
            this.sidePanelLeft!.classList.remove('show');
            this.sidePanelLeft!.classList.add('hide');
        }


    }
    

    private _propertyPanaelVisibility: boolean = false;
    public get propertyPanelVisibility(): boolean {
        return this._propertyPanaelVisibility;
    }
    public set propertyPanelVisibility(v: boolean) {
        this._propertyPanaelVisibility = v;
        localStorage.setItem("propertyPanelVisibility", v ? 'true' : 'false')
        if (v) {
            this.propertyPanel!.visible = v
            this.toolbar?.btnProperties.classList.add("active")
        } else {
            this.propertyPanel!.visible = v
            this.toolbar?.btnProperties.classList.remove("active")

        }
    }


    private _selectedElement: View | undefined;
    public get selectedElement(): View | undefined {
        return this._selectedElement;
    }
    public set selectedElement(v: View | undefined) {
        //requestAnimationFrame(() => {
        if (this._selectedElement !== v) {

            //this.toolbar!.btnProperties.classList.add("disabled")
            this.toolbar!.btnRotateRight.classList.add("disabled")
            // this.toolbar!.btnRotateLeft.classList.add("disabled")
            // this.toolbar!.btnMoveDown.classList.add("disabled")
            // this.toolbar!.btnMoveUp.classList.add("disabled")
            this.toolbar!.btnMoveToTop.classList.add("disabled")
            this.toolbar!.btnMoveToBottom.classList.add("disabled")

            if (this._selectedElement) {
                this._selectedElement!.isSelected = false
                this._selectedElement = undefined
            }
        }
        this._selectedElement = v;

        //window.requestAnimationFrame(() => {
        if (this._selectedElement) {
            if (this._selectedElement.canRotate) {
                this.toolbar!.btnRotateRight.classList.remove("disabled")
            } else {
                this.toolbar!.btnRotateRight.classList.add("disabled")
            }
            this.toolbar!.btnMoveToTop.classList.remove("disabled")
            this.toolbar!.btnMoveToBottom.classList.remove("disabled")

            if (Object.getPrototypeOf(v) == RouteSwitchElement.prototype) {
                var rs = v as RouteSwitchElement;
                rs.tag = this.views.getTurnoutElements().sort((a, b) => a.address - b.address);
                this.propertyPanel!.selectedObject = rs
            } else {
                this.propertyPanel!.selectedObject = this._selectedElement!
            }
        } else {
            this.propertyPanel!.selectedObject = undefined
        }
        //})

        this.draw();
        //})
    }


    private _cursorElement: View | undefined;
    public get cursorElement(): View {
        return this._cursorElement!;
    }
    public set cursorElement(v: View | undefined) {
        this._cursorElement = v;
        if (this.cursorElement) {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = this.globalX - rect.left
            this.mouseY = this.globalY - rect.top
            this.cursorElement!.x = this.getMouseGridX()
            this.cursorElement!.y = this.getMouseGridY()
            this.cursorElement.draw(this.ctx!)
        }
        this.draw()
        this.setCanvasCursor();
    }

    private drawGrid() {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;

        // Skálázott grid méret
        const scaledGridX = Globals.GridSizeX * this.scale;
        const scaledGridY = Globals.GridSizeY * this.scale;

        // Bal felső sarok világ koordinátái
        const startX = Math.floor(-this.originX / scaledGridX) * Globals.GridSizeX;
        const startY = Math.floor(-this.originY / scaledGridY) * Globals.GridSizeY;

        if (this.ctx) {
            // Háttér kitöltése
            //this.ctx.fillStyle = 'whitesmoke';
            //this.ctx.fillRect(0, 0, this.width, this.height);

            // Grid vonalak
            this.ctx.beginPath();
            this.ctx.strokeStyle = "#eee";
            this.ctx.lineWidth = 1;

            // Vízszintes vonalak
            for (
                let y = startY;
                y <= startY + (canvasHeight / this.scale) + Globals.GridSizeX;
                y += Globals.GridSizeY
            ) {
                const screenY = (y - this.originY) * this.scale;
                this.ctx.moveTo(startX, y);
                this.ctx.lineTo(this.originX + canvasWidth * scaledGridY, y);
            }

            // Függőleges vonalak
            for (
                let x = startX;
                x <= startX + (canvasWidth / this.scale) + Globals.GridSizeX;
                x += Globals.GridSizeX
            ) {
                const screenX = (x - this.originX) * this.scale;
                this.ctx.moveTo(x, startY);
                this.ctx.lineTo(x, this.originY + canvasHeight * scaledGridY);
            }

            this.ctx.stroke();

            // Koordináta-rendszer origó pirossal
            this.ctx.beginPath();


            this.ctx.stroke();
        }
    }

    draw() {
        requestAnimationFrame(() => {
            this.ctx!.reset()
            this.ctx!.resetTransform();
            this.ctx!.translate(this.originX, this.originY)
            this.ctx!.scale(this.scale, this.scale)

            if (Globals.Settings.EditorSettings.ShowGrid) {
                this.drawGrid()
            }

            this.views.elements.slice().reverse().forEach(elem => {
                elem.draw(this.ctx!)
            });

            if (this.cursorElement) {
                this.cursorElement.draw(this.ctx!)
            }

            this.drawStatus()

            if (Globals.Settings.EditorSettings.ShowClock) {
                this.ctx!.setTransform(1, 0, 0, 1, 0, 0);
                this.fastClock!.draw()
            }
        })

    }

    getMouseX(e: MouseEvent): number {
        return e.offsetX - this.originX
    }
    getMouseY(e: MouseEvent): number {
        return e.offsetY - this.originY
    }
    get gridSizeX(): number {
        return Globals.GridSizeX //* this.scale
    }
    get gridSizeY(): number {
        return Globals.GridSizeY //* this.scale
    }
    handleMouseDown(e: MouseEvent): any {
        e.preventDefault()

        this.dragEnabled = true
        this.downX = e.offsetX
        this.downY = e.offsetY
        if (this.drawEnabled) {


            var offsetX = this.getMouseX(e)
            var offsetY = this.getMouseY(e)


            if (e.button <= 1) {
                var x = this.getMouseGridX()
                var y = this.getMouseGridY()
                var elem = this.views.elements.find((e) => {
                    //return e.x == x && e.y == y
                    return e.mouseInView(x, y)
                })

                if (this.drawMode == drawModes.pointer) {

                    if (elem) {
                        if (this.selectedElement) {
                            // this.selectedElement.isSelected = false;
                        }
                        this.selectedElement = elem
                        this.selectedElement.isSelected = true;
                    } else {
                        this.unselectAll()
                    }
                }
                this.draw()

            }
        } else {

        }

    }

    private add(view: View) {
        this.views.add(view)
        if (Object.getPrototypeOf(view) == RouteSwitchElement.prototype) {
            view.mouseDownHandler = ((sender: any) => {
                var rs = view as RouteSwitchElement
                rs.setRoute(0, this.views.getTurnoutElements())
            })
        }


    }
    private handleMouseUp(e: MouseEvent) {
        this.dragEnabled = false
        x = this.getMouseGridX()
        y = this.getMouseGridY()
        if (this.drawEnabled) {
            if (e.button === 2) {
                var dx = e.offsetX - this.downX;
                var dy = e.offsetY - this.downY;
                this.originX += dx / this.scale
                this.originY += dy / this.scale
                this.draw()
                return;
            }

            e.preventDefault()
            if (this.drawMode == drawModes.pointer && !this.selectedElement) {
                return
            }

            var offsetX = this.getMouseX(e)
            var offsetY = this.getMouseY(e)

            var x = Math.trunc(offsetX / this.gridSizeX)
            var y = Math.trunc(offsetY / this.gridSizeY)
            x = this.getMouseGridX()
            y = this.getMouseGridY()

            var elem = this.views.elements.find((e) => {
                //return e.x == x && e.y == y
                return e.mouseInView(x, y)
            })

            // Csak ha nem lett elmozgatva!
            if (this.lastX == x && this.lastY == y) {
                if (elem && elem.isSelected && elem.name === this.selectedElement?.name) {
                    elem.mouseDown(e)
                    // this.selectedElement = elem
                    this.draw()
                    return

                }
            }
            this.lastX = x;
            this.lastY = y;
            const num = this.views.elements.length + 1
            switch (this.drawMode) {
                case drawModes.pointer:
                    break
                case drawModes.remove:
                    var elem = this.findElement(x, y)
                    if (elem) {
                        this.removeElement(elem)
                    }
                    break
                case drawModes.track:
                    this.removeIfExists(x, y)
                    var te = new TrackElement(getUUID(), x, y, "track" + num);
                    te.angle = this.cursorElement!.angle
                    // te.cc = Globals.defaultDevice!
                    this.unselectAll()
                    this.add(te)
                    break
                case drawModes.trackEnd:
                    this.removeIfExists(x, y)
                    var te = new TrackEndElement(getUUID(), x, y, "trackEnd" + num);
                    te.angle = this.cursorElement!.angle
                    // te.cc = Globals.defaultDevice!
                    this.unselectAll()
                    this.add(te)
                    break
                case drawModes.trackCorner:
                    this.removeIfExists(x, y)
                    var tc = new TrackCornerElement(getUUID(), x, y, "corner" + num);
                    tc.angle = this.cursorElement!.angle
                    // tc.cc = Globals.defaultDevice!
                    this.unselectAll()
                    this.add(tc)
                    break
                case drawModes.trackCurve:
                    this.removeIfExists(x, y)
                    var tc = new TrackCurveElement(getUUID(), x, y, "curve" + num);
                    tc.angle = this.cursorElement!.angle
                    // tc.cc = Globals.defaultDevice!
                    this.unselectAll()
                    this.add(tc)
                    break
                case drawModes.rect:
                    this.removeIfExists(x, y)
                    var rectangle = new RectangleElement(getUUID(), x, y, "rect" + num);
                    this.unselectAll()
                    rectangle.isSelected = true
                    this.add(rectangle)
                    break
                case drawModes.turnoutRight:
                    this.removeIfExists(x, y)
                    this.unselectAll()
                    var tor = new TurnoutRightElement(getUUID(), 14, x, y, "turnoutRight" + num);
                    tor.showAddress = Globals.Settings.EditorSettings.ShowAddress
                    tor.angle = this.cursorElement!.angle
                    // tor.cc = Globals.defaultDevice!
                    this.add(tor)
                    break
                case drawModes.turnoutLeft:
                    this.removeIfExists(x, y)
                    this.unselectAll()
                    var tol = new TurnoutLeftElement(getUUID(), 14, x, y, "turnoutleft" + num);
                    tol.showAddress = Globals.Settings.EditorSettings.ShowAddress
                    tol.angle = this.cursorElement!.angle
                    // tol.cc = Globals.defaultDevice!
                    this.add(tol)
                    break
                case drawModes.turnoutDouble:
                    this.removeIfExists(x, y)
                    this.unselectAll()
                    var tod = new TurnoutDoubleElement(getUUID(), 0, 0, x, y, "turnoutdouble" + num);
                    tod.showAddress = Globals.Settings.EditorSettings.ShowAddress
                    tod.angle = this.cursorElement!.angle
                    // tod.cc = Globals.defaultDevice!
                    this.add(tod)
                    break
                case drawModes.routeSwitch:
                    this.removeIfExists(x, y)
                    this.unselectAll()
                    var rs = new RouteSwitchElement(getUUID(), x, y, "routeSwitch" + num);
                    this.add(rs)
                    break;
                case drawModes.signal2:
                    this.removeIfExists(x, y)
                    this.unselectAll()
                    var s2 = new Signal2Element(getUUID(), 14, x, y, "turnoutleft" + num);
                    s2.showAddress = Globals.Settings.EditorSettings.ShowAddress
                    s2.angle = this.cursorElement!.angle
                    // s2.cc = Globals.defaultDevice!
                    s2.aspect = 1
                    this.add(s2)
                    break
                case drawModes.signal3:
                    this.removeIfExists(x, y)
                    this.unselectAll()
                    var s3 = new Signal3Element(getUUID(), 14, x, y, "turnoutleft" + num);
                    s3.showAddress = Globals.Settings.EditorSettings.ShowAddress
                    s3.angle = this.cursorElement!.angle
                    // s3.cc = Globals.defaultDevice!
                    s3.aspect = 1
                    this.add(s3)
                    break
                case drawModes.signal4:
                    this.removeIfExists(x, y)
                    this.unselectAll()
                    var s4 = new Signal4Element(getUUID(), 14, x, y, "turnoutleft" + num);
                    s4.showAddress = Globals.Settings.EditorSettings.ShowAddress
                    s4.angle = this.cursorElement!.angle
                    // s4.cc = Globals.defaultDevice!
                    s4.aspect = 1
                    this.add(s4)
                    break
                case drawModes.block:
                    this.removeIfExists(x, y)
                    this.unselectAll()
                    var b = new BlockElement(getUUID(), x, y, "block" + num);
                    b.angle = this.cursorElement!.angle
                    this.add(b)
                    break;
                case drawModes.button:
                    this.removeIfExists(x, y)
                    this.unselectAll()
                    var btn = new ButtonShapeElement(getUUID(), 0, x, y, "button" + num);
                    //b.angle = this.cursorElement!.angle
                    this.add(btn)
                    break;
                case drawModes.audiobutton:
                    this.removeIfExists(x, y)
                    this.unselectAll()
                    var abtn = new AudioButtonShapeElement(getUUID(), x, y, "audiobutton" + num);
                    this.add(abtn)
                    break;
                case drawModes.emergencybutton:
                    this.removeIfExists(x, y)
                    this.unselectAll()
                    var ebtn = new EmergencyButtonShapeElement(getUUID(), x, y, "emergencybutton" + num);
                    this.add(ebtn)
                    break;
                case drawModes.label2:
                    //this.removeIfExists(x, y)
                    this.unselectAll()
                    var l = new Label2Element(getUUID(), x, y, "label" + num);
                    this.add(l)
                    break;
                case drawModes.tree:
                    //this.removeIfExists(x, y)
                    this.unselectAll()
                    var tree = new TreeShapeElement(getUUID(), x, y, "tree" + num);
                    this.add(tree)
                    break;
            }

            this.draw()

        } else {
            var elem = this.views.elements.find((e) => {
                return e.x == x && e.y == y
            })

            if (elem) {
                if (Object.getPrototypeOf(elem) == Signal2Element.prototype) {
                    const popup = new dlgSignal2Select(elem as Signal2Element)
                    popup.setPosition(e.pageX, e.pageY);
                    popup.show();
                } else if (Object.getPrototypeOf(elem) == Signal3Element.prototype) {
                    const popup = new dlgSignal3Select(elem as Signal3Element)
                    popup.setPosition(e.pageX, e.pageY);
                    popup.show();
                } else if (Object.getPrototypeOf(elem) == Signal4Element.prototype) {
                    const popup = new dlgSignal4Select(elem as Signal4Element)
                    popup.setPosition(e.pageX, e.pageY);
                    popup.show();
                } else if (Object.getPrototypeOf(elem) == TurnoutDoubleElement.prototype) {
                    const popup = new turnoutDoublePopup(elem as TurnoutDoubleElement)
                    popup.setPosition(e.pageX, e.pageY);
                    popup.show();
                } else {
                    elem.mouseDown(e)
                    this.draw()
                }

            }
        }
    }



    private _drawMode: drawModes = drawModes.track;
    public get drawMode(): drawModes {
        return this._drawMode;
    }
    public set drawMode(v: drawModes) {
        this._drawMode = v;
        if (this.drawMode == drawModes.pointer) {
            this.selectedElement = undefined;
            this.cursorElement = undefined
            this.toolbar!.currentButton = this.toolbar!.btnPointer
            this.draw()
            this.setCanvasCursor()
        }

    }

    private setCanvasCursor() {
        var x = this.getMouseGridX()
        var y = this.getMouseGridY()
        var elem = this.views.elements.find((e) => {
            //return e.x == x && e.y == y
            return e.mouseInView(x, y)
        })
        if (elem || (this.cursorElement)) {
            this.canvas.style.cursor = "pointer"
        } else {
            this.canvas.style.cursor = "default"
        }

    }

    private handleMouseMove(e: MouseEvent) {
        if (!this.dragEnabled) {
            //return
        }
        this.mouseX = e.offsetX
        this.mouseY = e.offsetY

        this.setCanvasCursor();

        // var x = this.getMouseGridX()
        // var y = this.getMouseGridY()
        // var elem = this.views.elements.find((e) => {
        //     return e.x == x && e.y == y
        // })
        // if(elem || (this.cursorElement)) {
        //     this.canvas.style.cursor = "pointer"
        // } else {
        //     this.canvas.style.cursor = "default"
        // }



        // var offsetX = this.getMouseX(e)
        // var offsetY = this.getMouseY(e)

        if (e.buttons === 2) {
            const dx = e.offsetX - this.downX;
            const dy = e.offsetY - this.downY;
            this.originX += dx;
            this.originY += dy;
            this.downX = e.offsetX;
            this.downY = e.offsetY;
            this.draw();
            return
        }

        if (this.dragEnabled) {
            if (e.buttons === 1) {
                if (this.selectedElement) {
                    //this.selectedElement.x = this.getMouseGridX()
                    //this.selectedElement.y = this.getMouseGridY()
                    var x = this.getMouseGridX()
                    var y = this.getMouseGridY()
                    // var ee = this.findElement(x, y)
                    // if(ee && this.selectedElement != ee) {
                    //     this.selectedElement.bgColor ='#ff0000cc'
                    // } else {
                    //     this.selectedElement.bgColor = undefined
                    // }
                    this.selectedElement.move(x, y)
                    this.draw()
                }
            } if (this.drawMode == drawModes.pointer) {

            }
            else {

            }
        }
        if (this.cursorElement) {

            //this.cursorElement!.x = this.getMouseGridX()
            //this.cursorElement!.y = this.getMouseGridY()
            this.cursorElement.move(this.getMouseGridX(), this.getMouseGridY())

            this.draw()
            //this.cursorElement.draw(this.ctx!)
        }

        // this.mouseX = e.offsetX
        // this.mouseY = e.offsetY

        this.drawStatus()
    }

    private handleMouseWheel(e: WheelEvent) {
        if (this.ctx) {
            e.preventDefault();

            const rect = this.canvas.getBoundingClientRect();
            const mX = e.clientX - rect.left - 1;
            const mY = e.clientY - rect.top - 1;

            // Egér pozíciója az eredeti koordinátarendszerben
            const originalX = (e.offsetX - this.originX) / this.scale;
            const originalY = (e.offsetY - this.originY) / this.scale;

            // Skálázás módosítása
            var zoomFactor = e.deltaY < 0 ? 1.05 : 0.95;
            this.scale *= zoomFactor;
            if (this.scale > 3) {
                this.scale = 3
            } else if (this.scale < 0.2) {
                this.scale = 0.2
            }



            // Új eltolás kiszámítása (figyelve, hogy a skála már alkalmazva lesz az eltolásra)
            this.originX = Math.round(mX - originalX * this.scale);
            this.originY = Math.round(mY - originalY * this.scale);


            this.draw();
        }
    }
    getMouseGridX() {
        // const scaledGridX = this.gridSizeX * this.scale;
        const worldX = (this.mouseX - this.originX) / this.scale;
        return Math.floor(worldX / this.gridSizeX);
    }
    getMouseGridY() {
        // const scaledGridY = this.gridSizeY * this.scale;
        const worldY = (this.mouseY - this.originY) / this.scale;
        return Math.floor(worldY / this.gridSizeY);
    }
    drawStatus() {
        if (this.statusbar) {
            this.statusbar.innerHTML = `Status| x: ${this.getMouseGridX()} y: ${this.getMouseGridY()} Elements: ${this.views.elements.length} Scale: ${this.scale} origX: ${this.originX} origY: ${this.originY}`
        }
    }
    unselectAll() {
        this.views.elements.forEach((e) => {
            e.isSelected = false;
        })
        this.selectedElement = undefined
        this.draw()
    }

    exists(elem: RailView) {

    }

    removeIfExists(x: number, y: number) {
        var e = this.findElement(x, y)
        if (e) {
            this.removeElement(e)
        }
    }

    findElement(x: number, y: number) {
        return this.views.elements.find((e) => {
            return e.x == x && e.y == y
        })
    }

    removeElement(elem: View) {
        if (elem) {
            var index = this.views.getElements().indexOf(elem)
            if (index > -1) {
                this.views.elements.splice(index, 1)
            }
            if (elem === this.selectedElement) {
                this.selectedElement = undefined
            }
        }
    }

    save() {
        //var elems = JSON.stringify(this.elements)

        // Duplikált címek ellenőrzése!

        var elems: any[] = []
        this.views.elements.forEach((elem) => {
            var view = elem as RailView
            switch (elem.type) {
                case 'track':
                    var l = elem as TrackElement
                    elems.push({
                        uuid: l.UUID, type: l.type, name: l.name, x: l.x, y: l.y, angle: l.angle,
                        // cc: l.cc,
                        rbusAddress: l.rbusAddress
                    })
                    break;
                case 'trackEnd':
                    var te = elem as TrackEndElement
                    elems.push({
                        uuid: te.UUID, type: te.type, name: te.name, x: te.x, y: te.y, angle: te.angle,
                        // cc: te.cc,
                        rbusAddress: te.rbusAddress
                    })
                    break;
                case 'turnoutRight':
                    var tor = elem as TurnoutRightElement
                    elems.push({
                        uuid: tor.UUID, type: tor.type, name: tor.name, x: tor.x, y: tor.y, address: tor.address, angle: tor.angle,
                        //t1Closed: tor.t1Closed, t1ClosedValue: tor.t1ClosedValue, t1OpenValue: tor.t1OpenValue,
                        t1ClosedValue: tor.t1ClosedValue,
                        t1OpenValue: tor.t1OpenValue,
                        rbusAddress: tor.rbusAddress,
                        // cc: tor.cc
                    })
                    break;
                case 'turnoutLeft':
                    var tol = elem as TurnoutLeftElement
                    elems.push({
                        uuid: tol.UUID, type: tol.type, name: tol.name, x: tol.x, y: tol.y, address: tol.address, angle: tol.angle,
                        //t1Closed: tol.t1Closed, t1ClosedValue: tol.t1ClosedValue, t1OpenValue: tol.t1OpenValue,
                        t1ClosedValue: tol.t1ClosedValue,
                        t1OpenValue: tol.t1OpenValue,
                        rbusAddress: tol.rbusAddress,
                        // cc: tol.cc
                    })
                    break;
                case 'turnoutDouble':
                    var tod = elem as TurnoutDoubleElement
                    elems.push({
                        uuid: tod.UUID, type: tod.type, name: tod.name, x: tod.x, y: tod.y, address1: tod.address, address2: tod.address2, angle: tod.angle,
                        // t1Closed: tod.t1Closed, t1ClosedValue: tod.t1ClosedValue, t1OpenValue: tod.t1OpenValue,
                        // t2Closed: tod.t2Closed, t2ClosedValue: tod.t2ClosedValue, t2OpenValue: tod.t2OpenValue,
                        t1ClosedValue: tod.t1ClosedValue,
                        t1OpenValue: tod.t1OpenValue,
                        t2ClosedValue: tod.t2ClosedValue,
                        t2OpenValue: tod.t2OpenValue,
                        rbusAddress: tod.rbusAddress,
                        // cc: tod.cc
                    })
                    break;
                case 'curve':
                    var co = elem as TrackCurveElement
                    elems.push({
                        uuid: co.UUID, type: co.type, name: co.name, x: co.x, y: co.y, angle: co.angle,
                        // cc: co.cc,
                        rbusAddress: co.rbusAddress
                    })
                    break;
                case 'corner':
                    var cu = elem as TrackCornerElement
                    elems.push({
                        uuid: cu.UUID, type: cu.type, name: cu.name, x: cu.x, y: cu.y, angle: cu.angle,
                        // cc: cu.cc,
                        rbusAddress: cu.rbusAddress
                    })
                    break;
                case 'block':
                    var bl = elem as BlockElement
                    elems.push({
                        uuid: bl.UUID, type: bl.type, name: bl.name, x: bl.x, y: bl.y, angle: bl.angle,
                        locoAddress: bl.locoAddress
                    })
                    break;
                case 'label2':
                    var la = elem as Label2Element
                    elems.push({
                        uuid: la.UUID, type: la.type, name: la.name, x: la.x, y: la.y, angle: 0,
                        text: la.text,
                        valign: la.valign
                    })
                    break;
                case 'routeSwitch':
                    var rs = elem as RouteSwitchElement
                    elems.push({ uuid: rs.UUID, type: rs.type, name: rs.name, x: rs.x, y: rs.y, turnouts: rs.turnouts })
                    break;
                case 'signal2':
                    var s2 = elem as Signal2Element
                    elems.push({
                        uuid: s2.UUID, type: s2.type, address: s2.address, name: s2.name, x: s2.x, y: s2.y, angle: s2.angle,
                        addressLength: s2.addressLength,
                        isExtendedDecoder: s2.isExtendedDecoder,
                        valueGreen: s2.valueGreen,
                        valueRed: s2.valueRed,
                        rbusAddress: s2.rbusAddress,
                        // cc: s2.cc,
                        aspect: s2.aspect
                    })
                    break;
                case 'signal3':
                    var s3 = elem as Signal3Element
                    elems.push({
                        uuid: s3.UUID, type: s3.type, address: s3.address, name: s3.name, x: s3.x, y: s3.y, angle: s3.angle,
                        addressLength: s3.addressLength,
                        isExtendedDecoder: s3.isExtendedDecoder,
                        valueGreen: s3.valueGreen,
                        valueRed: s3.valueRed,
                        valueYellow: s3.valueYellow,
                        rbusAddress: s3.rbusAddress,
                        // cc: s3.cc,
                        aspect: s3.aspect
                    })
                    break;
                case 'signal4':
                    var s4 = elem as Signal4Element
                    elems.push({
                        uuid: s4.UUID, type: s4.type, address: s4.address, name: s4.name, x: s4.x, y: s4.y, angle: s4.angle,
                        addressLength: s4.addressLength,
                        isExtendedDecoder: s4.isExtendedDecoder,
                        valueGreen: s4.valueGreen,
                        valueRed: s4.valueRed,
                        valueYellow: s4.valueYellow,
                        valueWhite: s4.valueWhite,
                        rbusAddress: s4.rbusAddress,
                        // cc: s4.cc,
                        aspect: s4.aspect
                    })
                    break;
                // case 'signal5':
                //     var s5 = elem as Signal5Element
                //     elems.push({
                //         uuid: s5.UUID, type: s5.type, address: s5.address, name: s5.name, x: s5.x, y: s5.y, angle: s5.angle,
                //         addressLength: s5.addressLength,
                //         isExtendedDecoder: s5.isExtendedDecoder,
                //         valueGreen: s5.valueGreen,
                //         valueRed: s5.valueRed,
                //         valueYellow: s5.valueYellow,
                //         valueWhite: s5.valueWhite,
                //         valueBlue: s5.valueBlue,
                //         rbusAddress: s5.rbusAddress,
                //         device: s5.device
                //     })
                //     break;
                case 'button':
                    var b = elem as ButtonShapeElement
                    elems.push({
                        uuid: b.UUID, type: b.type, address: b.address, x: b.x, y: b.y, name: b.name,
                        valueOn: b.valueOn,
                        valueOff: b.valueOff
                    })
                    break;
                case 'audiobutton':
                    var ab = elem as AudioButtonShapeElement
                    elems.push({ uuid: ab.UUID, type: ab.type, x: ab.x, y: ab.y, name: ab.name, filename: ab.filename })
                    break;
                case 'emergencybutton':
                    var eb = elem as EmergencyButtonShapeElement
                    elems.push({ uuid: eb.UUID, type: eb.type, x: eb.x, y: eb.y, name: eb.name })
                    break;
                case 'tree':
                    var tree = elem as TreeShapeElement
                    elems.push({ uuid: tree.UUID, type: tree.type, x: tree.x, y: tree.y, name: tree.name })
                    break;


            }
        })

        var config = {
            settings: {
                scale: this.scale,
                origX: this.originX,
                origY: this.originY,
                // gridSizeX: Globals.EditorSettings.GridSizeX,
                // gridSizeY: Globals.EditorSettings.GridSizeY,
                // showAddress: Globals.EditorSettings.ShowAddress,
                // orientation: Globals.EditorSettings.Orientation,
                locoPanelVisible: this.sidePanelLeft?.classList.contains('show'),
                propertyPanelVisible: this.propertyPanel?.classList.contains('show')
            },
            pages: [
                { name: "page1", elems: elems },
            ],
        }

        Globals.configSave(config)
    }

    load(config: any) {

        this.views.elements.length = 0

        const defaults = { scale: 1, origX: 0, origY: 0, locoPanelVisible: false }

        try {

            if (config.settings) {
                this.scale = config.settings.scale ?? 1
                this.originX = config.settings.origX ?? 0
                this.originY = config.settings.origY ?? 0

            } else {
                config.settings = defaults;
            }

            //var elems = config.elems
            config.pages.forEach((page: any) => {
                page.elems.forEach((elem: any) => {
                    console.log(elem)
                    switch (elem.type) {
                        case "track":
                            var t = new TrackElement(elem.uuid, elem.x, elem.y, elem.name);
                            t.angle = elem.angle | 0
                            // t.cc = elem.cc
                            t.rbusAddress = elem.rbusAddress
                            this.add(t)
                            break;
                        case "trackEnd":
                            var te = new TrackEndElement(elem.uuid, elem.x, elem.y, elem.name);
                            te.angle = elem.angle | 0
                            // te.cc = elem.cc
                            te.rbusAddress = elem.rbusAddress
                            this.add(te)
                            break;
                        case "turnoutRight":
                            var tor = new TurnoutRightElement(elem.uuid, elem.address, elem.x, elem.y, elem.name);
                            tor.showAddress = Globals.Settings.EditorSettings.ShowAddress
                            tor.angle = elem.angle | 0
                            tor.t1ClosedValue = elem.t1ClosedValue ?? true
                            tor.t1OpenValue = elem.t1OpenValue ?? false
                            tor.rbusAddress = elem.rbusAddress
                            // tor.cc = elem.cc == undefined ? undefined : elem.cc
                            this.add(tor)
                            break;
                        case "turnoutLeft":
                            var tol = new TurnoutLeftElement(elem.uuid, elem.address, elem.x, elem.y, elem.name);
                            tol.showAddress = Globals.Settings.EditorSettings.ShowAddress
                            tol.angle = elem.angle | 0
                            tol.t1ClosedValue = elem.t1ClosedValue ?? true
                            tol.t1OpenValue = elem.t1OpenValue ?? false
                            tol.rbusAddress = elem.rbusAddress
                            // tol.cc = elem.cc == undefined ? undefined : elem.cc
                            this.add(tol)
                            break;
                        case "turnoutDouble":
                            var tod = new TurnoutDoubleElement(elem.uuid, elem.address1 ?? 0, elem.address2 ?? 0, elem.x, elem.y, elem.name);
                            tod.showAddress = Globals.Settings.EditorSettings.ShowAddress
                            tod.angle = elem.angle | 0

                            tod.t1ClosedValue = elem.t1ClosedValue ?? true
                            tod.t1OpenValue = elem.t1OpenValue ?? false

                            tod.t2ClosedValue = elem.t2ClosedValue ?? true
                            tod.t2OpenValue = elem.t2OpenValue ?? false
                            tod.rbusAddress = elem.rbusAddress
                            // tod.cc = elem.cc == undefined ? undefined : elem.cc

                            this.add(tod)
                            break;
                        case "curve":
                            var cu = new TrackCurveElement(elem.uuid, elem.x, elem.y, elem.name);
                            cu.angle = elem.angle | 0
                            // cu.cc = elem.cc
                            cu.rbusAddress = elem.rbusAddress
                            this.add(cu)
                            break;
                        case "corner":
                            var co = new TrackCornerElement(elem.uuid, elem.x, elem.y, elem.name);
                            co.angle = elem.angle | 0
                            // co.cc = elem.cc
                            co.rbusAddress = elem.rbusAddress
                            this.add(co)
                            break;
                        case "block":
                            var bl = new BlockElement(elem.uuid, elem.x, elem.y, elem.name);
                            bl.angle = elem.angle | 0
                            bl.locoAddress = elem.locoAddress | 0
                            this.add(bl)
                            break;
                        case "label2":
                            var l = new Label2Element(elem.uuid, elem.x, elem.y, elem.name);
                            console.log("LABEL:", l instanceof RailView);
                            l.text = elem.text ?? "LABEL"
                            l.valign = elem.valign
                            l.angle = 0
                            this.add(l)
                            break;
                        case "routeSwitch":
                            var rs = new RouteSwitchElement(elem.uuid, elem.x, elem.y, elem.name);
                            rs.turnouts = elem.turnouts
                            this.add(rs)
                            break;
                        case "signal2":
                            var s2 = new Signal2Element(elem.uuid, elem.address | 0, elem.x, elem.y, elem.name);
                            s2.angle = elem.angle ?? 0
                            s2.addressLength = elem.addressLength ?? 5
                            s2.isExtendedDecoder = s2.isExtendedDecoder ?? false;
                            s2.valueGreen = elem.valueGreen ?? 0
                            s2.valueRed = elem.valueRed ?? 0
                            s2.rbusAddress = elem.rbusAddress
                            // s2.cc = elem.cc == undefined ? undefined : elem.cc
                            s2.aspect = 1 // elem.aspect ?? 1
                            this.add(s2)
                            break;
                        case "signal3":
                            var s3 = new Signal3Element(elem.uuid, elem.address | 0, elem.x, elem.y, elem.name);
                            s3.angle = elem.angle ?? 0
                            s3.addressLength = elem.addressLength ?? 5
                            s3.isExtendedDecoder = s3.isExtendedDecoder ?? false;
                            s3.valueGreen = elem.valueGreen ?? 0
                            s3.valueRed = elem.valueRed ?? 0
                            s3.valueYellow = elem.valueYellow ?? 0
                            s3.rbusAddress = elem.rbusAddress
                            // s3.cc = elem.cc == undefined ? undefined : elem.cc
                            s3.aspect = 1; //elem.aspect ?? 1
                            this.add(s3)
                            break;
                        case "signal4":
                            var s4 = new Signal4Element(elem.uuid, elem.address | 0, elem.x, elem.y, elem.name);
                            s4.angle = elem.angle ?? 0
                            s4.addressLength = elem.addressLength ?? 5
                            s4.isExtendedDecoder = s4.isExtendedDecoder ?? false;
                            s4.valueGreen = elem.valueGreen ?? 0
                            s4.valueRed = elem.valueRed ?? 0
                            s4.valueYellow = elem.valueYellow ?? 0
                            s4.valueWhite = elem.valueWhite ?? 0
                            s4.rbusAddress = elem.rbusAddress
                            // s4.cc = elem.cc == undefined ? undefined : elem.cc
                            s4.aspect = 1 //elem.aspect ?? 1
                            this.add(s4)
                            break;
                        // case "signal5":
                        //     var s5 = new Signal5Element(elem.uuid, elem.address | 0, elem.x, elem.y, elem.name);
                        //     s5.angle = elem.angle ?? 0
                        //     s5.addressLength = elem.addressLength ?? 5
                        //     s5.isExtendedDecoder = s5.isExtendedDecoder ?? false;
                        //     s5.valueGreen = elem.valueGreen ?? 0
                        //     s5.valueRed = elem.valueRed ?? 0
                        //     s5.valueYellow = elem.valueYellow ?? 0
                        //     s5.valueWhite = elem.valueWhite ?? 0
                        //     s5.valueBlue = elem.valueBlue ?? 0
                        //     s5.rbusAddress = elem.rbusAddress
                        //     s5.device = elem.device == undefined ? undefined : elem.device

                        //     this.add(s5)
                        //     break;
                        case "button":
                            var b = new ButtonShapeElement(elem.uuid, elem.address, elem.x, elem.y, elem.name);
                            b.valueOff = elem.valueOff ?? false
                            b.valueOn = elem.valueOn ?? true
                            this.add(b)
                            break;
                        case "audiobutton":
                            var ab = new AudioButtonShapeElement(elem.uuid, elem.x, elem.y, elem.name);
                            ab.filename = elem.filename
                            this.add(ab)
                            break;
                        case "emergencybutton":
                            var eb = new EmergencyButtonShapeElement(elem.uuid, elem.x, elem.y, elem.name);
                            this.add(eb)
                            break;
                        case "tree":
                            var tree = new TreeShapeElement(elem.uuid, elem.x, elem.y, elem.name);
                            this.add(tree)
                            break;

                    }
                })
            })

            // const route1 = new RouteSwitchElement(this.ctx!, 2, 2, "route1")
            // this.add(route1)

            this.showAddresses(Globals.Settings.EditorSettings.ShowAddress)

            this.draw()
        } catch (error) {
            console.log(error)
        }

        // this.manager.addState(this.canvas.elements.elements)
    }

    // checkRoutes() {
    //     // var routeElements = this.views.getRouteSwitchElements()

    //     // routeElements.forEach((rswitch) => {
    //     //     const iturnouts = rswitch.turnouts
    //     //     iturnouts.forEach((it) => {
    //     //         var to = this.views.getTurnout(it.address)
    //     //         if (to) {

    //     //         }
    //     //     })
    //     // })

    // }
}

customElements.define('custom-canvas', CustomCanvas);
