interface Locomotive {
    id: string;
    name: string;
    address: number;
    imageUrl: string;
}

class LocomotiveComboBox extends HTMLElement {
    private locomotives: Locomotive[] = [];
    private selectedLocomotiveId: string | null = null;
    private dropdown: HTMLDivElement;
    private onChangeCallback: ((locomotive: Locomotive) => void) | null = null;

    constructor() {
        super();

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
        this.dropdown.querySelector(".dropdown-header")?.addEventListener("click", () => {
            this.dropdown.classList.toggle("open");
        });
    }

    // Adatok betöltése
    setLocomotives(locomotives: Locomotive[]) {
        this.locomotives = locomotives;
        this.renderList();
    }

    // Callback regisztrációja
    onChange(callback: (locomotive: Locomotive) => void) {
        this.onChangeCallback = callback;
    }

    // Locomotive kiválasztása cím alapján
    selectByAddress(address: number) {
        const locomotive = this.locomotives.find((loco) => loco.address === address);
        if (locomotive) {
            this.selectLocomotive(locomotive);
        } else {
            console.warn(`No locomotive found with address ${address}`);
        }
    }

    // Újrarenderelés
    private renderList() {
        const list = this.dropdown.querySelector(".dropdown-list");
        if (!list) return;

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
    private selectLocomotive(locomotive: Locomotive) {
        this.selectedLocomotiveId = locomotive.id;

        const header = this.dropdown.querySelector(".dropdown-header");
        if (header) {
            header.innerHTML = `
                <img src="${locomotive.imageUrl}" alt="${locomotive.name}">
                <span>${locomotive.name} (#${locomotive.address})</span>
            `;
        }

        // Esemény kiváltása
        this.dispatchEvent(
            new CustomEvent("locomotiveSelected", {
                detail: { locomotive },
                bubbles: true,
                composed: true,
            })
        );

        // Callback meghívása
        if (this.onChangeCallback) {
            this.onChangeCallback(locomotive);
        }
    }
}

// Custom element regisztráció
customElements.define("locomotive-combo-box", LocomotiveComboBox);

export { LocomotiveComboBox, Locomotive };
