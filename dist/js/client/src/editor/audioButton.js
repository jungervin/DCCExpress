define(["require", "exports", "./view"], function (require, exports, view_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AudioButtonShapeElement = exports.audioManager = exports.AudioManager = void 0;
    class AudioManager {
        constructor() {
            this.activeAudios = new Map();
        }
        play(filename) {
            filename = '/audio/' + filename;
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
                audio.currentTime = 0;
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
    exports.AudioManager = AudioManager;
    exports.audioManager = new AudioManager();
    class AudioButtonShapeElement extends view_1.View {
        constructor(uuid, x, y, name) {
            super(uuid, x, y, name);
            this.fillColor = "black";
            this._filename = "";
        }
        get type() {
            return 'audiobutton';
        }
        draw(ctx) {
            const p = 5; // padding
            ctx.save();
            ctx.strokeStyle = "gainsboro";
            ctx.strokeRect(this.posLeft + p, this.posTop + p, this.width - 2 * p, this.height - 2 * p);
            const x = this.posLeft + 3;
            const y = this.posTop + 3;
            const size = 35;
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(size / 24, size / 24);
            ctx.fillStyle = this.fillColor;
            ctx.beginPath();
            ctx.moveTo(5, 9);
            ctx.lineTo(5, 15);
            ctx.lineTo(9, 15);
            ctx.lineTo(14, 20);
            ctx.lineTo(14, 4);
            ctx.lineTo(9, 9);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.arc(15, 12, 3, Math.PI / -2, Math.PI / 2); // Körív létrehozása a hangerőhöz
            ctx.fill();
            ctx.restore();
            super.draw(ctx);
        }
        play() {
            if (this.filename) {
                exports.audioManager.play(this.filename);
            }
        }
        mouseDown(e) {
            if (this.filename) {
                this.fillColor = "lime";
                window.invalidate();
                this.play();
                if (this.mouseDownHandler) {
                    this.mouseDownHandler(this);
                }
                setTimeout(() => {
                    this.fillColor = "black";
                    window.invalidate();
                }, 250);
            }
            else {
                console.log("audio filename doesnt exists!");
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
