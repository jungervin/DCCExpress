export class FastClock {
    private canvas?: HTMLCanvasElement | null;
    private ctx: CanvasRenderingContext2D;
    private scaleFactor: number;
    private currentTime: Date;
    interval?: NodeJS.Timeout | null;
    visible: boolean = false;


    constructor(ctx: CanvasRenderingContext2D, scaleFactor: number = 1) {
        this.ctx = ctx
        this.scaleFactor = scaleFactor;
        this.currentTime = new Date();
        this.start();
    }

    private start() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => this.update(), 1000 / this.scaleFactor);
    }

    public update() {
        this.currentTime.setSeconds(this.currentTime.getSeconds() + 1);
        requestAnimationFrame(() => {
            this.draw();
        })
    }

    public draw() {

        if (this.visible) {
            const ctx = this.ctx;
            const width = 140;
            const height = width;
            //const centerX = width / 2;
            const x = this.ctx.canvas.width / 2 - width / 2
            const y = 10
            const centerX = x + width / 2
            const centerY = height / 2;
            const radius = Math.min(width, height) / 2 - 10;

            //ctx.clearRect(x, y, width, height);

            // Óralap
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = "black";
            ctx.fillStyle = "white"
            ctx.lineWidth = 6;
            ctx.fill()
            ctx.stroke();

            // Számok (órajelölések)
            for (let i = 1; i <= 12; i++) {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x = centerX + Math.cos(angle) * (radius - 16);
                const y = centerY + Math.sin(angle) * (radius - 16);
                ctx.font = "16px Arial";
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(i.toString(), x, y);
            }

            // Mutatók szögének kiszámítása
            const hours = this.currentTime.getHours() % 12;
            const minutes = this.currentTime.getMinutes();
            const seconds = this.currentTime.getSeconds();

            const hourAngle = ((hours + minutes / 60) * 30 - 90) * (Math.PI / 180);
            const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * (Math.PI / 180);
            const secondAngle = (seconds * 6 - 90) * (Math.PI / 180);

            // Óramutató
            this.drawHand(centerX, centerY, hourAngle, radius * 0.5, 6, "black");

            // Percmutató
            this.drawHand(centerX, centerY, minuteAngle, radius * 0.7, 4, "black");

            // Másodpercmutató
            this.drawHand(centerX, centerY, secondAngle, radius * 0.85, 2, "red");

            // Óra középpont
            ctx.beginPath();
            ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
        }
        //this.ctx.restore();
    }

    private drawHand(x: number, y: number, angle: number, length: number, width: number, color: string) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.stroke();
    }

    public setScaleFactor(factor: number) {
        this.scaleFactor = factor;
        this.start(); // Frissítjük az intervallumot
    }
}

