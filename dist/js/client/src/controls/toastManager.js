define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toastManager = exports.ToastManager = void 0;
    class ToastManager {
        constructor() {
            this.container = document.createElement("div");
            this.container.className = "toast-container";
            document.body.appendChild(this.container);
        }
        showToast(message) {
            const toast = document.createElement("div");
            toast.className = "toast";
            toast.innerText = message;
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
    exports.toastManager.showToast("Started!");
});
