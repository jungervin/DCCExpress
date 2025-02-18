define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AudioButtonPropertiesElement = void 0;
    class AudioButtonPropertiesElement extends HTMLElement {
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: 'open' });
            this.shadow.innerHTML = `
            <style>
                @import url("/bootstrap.css");
                @import url("/css/properties.css");
                p {
                    color: #ccc;
                }
            </style>
            <div class="container">
                <div class="igroup">
                    <p>The audio file must be located in the audio folder, but only its name and extension need to be specified. For example: signal.mp3.</p>
                    <div>File Name</div>
                    <div>
                        <input id="filename" type="text" style="width:100%" value="">
                    </div>
                </div>
            </div>
        `;
            this.labelTextElement = this.shadow.getElementById('filename');
        }
        setButton(button) {
            this.button = button;
            this.labelTextElement.value = button.filename;
            this.labelTextElement.onchange = (e) => {
                this.button.filename = this.labelTextElement.value;
                window.invalidate();
            };
        }
    }
    exports.AudioButtonPropertiesElement = AudioButtonPropertiesElement;
    customElements.define("audio-button-properties-element", AudioButtonPropertiesElement);
});
