export class HTMElementEx {
    element: HTMLElement;
    visible: boolean = true;
    visibilityChanged?: (sender: HTMElementEx) => void;
    constructor(element: HTMLElement) {
        this.element = element;
    }

    hide() {
        this.visible = false;
        this.element.style.visibility = "hidden"
        if(this.visibilityChanged) {
            this.visibilityChanged(this)
        }
    }

    show() {
        this.visible = true;
        this.element.style.visibility = "visible"
        if(this.visibilityChanged) {
            this.visibilityChanged(this)
        }
    }
}