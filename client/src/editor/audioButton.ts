import { View } from "./view";



class AudioManager {
    private activeAudios: Map<string, HTMLAudioElement> = new Map();

    play(filename: string) {
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

export class AudioButtonShapeElement extends View {

    constructor(uuid: string, x: number, y: number, name: string) {
        super(uuid, x, y, name)
    }
    get type(): string {
        return 'audiobutton'
    }

    draw(ctx: CanvasRenderingContext2D) {
        const p = 5; // padding
        ctx.save();
        ctx.strokeRect(this.posLeft + p, this.posTop + p, this.width - 2 * p, this.height - 2 * p)

        ctx.restore()
        super.draw(ctx)
    }

    mouseDown(e: MouseEvent): void {
        if (this.filename) {
            audioManager.play(this.filename);
            if (this.mouseDownHandler) {
                this.mouseDownHandler(this)
            }
        }
    }

    private _filename?: string;
    public get filename(): string | undefined {
        return this._filename;
    }
    public set filename(v: string) {
        this._filename = v;
    }

}