define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.drawPolarLine = exports.getPolarXy = exports.drawRectangle = exports.drawTextWithRoundedBackground = exports.drawTextWithBackground = void 0;
    const rad = Math.PI / 180.0;
    function drawTextWithBackground(ctx, x, y, text, textColor = 'black', rectColor = 'lightgray') {
        // Szöveg méretezése
        const textMetrics = ctx.measureText(text);
        const padding = 2; // Párnázás a szöveg körül
        const textWidth = textMetrics.width;
        const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
        // Téglalap méretének kiszámítása
        const rectWidth = textWidth + 2 * padding;
        const rectHeight = textHeight + 2 * padding;
        // Téglalap rajzolása
        ctx.fillStyle = rectColor;
        ctx.fillRect(x, y, rectWidth, rectHeight);
        // Szöveg rajzolása középre
        ctx.fillStyle = textColor;
        const textX = x + padding;
        const textY = y + padding + textMetrics.actualBoundingBoxAscent;
        ctx.fillText(text, textX, textY);
    }
    exports.drawTextWithBackground = drawTextWithBackground;
    function drawTextWithRoundedBackground(ctx, x, y, text, textColor = 'black', rectColor = 'lightgray', borderRadius = 2 // Lekerekítés sugara
    ) {
        ctx.save();
        // Szöveg méretezése
        const textMetrics = ctx.measureText(text);
        const padding = 2; // Párnázás a szöveg körül
        const textWidth = textMetrics.width;
        const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
        // Téglalap méretének kiszámítása
        const rectWidth = textWidth + 2 * padding;
        const rectHeight = textHeight + 2 * padding;
        // Lekerekített téglalap rajzolása
        ctx.fillStyle = rectColor;
        ctx.beginPath();
        ctx.moveTo(x + borderRadius, y);
        ctx.lineTo(x + rectWidth - borderRadius, y);
        ctx.quadraticCurveTo(x + rectWidth, y, x + rectWidth, y + borderRadius);
        ctx.lineTo(x + rectWidth, y + rectHeight - borderRadius);
        ctx.quadraticCurveTo(x + rectWidth, y + rectHeight, x + rectWidth - borderRadius, y + rectHeight);
        ctx.lineTo(x + borderRadius, y + rectHeight);
        ctx.quadraticCurveTo(x, y + rectHeight, x, y + rectHeight - borderRadius);
        ctx.lineTo(x, y + borderRadius);
        ctx.quadraticCurveTo(x, y, x + borderRadius, y);
        ctx.closePath();
        ctx.fill();
        // Szöveg rajzolása középre
        ctx.fillStyle = textColor;
        ctx.textAlign = "left";
        const textX = x + padding;
        const textY = y + padding + textMetrics.actualBoundingBoxAscent;
        ctx.fillText(text, textX, textY);
        ctx.restore();
    }
    exports.drawTextWithRoundedBackground = drawTextWithRoundedBackground;
    function drawRectangle(ctx, x, y, w, h, borderColor = 'black', fillColor = 'lightgray') {
        ctx.beginPath();
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.rect(x, y, w, h);
        ctx.stroke();
    }
    exports.drawRectangle = drawRectangle;
    function getPolarXy(cx, cy, r, theta) {
        return { x: cx + r * Math.cos(theta * rad), y: cy + r * Math.sin(theta * rad) };
    }
    exports.getPolarXy = getPolarXy;
    function drawPolarLine(ctx, centerX, centerY, r, theta, color = "black", lineWidth = 1) {
        // Polar koordináták átalakítása derékszögű koordinátákká
        const x1 = centerX; //+ r1 * Math.cos(theta1);
        const y1 = centerY; //+ r1 * Math.sin(theta1);
        const x2 = centerX + r * Math.cos(theta * rad);
        const y2 = centerY + r * Math.sin(theta * rad);
        // Rajzolás
        ctx.beginPath();
        ctx.moveTo(x1, y1); // Kiindulási pont
        ctx.lineTo(x2, y2); // Végpont
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.closePath();
    }
    exports.drawPolarLine = drawPolarLine;
});
// export class ViewImages {
//     static turnoutLeftClosedCanvas: HTMLCanvasElement = new HTMLCanvasElement()
//     static turnoutLeftOpenCanvas: HTMLCanvasElement = new HTMLCanvasElement()
//     static turnoutLeftClosed: TurnoutLeftElement;
//     static turnoutLeftOpen: TurnoutLeftElement;
//     constructor() {
//         const turnoutLeftClosed = new TurnoutLeftElement('0', 0, ViewImages.turnoutLeftClosedCanvas.getContext('2d')!, 0, 0, "")
//         turnout
//         this.turnoutLeftOpen = new TurnoutLeftElement('0', 0, this.turnoutLeftClosedCanvas.getContext('2d')!, 0, 0, "")
//     }
// }
