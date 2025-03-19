var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
define(["require", "exports", "./track", "./rectangle", "./turnout", "./views", "bootstrap", "./curve", "./corner", "./signals", "./trackend", "./route", "../controls/dialog", "../../../common/src/dcc", "../dialogs/propertiyPanel", "./block", "../helpers/globals", "../dialogs/AppSettingsDialog", "../dialogs/dlgSignal2Select", "../dialogs/turnoutsPopup", "../helpers/ws", "./label", "../helpers/utility", "../dialogs/codeEditor", "./dispatcher", "./button", "./audioButton", "./clock", "./emergencyButton", "./tree", "./sensor", "./crossing", "./schedulerButton", "../helpers/api"], function (require, exports, track_1, rectangle_1, turnout_1, views_1, bootstrap, curve_1, corner_1, signals_1, trackend_1, route_1, dialog_1, dcc_1, propertiyPanel_1, block_1, globals_1, AppSettingsDialog_1, dlgSignal2Select_1, turnoutsPopup_1, ws_1, label_1, utility_1, codeEditor_1, dispatcher_1, button_1, audioButton_1, clock_1, emergencyButton_1, tree_1, sensor_1, crossing_1, schedulerButton_1, api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CustomCanvas = exports.drawModes = void 0;
    bootstrap = __importStar(bootstrap);
    console.log(propertiyPanel_1.PropertyPanel);
    var drawModes;
    (function (drawModes) {
        drawModes[drawModes["pointer"] = 1] = "pointer";
        drawModes[drawModes["track"] = 2] = "track";
        drawModes[drawModes["trackEnd"] = 3] = "trackEnd";
        drawModes[drawModes["turnoutLeft"] = 4] = "turnoutLeft";
        drawModes[drawModes["turnoutRight"] = 5] = "turnoutRight";
        drawModes[drawModes["turnoutDouble"] = 6] = "turnoutDouble";
        drawModes[drawModes["rect"] = 7] = "rect";
        drawModes[drawModes["remove"] = 8] = "remove";
        drawModes[drawModes["trackCorner"] = 9] = "trackCorner";
        drawModes[drawModes["trackCurve"] = 10] = "trackCurve";
        drawModes[drawModes["signal2"] = 11] = "signal2";
        drawModes[drawModes["signal3"] = 12] = "signal3";
        drawModes[drawModes["signal4"] = 13] = "signal4";
        drawModes[drawModes["signal5"] = 14] = "signal5";
        drawModes[drawModes["routeSwitch"] = 15] = "routeSwitch";
        drawModes[drawModes["none"] = 16] = "none";
        drawModes[drawModes["block"] = 17] = "block";
        drawModes[drawModes["label2"] = 18] = "label2";
        drawModes[drawModes["button"] = 19] = "button";
        drawModes[drawModes["audiobutton"] = 20] = "audiobutton";
        drawModes[drawModes["emergencybutton"] = 21] = "emergencybutton";
        drawModes[drawModes["tree"] = 22] = "tree";
        drawModes[drawModes["sensor"] = 23] = "sensor";
        drawModes[drawModes["trackCrossing"] = 24] = "trackCrossing";
        drawModes[drawModes["turnoutY"] = 25] = "turnoutY";
        drawModes[drawModes["scheduler"] = 26] = "scheduler";
    })(drawModes || (exports.drawModes = drawModes = {}));
    class CustomCanvas extends HTMLElement {
        constructor() {
            super();
            this.views = new views_1.Views();
            this.downX = 0;
            this.downY = 0;
            this.lastX = 0;
            this.lastY = 0;
            this.mouseX = 0;
            this.mouseY = 0;
            this.scale = 1;
            this.dragEnabled = false;
            this.globalX = 0;
            this.globalY = 0;
            this.pointerMap = new Map(); // Pointer ID-k mentése
            this.lastDistance = 0;
            this.previousDistance = null;
            this.previousMidpoint = null;
            this.zoomSensitivity = 0.5;
            this.panSensitivity = 1.0;
            this._drawEnabled = false;
            this._locoControlPanelVisibility = false;
            this._propertyPanaelVisibility = false;
            this._drawMode = drawModes.track;
            this.originX = 0;
            this.originY = 0;
            //this.views = new Views()
            this.canvas = document.createElement('canvas');
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = `<style>canvas { border: 1px solid #000; display: block; margin:0; padding: 0}</style>`;
            shadow.appendChild(this.canvas);
            window.addEventListener('propertiesChanged', () => {
                this.draw();
            });
            window.invalidate = () => {
                this.draw();
            };
            window.addEventListener('taskChangedEvent', (e) => {
                var task = e.detail;
                const btn = api_1.Api.getTaskButton(task.name);
                if (btn) {
                    if (btn.status != task.status) {
                        btn.status = task.status;
                        this.draw();
                    }
                }
            });
            // window.taskChanged = (task: Task) => {
            //     const t = Api.getTaskButton(task.name)    
            //     if(t) {
            //         t.status = task.status
            //     }
            // }
            window.powerChanged = (power) => {
                this.locoControlPanel.power = power;
                this.draw();
            };
            window.addEventListener("mousemove", (e) => {
                this.globalX = e.clientX;
                this.globalY = e.clientY;
            });
            this.canvas.addEventListener('contextmenu', (event) => {
                event.preventDefault();
            });
        }
        connectedCallback() {
            // this.width = parseInt(this.getAttribute('width') || '100vw');
            // this.height = parseInt(this.getAttribute('height') || '100vw');
            this.canvas.width = this.parentElement.offsetWidth;
            this.canvas.height = this.parentElement.offsetHeight;
            this.ctx = this.canvas.getContext('2d');
            this.fastClock = new clock_1.FastClock(this.ctx);
            this.drawGrid();
            this.propertyPanel = document.getElementById("EditorPropertyPanel");
        }
        // convertToMouse(ev: TouchEvent) {
        //     if (ev.touches.length == 1) {
        //         var type = "";
        //         switch (ev.type) {
        //             case "touchstart":
        //                 type = "mousedown"; break;
        //             case "touchmove":
        //                 type = "mousemove"; break;
        //             case "touchend":
        //                 type = "mouseup"; break;
        //             default:
        //                 return;
        //         }
        //         var touch = ev.changedTouches[0];
        //         var simulatedEvent = document.createEvent("MouseEvent");
        //         simulatedEvent.initMouseEvent(type, true, true, window, 1, 
        //                 touch.screenX, touch.screenY, 
        //                 touch.clientX, touch.clientY, false, 
        //                 false, false, false, 0, null);
        //         touch.target.dispatchEvent(simulatedEvent);
        //         ev.preventDefault();
        //     }
        // }
        convertTouchEventToMouseEvent(event, eventType) {
            event.preventDefault();
            const touch = event.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            if (!touch) {
                var e = new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    clientX: this.lastTouch.clientX - rect.left,
                    clientY: this.lastTouch.clientY - rect.top,
                    screenX: this.lastTouch.screenX,
                    screenY: this.lastTouch.screenY,
                    button: 0,
                    buttons: 1
                });
                this.handleMouseUp(e);
                return;
            }
            this.lastTouch = touch;
            this.downX = touch.clientX - rect.left;
            this.downY = touch.clientY - rect.top;
            try {
                var e = new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    clientX: touch.clientX - rect.left,
                    clientY: touch.clientY - rect.top,
                    screenX: touch.screenX,
                    screenY: touch.screenY,
                    // button: 0,
                    // buttons: 1
                    button: 1,
                    buttons: 1
                });
                switch (eventType) {
                    case "mousedown":
                        this.handleMouseDown(e);
                        break;
                    case "mouseup":
                        this.handleMouseUp(e);
                        break;
                    case "mousemove":
                        this.handleMouseMove(e);
                        break;
                    default:
                        alert("EventType: " + eventType);
                        break;
                }
            }
            catch (error) {
                alert("Error" + error);
            }
            return;
            // // if (event.touches.length === 2) {
            // //     const touch1 = event.touches[0];
            // //     const touch2 = event.touches[1];
            // //     const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
            // //     if (this.previousDistance !== null && this.previousDistance != distance) {
            // //         const deltaY = (this.previousDistance - distance) ;
            // //         const wheelEvent = new WheelEvent("wheel", {
            // //             bubbles: true,
            // //             cancelable: true,
            // //             deltaY: deltaY,
            // //             clientX: touch1.clientX,
            // //             clientY: touch1.clientY,
            // //             screenX: touch1.screenX,
            // //             screenY: touch1.screenY,
            // //         });
            // //         this.handleMouseWheel(wheelEvent);
            // //     }
            // //     this.previousDistance = distance;
            // //     return
            // // } else {
            // //     this.previousDistance = null;
            // // }        
            // if (event.touches.length === 2) {
            //     const touch1 = event.touches[0];
            //     const touch2 = event.touches[1];
            //     const midpoint = {
            //         x: (touch1.clientX + touch2.clientX) / 2,
            //         y: (touch1.clientY + touch2.clientY) / 2
            //     };
            //     const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
            //     if (this.previousDistance !== null && this.previousMidpoint !== null) {
            //         if (Math.abs(this.previousDistance - distance) > 2) {
            //             // Handle zoom
            //             const deltaY = (this.previousDistance - distance) * this.zoomSensitivity;
            //             const wheelEvent = new WheelEvent("wheel", {
            //                 bubbles: true,
            //                 cancelable: true,
            //                 deltaY: deltaY,
            //                 clientX: this.previousMidpoint.x - rect.left,
            //                 clientY: this.previousMidpoint.y - rect.top,
            //                 screenX: touch.screenX,
            //                 screenY: touch.screenY,
            //             });
            //             this.handleMouseWheel(wheelEvent);
            //         } else {
            //             // Handle panning (two-finger drag)
            //             const deltaX = (midpoint.x - this.previousMidpoint.x) * this.panSensitivity;
            //             const deltaY = (midpoint.y - this.previousMidpoint.y) * this.panSensitivity;
            //             const moveEvent = new MouseEvent("mousemove", {
            //                 bubbles: true,
            //                 cancelable: true,
            //                 clientX: midpoint.x - rect.left,
            //                 clientY: midpoint.y - rect.top,
            //                 screenX: touch1.screenX,
            //                 screenY: touch1.screenY,
            //                 movementX: deltaX,
            //                 movementY: deltaY,
            //                 buttons: 2
            //             });
            //             this.handleMouseMove(moveEvent);
            //         }
            //     }
            //     this.previousDistance = distance;
            //     this.previousMidpoint = midpoint;
            // } else {
            //     this.previousDistance = null;
            //     this.previousMidpoint = null;
            // }
        }
        init() {
            //this.fastClock!.setScaleFactor(Globals.Settings.EditorSettings.fastClockFactor)
            this.statusbar = document.getElementById("statusbar");
            this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
            this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.canvas.addEventListener('wheel', (e) => this.handleMouseWheel(e));
            // this.canvas.ontouchstart = ((ev: TouchEvent) => {
            //     this.lastTouchEvent = ev;
            //     this.convertTouchEventToMouseEvent(ev, "mousedown")
            // }).bind(this)
            // this.canvas.ontouchend = ((ev:TouchEvent ) => {
            //     this.convertTouchEventToMouseEvent(ev, "mouseup")
            // }).bind(this);
            // this.canvas.ontouchcancel = ((ev: TouchEvent) => {
            //     this.lastTouchEvent = ev;
            //     this.convertTouchEventToMouseEvent(ev, "mouseup")
            // }).bind(this);
            // this.canvas.ontouchmove = (ev) => {
            //     this.lastTouchEvent = ev;
            //     this.convertTouchEventToMouseEvent(ev, "mousemove")
            // }
            this.cursorTrackElement = new track_1.TrackElement("", 0, 0, "cursor");
            this.cursorTrackElement.isSelected = true;
            this.cursorTrackEndElement = new trackend_1.TrackEndElement("", 0, 0, "cursor");
            this.cursorTrackEndElement.isSelected = true;
            this.cursorTrackCornerElement = new corner_1.TrackCornerElement("", 0, 0, "cursor");
            this.cursorTrackCornerElement.isSelected = true;
            this.cursorTrackCurveElement = new curve_1.TrackCurveElement("", 0, 0, "cursor");
            this.cursorTrackCurveElement.isSelected = true;
            this.cursorTrackCrossingElement = new crossing_1.TrackCrossingShapeElement("", 0, 0, "cursor");
            this.cursorTrackCrossingElement.isSelected = true;
            this.cursorTurnoutRightElement = new turnout_1.TurnoutRightElement("", 0, 0, 0, "cursor");
            this.cursorTurnoutRightElement.isSelected = true;
            this.cursorTurnoutLeftElement = new turnout_1.TurnoutLeftElement("", 0, 0, 0, "cursor");
            this.cursorTurnoutLeftElement.isSelected = true;
            this.cursorTurnoutYElement = new turnout_1.TurnoutYShapeElement("", 0, 0, 0, "cursor");
            this.cursorTurnoutYElement.isSelected = true;
            this.cursorTurnoutDoubleElement = new turnout_1.TurnoutDoubleElement("", 0, 0, 0, 0, "cursor");
            this.cursorTurnoutDoubleElement.isSelected = true;
            this.cursorSignal2Element = new signals_1.Signal2Element("", 10, 0, 0, "cursor");
            this.cursorSignal2Element.isSelected = true;
            this.cursorSignal3Element = new signals_1.Signal3Element("", 10, 0, 0, "cursor");
            this.cursorSignal3Element.isSelected = true;
            this.cursorSignal4Element = new signals_1.Signal4Element("", 10, 0, 0, "cursor");
            this.cursorSignal4Element.isSelected = true;
            this.cursorButtonElement = new button_1.ButtonShapeElement("", 0, 0, 0, "cursor");
            this.cursorButtonElement.isSelected = true;
            this.cursorAudioButtonElement = new audioButton_1.AudioButtonShapeElement("", 0, 0, "cursor");
            this.cursorAudioButtonElement.isSelected = true;
            this.cursorEmergencyButtonElement = new emergencyButton_1.EmergencyButtonShapeElement("", 0, 0, "cursor");
            this.cursorEmergencyButtonElement.isSelected = true;
            this.cursorSensorShapeElement = new sensor_1.SensorShapeElement("", 0, 0, 0, "cursor");
            this.cursorSensorShapeElement.isSelected = true;
            // this.cursorSignal5Element = new Signal5Element("", 10, 0, 0, "cursor");
            // this.cursorSignal5Element.isSelected = true
            this.routeSwitchElement = new route_1.RouteSwitchElement("", 0, 0, "cursor");
            this.routeSwitchElement.isSelected = true;
            this.cursorBlockElement = new block_1.BlockElement("", 0, 0, "cursor");
            this.cursorBlockElement.text = "---";
            this.cursorBlockElement.isSelected = true;
            this.cursorLabel2Element = new label_1.Label2Element("", 0, 0, "cursor");
            this.cursorLabel2Element.text = "LABEL";
            this.cursorLabel2Element.isSelected = true;
            this.cursorTreeShapeElement = new tree_1.TreeShapeElement("", 0, 0, "cursor");
            this.cursorTreeShapeElement.isSelected = true;
            this.cursorSchedulerButtonShapeElement = new schedulerButton_1.SchedulerButtonShapeElement("", 0, 0, "");
            this.cursorSchedulerButtonShapeElement.isSelected = true;
            const shapesModalElement = document.getElementById("shapesModal");
            this.shapesModal = new bootstrap.Modal(shapesModalElement);
            if (this.toolbar) {
            }
            else {
                alert("A toolbar nincs beállítva!");
            }
            document.getElementById("tbTrack").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.track;
                this.cursorElement = this.cursorTrackElement;
                this.cursorElement.draw(this.ctx);
            };
            document.getElementById("tbTrackEnd").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.trackEnd;
                this.cursorElement = this.cursorTrackEndElement;
            };
            document.getElementById("tbTrackCorner").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.trackCorner;
                this.cursorElement = this.cursorTrackCornerElement;
            };
            document.getElementById("tbTrackCurve").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.trackCurve;
                this.cursorElement = this.cursorTrackCurveElement;
            };
            document.getElementById("tbTrackCrossing").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.trackCrossing;
                this.cursorElement = this.cursorTrackCrossingElement;
            };
            document.getElementById("tbTurnoutLeft").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.turnoutLeft;
                this.cursorElement = this.cursorTurnoutLeftElement;
            };
            document.getElementById("tbTurnoutRight").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.turnoutRight;
                this.cursorElement = this.cursorTurnoutRightElement;
            };
            document.getElementById("tbTurnoutY").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.turnoutY;
                this.cursorElement = this.cursorTurnoutYElement;
            };
            document.getElementById("tbTurnoutDouble").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.turnoutDouble;
                this.cursorElement = this.cursorTurnoutDoubleElement;
            };
            document.getElementById("tbSignal2").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.signal2;
                this.cursorElement = this.cursorSignal2Element;
            };
            document.getElementById("tbSignal3").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.signal3;
                this.cursorElement = this.cursorSignal3Element;
            };
            document.getElementById("tbSignal4").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.signal4;
                this.cursorElement = this.cursorSignal4Element;
            };
            document.getElementById("tbRouteSwitch").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.routeSwitch;
                this.cursorElement = this.routeSwitchElement;
            };
            document.getElementById("tbButton").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.button;
                this.cursorElement = this.cursorButtonElement;
                this.cursorElement.draw(this.ctx);
            };
            document.getElementById("tbAudioButton").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.audiobutton;
                this.cursorElement = this.cursorAudioButtonElement;
                this.cursorElement.draw(this.ctx);
            };
            document.getElementById("tbEmergencyButton").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.emergencybutton;
                this.cursorElement = this.cursorEmergencyButtonElement;
                this.cursorElement.draw(this.ctx);
            };
            document.getElementById("tbTree").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.tree;
                this.cursorElement = this.cursorTreeShapeElement;
                this.cursorElement.draw(this.ctx);
            };
            document.getElementById("tbBlock").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.block;
                this.cursorElement = this.cursorBlockElement;
            };
            document.getElementById("tbLabel2").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.label2;
                this.cursorElement = this.cursorLabel2Element;
            };
            document.getElementById("tbSensor").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.sensor;
                this.cursorElement = this.cursorSensorShapeElement;
            };
            document.getElementById("tbScheduler").onclick = (e) => {
                this.shapesModal.hide();
                this.unselectAll();
                this.drawMode = drawModes.scheduler;
                this.cursorElement = this.cursorSchedulerButtonShapeElement;
            };
            this.drawEnabled = localStorage.getItem("drawEnabled") == "true";
            this.toolbar.btnEdit.onclick = (e) => {
                this.drawEnabled = !this.drawEnabled;
            };
            this.toolbar.btnSave.onclick = (e) => {
                this.save();
            };
            this.toolbar.btnPointer.onclick = (e) => {
                this.toolbar.currentButton = (this.toolbar.btnPointer);
                this.drawMode = drawModes.pointer;
                this.cursorElement = undefined;
                this.draw();
            };
            this.toolbar.btnShapes.onclick = (e) => {
                this.toolbar.currentButton = (this.toolbar.btnShapes);
                this.shapesModal.show();
            };
            this.toolbar.btnRemove.onclick = (e) => {
                this.toolbar.currentButton = (this.toolbar.btnRemove);
                this.unselectAll();
                this.drawMode = drawModes.remove;
                this.cursorElement = undefined;
                this.draw();
            };
            this.toolbar.btnFitToPage.onclick = (e) => {
                this.originX = 0;
                this.originY = 0;
                var r = { x1: 10000, y1: 10000, x2: -10000, y2: -10000 };
                this.views.elements.forEach((elem) => {
                    if (elem.x < r.x1) {
                        r.x1 = elem.x;
                    }
                    if (elem.x > r.x2) {
                        r.x2 = elem.x;
                    }
                    if (elem.y < r.y1) {
                        r.y1 = elem.y;
                    }
                    if (elem.y > r.y2) {
                        r.y2 = elem.y;
                    }
                });
                //console.log("RECT:", r)
                var rw = Math.round((r.x2 - r.x1) / 2);
                var rh = Math.round((r.y2 - r.y1) / 2);
                var cw = Math.round((this.canvas.width / this.scale / this.gridSizeX) / 2);
                var ch = Math.round((this.canvas.height / this.scale / this.gridSizeY) / 2);
                var dx = Math.round(r.x1 + rw - cw);
                var dy = Math.round(r.y1 + rh - ch);
                // this.width = this.canvas.width / this.scale
                // this.height = this.canvas.height / this.scale
                this.views.elements.forEach((elem) => {
                    elem.x -= dx;
                    elem.y -= dy + 1;
                });
                this.draw();
            };
            this.toolbar.btnRotateRight.onclick = (e) => {
                if (this.selectedElement) {
                    this.selectedElement.rotateRight();
                    this.draw();
                }
            };
            this.toolbar.btnRotateRight.classList.add("disabled");
            this.toolbar.btnMoveToTop.onclick = (e) => {
                if (this.selectedElement) {
                    var i = this.views.elements.indexOf(this.selectedElement);
                    (0, utility_1.moveToStart)(this.views.elements, i);
                    this.draw();
                }
            };
            this.toolbar.btnMoveToTop.classList.add("disabled");
            this.toolbar.btnMoveToBottom.onclick = (e) => {
                if (this.selectedElement) {
                    var i = this.views.elements.indexOf(this.selectedElement);
                    (0, utility_1.moveToEnd)(this.views.elements, i);
                    this.draw();
                }
            };
            this.toolbar.btnMoveToBottom.classList.add("disabled");
            document.addEventListener('keydown', (e) => {
                const target = e.target;
                if (target.localName == 'property-panel') {
                    // Ne csinálj semmit, ha az esemény egy szerkeszthető mezőben történt
                    return;
                }
                if (e.key === 'h' || e.key === 'H') {
                    this.toolbar.style.display = this.toolbar.style.display == "none" ? "block" : "none";
                    this.canvas.width = window.innerWidth;
                    this.canvas.height = window.innerHeight;
                    this.draw();
                }
                if (e.key === 'r' || e.key === 'R') {
                    if (this.cursorElement && this.cursorElement.canRotate) {
                        this.cursorElement.rotateRight();
                        this.draw();
                    }
                    else if (this.selectedElement && this.selectedElement.canRotate) {
                        this.selectedElement.rotateRight();
                        this.draw();
                        this.selectedElement.draw(this.ctx);
                        requestAnimationFrame(() => {
                            var _a;
                            if ((_a = this.selectedElement) === null || _a === void 0 ? void 0 : _a.canRotate) {
                                //this.propertyPanel!.selectedObject = undefined
                                //this.propertyPanel!.selectedObject = this.selectedElement
                            }
                        });
                    }
                }
                else if (e.key.toLowerCase() == 'delete') {
                    if (this.selectedElement) {
                        this.removeElement(this.selectedElement);
                    }
                }
                else if (e.key.toLowerCase() == 'escape') {
                    this.drawMode = drawModes.pointer;
                }
            });
            this.propertyPanel.btnClose.onclick = ((e) => {
                this.propertyPanelVisibility = false;
            });
            this.propertyPanelVisibility = localStorage.getItem("propertyPanelVisibility") == "true";
            this.toolbar.btnProperties.onclick = (e) => {
                this.propertyPanelVisibility = !this.propertyPanelVisibility;
            };
            this.toolbar.btnAppSettings.onclick = (e) => {
                const d = new AppSettingsDialog_1.AppSettingsDialog();
                d.onclose = (sender) => {
                    if (d.dialogResult == dialog_1.DialogResult.ok) {
                        globals_1.Globals.Settings.EditorSettings.ShowGrid = d.showGrid.checked;
                        globals_1.Globals.Settings.EditorSettings.ShowAddress = d.showAddress.checked;
                        globals_1.Globals.Settings.Dispacher.interval = d.intervalElement.value;
                        globals_1.Globals.Settings.EditorSettings.ShowClock = d.showClock.checked;
                        globals_1.Globals.Settings.EditorSettings.DispalyAsSingleLamp = d.showSingleLamp.checked;
                        this.fastClock.visible = d.showClock.checked;
                        globals_1.Globals.Settings.EditorSettings.fastClockFactor = d.fastClockFactor.value;
                        globals_1.Globals.saveJson("/settings.json", globals_1.Globals.Settings);
                        //this.draw()
                        this.showAddresses(globals_1.Globals.Settings.EditorSettings.ShowAddress);
                        this.setSignalSingleLamp(globals_1.Globals.Settings.EditorSettings.DispalyAsSingleLamp);
                        ws_1.wsClient.send({ type: dcc_1.ApiCommands.setTimeSettings, data: { scale: d.fastClockFactor.value } });
                    }
                };
            };
            dispatcher_1.Dispatcher.onchange = () => {
                if (dispatcher_1.Dispatcher.active) {
                    this.toolbar.btnDispatcher.classList.add("active");
                }
                else {
                    this.toolbar.btnDispatcher.classList.remove("active");
                }
            };
            dispatcher_1.Dispatcher.onerror = (msg, err) => {
                alert(msg + '\n\n' + err);
                dispatcher_1.Dispatcher.active = false;
            };
            this.toolbar.btnDispatcher.onclick = (e) => {
                dispatcher_1.Dispatcher.active = !dispatcher_1.Dispatcher.active;
            };
            this.toolbar.btnCodeEditor.onclick = (e) => {
                const codeEditor = new codeEditor_1.CodeEditor();
            };
            this.toolbar.btnLoco.onclick = (e) => {
                this.locoControlPanelVisibility = !this.locoControlPanelVisibility;
            };
            this.sidePanelLeft = document.getElementById('sidePanelLeft');
            this.btnSidePanelLeftClose = document.getElementById('btnSidePanelLeftClose');
            this.btnSidePanelLeftClose.onclick = (e) => {
                this.locoControlPanelVisibility = false;
            };
            this.locoControlPanel = document.getElementById('locoControlPanel');
            this.locoControlPanelVisibility = localStorage.getItem("locoControlPanelVisibility") == "true";
        }
        showAddresses(show) {
            this.views.getTurnoutElements().forEach((t) => {
                t.showAddress = show;
            });
            this.views.getSignalElements().forEach((t) => {
                t.showAddress = show;
            });
            this.views.getSensorElements().forEach((t) => {
                t.showAddress = show;
            });
            this.views.getButtonElements().forEach((t) => {
                t.showAddress = show;
            });
            this.draw();
        }
        setSignalSingleLamp(single) {
            this.views.getSignalElements().forEach((t) => {
                t.dispalyAsSingleLamp = single;
            });
            this.draw();
        }
        get drawEnabled() {
            return this._drawEnabled;
        }
        set drawEnabled(v) {
            var _a;
            this._drawEnabled = v;
            localStorage.setItem("drawEnabled", v ? "true" : "false");
            this.toolbar.toolbarEdit.style.display = this.drawEnabled ? "block" : "none";
            this.toolbar.toolbarPlay.style.display = !this.drawEnabled ? "block" : "none";
            if (!this.drawEnabled) {
                this.unselectAll();
                this.cursorElement = undefined;
                //this.propertyPanel!.visible = false
                this.propertyPanelVisibility = v;
                (_a = this.toolbar) === null || _a === void 0 ? void 0 : _a.btnProperties.classList.remove("active");
                this.toolbar.btnEdit.classList.remove("active");
            }
            else {
                this.toolbar.btnEdit.classList.add("active");
            }
        }
        get locoControlPanelVisibility() {
            return this._locoControlPanelVisibility;
        }
        set locoControlPanelVisibility(v) {
            this._locoControlPanelVisibility = v;
            localStorage.setItem("locoControlPanelVisibility", v ? "true" : "false");
            if (v) {
                this.toolbar.btnLoco.classList.add("active");
                this.sidePanelLeft.classList.remove('hide');
                this.sidePanelLeft.classList.add('show');
            }
            else {
                this.toolbar.btnLoco.classList.remove("active");
                this.sidePanelLeft.classList.remove('show');
                this.sidePanelLeft.classList.add('hide');
            }
        }
        get propertyPanelVisibility() {
            return this._propertyPanaelVisibility;
        }
        set propertyPanelVisibility(v) {
            var _a, _b;
            this._propertyPanaelVisibility = v;
            localStorage.setItem("propertyPanelVisibility", v ? 'true' : 'false');
            if (v) {
                this.propertyPanel.visible = v;
                (_a = this.toolbar) === null || _a === void 0 ? void 0 : _a.btnProperties.classList.add("active");
            }
            else {
                this.propertyPanel.visible = v;
                (_b = this.toolbar) === null || _b === void 0 ? void 0 : _b.btnProperties.classList.remove("active");
            }
        }
        get selectedElement() {
            return this._selectedElement;
        }
        set selectedElement(v) {
            //requestAnimationFrame(() => {
            if (this._selectedElement !== v) {
                //this.toolbar!.btnProperties.classList.add("disabled")
                this.toolbar.btnRotateRight.classList.add("disabled");
                // this.toolbar!.btnRotateLeft.classList.add("disabled")
                // this.toolbar!.btnMoveDown.classList.add("disabled")
                // this.toolbar!.btnMoveUp.classList.add("disabled")
                this.toolbar.btnMoveToTop.classList.add("disabled");
                this.toolbar.btnMoveToBottom.classList.add("disabled");
                if (this._selectedElement) {
                    this._selectedElement.isSelected = false;
                    this._selectedElement = undefined;
                }
            }
            this._selectedElement = v;
            //window.requestAnimationFrame(() => {
            if (this._selectedElement) {
                if (this._selectedElement.canRotate) {
                    this.toolbar.btnRotateRight.classList.remove("disabled");
                }
                else {
                    this.toolbar.btnRotateRight.classList.add("disabled");
                }
                this.toolbar.btnMoveToTop.classList.remove("disabled");
                this.toolbar.btnMoveToBottom.classList.remove("disabled");
                if (Object.getPrototypeOf(v) == route_1.RouteSwitchElement.prototype) {
                    var rs = v;
                    rs.tag = this.views.getTurnoutElements().sort((a, b) => a.address - b.address);
                    this.propertyPanel.selectedObject = rs;
                }
                else {
                    this.propertyPanel.selectedObject = this._selectedElement;
                }
            }
            else {
                this.propertyPanel.selectedObject = undefined;
            }
            //})
            this.draw();
            //})
        }
        get cursorElement() {
            return this._cursorElement;
        }
        set cursorElement(v) {
            this._cursorElement = v;
            if (this.cursorElement) {
                const rect = this.canvas.getBoundingClientRect();
                this.mouseX = this.globalX - rect.left;
                this.mouseY = this.globalY - rect.top;
                this.cursorElement.x = this.getMouseGridX();
                this.cursorElement.y = this.getMouseGridY();
                this.cursorElement.draw(this.ctx);
            }
            this.draw();
            this.setCanvasCursor();
        }
        drawGrid() {
            const canvasWidth = this.canvas.width;
            const canvasHeight = this.canvas.height;
            // Skálázott grid méret
            const scaledGridX = globals_1.Globals.GridSizeX * this.scale;
            const scaledGridY = globals_1.Globals.GridSizeY * this.scale;
            // Bal felső sarok világ koordinátái
            const startX = Math.floor(-this.originX / scaledGridX) * globals_1.Globals.GridSizeX;
            const startY = Math.floor(-this.originY / scaledGridY) * globals_1.Globals.GridSizeY;
            if (this.ctx) {
                // Háttér kitöltése
                //this.ctx.fillStyle = 'whitesmoke';
                //this.ctx.fillRect(0, 0, this.width, this.height);
                // Grid vonalak
                this.ctx.beginPath();
                this.ctx.strokeStyle = "#eee";
                this.ctx.lineWidth = 1;
                // Vízszintes vonalak
                for (let y = startY; y <= startY + (canvasHeight / this.scale) + globals_1.Globals.GridSizeX; y += globals_1.Globals.GridSizeY) {
                    const screenY = (y - this.originY) * this.scale;
                    this.ctx.moveTo(startX, y);
                    this.ctx.lineTo(this.originX + canvasWidth * scaledGridY, y);
                }
                // Függőleges vonalak
                for (let x = startX; x <= startX + (canvasWidth / this.scale) + globals_1.Globals.GridSizeX; x += globals_1.Globals.GridSizeX) {
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
                this.ctx.reset();
                this.ctx.resetTransform();
                this.ctx.translate(this.originX, this.originY);
                this.ctx.scale(this.scale, this.scale);
                if (globals_1.Globals.Settings.EditorSettings.ShowGrid) {
                    this.drawGrid();
                }
                this.views.elements.slice().reverse().forEach(elem => {
                    elem.draw(this.ctx);
                });
                if (this.cursorElement) {
                    this.cursorElement.draw(this.ctx);
                }
                this.drawStatus();
                if (globals_1.Globals.Settings.EditorSettings.ShowClock) {
                    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
                    this.fastClock.draw();
                }
            });
        }
        getMouseX(e) {
            return e.offsetX - this.originX;
        }
        getMouseY(e) {
            return e.offsetY - this.originY;
        }
        get gridSizeX() {
            return globals_1.Globals.GridSizeX; //* this.scale
        }
        get gridSizeY() {
            return globals_1.Globals.GridSizeY; //* this.scale
        }
        handleMouseDown(e) {
            e.preventDefault();
            if (e.target === this.canvas && document.activeElement) {
                document.activeElement.blur();
            }
            this.dragEnabled = true;
            this.downX = e.offsetX;
            this.downY = e.offsetY;
            if (this.drawEnabled) {
                var offsetX = this.getMouseX(e);
                var offsetY = this.getMouseY(e);
                if (e.button <= 1) {
                    var x = this.getMouseGridX();
                    var y = this.getMouseGridY();
                    var elem = this.views.elements.find((e) => {
                        return e.mouseInView(x, y);
                    });
                    if (this.drawMode == drawModes.pointer) {
                        if (elem) {
                            this.selectedElement = elem;
                            this.selectedElement.isSelected = true;
                        }
                        else {
                            this.unselectAll();
                        }
                    }
                    this.draw();
                }
            }
            else {
            }
        }
        add(view) {
            this.views.add(view);
            if (Object.getPrototypeOf(view) == route_1.RouteSwitchElement.prototype) {
                view.mouseDownHandler = ((sender) => {
                    var rs = view;
                    rs.setRoute(0, this.views.getTurnoutElements());
                });
            }
        }
        handleMouseUp(e) {
            var _a;
            this.dragEnabled = false;
            x = this.getMouseGridX();
            y = this.getMouseGridY();
            if (this.drawEnabled) {
                if (e.button === 2) {
                    var dx = e.offsetX - this.downX;
                    var dy = e.offsetY - this.downY;
                    this.originX += dx / this.scale;
                    this.originY += dy / this.scale;
                    this.draw();
                    return;
                }
                e.preventDefault();
                if (this.drawMode == drawModes.pointer && !this.selectedElement) {
                    return;
                }
                var offsetX = this.getMouseX(e);
                var offsetY = this.getMouseY(e);
                var x = Math.trunc(offsetX / this.gridSizeX);
                var y = Math.trunc(offsetY / this.gridSizeY);
                x = this.getMouseGridX();
                y = this.getMouseGridY();
                var elem = this.views.elements.find((e) => {
                    //return e.x == x && e.y == y
                    return e.mouseInView(x, y);
                });
                // Csak ha nem lett elmozgatva!
                if (this.lastX == x && this.lastY == y) {
                    if (elem && elem.isSelected && elem.name === ((_a = this.selectedElement) === null || _a === void 0 ? void 0 : _a.name)) {
                        elem.mouseDown(e);
                        // this.selectedElement = elem
                        this.draw();
                        return;
                    }
                }
                this.lastX = x;
                this.lastY = y;
                const num = this.views.elements.length + 1;
                switch (this.drawMode) {
                    case drawModes.pointer:
                        break;
                    case drawModes.remove:
                        var elem = this.findElement(x, y);
                        if (elem) {
                            this.removeElement(elem);
                        }
                        break;
                    case drawModes.track:
                        this.removeIfExists(x, y);
                        var te = new track_1.TrackElement((0, dcc_1.getUUID)(), x, y, "track" + num);
                        te.angle = this.cursorElement.angle;
                        // te.cc = Globals.defaultDevice!
                        this.unselectAll();
                        this.add(te);
                        break;
                    case drawModes.trackEnd:
                        this.removeIfExists(x, y);
                        var te = new trackend_1.TrackEndElement((0, dcc_1.getUUID)(), x, y, "trackEnd" + num);
                        te.angle = this.cursorElement.angle;
                        // te.cc = Globals.defaultDevice!
                        this.unselectAll();
                        this.add(te);
                        break;
                    case drawModes.trackCorner:
                        this.removeIfExists(x, y);
                        var tc = new corner_1.TrackCornerElement((0, dcc_1.getUUID)(), x, y, "corner" + num);
                        tc.angle = this.cursorElement.angle;
                        // tc.cc = Globals.defaultDevice!
                        this.unselectAll();
                        this.add(tc);
                        break;
                    case drawModes.trackCurve:
                        this.removeIfExists(x, y);
                        var tc = new curve_1.TrackCurveElement((0, dcc_1.getUUID)(), x, y, "curve" + num);
                        tc.angle = this.cursorElement.angle;
                        // tc.cc = Globals.defaultDevice!
                        this.unselectAll();
                        this.add(tc);
                        break;
                    case drawModes.trackCrossing:
                        this.removeIfExists(x, y);
                        var tcr = new crossing_1.TrackCrossingShapeElement((0, dcc_1.getUUID)(), x, y, "trackcrossing" + num);
                        tcr.angle = this.cursorElement.angle;
                        // tc.cc = Globals.defaultDevice!
                        this.unselectAll();
                        this.add(tcr);
                        break;
                    case drawModes.rect:
                        this.removeIfExists(x, y);
                        var rectangle = new rectangle_1.RectangleElement((0, dcc_1.getUUID)(), x, y, "rect" + num);
                        this.unselectAll();
                        rectangle.isSelected = true;
                        this.add(rectangle);
                        break;
                    case drawModes.turnoutRight:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var tor = new turnout_1.TurnoutRightElement((0, dcc_1.getUUID)(), 14, x, y, "turnoutRight" + num);
                        tor.showAddress = globals_1.Globals.Settings.EditorSettings.ShowAddress;
                        tor.angle = this.cursorElement.angle;
                        // tor.cc = Globals.defaultDevice!
                        this.add(tor);
                        break;
                    case drawModes.turnoutLeft:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var tol = new turnout_1.TurnoutLeftElement((0, dcc_1.getUUID)(), 14, x, y, "turnoutleft" + num);
                        tol.showAddress = globals_1.Globals.Settings.EditorSettings.ShowAddress;
                        tol.angle = this.cursorElement.angle;
                        // tol.cc = Globals.defaultDevice!
                        this.add(tol);
                        break;
                    case drawModes.turnoutY:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var toy = new turnout_1.TurnoutYShapeElement((0, dcc_1.getUUID)(), 14, x, y, "turnoutY" + num);
                        toy.showAddress = globals_1.Globals.Settings.EditorSettings.ShowAddress;
                        toy.angle = this.cursorElement.angle;
                        // tol.cc = Globals.defaultDevice!
                        this.add(toy);
                        break;
                    case drawModes.turnoutDouble:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var tod = new turnout_1.TurnoutDoubleElement((0, dcc_1.getUUID)(), 0, 0, x, y, "turnoutdouble" + num);
                        tod.showAddress = globals_1.Globals.Settings.EditorSettings.ShowAddress;
                        tod.angle = this.cursorElement.angle;
                        // tod.cc = Globals.defaultDevice!
                        this.add(tod);
                        break;
                    case drawModes.routeSwitch:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var rs = new route_1.RouteSwitchElement((0, dcc_1.getUUID)(), x, y, "routeSwitch" + num);
                        this.add(rs);
                        break;
                    case drawModes.signal2:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var s2 = new signals_1.Signal2Element((0, dcc_1.getUUID)(), 14, x, y, "signal2-" + num);
                        s2.showAddress = globals_1.Globals.Settings.EditorSettings.ShowAddress;
                        s2.dispalyAsSingleLamp = globals_1.Globals.Settings.EditorSettings.DispalyAsSingleLamp;
                        s2.angle = this.cursorElement.angle;
                        // s2.cc = Globals.defaultDevice!
                        //s2.aspect = 1
                        this.add(s2);
                        break;
                    case drawModes.signal3:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var s3 = new signals_1.Signal3Element((0, dcc_1.getUUID)(), 14, x, y, "signal3-" + num);
                        s3.showAddress = globals_1.Globals.Settings.EditorSettings.ShowAddress;
                        s3.dispalyAsSingleLamp = globals_1.Globals.Settings.EditorSettings.DispalyAsSingleLamp;
                        s3.angle = this.cursorElement.angle;
                        // s3.cc = Globals.defaultDevice!
                        //s3.aspect = 1
                        this.add(s3);
                        break;
                    case drawModes.signal4:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var s4 = new signals_1.Signal4Element((0, dcc_1.getUUID)(), 14, x, y, "signal4-" + num);
                        s4.showAddress = globals_1.Globals.Settings.EditorSettings.ShowAddress;
                        s4.dispalyAsSingleLamp = globals_1.Globals.Settings.EditorSettings.DispalyAsSingleLamp;
                        s4.angle = this.cursorElement.angle;
                        // s4.cc = Globals.defaultDevice!
                        //s4.aspect = 1
                        this.add(s4);
                        break;
                    case drawModes.block:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var b = new block_1.BlockElement((0, dcc_1.getUUID)(), x, y, "block" + num);
                        b.angle = this.cursorElement.angle;
                        this.add(b);
                        break;
                    case drawModes.button:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var btn = new button_1.ButtonShapeElement((0, dcc_1.getUUID)(), 0, x, y, "button" + num);
                        //b.angle = this.cursorElement!.angle
                        this.add(btn);
                        break;
                    case drawModes.audiobutton:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var abtn = new audioButton_1.AudioButtonShapeElement((0, dcc_1.getUUID)(), x, y, "audiobutton" + num);
                        this.add(abtn);
                        break;
                    case drawModes.emergencybutton:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var ebtn = new emergencyButton_1.EmergencyButtonShapeElement((0, dcc_1.getUUID)(), x, y, "emergencybutton" + num);
                        this.add(ebtn);
                        break;
                    case drawModes.label2:
                        //this.removeIfExists(x, y)
                        this.unselectAll();
                        var l = new label_1.Label2Element((0, dcc_1.getUUID)(), x, y, "label" + num);
                        this.add(l);
                        break;
                    case drawModes.sensor:
                        //this.removeIfExists(x, y)
                        this.unselectAll();
                        var s = new sensor_1.SensorShapeElement((0, dcc_1.getUUID)(), 0, x, y, "sensor" + num);
                        this.add(s);
                        break;
                    case drawModes.tree:
                        //this.removeIfExists(x, y)
                        this.unselectAll();
                        var tree = new tree_1.TreeShapeElement((0, dcc_1.getUUID)(), x, y, "tree" + num);
                        this.add(tree);
                        break;
                    case drawModes.scheduler:
                        //this.removeIfExists(x, y)
                        this.unselectAll();
                        var sb = new schedulerButton_1.SchedulerButtonShapeElement((0, dcc_1.getUUID)(), x, y, "schedulerButton" + num);
                        this.add(sb);
                        break;
                }
                this.draw();
            }
            else {
                var elem = this.views.elements.find((e) => {
                    return e.x == x && e.y == y;
                });
                if (elem) {
                    if (Object.getPrototypeOf(elem) == signals_1.Signal2Element.prototype) {
                        const popup = new dlgSignal2Select_1.dlgSignal2Select(elem);
                        popup.setPosition(e.pageX, e.pageY);
                        popup.show();
                    }
                    else if (Object.getPrototypeOf(elem) == signals_1.Signal3Element.prototype) {
                        const popup = new dlgSignal2Select_1.dlgSignal3Select(elem);
                        popup.setPosition(e.pageX, e.pageY);
                        popup.show();
                    }
                    else if (Object.getPrototypeOf(elem) == signals_1.Signal4Element.prototype) {
                        const popup = new dlgSignal2Select_1.dlgSignal4Select(elem);
                        popup.setPosition(e.pageX, e.pageY);
                        popup.show();
                    }
                    else if (Object.getPrototypeOf(elem) == turnout_1.TurnoutDoubleElement.prototype) {
                        const popup = new turnoutsPopup_1.turnoutDoublePopup(elem);
                        popup.setPosition(e.pageX, e.pageY);
                        popup.show();
                    }
                    else {
                        elem.mouseDown(e);
                        this.draw();
                    }
                }
            }
        }
        get drawMode() {
            return this._drawMode;
        }
        set drawMode(v) {
            this._drawMode = v;
            if (this.drawMode == drawModes.pointer) {
                this.selectedElement = undefined;
                this.cursorElement = undefined;
                this.toolbar.currentButton = this.toolbar.btnPointer;
                this.draw();
                this.setCanvasCursor();
            }
        }
        setCanvasCursor() {
            var x = this.getMouseGridX();
            var y = this.getMouseGridY();
            var elem = this.views.elements.find((e) => {
                //return e.x == x && e.y == y
                return e.mouseInView(x, y);
            });
            if (elem || (this.cursorElement)) {
                if (this.drawEnabled) {
                    this.canvas.style.cursor = "pointer";
                }
                else {
                    this.canvas.style.cursor = elem.cursor;
                }
            }
            else {
                this.canvas.style.cursor = "default";
            }
        }
        handleMouseMove(e) {
            if (!this.dragEnabled) {
                //return
            }
            this.mouseX = e.offsetX;
            this.mouseY = e.offsetY;
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
                return;
            }
            if (this.dragEnabled) {
                if (e.buttons === 1) {
                    if (this.selectedElement) {
                        //this.selectedElement.x = this.getMouseGridX()
                        //this.selectedElement.y = this.getMouseGridY()
                        var x = this.getMouseGridX();
                        var y = this.getMouseGridY();
                        // var ee = this.findElement(x, y)
                        // if(ee && this.selectedElement != ee) {
                        //     this.selectedElement.bgColor ='#ff0000cc'
                        // } else {
                        //     this.selectedElement.bgColor = undefined
                        // }
                        this.selectedElement.move(x, y);
                        this.draw();
                    }
                }
                if (this.drawMode == drawModes.pointer) {
                }
                else {
                }
            }
            if (this.cursorElement) {
                //this.cursorElement!.x = this.getMouseGridX()
                //this.cursorElement!.y = this.getMouseGridY()
                this.cursorElement.move(this.getMouseGridX(), this.getMouseGridY());
                this.draw();
                //this.cursorElement.draw(this.ctx!)
            }
            // this.mouseX = e.offsetX
            // this.mouseY = e.offsetY
            this.drawStatus();
        }
        handleMouseWheel(e) {
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
                    this.scale = 3;
                }
                else if (this.scale < 0.2) {
                    this.scale = 0.2;
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
                this.statusbar.innerHTML = `Status| x: ${this.getMouseGridX()} y: ${this.getMouseGridY()} Elements: ${this.views.elements.length} Scale: ${this.scale} origX: ${this.originX} origY: ${this.originY}`;
            }
        }
        unselectAll() {
            this.views.elements.forEach((e) => {
                e.isSelected = false;
            });
            this.selectedElement = undefined;
            this.draw();
        }
        exists(elem) {
        }
        removeIfExists(x, y) {
            var e = this.findElement(x, y);
            if (e) {
                this.removeElement(e);
            }
        }
        findElement(x, y) {
            return this.views.elements.find((e) => {
                return e.x == x && e.y == y;
            });
        }
        removeElement(elem) {
            if (elem) {
                var index = this.views.getElements().indexOf(elem);
                if (index > -1) {
                    this.views.elements.splice(index, 1);
                }
                if (elem === this.selectedElement) {
                    this.selectedElement = undefined;
                }
            }
        }
        save() {
            //var elems = JSON.stringify(this.elements)
            var _a, _b;
            // Duplikált címek ellenőrzése!
            var elems = [];
            this.views.elements.forEach((elem) => {
                var view = elem;
                switch (elem.type) {
                    case 'track':
                        var l = elem;
                        elems.push({
                            uuid: l.UUID, type: l.type, name: l.name, x: l.x, y: l.y, angle: l.angle,
                            // cc: l.cc,
                            rbusAddress: l.rbusAddress
                        });
                        break;
                    case 'trackEnd':
                        var te = elem;
                        elems.push({
                            uuid: te.UUID, type: te.type, name: te.name, x: te.x, y: te.y, angle: te.angle,
                            // cc: te.cc,
                            rbusAddress: te.rbusAddress
                        });
                        break;
                    case 'turnoutRight':
                        var tor = elem;
                        elems.push({
                            uuid: tor.UUID, type: tor.type, name: tor.name, x: tor.x, y: tor.y, address: tor.address, angle: tor.angle,
                            //t1Closed: tor.t1Closed, t1ClosedValue: tor.t1ClosedValue, t1OpenValue: tor.t1OpenValue,
                            t1ClosedValue: tor.t1ClosedValue,
                            t1OpenValue: tor.t1OpenValue,
                            rbusAddress: tor.rbusAddress,
                            outputMode: tor.outputMode,
                        });
                        break;
                    case 'turnoutLeft':
                        var tol = elem;
                        elems.push({
                            uuid: tol.UUID, type: tol.type, name: tol.name, x: tol.x, y: tol.y, address: tol.address, angle: tol.angle,
                            //t1Closed: tol.t1Closed, t1ClosedValue: tol.t1ClosedValue, t1OpenValue: tol.t1OpenValue,
                            t1ClosedValue: tol.t1ClosedValue,
                            t1OpenValue: tol.t1OpenValue,
                            rbusAddress: tol.rbusAddress,
                            outputMode: tol.outputMode,
                        });
                        break;
                    case 'turnoutY':
                        var toy = elem;
                        elems.push({
                            uuid: toy.UUID, type: toy.type, name: toy.name, x: toy.x, y: toy.y,
                            address: toy.address,
                            angle: toy.angle,
                            t1ClosedValue: toy.t1ClosedValue,
                            t1OpenValue: toy.t1OpenValue,
                            rbusAddress: toy.rbusAddress,
                            outputMode: toy.outputMode,
                        });
                        break;
                    case 'turnoutDouble':
                        var tod = elem;
                        elems.push({
                            uuid: tod.UUID, type: tod.type, name: tod.name, x: tod.x, y: tod.y, address1: tod.address, address2: tod.address2, angle: tod.angle,
                            // t1Closed: tod.t1Closed, t1ClosedValue: tod.t1ClosedValue, t1OpenValue: tod.t1OpenValue,
                            // t2Closed: tod.t2Closed, t2ClosedValue: tod.t2ClosedValue, t2OpenValue: tod.t2OpenValue,
                            t1ClosedValue: tod.t1ClosedValue,
                            t1OpenValue: tod.t1OpenValue,
                            t2ClosedValue: tod.t2ClosedValue,
                            t2OpenValue: tod.t2OpenValue,
                            rbusAddress: tod.rbusAddress,
                            outputMode: tod.outputMode,
                        });
                        break;
                    case 'curve':
                        var co = elem;
                        elems.push({
                            uuid: co.UUID, type: co.type, name: co.name, x: co.x, y: co.y, angle: co.angle,
                            // cc: co.cc,
                            rbusAddress: co.rbusAddress
                        });
                        break;
                    case 'trackcrossing':
                        var tcr = elem;
                        elems.push({
                            uuid: tcr.UUID, type: tcr.type, name: tcr.name, x: tcr.x, y: tcr.y,
                            angle: tcr.angle,
                            rbusAddress: tcr.rbusAddress
                        });
                        break;
                    case 'corner':
                        var cu = elem;
                        elems.push({
                            uuid: cu.UUID, type: cu.type, name: cu.name, x: cu.x, y: cu.y, angle: cu.angle,
                            // cc: cu.cc,
                            rbusAddress: cu.rbusAddress
                        });
                        break;
                    case 'block':
                        var bl = elem;
                        elems.push({
                            uuid: bl.UUID, type: bl.type, name: bl.name, x: bl.x, y: bl.y, angle: bl.angle,
                            locoAddress: bl.locoAddress
                        });
                        break;
                    case 'label2':
                        var la = elem;
                        elems.push({
                            uuid: la.UUID, type: la.type, name: la.name, x: la.x, y: la.y, angle: 0,
                            text: la.text,
                            valign: la.valign,
                            fgColor: la.fgColor,
                            bgColor: la.bgColor,
                            fontSize: la.fontSize,
                            fontStyle: la.fontStyle,
                            fontName: la.fontName,
                            textAlign: la.textAlign,
                            textBaseline: la.textBaseline
                        });
                        break;
                    case 'routeSwitch':
                        var rs = elem;
                        elems.push({ uuid: rs.UUID, type: rs.type, name: rs.name, x: rs.x, y: rs.y, turnouts: rs.turnouts });
                        break;
                    case 'signal2':
                        var s2 = elem;
                        elems.push({
                            uuid: s2.UUID, type: s2.type, address: s2.address, name: s2.name, x: s2.x, y: s2.y, angle: s2.angle,
                            addressLength: s2.addressLength,
                            isExtendedDecoder: s2.isExtendedDecoder,
                            valueGreen: s2.valueGreen,
                            valueRed: s2.valueRed,
                            rbusAddress: s2.rbusAddress,
                            outputMode: s2.outputMode,
                            // cc: s2.cc,
                            aspect: s2.aspect
                        });
                        break;
                    case 'signal3':
                        var s3 = elem;
                        elems.push({
                            uuid: s3.UUID, type: s3.type, address: s3.address, name: s3.name, x: s3.x, y: s3.y, angle: s3.angle,
                            addressLength: s3.addressLength,
                            isExtendedDecoder: s3.isExtendedDecoder,
                            valueGreen: s3.valueGreen,
                            valueRed: s3.valueRed,
                            valueYellow: s3.valueYellow,
                            rbusAddress: s3.rbusAddress,
                            outputMode: s3.outputMode,
                            // cc: s3.cc,
                            aspect: s3.aspect
                        });
                        break;
                    case 'signal4':
                        var s4 = elem;
                        elems.push({
                            uuid: s4.UUID, type: s4.type, address: s4.address, name: s4.name, x: s4.x, y: s4.y, angle: s4.angle,
                            addressLength: s4.addressLength,
                            isExtendedDecoder: s4.isExtendedDecoder,
                            valueGreen: s4.valueGreen,
                            valueRed: s4.valueRed,
                            valueYellow: s4.valueYellow,
                            valueWhite: s4.valueWhite,
                            rbusAddress: s4.rbusAddress,
                            outputMode: s4.outputMode,
                            // cc: s4.cc,
                            aspect: s4.aspect
                        });
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
                        var b = elem;
                        elems.push({
                            uuid: b.UUID, type: b.type, address: b.address, x: b.x, y: b.y, name: b.name,
                            valueOn: b.valueOn,
                            valueOff: b.valueOff,
                            colorOn: b.colorOn,
                            outputMode: b.outputMode,
                        });
                        break;
                    case 'sensor':
                        var sensor = elem;
                        elems.push({
                            uuid: sensor.UUID, type: sensor.type, address: sensor.address, x: sensor.x, y: sensor.y, name: sensor.name,
                            valueOn: sensor.valueOn,
                            valueOff: sensor.valueOff,
                            colorOn: sensor.colorOn,
                            kind: sensor.kind,
                        });
                        break;
                    case 'audiobutton':
                        var ab = elem;
                        elems.push({ uuid: ab.UUID, type: ab.type, x: ab.x, y: ab.y, name: ab.name, filename: ab.filename });
                        break;
                    case 'emergencybutton':
                        var eb = elem;
                        elems.push({ uuid: eb.UUID, type: eb.type, x: eb.x, y: eb.y, name: eb.name });
                        break;
                    case 'tree':
                        var tree = elem;
                        elems.push({ uuid: tree.UUID, type: tree.type, x: tree.x, y: tree.y, name: tree.name });
                        break;
                    case 'schedulerButton':
                        var schedulerButton = elem;
                        elems.push({ uuid: schedulerButton.UUID, type: schedulerButton.type, x: schedulerButton.x, y: schedulerButton.y, name: schedulerButton.name,
                            taskName: schedulerButton.taskName
                        });
                        break;
                }
            });
            var config = {
                settings: {
                    scale: this.scale,
                    origX: this.originX,
                    origY: this.originY,
                    // gridSizeX: Globals.EditorSettings.GridSizeX,
                    // gridSizeY: Globals.EditorSettings.GridSizeY,
                    // showAddress: Globals.EditorSettings.ShowAddress,
                    // orientation: Globals.EditorSettings.Orientation,
                    locoPanelVisible: (_a = this.sidePanelLeft) === null || _a === void 0 ? void 0 : _a.classList.contains('show'),
                    propertyPanelVisible: (_b = this.propertyPanel) === null || _b === void 0 ? void 0 : _b.classList.contains('show')
                },
                pages: [
                    { name: "page1", elems: elems },
                ],
            };
            globals_1.Globals.configSave(config);
        }
        load(config) {
            var _a, _b, _c;
            this.views.elements.length = 0;
            const defaults = { scale: 1, origX: 0, origY: 0, locoPanelVisible: false };
            try {
                if (config.settings) {
                    this.scale = (_a = config.settings.scale) !== null && _a !== void 0 ? _a : 1;
                    this.originX = (_b = config.settings.origX) !== null && _b !== void 0 ? _b : 0;
                    this.originY = (_c = config.settings.origY) !== null && _c !== void 0 ? _c : 0;
                }
                else {
                    config.settings = defaults;
                }
                //var elems = config.elems
                config.pages.forEach((page) => {
                    page.elems.forEach((elem) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30;
                        console.log(elem);
                        switch (elem.type) {
                            case "track":
                                var t = new track_1.TrackElement(elem.uuid, elem.x, elem.y, elem.name);
                                t.angle = elem.angle | 0;
                                // t.cc = elem.cc
                                t.rbusAddress = elem.rbusAddress;
                                this.add(t);
                                break;
                            case "trackEnd":
                                var te = new trackend_1.TrackEndElement(elem.uuid, elem.x, elem.y, elem.name);
                                te.angle = elem.angle | 0;
                                // te.cc = elem.cc
                                te.rbusAddress = elem.rbusAddress;
                                this.add(te);
                                break;
                            case "turnoutRight":
                                var tor = new turnout_1.TurnoutRightElement(elem.uuid, elem.address, elem.x, elem.y, elem.name);
                                tor.showAddress = globals_1.Globals.Settings.EditorSettings.ShowAddress;
                                tor.angle = elem.angle | 0;
                                tor.t1ClosedValue = (_a = elem.t1ClosedValue) !== null && _a !== void 0 ? _a : true;
                                tor.t1OpenValue = (_b = elem.t1OpenValue) !== null && _b !== void 0 ? _b : false;
                                tor.rbusAddress = elem.rbusAddress;
                                tor.outputMode = (_c = elem.outputMode) !== null && _c !== void 0 ? _c : dcc_1.OutputModes.dccExAccessory;
                                this.add(tor);
                                break;
                            case "turnoutLeft":
                                var tol = new turnout_1.TurnoutLeftElement(elem.uuid, elem.address, elem.x, elem.y, elem.name);
                                tol.showAddress = globals_1.Globals.Settings.EditorSettings.ShowAddress;
                                tol.angle = elem.angle | 0;
                                tol.t1ClosedValue = (_d = elem.t1ClosedValue) !== null && _d !== void 0 ? _d : true;
                                tol.t1OpenValue = (_e = elem.t1OpenValue) !== null && _e !== void 0 ? _e : false;
                                tol.rbusAddress = elem.rbusAddress;
                                tol.outputMode = (_f = elem.outputMode) !== null && _f !== void 0 ? _f : dcc_1.OutputModes.dccExAccessory;
                                this.add(tol);
                                break;
                            case "turnoutY":
                                var toy = new turnout_1.TurnoutYShapeElement(elem.uuid, elem.address, elem.x, elem.y, elem.name);
                                toy.showAddress = globals_1.Globals.Settings.EditorSettings.ShowAddress;
                                toy.angle = elem.angle | 0;
                                toy.t1ClosedValue = (_g = elem.t1ClosedValue) !== null && _g !== void 0 ? _g : true;
                                toy.t1OpenValue = (_h = elem.t1OpenValue) !== null && _h !== void 0 ? _h : false;
                                toy.rbusAddress = elem.rbusAddress;
                                toy.outputMode = (_j = elem.outputMode) !== null && _j !== void 0 ? _j : dcc_1.OutputModes.dccExAccessory;
                                this.add(toy);
                                break;
                            case "turnoutDouble":
                                var tod = new turnout_1.TurnoutDoubleElement(elem.uuid, (_k = elem.address1) !== null && _k !== void 0 ? _k : 0, (_l = elem.address2) !== null && _l !== void 0 ? _l : 0, elem.x, elem.y, elem.name);
                                tod.showAddress = globals_1.Globals.Settings.EditorSettings.ShowAddress;
                                tod.angle = elem.angle | 0;
                                tod.t1ClosedValue = (_m = elem.t1ClosedValue) !== null && _m !== void 0 ? _m : true;
                                tod.t1OpenValue = (_o = elem.t1OpenValue) !== null && _o !== void 0 ? _o : false;
                                tod.t2ClosedValue = (_p = elem.t2ClosedValue) !== null && _p !== void 0 ? _p : true;
                                tod.t2OpenValue = (_q = elem.t2OpenValue) !== null && _q !== void 0 ? _q : false;
                                tod.rbusAddress = elem.rbusAddress;
                                tod.outputMode = (_r = elem.outputMode) !== null && _r !== void 0 ? _r : dcc_1.OutputModes.dccExAccessory;
                                this.add(tod);
                                break;
                            case "curve":
                                var cu = new curve_1.TrackCurveElement(elem.uuid, elem.x, elem.y, elem.name);
                                cu.angle = elem.angle | 0;
                                // cu.cc = elem.cc
                                cu.rbusAddress = elem.rbusAddress;
                                this.add(cu);
                                break;
                            case "corner":
                                var co = new corner_1.TrackCornerElement(elem.uuid, elem.x, elem.y, elem.name);
                                co.angle = elem.angle | 0;
                                // co.cc = elem.cc
                                co.rbusAddress = elem.rbusAddress;
                                this.add(co);
                                break;
                            case "trackcrossing":
                                var tcr = new crossing_1.TrackCrossingShapeElement(elem.uuid, elem.x, elem.y, elem.name);
                                tcr.angle = elem.angle | 0;
                                // co.cc = elem.cc
                                tcr.rbusAddress = elem.rbusAddress;
                                this.add(tcr);
                                break;
                            case "block":
                                var bl = new block_1.BlockElement(elem.uuid, elem.x, elem.y, elem.name);
                                bl.angle = elem.angle | 0;
                                bl.locoAddress = elem.locoAddress | 0;
                                this.add(bl);
                                break;
                            case "label2":
                                var l = new label_1.Label2Element(elem.uuid, elem.x, elem.y, elem.name);
                                l.angle = 0;
                                l.text = (_s = elem.text) !== null && _s !== void 0 ? _s : "LABEL";
                                l.valign = (_t = elem.valign) !== null && _t !== void 0 ? _t : "center";
                                l.fgColor = (_u = elem.fgColor) !== null && _u !== void 0 ? _u : "black",
                                    l.bgColor = (_v = elem.bgColor) !== null && _v !== void 0 ? _v : "white",
                                    l.fontSize = (_w = elem.fontSize) !== null && _w !== void 0 ? _w : "10px",
                                    l.fontStyle = (_x = elem.fontStyle) !== null && _x !== void 0 ? _x : "normal",
                                    l.fontName = (_y = elem.fontName) !== null && _y !== void 0 ? _y : "Arial",
                                    l.textAlign = (_z = elem.textAlign) !== null && _z !== void 0 ? _z : "center",
                                    l.textBaseline = (_0 = elem.textBaseline) !== null && _0 !== void 0 ? _0 : "middle";
                                this.add(l);
                                break;
                            case "routeSwitch":
                                var rs = new route_1.RouteSwitchElement(elem.uuid, elem.x, elem.y, elem.name);
                                rs.turnouts = elem.turnouts;
                                this.add(rs);
                                break;
                            case "signal2":
                                var s2 = new signals_1.Signal2Element(elem.uuid, elem.address | 0, elem.x, elem.y, elem.name);
                                s2.angle = (_1 = elem.angle) !== null && _1 !== void 0 ? _1 : 0;
                                s2.addressLength = (_2 = elem.addressLength) !== null && _2 !== void 0 ? _2 : 5;
                                s2.isExtendedDecoder = (_3 = s2.isExtendedDecoder) !== null && _3 !== void 0 ? _3 : false;
                                s2.valueGreen = (_4 = elem.valueGreen) !== null && _4 !== void 0 ? _4 : 0;
                                s2.valueRed = (_5 = elem.valueRed) !== null && _5 !== void 0 ? _5 : 0;
                                s2.rbusAddress = elem.rbusAddress;
                                s2.outputMode = (_6 = elem.outputMode) !== null && _6 !== void 0 ? _6 : dcc_1.OutputModes.accessory;
                                // s2.cc = elem.cc == undefined ? undefined : elem.cc
                                //s2.aspect = 1 // elem.aspect ?? 1
                                s2.name = elem.name.replace("turnoutleft", "signal2-");
                                this.add(s2);
                                break;
                            case "signal3":
                                var s3 = new signals_1.Signal3Element(elem.uuid, elem.address | 0, elem.x, elem.y, elem.name);
                                s3.angle = (_7 = elem.angle) !== null && _7 !== void 0 ? _7 : 0;
                                s3.addressLength = (_8 = elem.addressLength) !== null && _8 !== void 0 ? _8 : 5;
                                s3.isExtendedDecoder = (_9 = s3.isExtendedDecoder) !== null && _9 !== void 0 ? _9 : false;
                                s3.valueGreen = (_10 = elem.valueGreen) !== null && _10 !== void 0 ? _10 : 0;
                                s3.valueRed = (_11 = elem.valueRed) !== null && _11 !== void 0 ? _11 : 0;
                                s3.valueYellow = (_12 = elem.valueYellow) !== null && _12 !== void 0 ? _12 : 0;
                                s3.rbusAddress = elem.rbusAddress;
                                s3.outputMode = (_13 = elem.outputMode) !== null && _13 !== void 0 ? _13 : dcc_1.OutputModes.accessory;
                                // s3.cc = elem.cc == undefined ? undefined : elem.cc
                                //s3.aspect = 1; //elem.aspect ?? 1
                                s3.name = elem.name.replace("turnoutleft", "signal3-");
                                this.add(s3);
                                break;
                            case "signal4":
                                var s4 = new signals_1.Signal4Element(elem.uuid, elem.address | 0, elem.x, elem.y, elem.name);
                                s4.angle = (_14 = elem.angle) !== null && _14 !== void 0 ? _14 : 0;
                                s4.addressLength = (_15 = elem.addressLength) !== null && _15 !== void 0 ? _15 : 5;
                                s4.isExtendedDecoder = (_16 = s4.isExtendedDecoder) !== null && _16 !== void 0 ? _16 : false;
                                s4.valueGreen = (_17 = elem.valueGreen) !== null && _17 !== void 0 ? _17 : 0;
                                s4.valueRed = (_18 = elem.valueRed) !== null && _18 !== void 0 ? _18 : 0;
                                s4.valueYellow = (_19 = elem.valueYellow) !== null && _19 !== void 0 ? _19 : 0;
                                s4.valueWhite = (_20 = elem.valueWhite) !== null && _20 !== void 0 ? _20 : 0;
                                s4.rbusAddress = elem.rbusAddress;
                                s4.outputMode = (_21 = elem.outputMode) !== null && _21 !== void 0 ? _21 : dcc_1.OutputModes.accessory;
                                // s4.cc = elem.cc == undefined ? undefined : elem.cc
                                //s4.aspect = 1 //elem.aspect ?? 1
                                s4.name = elem.name.replace("turnoutleft", "signal4-");
                                this.add(s4);
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
                                var b = new button_1.ButtonShapeElement(elem.uuid, elem.address, elem.x, elem.y, elem.name);
                                b.valueOff = (_22 = elem.valueOff) !== null && _22 !== void 0 ? _22 : false;
                                b.valueOn = (_23 = elem.valueOn) !== null && _23 !== void 0 ? _23 : true;
                                b.outputMode = (_24 = elem.outputMode) !== null && _24 !== void 0 ? _24 : 0;
                                this.add(b);
                                break;
                            case "audiobutton":
                                var ab = new audioButton_1.AudioButtonShapeElement(elem.uuid, elem.x, elem.y, elem.name);
                                ab.filename = elem.filename;
                                this.add(ab);
                                break;
                            case "emergencybutton":
                                var eb = new emergencyButton_1.EmergencyButtonShapeElement(elem.uuid, elem.x, elem.y, elem.name);
                                this.add(eb);
                                break;
                            case "tree":
                                var tree = new tree_1.TreeShapeElement(elem.uuid, elem.x, elem.y, elem.name);
                                this.add(tree);
                                break;
                            case "schedulerButton":
                                var schedulerButton = new schedulerButton_1.SchedulerButtonShapeElement(elem.uuid, elem.x, elem.y, elem.name);
                                schedulerButton.taskName = (_25 = elem.taskName) !== null && _25 !== void 0 ? _25 : "";
                                this.add(schedulerButton);
                                break;
                            case "sensor":
                                var sensor = new sensor_1.SensorShapeElement(elem.uuid, (_26 = elem.address) !== null && _26 !== void 0 ? _26 : 0, elem.x, elem.y, elem.name);
                                sensor.kind = (_27 = elem.kind) !== null && _27 !== void 0 ? _27 : sensor_1.SensorTypes.rect;
                                sensor.colorOn = (_28 = elem.fillColor) !== null && _28 !== void 0 ? _28 : "lime";
                                sensor.valueOff = (_29 = elem.valueOff) !== null && _29 !== void 0 ? _29 : false;
                                sensor.valueOn = (_30 = elem.valueOn) !== null && _30 !== void 0 ? _30 : true;
                                this.add(sensor);
                                break;
                        }
                    });
                });
                // const route1 = new RouteSwitchElement(this.ctx!, 2, 2, "route1")
                // this.add(route1)
                this.showAddresses(globals_1.Globals.Settings.EditorSettings.ShowAddress);
                this.setSignalSingleLamp(globals_1.Globals.Settings.EditorSettings.DispalyAsSingleLamp);
                this.draw();
            }
            catch (error) {
                console.log(error);
            }
            // this.manager.addState(this.canvas.elements.elements)
        }
    }
    exports.CustomCanvas = CustomCanvas;
    customElements.define('custom-canvas', CustomCanvas);
});
