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
define(["require", "exports", "./track", "./rectangle", "./turnout", "./view", "./views", "bootstrap", "./curve", "./corner", "./signals", "./trackend", "./route", "../controls/dialog", "../../../common/src/dcc", "../dialogs/propertiyPanel", "./block", "../helpers/globals", "../dialogs/AppSettingsDialog", "../dialogs/dlgSignal2Select", "../dialogs/turnoutsPopup", "../helpers/ws", "./label", "../helpers/utility", "../dialogs/codeEditor", "./dispatcher", "./button", "./audioButton"], function (require, exports, track_1, rectangle_1, turnout_1, view_1, views_1, bootstrap, curve_1, corner_1, signals_1, trackend_1, route_1, dialog_1, dcc_1, propertiyPanel_1, block_1, globals_1, AppSettingsDialog_1, dlgSignal2Select_1, turnoutsPopup_1, ws_1, label_1, utility_1, codeEditor_1, dispatcher_1, button_1, audioButton_1) {
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
    })(drawModes || (exports.drawModes = drawModes = {}));
    class CustomCanvas extends HTMLElement {
        constructor() {
            super();
            this.downX = 0;
            this.downY = 0;
            this.lastX = 0;
            this.lastY = 0;
            this.mouseX = 0;
            this.mouseY = 0;
            this.scale = 1;
            this.drawEnabled = true;
            this.width = 0;
            this.height = 0;
            this.dragEnabled = false;
            this.globalX = 0;
            this.globalY = 0;
            this._drawMode = drawModes.track;
            this.originX = 0;
            this.originY = 0;
            this.views = new views_1.Views();
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
            window.powerChanged = (power) => {
                this.locoControlPanel.power = power;
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
            this.width = parseInt(this.getAttribute('width') || '100vw');
            this.height = parseInt(this.getAttribute('height') || '100vw');
            this.canvas.width = this.parentElement.offsetWidth;
            this.canvas.height = this.parentElement.offsetHeight;
            this.ctx = this.canvas.getContext('2d');
            this.drawGrid();
            this.propertyPanel = document.getElementById("EditorPropertyPanel");
        }
        init() {
            this.status = document.getElementById("status");
            this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
            this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.canvas.addEventListener('wheel', (e) => this.handleMouseWheel(e));
            this.cursorTrackElement = new track_1.TrackElement("", 0, 0, "cursor");
            this.cursorTrackElement.isSelected = true;
            this.cursorTrackEndElement = new trackend_1.TrackEndElement("", 0, 0, "cursor");
            this.cursorTrackEndElement.isSelected = true;
            this.cursorTrackCornerElement = new corner_1.TrackCornerElement("", 0, 0, "cursor");
            this.cursorTrackCornerElement.isSelected = true;
            this.cursorTrackCurveElement = new curve_1.TrackCurveElement("", 0, 0, "cursor");
            this.cursorTrackCurveElement.isSelected = true;
            this.cursorTurnoutRightElement = new turnout_1.TurnoutRightElement("", 0, 0, 0, "cursor");
            this.cursorTurnoutRightElement.isSelected = true;
            this.cursorTurnoutLeftElement = new turnout_1.TurnoutLeftElement("", 0, 0, 0, "cursor");
            this.cursorTurnoutLeftElement.isSelected = true;
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
            this.toolbar.btnEdit.onclick = (e) => {
                var _a;
                this.drawEnabled = !this.drawEnabled;
                this.toolbar.toolbarEdit.style.display = this.drawEnabled ? "block" : "none";
                this.toolbar.toolbarPlay.style.display = !this.drawEnabled ? "block" : "none";
                if (!this.drawEnabled) {
                    this.unselectAll();
                    this.cursorElement = undefined;
                    this.propertyPanel.visible = false;
                    (_a = this.toolbar) === null || _a === void 0 ? void 0 : _a.btnProperties.classList.remove("active");
                    this.toolbar.btnEdit.classList.remove("active");
                }
                else {
                    this.toolbar.btnEdit.classList.add("active");
                }
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
                this.drawMode = drawModes.remove;
                this.cursorElement = undefined;
                this.draw();
            };
            this.toolbar.btnFitToPage.onclick = (e) => {
                this.originX = 0;
                this.originY = 0;
                var r = { x1: 1000, y1: 1000, x2: 0, y2: 0 };
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
                console.log("RECT:", r);
                var rw = Math.floor((r.x2 - r.x1) / 2);
                var rh = Math.floor((r.y2 - r.y1) / 2);
                var cw = Math.floor((this.canvas.width / this.scale / this.gridSizeX) / 2);
                var ch = Math.floor((this.canvas.height / this.scale / this.gridSizeY) / 2);
                var dx = Math.floor(r.x1 + rw - cw);
                var dy = Math.floor(r.y1 + rh - ch);
                this.width = this.canvas.width / this.scale;
                this.height = this.canvas.height / this.scale;
                this.views.elements.forEach((elem) => {
                    elem.x -= dx + 1;
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
                if (e.key === 'r' || e.key === 'R') {
                    if (this.cursorElement && this.cursorElement.canRotate) {
                        this.cursorElement.rotateRight();
                        this.draw();
                    }
                    else if (this.selectedElement && this.selectedElement.canRotate) {
                        this.selectedElement.rotateRight();
                        this.draw();
                        this.selectedElement.draw(this.ctx);
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
            //this.propertyPanel!.visible = true;
            //this.toolbar?.btnProperties.classList.add("active")
            this.propertyPanel.btnClose.onclick = ((e) => {
                var _a;
                this.propertyPanel.visible = false;
                (_a = this.toolbar) === null || _a === void 0 ? void 0 : _a.btnProperties.classList.remove("active");
            });
            this.toolbar.btnProperties.onclick = (e) => {
                var _a, _b;
                this.propertyPanel.visible = !this.propertyPanel.visible;
                if (this.propertyPanel.visible) {
                    (_a = this.toolbar) === null || _a === void 0 ? void 0 : _a.btnProperties.classList.add("active");
                }
                else {
                    (_b = this.toolbar) === null || _b === void 0 ? void 0 : _b.btnProperties.classList.remove("active");
                }
            };
            this.toolbar.btnAppSettings.onclick = (e) => {
                const d = new AppSettingsDialog_1.AppSettingsDialog();
                //d.gridSize.value = settings.GridSizeX;
                d.showAddress.checked = globals_1.Globals.Settings.EditorSettings.ShowAddress;
                d.intervalElement.value = globals_1.Globals.Settings.Dispacher.interval;
                d.onclose = (sender) => {
                    if (d.dialogResult == dialog_1.DialogResult.ok) {
                        globals_1.Globals.Settings.EditorSettings.ShowAddress = d.showAddress.checked;
                        globals_1.Globals.Settings.Dispacher.interval = d.intervalElement.value;
                        globals_1.Globals.saveJson("/settings.json", globals_1.Globals.Settings);
                        this.showAddresses(globals_1.Globals.Settings.EditorSettings.ShowAddress);
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
                // if(Dispatcher.active) {
                //     Dispatcher.start("dispatcher.js")
                // } else {
                //     Dispatcher.stop()
                // }
            };
            this.toolbar.btnCodeEditor.onclick = (e) => {
                const codeEditor = new codeEditor_1.CodeEditor();
            };
            this.toolbar.btnLoco.onclick = (e) => {
                if (this.toolbar.btnLoco.classList.contains('active')) {
                    this.toolbar.btnLoco.classList.remove("active");
                    this.sidePanelLeft.classList.remove('show');
                    this.sidePanelLeft.classList.add('hide');
                }
                else {
                    this.toolbar.btnLoco.classList.add("active");
                    this.sidePanelLeft.classList.remove('hide');
                    this.sidePanelLeft.classList.add('show');
                }
            };
            this.sidePanelLeft = document.getElementById('sidePanelLeft');
            this.btnSidePanelLeftClose = document.getElementById('btnSidePanelLeftClose');
            this.btnSidePanelLeftClose.onclick = (e) => {
                this.sidePanelLeft.classList.remove('show');
                this.sidePanelLeft.classList.add('hide');
                this.toolbar.btnLoco.classList.remove("active");
            };
            this.locoControlPanel = document.getElementById('locoControlPanel');
        }
        showAddresses(show) {
            this.views.getTurnoutElements().forEach((t) => {
                t.showAddress = show;
            });
            this.views.getSignalElements().forEach((t) => {
                t.showAddress = show;
            });
            this.draw();
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
            this.ctx.reset();
            this.ctx.resetTransform();
            // this.ctx!.setTransform(this.scale, 0, 0, this.scale, this.originX, this.originY);
            //this.ctx!.setTransform(this.scale, 0, 0, this.scale, 0, 0);
            this.ctx.translate(this.originX, this.originY);
            this.ctx.scale(this.scale, this.scale);
            this.drawGrid();
            this.views.elements.slice().reverse().forEach(elem => {
                elem.draw(this.ctx);
            });
            if (this.cursorElement) {
                this.cursorElement.draw(this.ctx);
            }
            this.drawStatus();
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
                        //return e.x == x && e.y == y
                        return e.mouseInView(x, y);
                    });
                    if (this.drawMode == drawModes.pointer) {
                        if (elem) {
                            if (this.selectedElement) {
                                // this.selectedElement.isSelected = false;
                            }
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
                        var te = new track_1.TrackElement((0, dcc_1.getUUID)(), x, y, "track" + this.views.elements.length);
                        te.angle = this.cursorElement.angle;
                        // te.cc = Globals.defaultDevice!
                        this.unselectAll();
                        this.add(te);
                        break;
                    case drawModes.trackEnd:
                        this.removeIfExists(x, y);
                        var te = new trackend_1.TrackEndElement((0, dcc_1.getUUID)(), x, y, "trackEnd" + this.views.elements.length);
                        te.angle = this.cursorElement.angle;
                        // te.cc = Globals.defaultDevice!
                        this.unselectAll();
                        this.add(te);
                        break;
                    case drawModes.trackCorner:
                        this.removeIfExists(x, y);
                        var tc = new corner_1.TrackCornerElement((0, dcc_1.getUUID)(), x, y, "corner" + this.views.elements.length);
                        tc.angle = this.cursorElement.angle;
                        // tc.cc = Globals.defaultDevice!
                        this.unselectAll();
                        this.add(tc);
                        break;
                    case drawModes.trackCurve:
                        this.removeIfExists(x, y);
                        var tc = new curve_1.TrackCurveElement((0, dcc_1.getUUID)(), x, y, "curve" + this.views.elements.length);
                        tc.angle = this.cursorElement.angle;
                        // tc.cc = Globals.defaultDevice!
                        this.unselectAll();
                        this.add(tc);
                        break;
                    case drawModes.rect:
                        this.removeIfExists(x, y);
                        var rectangle = new rectangle_1.RectangleElement((0, dcc_1.getUUID)(), x, y, "rect" + this.views.elements.length);
                        this.unselectAll();
                        rectangle.isSelected = true;
                        this.add(rectangle);
                        break;
                    case drawModes.turnoutRight:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var tor = new turnout_1.TurnoutRightElement((0, dcc_1.getUUID)(), 14, x, y, "turnoutRight" + this.views.elements.length);
                        tor.showAddress = globals_1.Globals.Settings.EditorSettings.ShowAddress;
                        tor.angle = this.cursorElement.angle;
                        // tor.cc = Globals.defaultDevice!
                        this.add(tor);
                        break;
                    case drawModes.turnoutLeft:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var tol = new turnout_1.TurnoutLeftElement((0, dcc_1.getUUID)(), 14, x, y, "turnoutleft" + this.views.elements.length);
                        tol.showAddress = globals_1.Globals.Settings.EditorSettings.ShowAddress;
                        tol.angle = this.cursorElement.angle;
                        // tol.cc = Globals.defaultDevice!
                        this.add(tol);
                        break;
                    case drawModes.turnoutDouble:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var tod = new turnout_1.TurnoutDoubleElement((0, dcc_1.getUUID)(), 0, 0, x, y, "turnoutdouble" + this.views.elements.length);
                        tod.showAddress = globals_1.Globals.Settings.EditorSettings.ShowAddress;
                        tod.angle = this.cursorElement.angle;
                        // tod.cc = Globals.defaultDevice!
                        this.add(tod);
                        break;
                    case drawModes.routeSwitch:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var rs = new route_1.RouteSwitchElement((0, dcc_1.getUUID)(), x, y, "routeSwitch" + this.views.elements.length);
                        this.add(rs);
                        break;
                    case drawModes.signal2:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var s2 = new signals_1.Signal2Element((0, dcc_1.getUUID)(), 14, x, y, "turnoutleft" + this.views.elements.length);
                        s2.showAddress = globals_1.Globals.Settings.EditorSettings.ShowAddress;
                        s2.angle = this.cursorElement.angle;
                        // s2.cc = Globals.defaultDevice!
                        s2.aspect = 1;
                        this.add(s2);
                        break;
                    case drawModes.signal3:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var s3 = new signals_1.Signal3Element((0, dcc_1.getUUID)(), 14, x, y, "turnoutleft" + this.views.elements.length);
                        s3.showAddress = globals_1.Globals.Settings.EditorSettings.ShowAddress;
                        s3.angle = this.cursorElement.angle;
                        // s3.cc = Globals.defaultDevice!
                        s3.aspect = 1;
                        this.add(s3);
                        break;
                    case drawModes.signal4:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var s4 = new signals_1.Signal4Element((0, dcc_1.getUUID)(), 14, x, y, "turnoutleft" + this.views.elements.length);
                        s4.showAddress = globals_1.Globals.Settings.EditorSettings.ShowAddress;
                        s4.angle = this.cursorElement.angle;
                        // s4.cc = Globals.defaultDevice!
                        s4.aspect = 1;
                        this.add(s4);
                        break;
                    case drawModes.block:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var b = new block_1.BlockElement((0, dcc_1.getUUID)(), x, y, "block" + this.views.elements.length);
                        b.angle = this.cursorElement.angle;
                        this.add(b);
                        break;
                    case drawModes.button:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var btn = new button_1.ButtonShapeElement((0, dcc_1.getUUID)(), 0, x, y, "button" + this.views.elements.length);
                        //b.angle = this.cursorElement!.angle
                        this.add(btn);
                        break;
                    case drawModes.audiobutton:
                        this.removeIfExists(x, y);
                        this.unselectAll();
                        var abtn = new audioButton_1.AudioButtonShapeElement((0, dcc_1.getUUID)(), x, y, "audiobutton" + this.views.elements.length);
                        this.add(abtn);
                        break;
                    case drawModes.label2:
                        //this.removeIfExists(x, y)
                        this.unselectAll();
                        var l = new label_1.Label2Element((0, dcc_1.getUUID)(), x, y, "label" + this.views.elements.length);
                        this.add(l);
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
                this.canvas.style.cursor = "pointer";
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
            if (this.status) {
                this.status.innerHTML = `Status| x: ${this.getMouseGridX()} y: ${this.getMouseGridY()} Elements: ${this.views.elements.length} Scale: ${this.scale} origX: ${this.originX} origY: ${this.originY}`;
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
                            // cc: tor.cc
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
                            // cc: tol.cc
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
                            // cc: tod.cc
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
                            valign: la.valign
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
                        elems.push({ uuid: b.UUID, type: b.type, address: b.address, x: b.x, y: b.y, name: b.name });
                        break;
                    case 'audiobutton':
                        var ab = elem;
                        elems.push({ uuid: ab.UUID, type: ab.type, x: ab.x, y: ab.y, name: ab.name, filename: ab.filename });
                        break;
                }
            });
            var config = {
                dispatcher: {
                    //code: Dispatcher.code,
                    active: dispatcher_1.Dispatcher.active,
                    interval: globals_1.Globals.Settings.Dispacher.interval
                },
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
            //this.socket!.emit("configSave", config)
            ws_1.wsClient.send({ type: dcc_1.ApiCommands.configSave, data: config });
        }
        load(config) {
            var _a, _b, _c;
            this.views = new views_1.Views();
            try {
                //Dispatcher.code = "";
                if (config.dispatcher) {
                    //Dispatcher.code = config.dispatcher.code ?? ""
                    dispatcher_1.Dispatcher.active = (_a = config.dispatcher.active) !== null && _a !== void 0 ? _a : false;
                    dispatcher_1.Dispatcher.interval = (_b = config.dispatcher.interval) !== null && _b !== void 0 ? _b : 800;
                }
                else {
                }
                this.scale = config.settings.scale;
                // Globals.EditorSettings.GridSizeX = config.settings.gridSizeX
                // Globals.EditorSettings.GridSizeY = config.settings.gridSizeY
                // Globals.EditorSettings.ShowAddress = config.settings.showAddress
                // Globals.EditorSettings.Orientation = config.settings.orientation
                this.originX = config.settings.origX;
                this.originY = config.settings.origY;
                if (config.settings.locoPanelVisible) {
                    (_c = this.sidePanelLeft) === null || _c === void 0 ? void 0 : _c.classList.add('show');
                    this.toolbar.btnLoco.classList.add("active");
                }
                //var elems = config.elems
                config.pages.forEach((page) => {
                    page.elems.forEach((elem) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
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
                                // tor.cc = elem.cc == undefined ? undefined : elem.cc
                                this.add(tor);
                                break;
                            case "turnoutLeft":
                                var tol = new turnout_1.TurnoutLeftElement(elem.uuid, elem.address, elem.x, elem.y, elem.name);
                                tol.showAddress = globals_1.Globals.Settings.EditorSettings.ShowAddress;
                                tol.angle = elem.angle | 0;
                                tol.t1ClosedValue = (_c = elem.t1ClosedValue) !== null && _c !== void 0 ? _c : true;
                                tol.t1OpenValue = (_d = elem.t1OpenValue) !== null && _d !== void 0 ? _d : false;
                                tol.rbusAddress = elem.rbusAddress;
                                // tol.cc = elem.cc == undefined ? undefined : elem.cc
                                this.add(tol);
                                break;
                            case "turnoutDouble":
                                var tod = new turnout_1.TurnoutDoubleElement(elem.uuid, (_e = elem.address1) !== null && _e !== void 0 ? _e : 0, (_f = elem.address2) !== null && _f !== void 0 ? _f : 0, elem.x, elem.y, elem.name);
                                tod.showAddress = globals_1.Globals.Settings.EditorSettings.ShowAddress;
                                tod.angle = elem.angle | 0;
                                tod.t1ClosedValue = (_g = elem.t1ClosedValue) !== null && _g !== void 0 ? _g : true;
                                tod.t1OpenValue = (_h = elem.t1OpenValue) !== null && _h !== void 0 ? _h : false;
                                tod.t2ClosedValue = (_j = elem.t2ClosedValue) !== null && _j !== void 0 ? _j : true;
                                tod.t2OpenValue = (_k = elem.t2OpenValue) !== null && _k !== void 0 ? _k : false;
                                tod.rbusAddress = elem.rbusAddress;
                                // tod.cc = elem.cc == undefined ? undefined : elem.cc
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
                            case "block":
                                var bl = new block_1.BlockElement(elem.uuid, elem.x, elem.y, elem.name);
                                bl.angle = elem.angle | 0;
                                bl.locoAddress = elem.locoAddress | 0;
                                this.add(bl);
                                break;
                            case "label2":
                                var l = new label_1.Label2Element(elem.uuid, elem.x, elem.y, elem.name);
                                console.log("LABEL:", l instanceof view_1.RailView);
                                l.text = (_l = elem.text) !== null && _l !== void 0 ? _l : "LABEL";
                                l.valign = elem.valign;
                                l.angle = 0;
                                this.add(l);
                                break;
                            case "routeSwitch":
                                var rs = new route_1.RouteSwitchElement(elem.uuid, elem.x, elem.y, elem.name);
                                rs.turnouts = elem.turnouts;
                                this.add(rs);
                                break;
                            case "signal2":
                                var s2 = new signals_1.Signal2Element(elem.uuid, elem.address | 0, elem.x, elem.y, elem.name);
                                s2.angle = (_m = elem.angle) !== null && _m !== void 0 ? _m : 0;
                                s2.addressLength = (_o = elem.addressLength) !== null && _o !== void 0 ? _o : 5;
                                s2.isExtendedDecoder = (_p = s2.isExtendedDecoder) !== null && _p !== void 0 ? _p : false;
                                s2.valueGreen = (_q = elem.valueGreen) !== null && _q !== void 0 ? _q : 0;
                                s2.valueRed = (_r = elem.valueRed) !== null && _r !== void 0 ? _r : 0;
                                s2.rbusAddress = elem.rbusAddress;
                                // s2.cc = elem.cc == undefined ? undefined : elem.cc
                                s2.aspect = 1; // elem.aspect ?? 1
                                this.add(s2);
                                break;
                            case "signal3":
                                var s3 = new signals_1.Signal3Element(elem.uuid, elem.address | 0, elem.x, elem.y, elem.name);
                                s3.angle = (_s = elem.angle) !== null && _s !== void 0 ? _s : 0;
                                s3.addressLength = (_t = elem.addressLength) !== null && _t !== void 0 ? _t : 5;
                                s3.isExtendedDecoder = (_u = s3.isExtendedDecoder) !== null && _u !== void 0 ? _u : false;
                                s3.valueGreen = (_v = elem.valueGreen) !== null && _v !== void 0 ? _v : 0;
                                s3.valueRed = (_w = elem.valueRed) !== null && _w !== void 0 ? _w : 0;
                                s3.valueYellow = (_x = elem.valueYellow) !== null && _x !== void 0 ? _x : 0;
                                s3.rbusAddress = elem.rbusAddress;
                                // s3.cc = elem.cc == undefined ? undefined : elem.cc
                                s3.aspect = 1; //elem.aspect ?? 1
                                this.add(s3);
                                break;
                            case "signal4":
                                var s4 = new signals_1.Signal4Element(elem.uuid, elem.address | 0, elem.x, elem.y, elem.name);
                                s4.angle = (_y = elem.angle) !== null && _y !== void 0 ? _y : 0;
                                s4.addressLength = (_z = elem.addressLength) !== null && _z !== void 0 ? _z : 5;
                                s4.isExtendedDecoder = (_0 = s4.isExtendedDecoder) !== null && _0 !== void 0 ? _0 : false;
                                s4.valueGreen = (_1 = elem.valueGreen) !== null && _1 !== void 0 ? _1 : 0;
                                s4.valueRed = (_2 = elem.valueRed) !== null && _2 !== void 0 ? _2 : 0;
                                s4.valueYellow = (_3 = elem.valueYellow) !== null && _3 !== void 0 ? _3 : 0;
                                s4.valueWhite = (_4 = elem.valueWhite) !== null && _4 !== void 0 ? _4 : 0;
                                s4.rbusAddress = elem.rbusAddress;
                                // s4.cc = elem.cc == undefined ? undefined : elem.cc
                                s4.aspect = 1; //elem.aspect ?? 1
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
                                this.add(b);
                                break;
                            case "audiobutton":
                                var ab = new audioButton_1.AudioButtonShapeElement(elem.uuid, elem.x, elem.y, elem.name);
                                ab.filename = elem.filename;
                                this.add(ab);
                                break;
                        }
                    });
                });
                // const route1 = new RouteSwitchElement(this.ctx!, 2, 2, "route1")
                // this.add(route1)
                this.showAddresses(globals_1.Globals.Settings.EditorSettings.ShowAddress);
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
