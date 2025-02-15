export class ToastManager {
    private container: HTMLElement;

    constructor() {
        this.container = document.createElement("div");
        this.container.className = "toast-container";
        document.body.appendChild(this.container);
    }

    showToast(message: string) {
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

// Példa használat
export const toastManager = new ToastManager();
toastManager.showToast("Started!");
