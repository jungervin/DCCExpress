import { wsClient } from "../helpers/ws";
import { ApiCommands, iData, iLoco, iLocoFunction, iLocomotive as iLocomotive, iPowerInfo, iSetLocoFunction, iSetPower, Z21Directions } from "../../../common/src/dcc";


interface FunctionButton extends HTMLButtonElement {
    function?: iLocoFunction;
    fn: number;
}


export class LocoControlPanel extends HTMLElement {
    locomotives: iLocomotive[] = [];
    locoImage: HTMLImageElement;
    btnReverse: HTMLButtonElement;
    btnForward: HTMLButtonElement;
    btnStop: HTMLButtonElement;
    btnSpeed10: HTMLButtonElement;
    btnSpeed20: HTMLButtonElement;
    btnSpeed40: HTMLButtonElement;
    btnSpeed80: HTMLButtonElement;
    btnSpeed100: HTMLButtonElement;
    buttons: { [fn: number]: FunctionButton } = {};
    fnButtons: HTMLDivElement;
    modal: HTMLDivElement;
    locoInfoElement: HTMLElement;
    btnSpeed5: HTMLButtonElement;
    btnEmergency: any;
    locoName: HTMLDivElement;
    locoModeInfoElement: HTMLElement;



    constructor() {
        super()
        const shadow = this.attachShadow({ mode: "open" });

        shadow.innerHTML = `
            <style>
                #container {
                    color: black;
                    padding: 10px;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: #f4f4f4;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }

                #infoLeft, #infoRight{
                    background: red;
                    width: 80px;
                    width: 20%;
                    text-align: center;                 
                    display: none;   
                }
                #locoImageDiv {
                    width: 60%;
                    text-align: center;
                    
                }
                /* Mozdonykép stílus */
                #locoImage {
                    height: 64px;
                    max-width: 400px;
                    cursor:pointer;
                    
                }


                /* Gombcsoport az iránygombokhoz (20% - 60% - 20%) */
                .direction-group {
                    display: grid;
                    grid-template-columns: 1fr 2fr 1fr;
                    width: 100%;
                    gap: 6px;
                    margin-bottom: 4px;
                }
        
                /* Sebesség gombok (5 oszlop, azaz 20%-os elosztás) */
                .speed-group {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    width: 100%;
                    gap: 4px;
                    margin-bottom: 4px;
                }
        
                /* Gombok általános stílusa */
                #container button {
                    background: rgb(100, 100, 100);
                    border: none;
                    border-radius: 4px;
                    padding: 0px;
                    color: white;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                    width: 100%;
                    height: 48px;
                }
                
                #fnButtons {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    grid-template-rows: repeat(6, 1fr); /* 12 egyenlő sor */
                    width: 100%;
                    gap: 4px;
                    
                }

                #container #fnButtons button {
                    padding: 0;
                    font-size: 12px;
                }
                #container #fnButtons button.fnbutton {
                    background-color: dodgerblue;
                }

                /* Hover effekt */
                button:hover {
                    background: rgb(125, 125, 125);
                    transform: scale(1.01);
                }
        
                /* Aktív állapot */
                button:active {
                    background:  rgb(25, 25, 25);
                    transform: scale(0.99);
                }
        
                /* Funkció gombok */
                #container #fnButtons button.on {
                    background-color: rgb(77, 77, 255);
                    color: white;
                    border-color: blue;
                }
                    
                #container #fnButtons button.on:hover,
                #container #fnButtons button.on:active {
                    background-color: blue;
                    transform: none;
                }

            /* Modal háttér  */
                #modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    justify-content: center;
                    align-items: center;
                    color: black;
                }
                #modal h3 {
                    padding: 0;
                    margin: 5px;
                }
                /* Modal tartalom */
                .modal-content {
                    width: 80%;
                    background: white;
                    padding: 10px;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                    text-align: center;
                }

                /* Mozdony lista */
                .loco-item {
                    display: flex;
                    flex-direction: column;
                    overflow: auto;
                    align-items: center;
                    padding: 10px;
                    cursor: pointer;
                    border-bottom: 1px solid #ddd;
                    transition: background 0.3s;
                }

                /* Kijelölt mozdony */
                .selected {
                    background: red !important;
                    color: white;
                    font-weight: bold;
                }

                .loco-item:hover {
                    background: #f0f0f0;
                }

                .loco-item img {
                    height: auto;
                    margin-right: 10px;
                    border-radius: 5px;
                }

                /* Modal bezáró gomb */
                #closeModal {
                    margin-top: 10px;
                    padding: 10px 20px;
                    background: red;
                    border: none;
                    color: white;
                    cursor: pointer;
                }

                #locoList {
                    height: 70%;
                    overflow: auto;
                    border-radius: 5px;
                    border: 1px solid #ddd;
                }

                #locoInfo {
                    min-width: 100px;
                    color: #222;
                    background-color: gainsboro;
                    margin-bottom: 4px;
                    padding: 4px;
                    border-radius: 5px;
                    border: 1px solid black;
                    font-weight: bold;
                    justify-content: center;
                    text-align: center;
                    font-size: 2em;
                }

                #container #btnEmergency {
                    width: 100%;
                    background: rgb(104, 30, 30);
                    margin-bottom: 4px;
                }
                #container #btnEmergency:hover {
                    width: 100%;
                    background: rgb(138, 38, 38);
                    margin-bottom: 4px;
                }
                #container #btnEmergency:active {
                    width: 100%;
                    background: rgb(255, 0, 0);
                    margin-bottom: 4px;
                }
                #container #btnEmergency.on {
                    width: 100%;
                    background: rgb(255, 0, 0);
                    margin-bottom: 4px;
                    animation: blink 0.5s infinite alternate;
                }

                @keyframes blink {
                    from {
                        background-color: red;
                        fill: yellow;
                    }
                    to {
                        background-color: rgb(138, 38, 38);
                        fill: #000;
                    }
                }                   

                #container #locoModeInfo {
                    width: 100%;
                    background-color: gray;
                    color: white;
                    padding: 4px 0;
                    border-radius:5px;
                    margin: 4px 0;
                    text-align: center;"
                }

            </style>
        
            <div id="container" class="scrollable" >
                <div style="justify-content: center; width:100%; height: 100px; display: flex; border-bottom: 20px;">
                    <div id="infoLeft">INFO L</div>
                    <div id="locoImageDiv">
                        <img id="locoImage" src="/uploads/1736337194644-csorgo.jpg">
                        <div id="locoName">#11 CSÖRGŐ</div>
                    </div>
                    <div id="infoRight">INFO R</div>
                </div>

                <div id="locoInfo">
                    10
                </div>
        
                <div id="locoModeInfo">
                    MANUAL
                </div>
                <div style="width: 100%">
                    <button id="btnEmergency">EMERGENCY STOP</button>
                </div>
                <!-- KÜLÖN SOR: Irányítás (20% - 60% - 20%) -->
                <div class="direction-group">
                    <button id="btnReverse">&lt;&lt;</button>
                    <button id="btnStop">STOP</button>
                    <button id="btnForward">&gt;&gt;</button>
                </div>
        
                <!-- KÜLÖN SOR: Sebesség gombok (5 oszlop) -->
                <div class="speed-group">
                    <button id="btnSpeed5">5</button>
                    <button id="btnSpeed10">10</button>
                    <button id="btnSpeed20">20</button>
                    <button id="btnSpeed40">40</button>
                    <button id="btnSpeed80">80</button>
                    <button id="btnSpeed100">100</button>
                </div>
        
                <div id="fnButtons"></div>
        
            </div>

             <!-- Modal -->
            <div id="modal">
                <div class="modal-content">
                    <h3 style="padding: 0">Válassz mozdonyt</h3>
                    <div id="locoList"></div>
                    <button id="closeModal">Bezárás</button>
                </div>
            </div>
        `;

        this.locoImage = shadow.getElementById("locoImage") as HTMLImageElement
        this.locoName = shadow.getElementById("locoName") as HTMLDivElement
        this.locoInfoElement = shadow.getElementById("locoInfo") as HTMLElement
        this.locoModeInfoElement = shadow.getElementById("locoModeInfo") as HTMLElement
        this.locoImage.addEventListener("click", () => this.openLocoSelector());
        shadow.getElementById("closeModal")?.addEventListener("click", () => this.closeLocoSelector());


        this.btnEmergency = shadow.getElementById("btnEmergency") as HTMLButtonElement
        this.btnEmergency.onclick = (e: MouseEvent) => {
            if (this.power) {
                wsClient.send({ type: ApiCommands.emergencyStop, data: "" } as iData)
            } else {
                wsClient.send({ type: ApiCommands.setPower, data: { on: true } as iSetPower } as iData)
            }
        }


        this.btnReverse = shadow.getElementById("btnReverse") as HTMLButtonElement
        this.btnReverse.onclick = (e) => {
            if (this.currentLoco) {
                var loco: iLoco = { address: this.currentLoco?.address, direction: Z21Directions.reverse, speed: this.currentLoco.speed, funcMap: 0 }
                wsClient.send({ type: ApiCommands.setLoco, data: loco } as iData)
            }
        }
        this.btnStop = shadow.getElementById("btnStop") as HTMLButtonElement
        this.btnStop.onclick = (e) => {
            if (this.currentLoco) {
                var loco: iLoco = { address: this.currentLoco?.address, direction: this.currentLoco.direction, speed: 0, funcMap: 0 }
                wsClient.send({ type: ApiCommands.setLoco, data: loco } as iData)
            }
        }

        this.btnForward = shadow.getElementById("btnForward") as HTMLButtonElement
        this.btnForward.onclick = (e) => {
            if (this.currentLoco) {
                var loco: iLoco = { address: this.currentLoco?.address, direction: Z21Directions.forward, speed: this.currentLoco.speed, funcMap: 0 }
                wsClient.send({ type: ApiCommands.setLoco, data: loco } as iData)
            }
        }

        this.btnSpeed5 = shadow.getElementById("btnSpeed5") as HTMLButtonElement
        this.btnSpeed5.onclick = (e) => {
            if (this.currentLoco) {
                var loco: iLoco = { address: this.currentLoco?.address, direction: this.currentLoco.direction, speed: this.getSpeedPercentage(5), funcMap: 0 }
                wsClient.send({ type: ApiCommands.setLoco, data: loco } as iData)
            }
        }

        this.btnSpeed10 = shadow.getElementById("btnSpeed10") as HTMLButtonElement
        this.btnSpeed10.onclick = (e) => {
            if (this.currentLoco) {
                var loco: iLoco = { address: this.currentLoco?.address, direction: this.currentLoco.direction, speed: this.getSpeedPercentage(10), funcMap: 0 }
                wsClient.send({ type: ApiCommands.setLoco, data: loco } as iData)
            }
        }

        this.btnSpeed20 = shadow.getElementById("btnSpeed20") as HTMLButtonElement
        this.btnSpeed20.onclick = (e) => {
            if (this.currentLoco) {
                var loco: iLoco = { address: this.currentLoco?.address, direction: this.currentLoco.direction, speed: this.getSpeedPercentage(20), funcMap: 0 }
                wsClient.send({ type: ApiCommands.setLoco, data: loco } as iData)
            }
        }

        this.btnSpeed40 = shadow.getElementById("btnSpeed40") as HTMLButtonElement
        this.btnSpeed40.onclick = (e) => {
            if (this.currentLoco) {
                var loco: iLoco = { address: this.currentLoco?.address, direction: this.currentLoco.direction, speed: this.getSpeedPercentage(40), funcMap: 0 }
                wsClient.send({ type: ApiCommands.setLoco, data: loco } as iData)
            }
        }

        this.btnSpeed80 = shadow.getElementById("btnSpeed80") as HTMLButtonElement
        this.btnSpeed80.onclick = (e) => {
            if (this.currentLoco) {
                var loco: iLoco = { address: this.currentLoco?.address, direction: this.currentLoco.direction, speed: this.getSpeedPercentage(80), funcMap: 0 }
                wsClient.send({ type: ApiCommands.setLoco, data: loco } as iData)
            }
        }
        this.btnSpeed100 = shadow.getElementById("btnSpeed100") as HTMLButtonElement
        this.btnSpeed100.onclick = (e) => {
            if (this.currentLoco) {
                var loco: iLoco = { address: this.currentLoco?.address, direction: this.currentLoco.direction, speed: this.getSpeedPercentage(100), funcMap: 0 }
                wsClient.send({ type: ApiCommands.setLoco, data: loco } as iData)
            }
        }

        this.fnButtons = shadow.getElementById("fnButtons") as HTMLDivElement

        this.modal = shadow.getElementById("modal") as HTMLDivElement;

        for (var i = 0; i <= 28; i++) {

            const btn: FunctionButton = document.createElement('button') as FunctionButton
            this.buttons[i] = btn;
            // btn.style.backgroundColor = "cornflowerblue"
            // btn.style.backgroundColor = "#bbb"
            //btn.className = 'fnbutton'
            btn.fn = i
            btn.function = undefined;
            btn.onpointerdown = (e) => {
                if (this.currentLoco) {
                    if (btn.function) {
                        if (btn.function.momentary) {
                            var f: iSetLocoFunction = { id: btn.fn, address: this.currentLoco?.address, isOn: true }
                            wsClient.send({ type: ApiCommands.setLocoFunction, data: f } as iData)
                        } else {
                            var f: iSetLocoFunction = { id: btn.fn, address: this.currentLoco?.address, isOn: !btn.function.isOn }
                            wsClient.send({ type: ApiCommands.setLocoFunction, data: f } as iData)
                        }
                    } else {
                        const on: boolean = ((this.currentLoco.functionMap >> btn.fn) & 1 ) > 0

                        var f: iSetLocoFunction = { id: btn.fn, address: this.currentLoco?.address, isOn: !on }
                        wsClient.send({ type: ApiCommands.setLocoFunction, data: f } as iData)
                    }
                }
            }
            btn.onpointerup = (e) => {
                if (btn.function && btn.function.momentary && this.currentLoco) {
                    var f: iSetLocoFunction = { id: btn.fn, address: this.currentLoco?.address, isOn: false }
                    wsClient.send({ type: ApiCommands.setLocoFunction, data: f } as iData)
                }
            }

            btn.innerHTML = `F${i}`
            this.fnButtons.appendChild(btn)

        }
    }

  

