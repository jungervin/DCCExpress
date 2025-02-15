define(["require", "exports", "../../../common/src/dcc"], function (require, exports, dcc_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Locos = exports.LocoElement = exports.LocoFunctionElement = exports.LocoFunction = void 0;
    class LocoFunction {
        constructor(fid, name, delay, callback) {
            this.fid = 0;
            this.name = "na";
            this.delay = 0;
            this._isOn = false;
            this.fid = fid;
            this.name = name;
            this.delay = delay;
            this.button = document.createElement('loco-function-element');
            this.button.init(fid, name);
            this.mouseDownHandler = callback;
        }
        get isOn() {
            return this._isOn;
        }
        set isOn(v) {
            this._isOn = v;
            if (v) {
                this.button.classList.add("active");
            }
            else {
                this.button.classList.remove("active");
            }
        }
    }
    exports.LocoFunction = LocoFunction;
    class LocoFunctionElement extends HTMLElement {
        constructor() {
            super();
        }
        connectedCallback() {
            this.className = "btnLocoFunction";
        }
        init(fid, name) {
            this.innerHTML = `<div>F${fid}<br>${name}</div>`;
        }
    }
    exports.LocoFunctionElement = LocoFunctionElement;
    customElements.define('loco-function-element', LocoFunctionElement);
    class LocoElement extends HTMLElement {
        constructor() {
            super();
            this.functions = new Array();
            this.name = "";
            this.address = 3;
            this.speedMode = dcc_1.SpeedModes.S128;
            this.forward = false;
            this.speed = 0;
            this.locoFunctionsPanel = document.getElementById("locoFunctionsPanel");
            this.onclick = (e) => {
                if (this.mouseDownHandler) {
                    this.mouseDownHandler(this, e);
                }
            };
        }
        init(name, img, address, mode, functions) {
            this.name = name;
            this.address = address;
            this.speedMode = mode;
            this.className = "locoItem";
            this.innerHTML = `
                <div>
                    <img src="${img}">
                </div>
                <div>#${this.address} ${this.name}</div>
        `;
        }
        addFunction(f) {
            this.functions.push(f);
            f.button.onmousedown = ((e) => {
                //f.isOn = !f.isOn
                if (f.mouseDownHandler) {
                    f.mouseDownHandler(f, e);
                }
            }).bind(this);
            f.button.onmouseup = ((e) => {
                //f.isOn = !f.isOn
                if (f.mouseUpHandler) {
                    f.mouseUpHandler(f, e);
                }
            }).bind(this);
        }
        show() {
            this.locoFunctionsPanel.innerHTML = "";
            this.functions.forEach((f) => {
                this.locoFunctionsPanel.appendChild(f.button);
                f.isOn = f.isOn;
            });
        }
    }
    exports.LocoElement = LocoElement;
    customElements.define('loco-element', LocoElement);
    class Locos {
        constructor(io) {
            this.locos = new Array();
            this.io = io;
            this.locosUIList = document.getElementById("locosList");
            this.speedometer = document.getElementById("speedometer");
            this.speedometer.setMaxSpeed(160);
            this.speedometer.setSpeed(0);
            this.btnForward = document.getElementById("btnForward");
            this.btnForward.onclick = (e) => {
                var _a;
                this.currentLoco.forward = true;
                this.io.emit("locoDrive", { address: (_a = this._currentLoco) === null || _a === void 0 ? void 0 : _a.address, speedMode: this.currentLoco.speedMode, forward: this.currentLoco.forward, speed: this.currentLoco.speed });
            };
            this.btnStop = document.getElementById("btnStop");
            this.btnStop.onclick = (e) => {
                this.currentLoco.speed = 0;
                this.io.emit("locoDrive", { address: this._currentLoco.address, speedMode: this.currentLoco.speedMode, forward: this.currentLoco.forward, speed: this.currentLoco.speed });
            };
            this.btnReverse = document.getElementById("btnReverse");
            this.btnReverse.onclick = (e) => {
                this.currentLoco.forward = false;
                this.io.emit("locoDrive", { address: this._currentLoco.address, speedMode: this.currentLoco.speedMode, forward: this.currentLoco.forward, speed: this.currentLoco.speed });
            };
            this.btnSpeed10 = document.getElementById("btnSpeed10");
            this.btnSpeed10.onclick = (e) => {
                this.currentLoco.speed = 10;
                this.io.emit("locoDrive", { address: this._currentLoco.address, speedMode: this.currentLoco.speedMode, forward: this.currentLoco.forward, speed: this.currentLoco.speed });
            };
            this.btnSpeed20 = document.getElementById("btnSpeed20");
            this.btnSpeed20.onclick = (e) => {
                this.currentLoco.speed = 20;
                this.io.emit("locoDrive", { address: this._currentLoco.address, speedMode: this.currentLoco.speedMode, forward: this.currentLoco.forward, speed: this.currentLoco.speed });
            };
            this.btnSpeed40 = document.getElementById("btnSpeed40");
            this.btnSpeed40.onclick = (e) => {
                this.currentLoco.speed = 40;
                this.io.emit("locoDrive", { address: this._currentLoco.address, speedMode: this.currentLoco.speedMode, forward: this.currentLoco.forward, speed: this.currentLoco.speed });
            };
            this.btnSpeed80 = document.getElementById("btnSpeed80");
            this.btnSpeed80.onclick = (e) => {
                this.currentLoco.speed = 80;
                this.io.emit("locoDrive", { address: this._currentLoco.address, speedMode: this.currentLoco.speedMode, forward: this.currentLoco.forward, speed: this.currentLoco.speed });
            };
            this.btnSpeed100 = document.getElementById("btnSpeed100");
            this.btnSpeed100.onclick = (e) => {
                this.currentLoco.speed = 120;
                this.io.emit("locoDrive", { address: this._currentLoco.address, speedMode: this.currentLoco.speedMode, forward: this.currentLoco.forward, speed: this.currentLoco.speed });
            };
        }
        updateUI() {
            this.btnStop.className = this.currentLoco.speed == 0 ? "btn btnControl active" : "btn btnControl";
            this.btnSpeed10.className = this.currentLoco.speed == 10 ? "btn btnControl active" : "btn btnControl";
        }
        get currentLoco() {
            return this._currentLoco;
        }
        set currentLoco(v) {
            if (this._currentLoco) {
                this._currentLoco.classList.remove('active');
            }
            this._currentLoco = v;
            if (this._currentLoco) {
                this._currentLoco.classList.add('active');
                this.speedometer.loco = this._currentLoco;
                v.show();
                //this.locoFunctionsPanel.innerHTML = html
            }
        }
        locoClicked(sender, e) {
            this.currentLoco = sender;
        }
        functionMouseDown(sender, e) {
            var _a, _b;
            if (sender.delay > 0) {
                //sender.isOn = true;
                this.io.emit("btnFunction", { address: (_a = this.currentLoco) === null || _a === void 0 ? void 0 : _a.address, fn: sender.fid, on: true, delay: sender.delay });
                setTimeout(() => {
                    var _a;
                    sender.isOn = false;
                    this.io.emit("btnFunction", { address: (_a = this.currentLoco) === null || _a === void 0 ? void 0 : _a.address, fn: sender.fid, on: true, delay: sender.delay });
                }, sender.delay);
            }
            else {
                //sender.isOn = !sender.isOn
                this.io.emit("btnFunction", { address: (_b = this.currentLoco) === null || _b === void 0 ? void 0 : _b.address, fn: sender.fid, on: !sender.isOn, delay: sender.delay });
            }
        }
        load(config) {
            this.locosUIList.innerHTML = "";
            var loco1 = document.createElement("loco-element");
            this.locos.push(loco1);
            this.locosUIList.appendChild(loco1);
            loco1.init("CSÖRGŐ 2182", './images/locos/csorgo.png', 11, dcc_1.SpeedModes.S128, undefined);
            loco1.mouseDownHandler = this.locoClicked.bind(this);
            for (var i = 0; i <= 28; i++) {
                loco1.addFunction(new LocoFunction(i, "F" + i, 0, this.functionMouseDown.bind(this)));
            }
            var loco2 = document.createElement("loco-element");
            this.locosUIList.appendChild(loco2);
            loco2.init("BOBÓ 148", './images/locos/bobo.png', 18, dcc_1.SpeedModes.S128, undefined);
            loco2.mouseDownHandler = this.locoClicked.bind(this);
            loco2.addFunction(new LocoFunction(0, "LIGHT", 0, this.functionMouseDown.bind(this)));
            loco2.addFunction(new LocoFunction(1, "ENGINE", 0, this.functionMouseDown.bind(this)));
            loco2.addFunction(new LocoFunction(2, "<small>l</small>HORN", 500, this.functionMouseDown.bind(this)));
            loco2.addFunction(new LocoFunction(3, "<small>s</small>HORM", 500, this.functionMouseDown.bind(this)));
            this.locos.push(loco2);
            this.currentLoco = loco1;
        }
    }
    exports.Locos = Locos;
});
