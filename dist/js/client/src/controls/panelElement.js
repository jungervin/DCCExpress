define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMElementEx = void 0;
    class HTMElementEx {
        constructor(element) {
            this.visible = true;
            this.element = element;
        }
        hide() {
            this.visible = false;
            this.element.style.visibility = "hidden";
            if (this.visibilityChanged) {
                this.visibilityChanged(this);
            }
        }
        show() {
            this.visible = true;
            this.element.style.visibility = "visible";
            if (this.visibilityChanged) {
                this.visibilityChanged(this);
            }
        }
    }
    exports.HTMElementEx = HTMElementEx;
});