    init() {
        this.fetchLocomotives()
    }
    connectedCallback() {

    }


    private async fetchLocomotives() {
        try {
            const response = await fetch(`/locomotives`);
            const locos = await response.json();
            this.locomotives = locos.sort((a: iLocomotive, b: iLocomotive) => a.address - b.address);
            //this.render();
            if (this.locomotives.length > 0) {
                this.locomotives.forEach((l) => {
                    l.speed = 0
                    var loco: iLoco = { address: l.address, direction: 0, funcMap: 0, speed: 0 }
                    wsClient.send({ type: ApiCommands.getLoco, data: loco } as iData)
                })
                this.currentLoco = this.locomotives[0]
            }
        } catch (error) {
            console.error("Error fetching locomotives:", error);
        }
    }

    private openLocoSelector() {
        const locoList = this.shadowRoot!.getElementById("locoList") as HTMLElement;
        locoList.innerHTML = "";

        this.locomotives.forEach((loco) => {
            const locoItem = document.createElement("div");
            locoItem.classList.add("loco-item");
            locoItem.innerHTML = `
                <div>
                    <img src="${loco.imageUrl}" alt="${loco.name}">
                </div>
                <div>#${loco.address} ${loco.name}</div>
            `;

            if (loco.id === this.currentLoco?.id) {
                locoItem.classList.add("selected");
                //setTimeout(() => locoItem.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
            }

            locoItem.addEventListener("click", () => {
                this.currentLoco = loco;
                this.closeLocoSelector();
            });
            locoList.appendChild(locoItem);
        });

        this.modal.style.display = "flex";
    }

