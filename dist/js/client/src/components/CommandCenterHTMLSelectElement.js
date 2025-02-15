define(["require", "exports", "../helpers/globlas"], function (require, exports, globlas_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CommandCenterHTMLSelectElement = void 0;
    class CommandCenterHTMLSelectElement extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = `
            <link rel="stylesheet" href="/bootstrap.css">            
            <div class="form-group">
                <div>Command Center:</div>
                <select name="device" id="device" style="min-width: 50%; height: 2em">
                <option value="na">NA</option>
                </select>
            </div>
        `;
            this.list = shadow.getElementById("device");
            this.list.onchange = (e) => {
                if (this._onChangeCallback) {
                    this._onChangeCallback(this.getSelectedDevice());
                }
            };
            //this.init()
        }
        init() {
            //fetchDevices().then((data: iCommandCenter[]) => {
            this.list.innerHTML = "";
            this.devices = globlas_1.Globals.devices;
            var opt = document.createElement("option");
            opt.value = "";
            opt.innerHTML = "---";
            this.list.appendChild(opt);
            for (var i = 0; i < globlas_1.Globals.devices.length; i++) {
                var cc = globlas_1.Globals.devices[i];
                var opt = document.createElement("option");
                opt.value = cc.uuid;
                opt.innerHTML = cc.name;
                this.list.appendChild(opt);
            }
            //this.resolveDevicesLoaded();
            //})
        }
        getSelectedDevice() {
            if (!this.devices)
                return null;
            const selectedId = this.list.value;
            return this.devices.find((device) => device.uuid === selectedId) || null;
        }
        setSelectedDevice(device) {
            //await this.devicesLoaded; 
            this.init();
            if (device) {
                this.list.value = device.uuid;
                if (this._onChangeCallback) {
                    this._onChangeCallback(device);
                }
            }
        }
        set onchangeCallback(callback) {
            this._onChangeCallback = callback;
        }
    }
    exports.CommandCenterHTMLSelectElement = CommandCenterHTMLSelectElement;
    customElements.define("command-center-select-element", CommandCenterHTMLSelectElement);
});
