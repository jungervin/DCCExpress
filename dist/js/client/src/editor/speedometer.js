"use strict";
// import { LocoElement } from "./loco";
// export class SpeedometerElement extends HTMLElement {
//     private maxSpeed: number = 100; 
//     private currentSpeed: number = 0;
//     speedElement: HTMLDivElement;
//     labelElement: HTMLDivElement;
//     btnForward: HTMLDivElement;
//     btnReverse: HTMLDivElement;
//     constructor() {
//         super();
//         this.speedElement = document.createElement("div")
//         this.appendChild(this.speedElement)
//         this.labelElement = document.createElement("div")
//         this.appendChild(this.labelElement)
//         this.btnForward = document.createElement("div")
//         this.btnForward.className = "btnLocoForward"
//         this.appendChild(this.btnForward)
//         this.btnReverse = document.createElement("div")
//         this.btnReverse.className = "btnLocoReverse"
//         this.appendChild(this.btnReverse)
//     }
//     static get observedAttributes() {
//         return ['max-speed', 'current-speed'];
//     }
//     attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
//         // if (name === 'max-speed' && newValue) {
//         //     this.maxSpeed = parseInt(newValue, 10);
//         //     this.updateLabel();
//         // } else if (name === 'current-speed' && newValue) {
//         //     this.currentSpeed = parseInt(newValue, 10);
//         //     this.updateNeedle();
//         //     this.updateLabel();
//         // }
//     }
//     private updateNeedle() {
//         const angle = (180 * this.currentSpeed) / this.maxSpeed - 90; // -90°-tól indul
//         // this.needle.style.transform = `rotate(${angle}deg)`;
//     }
//     private updateLabel() {
//         // const label = this.shadowRoot!.querySelector('.label');
//         // if (label) {
//         //     label.textContent = `${this.currentSpeed} / ${this.maxSpeed} km/h`;
//         // }
//     }
//     // Sebesség beállítása (TypeScriptből is)
//     public setSpeed(speed: number) {
//         this.speedElement.innerHTML = speed.toString()
//     }
//     public setMaxSpeed(maxSpeed: number) {
//     }
//     private _loco: LocoElement | undefined;
//     public get loco(): LocoElement {
//         return this._loco!;
//     }
//     public set loco(v: LocoElement) {
//         this._loco = v;
//         if(v) {
//             this.labelElement.innerHTML = v.name
//         } else {
//             this.labelElement.innerHTML = ""
//         }
//     }
// }
// // Komponens regisztrációja
// customElements.define('speedometer-element', SpeedometerElement);
