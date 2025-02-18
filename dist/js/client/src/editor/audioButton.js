define(["require", "exports", "./view"], function (require, exports, view_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AudioButtonShapeElement = void 0;
    class AudioManager {
        constructor() {
            this.activeAudios = new Map();
        }
        play(filename) {
            if (this.activeAudios.has(filename)) {
                this.stop(filename);
            }
            const audio = new Audio(filename);
            audio.play().catch(error => console.error("Audio play error:", error));
            this.activeAudios.set(filename, audio);
        }
        stop(filename) {
            const audio = this.activeAudios.get(filename);
            if (audio) {
                audio.pause();
                audio.currentTime = 0; // Visszaállítás elejére
                this.activeAudios.delete(filename);
            }
        }
        stopAll() {
            this.activeAudios.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
            this.activeAudios.clear();
        }
    }
    const audioManager = new AudioManager();
    class AudioButtonShapeElement extends view_1.View {
        constructor(uuid, x, y, name) {
            super(uuid, x, y, name);
        }
        get type() {
            return 'audiobutton';
        }
        draw(ctx) {
            const p = 5; // padding
            ctx.save();
            ctx.strokeRect(this.posLeft + p, this.posTop + p, this.width - 2 * p, this.height - 2 * p);
            ctx.restore();
            super.draw(ctx);
        }
        mouseDown(e) {
            if (this.filename) {
                audioManager.play(this.filename);
                if (this.mouseDownHandler) {
                    this.mouseDownHandler(this);
                }
            }
        }
        get filename() {
            return this._filename;
        }
        set filename(v) {
            this._filename = v;
        }
    }
    exports.AudioButtonShapeElement = AudioButtonShapeElement;
});
