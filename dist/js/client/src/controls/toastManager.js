define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toastManager = exports.ToastManager = void 0;
    class ToastManager {
        constructor() {
            this.container = document.getElementById("toastcontainer");
        }
        showToast(message, type = "info") {
            const toast = document.createElement("div");
            toast.className = "toast2 " + type;
            toast.innerHTML = message;
            this.container.appendChild(toast);
            setTimeout(() => {
                toast.classList.add("fade-out");
                setTimeout(() => {
                    toast.remove();
                }, 500); // Animációs idő
            }, 5000);
        }
    }
    exports.ToastManager = ToastManager;
    exports.toastManager = new ToastManager();
});