    private closeLocoSelector() {
        this.modal.style.display = "none";
    }

    render() {
        this.locomotives.forEach((l) => {
            // const loco = document.createElement('div')
            // loco.innerHTML = l.name
            // this.header.appendChild(loco)
        })

    }
    renderLocoFunctions() {
        this.locoImage.src = this.currentLoco!.imageUrl
        this.locoName.innerText = `#${this.currentLoco!.address} ${this.currentLoco!.name}`
        for (var i = 0; i <= 28; i++) {
            //this.buttons[i].style.backgroundColor = "#bbb"
            this.buttons[i].className = ''
            this.buttons[i].function = undefined;
            this.buttons[i].innerHTML = `F${i}`
        }

        this.currentLoco?.functions?.forEach((f) => {
            //this.buttons[f.id].style.backgroundColor = "cornflowerblue"
            this.buttons[f.id].className = 'fnbutton'
            this.buttons[f.id].innerHTML = `F${f.id}<br>${f.name}`
            this.buttons[f.id].function = f
        })

        this.updateUI()
    }


    private _currentLoco: iLocomotive | undefined
    public get currentLoco(): iLocomotive | undefined {
        return this._currentLoco;
    }
    public set currentLoco(v: iLocomotive) {
        this._currentLoco = v;
        this.renderLocoFunctions()
    }

