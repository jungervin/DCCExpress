define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ShapeCombobox = void 0;
    class ShapeCombobox {
    }
    exports.ShapeCombobox = ShapeCombobox;
    [];
    {
        this.container = document.createElement("div");
        this.container.style.position = "relative";
        this.select = document.createElement("select");
        this.select.style.width = "100%";
        this.select.style.padding = "4px";
        this.select.style.marginBottom = "8px";
        this.select.style.border = "1px solid #ccc";
        this.select.style.borderRadius = "4px";
        this.select.style.background = "white";
        options.forEach((option, index) => {
            const opt = document.createElement("option");
            opt.value = index.toString(); // Az indexet használjuk az értékhez
            opt.textContent = option.label;
            this.select.appendChild(opt);
        });
        this.select.addEventListener("change", () => {
            const selectedIndex = parseInt(this.select.value, 10);
            const selectedOption = options[selectedIndex];
            if (selectedOption && this.onchange) {
                this.onchange(this);
            }
        });
        // Létrehozunk egy canvas-t a rajzoláshoz
        const canvas = document.createElement("canvas");
        canvas.width = 80;
        canvas.height = 80;
        canvas.style.marginTop = "8px";
        const ctx = canvas.getContext("2d");
        // A kezdeti állapot kirajzolása
        options[0].shape.draw(ctx);
        // Váltáskor újrarajzoljuk a kiválasztott elemet
        this.select.addEventListener("change", () => {
            var _a;
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Töröljük a korábbi rajzot
                const selectedIndex = parseInt(this.select.value, 10);
                const selectedOption = options[selectedIndex];
                if ((_a = selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.shape) === null || _a === void 0 ? void 0 : _a.draw) {
                    selectedOption.shape.draw(ctx);
                }
            }
        });
        this.container.appendChild(this.select);
        this.container.appendChild(canvas);
    }
    set;
    value(val, string);
    {
        this.select.value = val;
        const event = new Event("change");
        this.select.dispatchEvent(event); // Automatikusan újrarajzol
    }
    get;
    value();
    string;
    {
        return this.select.value;
    }
    getElement();
    HTMLElement;
    {
        return this.container;
    }
});
