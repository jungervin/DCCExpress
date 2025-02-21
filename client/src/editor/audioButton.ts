import { View } from "./view";

export class AudioManager {
    private activeAudios: Map<string, HTMLAudioElement> = new Map();

    play(filename: string) {
        filename = '/audio/' + filename
        if (this.activeAudios.has(filename)) {
            this.stop(filename);
        }

        const audio = new Audio(filename);
        audio.play().catch(error => console.error("Audio play error:", error));

        this.activeAudios.set(filename, audio);
    }

    stop(filename: string) {
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


export const audioManager = new AudioManager();

export class AudioButtonShapeElement extends View {
    fillColor: string = "black";

    constructor(uuid: string, x: number, y: number, name: string) {
        super(uuid, x, y, name)
    }
    get type(): string {
        return 'audiobutton'
    }

    draw(ctx: CanvasRenderingContext2D) {
        const p = 5; // padding
        ctx.save();

        ctx.strokeStyle = "gainsboro";
        ctx.strokeRect(this.posLeft + p, this.posTop + p, this.width - 2 * p, this.height - 2 * p)

        const x = this.posLeft + 3
        const y = this.posTop + 3
        const size = 35

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
        ctx.arc(15, 12, 3, Math.PI / -2, Math.PI / 2 ); // Körív létrehozása a hangerőhöz
        ctx.fill();

        ctx.restore();



        super.draw(ctx)
    }

    play() {
        if (this.filename) {
            audioManager.play(this.filename);
        }
    }

    mouseDown(e: MouseEvent): void {
        if (this.filename) {
            this.fillColor = "lime";
            window.invalidate();
            this.play()
            if (this.mouseDownHandler) {
                this.mouseDownHandler(this)
            }

            setTimeout(() => {
                this.fillColor = "black";
                window.invalidate();
            }, 250);
        } else {
            console.log("audio filename doesnt exists!")
        }
    }

    private _filename: string = "";
    public get filename(): string | undefined {
        return this._filename;
    }
    public set filename(v: string) {
        this._filename = v;
    }

}