    getSpeedPercentage(perc: number, maxSpeed: number = 127): number {
        return Math.round((maxSpeed * (perc / 100.0)));
    }
    getClosestSpeedThreshold(speed: number, maxSpeed: number = 127): number {
        if (speed == 0) {
            return 0;
        }
        // const speedThresholds = [5, 10, 40, 80, 100];
        // const speedValues = speedThresholds.map(p => Math.round((p / 100) * maxSpeed));

        // return speedValues.reduce((closest, current) =>
        //     Math.abs(currentSpeed - current) <= Math.abs(currentSpeed - closest) ? current : closest
        // );

        const percentageThresholds = [5, 10, 20, 40, 80, 100];

        // Százalékos értéket számolunk a speed alapján
        const speedPercentage = (speed / maxSpeed) * 100;

        // Megkeressük a legközelebbi százalékértéket
        return percentageThresholds.reduce((closest, current) =>
            Math.abs(speedPercentage - current) < Math.abs(speedPercentage - closest) ? current : closest
        );
    }

    calculateRealSpeed(modelSpeed: number): number {
        const scaleFactor = 87; // H0 méretarány
        const realSpeed = (modelSpeed * scaleFactor) * 3600 / 100000; // átváltás km/h-ra
        return Math.round(realSpeed * 10) / 10; // Egy tizedes jegyre kerekítés
    }

