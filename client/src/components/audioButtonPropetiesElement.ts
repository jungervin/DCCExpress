import { AudioButtonShapeElement } from "../editor/audioButton";

export class AudioButtonPropertiesElement extends HTMLElement {
    shadow: ShadowRoot;
    labelTextElement: HTMLInputElement | null;
    button?: AudioButtonShapeElement;
    
    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadow.innerHTML = `
            <style>
                @import url("css/bootstrap.min.css");
                @import url("css/properties.css");
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
        `
        this.labelTextElement = this.shadow.getElementById('filename') as HTMLInputElement
    }

    setButton(button: AudioButtonShapeElement) {
        this.button = button;
        this.labelTextElement!.value = button.filename!
        this.labelTextElement!.onchange = (e) => {
           this.button!.filename = this.labelTextElement!.value
           window.invalidate()
        }
    }
}
customElements.define("audio-button-properties-element", AudioButtonPropertiesElement)