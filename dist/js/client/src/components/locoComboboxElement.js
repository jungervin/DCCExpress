define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LocomotiveComboBox = void 0;
    class LocomotiveComboBox extends HTMLElement {
        constructor() {
            var _a;
            super();
            this.locomotives = [];
            this.selectedLocomotiveId = null;
            this.onChangeCallback = null;
            // Shadow DOM létrehozása
            const shadow = this.attachShadow({ mode: "open" });
            // Stílusok
            const style = document.createElement("style");
            style.textContent = `
            :host {
                display: inline-block;
                font-family: Arial, sans-serif;
                color: #000;
                
            }
            .dropdown {
                border: 1px solid #ccc;
                border-radius: 4px;
                
                cursor: pointer;
                position: relative;
                
            }
            .dropdown-header {
                display: flex;
                align-items: center;
                padding: 8px;
                background: #f9f9f9;
            }
            .dropdown-header img {
                
                height: 40px;
                margin-right: 10px;
            }
            .dropdown-list {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                margin: 0;
                width: 99%;
                max-height: 200px;
                overflow-y: auto;
                overflow-x: hidden;
                border: 1px solid #ccc;
                background: #fff;
                z-index: 10;
            }
            .dropdown-item {
                display: flex;
                align-items: center;
                padding: 8px;
                border-bottom: 1px solid #eee;
                margin: 0;
            }
            .dropdown-item:last-child {
                border-bottom: none;
            }
            .dropdown-item img {
                
                height: 40px;
                margin-right: 10px;
            }
            .dropdown-item:hover {
                background: #f0f0f0;
            }
            .dropdown.open .dropdown-list {
                display: block;
                margin: 0;
                overflow-x: hidden;
            }
        `;
            shadow.appendChild(style);
            // Dropdown alapstruktúra
            this.dropdown = document.createElement("div");
            this.dropdown.classList.add("dropdown");
            this.dropdown.innerHTML = `
            <div class="dropdown-header">
                <span>Select a locomotive</span>
            </div>
            <div class="dropdown-list"></div>
        `;
            shadow.appendChild(this.dropdown);
            // Eseménykezelő a dropdown-hoz
            (_a = this.dropdown.querySelector(".dropdown-header")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
                this.dropdown.classList.toggle("open");
            });
        }
        // Adatok betöltése
        setLocomotives(locomotives) {
            this.locomotives = locomotives;
            this.renderList();
        }
        // Callback regisztrációja
        onChange(callback) {
            this.onChangeCallback = callback;
        }
        // Locomotive kiválasztása cím alapján
        selectByAddress(address) {
            const locomotive = this.locomotives.find((loco) => loco.address === address);
            if (locomotive) {
                this.selectLocomotive(locomotive);
            }
            else {
                console.warn(`No locomotive found with address ${address}`);
            }
        }
        // Újrarenderelés
        renderList() {
            const list = this.dropdown.querySelector(".dropdown-list");
            if (!list)
                return;
            list.innerHTML = ""; // Lista ürítése
            this.locomotives.forEach((locomotive) => {
                const item = document.createElement("div");
                item.classList.add("dropdown-item");
                item.innerHTML = `
                <img src="${locomotive.imageUrl}" alt="${locomotive.name}">
                <span>${locomotive.name} (#${locomotive.address})</span>
            `;
                item.addEventListener("click", () => {
                    this.selectLocomotive(locomotive);
                    this.dropdown.classList.remove("open");
                });
                list.appendChild(item);
            });
        }
        // Locomotive kiválasztása
        selectLocomotive(locomotive) {
            this.selectedLocomotiveId = locomotive.id;
            const header = this.dropdown.querySelector(".dropdown-header");
            if (header) {
                header.innerHTML = `
                <img src="${locomotive.imageUrl}" alt="${locomotive.name}">
                <span>${locomotive.name} (#${locomotive.address})</span>
            `;
            }
            // Esemény kiváltása
            this.dispatchEvent(new CustomEvent("locomotiveSelected", {
                detail: { locomotive },
                bubbles: true,
                composed: true,
            }));
            // Callback meghívása
            if (this.onChangeCallback) {
                this.onChangeCallback(locomotive);
            }
        }
    }
    exports.LocomotiveComboBox = LocomotiveComboBox;
    // Custom element regisztráció
    customElements.define("locomotive-combo-box", LocomotiveComboBox);
});
