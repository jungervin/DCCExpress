define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TrackPropertiesElement = void 0;
    class TrackPropertiesElement extends HTMLElement {
        // deviceElement: CommandCenterHTMLSelectElement;
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = `
        <style>
                @import url("css/bootstrap.min.css");
                @import url("css/properties.css");
        </style>
    
        <div class="container">
        <!--
            <div class="igroup">
                <command-center-select-element id="device"></command-center-select-element>
            </div>
            -->

            <div class="igroup">
                <div>RBus Address</div>
                <div>
                    <input id="rbusAddress" type="number" value="0">
                </div>
            </div>
        </div>
    `;
            // this.deviceElement = shadow.getElementById("device") as CommandCenterHTMLSelectElement
            this.rbusAddressElement = shadow.getElementById("rbusAddress");
        }
        setTrack(track) {
            this.trackElement = track;
            // this.deviceElement.setSelectedDevice(this.trackElement!.cc)
            // this.deviceElement!.onchangeCallback = (value) => {
            //     this.trackElement!.cc = value!
            // };        
            this.rbusAddressElement.value = this.trackElement.rbusAddress.toString();
            this.rbusAddressElement.onchange = (e) => {
                this.trackElement.rbusAddress = parseInt(this.rbusAddressElement.value);
            };
        }
    }
    exports.TrackPropertiesElement = TrackPropertiesElement;
    customElements.define("track-properties-element", TrackPropertiesElement);
});
