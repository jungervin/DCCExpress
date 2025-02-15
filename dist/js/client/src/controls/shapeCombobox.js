define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ShapeCombobox = void 0;
    class ShapeCombobox {
        constructor(views) {
            this.selectedOption = null;
            this.container = document.createElement("div");
            this.container.style.position = "relative";
            this.container.style.border = "1px solid #ccc";
            this.container.style.borderRadius = "4px";
            this.container.style.overflow = "hidden";
            this.container.style.marginBottom = "8px";
            this.header = document.createElement("div");
            this.header.style.display = "flex";
            this.header.style.flexWrap = "wrap";
            this.header.style.height = "80px";
            // this.header.style.alignItems = "center";
            this.header.style.padding = "8px";
            this.header.style.background = "#f9f9f9";
            this.header.textContent = "Select an option";
            this.header.style.cursor = "pointer";
            const dropdownArrow = document.createElement("span");
            dropdownArrow.textContent = "▼";
            dropdownArrow.style.position = "absolute";
            dropdownArrow.style.top = "0px";
            dropdownArrow.style.right = "0px";
            dropdownArrow.style.height = "100%";
            dropdownArrow.style.width = "30px";
            dropdownArrow.style.margin = "0";
            dropdownArrow.style.padding = "8px";
            dropdownArrow.style.fontSize = "16px";
            dropdownArrow.style.color = "#666";
            dropdownArrow.style.backgroundColor = "silver";
            this.header.addEventListener("click", () => {
                if (this.list.style.display === "block") {
                    this.list.style.display = "none";
                    document.body.removeChild(this.list); // Eltávolítjuk a body-ból
                }
                else {
                    const rect = this.header.getBoundingClientRect();
                    // Áthelyezzük a listát a body-ba
                    this.list.style.display = "block";
                    this.list.style.position = "absolute";
                    this.list.style.top = `${rect.bottom}px`;
                    this.list.style.left = `${rect.left}px`;
                    this.list.style.width = `${rect.width}px`;
                    document.body.appendChild(this.list);
                    const handleClickOutside = (e) => {
                        if (!this.container.contains(e.target) && e.target !== this.list) {
                            document.removeEventListener("click", handleClickOutside);
                            this.list.style.display = "none";
                            document.body.removeChild(this.list); // Eltávolítjuk a body-ból
                        }
                    };
                    document.addEventListener("click", handleClickOutside);
                }
            });
            this.list = document.createElement("div");
            this.list.style.display = "none";
            this.list.style.position = "absolute";
            this.list.style.top = "0";
            this.list.style.left = "0";
            this.list.style.width = "100%";
            this.list.style.maxHeight = "300px";
            this.list.style.overflowY = "auto";
            this.list.style.border = "1px solid #ccc";
            this.list.style.backgroundColor = "white";
            this.list.style.color = "black";
            // this.list.style.zIndex = "12000";
            views.forEach((option) => {
                const item = document.createElement("div");
                item.style.display = "flex";
                item.style.flexWrap = "wrap";
                // item.style.alignItems = "center";
                // item.style.verticalAlign = "start"
                item.style.padding = "8px";
                item.style.borderBottom = "1px solid #eee";
                item.style.cursor = "pointer";
                item.style.color = "black";
                const canvas = document.createElement('canvas-shape-element');
                canvas.style.margin = "4px";
                canvas.initFrom(option);
                canvas.draw();
                const label = document.createElement("div");
                // label.style.top = "0%"
                label.innerHTML = option.toString();
                item.appendChild(canvas);
                item.appendChild(label);
                item.addEventListener("click", () => {
                    this.selectOption(option);
                });
                this.list.appendChild(item);
            });
            this.header.appendChild(dropdownArrow);
            this.container.appendChild(this.header);
        }
        selectOption(option) {
            this.selectedOption = option;
            this.header.innerHTML = "";
            const canvas = document.createElement('canvas-shape-element');
            canvas.style.margin = "4px";
            canvas.initFrom(option);
            canvas.draw();
            const label = document.createElement("div");
            label.innerHTML = option.toString();
            // label.style.marginLeft = "4px";
            const dropdownArrow = document.createElement("span");
            dropdownArrow.textContent = "▼";
            dropdownArrow.style.position = "absolute";
            dropdownArrow.style.top = "0px";
            dropdownArrow.style.right = "0px";
            dropdownArrow.style.height = "100%";
            dropdownArrow.style.width = "30px";
            dropdownArrow.style.margin = "0";
            dropdownArrow.style.padding = "8px";
            dropdownArrow.style.fontSize = "16px";
            dropdownArrow.style.color = "#666";
            dropdownArrow.style.backgroundColor = "silver";
            this.header.appendChild(canvas);
            this.header.appendChild(label);
            this.header.appendChild(dropdownArrow);
            if (this.onchange) {
                this.onchange(option);
            }
            this.list.style.display = "none";
        }
        set value(option) {
            if (option) {
                this.selectOption(option);
            }
        }
        get value() {
            return this.selectedOption;
        }
        getElement() {
            return this.container;
        }
    }
    exports.ShapeCombobox = ShapeCombobox;
});