    calculateRealTrainSpeed(dccSpeed: number, realMaxSpeed: number = 120): number {
        if (dccSpeed < 0 || dccSpeed > 127) {
            throw new Error("A DCC sebességnek 0 és 127 között kell lennie.");
        }

        const realSpeed = (dccSpeed / 127) * realMaxSpeed;
        return Math.round(realSpeed * 10) / 10; // Kerekítés 1 tizedes jegyre
    }
    updateUI() {
        if (this.currentLoco) {
            const speed = this.getClosestSpeedThreshold(this.currentLoco.speed)

            this.btnReverse.style.backgroundColor = this.currentLoco.direction == Z21Directions.reverse ? 'lime' : 'gray'
            this.btnStop.style.backgroundColor = this.currentLoco.speed == 0 ? 'orange' : 'gray'
            this.btnForward.style.backgroundColor = this.currentLoco.direction == Z21Directions.forward ? 'lime' : 'gray'

            this.btnSpeed5.style.backgroundColor = speed == 5 ? 'lime' : 'gray'
            this.btnSpeed10.style.backgroundColor = speed == 10 ? 'lime' : 'gray'
            this.btnSpeed20.style.backgroundColor = speed == 20 ? 'lime' : 'gray'
            this.btnSpeed40.style.backgroundColor = speed == 40 ? 'lime' : 'gray'
            this.btnSpeed80.style.backgroundColor = speed == 80 ? 'lime' : 'gray'
            this.btnSpeed100.style.backgroundColor = speed == 100 ? 'lime' : 'gray'

            this.locoInfoElement.innerHTML = this.currentLoco.speed.toString()

            for (var i = 0; i <= 28; i++) {
                var on = ((this.currentLoco.functionMap >> i) & 1) == 1;
                const fn = this.currentLoco.functions.find(f => f.id == i)
                if (fn) {
                    fn.isOn = on
                }
                if (on) {
                    this.buttons[i].classList.add('on')
                } else {
                    this.buttons[i].classList.remove('on')
                }
            }



        } else {
            this.locoInfoElement.innerHTML = "Unknown Loco"
        }


    }
    public processMessage(data: iLoco) {

        if (data) {
            const loco = this.locomotives.find(l => l.address == data.address)
            if (loco) {
                loco.speed = data.speed;
                loco.direction = data.direction
                loco.functionMap = data.funcMap



                if (this.currentLoco && this.currentLoco.address == loco.address) {
                    this.updateUI()
                }
            }
        } else {
            console.log("controlPanel.processMessage:  data undefined",)
        }
    }


    private _power?: iPowerInfo
    public get power(): iPowerInfo | undefined {
        return this._power;
    }
    public set power(pi: iPowerInfo) {
        if (pi.emergencyStop) {
            this.btnEmergency.classList.add('on')
        } else {
            this.btnEmergency.classList.remove('on')
        }
        this._power = pi;
    }

}

customElements.define('loco-control-panel', LocoControlPanel)