export class BitElement extends HTMLElement {
    
    onchanged?: (sender: BitElement) => void;
    constructor() {
        super()
        this.onclick = (e: MouseEvent) => {
            this.value = !this.value
        }
    }

    connectedCallback() {
        this.style.display = "flex"
        this.style.alignItems = "center"
        this.style.justifyContent = "center"
        this.style.fontWeight = "bold"
        this.style.color = 'white'
        this.style.backgroundColor = "#2a2a2a"
        this.style.width = '32px'
        this.style.height = '32px'
        this.style.cursor = 'pointer'
        this.style.border = '1px solid black'
        
        this.value = this.value
    }


    private _value: boolean = false;
    public get value(): boolean {
        return this._value;
    }
    public set value(v: boolean) {
        this._value = v;
       
        if (v) {
            this.style.backgroundColor = "lime"
            this.style.color = "black"
            this.innerHTML = '1'
        } else {
            this.style.backgroundColor = "#2a2a2a"
            this.style.color = "white"
            this.innerHTML = '0'
        }
        if(this.onchanged) {
            this.onchanged(this)
        }
    }

    setCursor(cursor: string) {
        this.style.cursor = cursor
    }

}
customElements.define('bit-element', BitElement);