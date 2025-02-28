export class ToastManager {
    private container: HTMLElement;
    constructor() {
        this.container = document.getElementById("toastcontainer")!;
    }

    showToast(message: string, type = "info") {
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


export const toastManager = new ToastManager();
