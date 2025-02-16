var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../helpers/ws", "../../../common/src/dcc"], function (require, exports, ws_1, dcc_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LocoControlPanel = void 0;
    class LocoControlPanel extends HTMLElement {
        constructor() {
            var _a;
            super();
            this.locomotives = [];
            this.buttons = {};
            this._power = false;
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


            /* Modal háttér */
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
                    background: white;
                    padding: 10px;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                    
                    text-align: center;
                    
                }

                /* Mozdony lista */
                .loco-item {
                    display: flex;
                    
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
                    height: 300px;
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
            this.locoImage = shadow.getElementById("locoImage");
            this.locoName = shadow.getElementById("locoName");
            this.locoInfoElement = shadow.getElementById("locoInfo");
            this.locoImage.addEventListener("click", () => this.openLocoSelector());
            (_a = shadow.getElementById("closeModal")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => this.closeLocoSelector());
            this.btnEmergency = shadow.getElementById("btnEmergency");
            this.btnEmergency.onclick = (e) => {
                if (this.power) {
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.emergencyStop, data: "" });
                }
                else {
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.setPower, data: { on: true } });
                }
            };
            this.btnReverse = shadow.getElementById("btnReverse");
            this.btnReverse.onclick = (e) => {
                var _a;
                if (this.currentLoco) {
                    var loco = { address: (_a = this.currentLoco) === null || _a === void 0 ? void 0 : _a.address, direction: dcc_1.Z21Directions.reverse, speed: this.currentLoco.speed, funcMap: 0 };
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.setLoco, data: loco });
                }
            };
            this.btnStop = shadow.getElementById("btnStop");
            this.btnStop.onclick = (e) => {
                var _a;
                if (this.currentLoco) {
                    var loco = { address: (_a = this.currentLoco) === null || _a === void 0 ? void 0 : _a.address, direction: this.currentLoco.direction, speed: 0, funcMap: 0 };
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.setLoco, data: loco });
                }
            };
            this.btnForward = shadow.getElementById("btnForward");
            this.btnForward.onclick = (e) => {
                var _a;
                if (this.currentLoco) {
                    var loco = { address: (_a = this.currentLoco) === null || _a === void 0 ? void 0 : _a.address, direction: dcc_1.Z21Directions.forward, speed: this.currentLoco.speed, funcMap: 0 };
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.setLoco, data: loco });
                }
            };
            this.btnSpeed5 = shadow.getElementById("btnSpeed5");
            this.btnSpeed5.onclick = (e) => {
                var _a;
                if (this.currentLoco) {
                    var loco = { address: (_a = this.currentLoco) === null || _a === void 0 ? void 0 : _a.address, direction: this.currentLoco.direction, speed: this.getSpeedPercentage(5), funcMap: 0 };
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.setLoco, data: loco });
                }
            };
            this.btnSpeed10 = shadow.getElementById("btnSpeed10");
            this.btnSpeed10.onclick = (e) => {
                var _a;
                if (this.currentLoco) {
                    var loco = { address: (_a = this.currentLoco) === null || _a === void 0 ? void 0 : _a.address, direction: this.currentLoco.direction, speed: this.getSpeedPercentage(10), funcMap: 0 };
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.setLoco, data: loco });
                }
            };
            this.btnSpeed20 = shadow.getElementById("btnSpeed20");
            this.btnSpeed20.onclick = (e) => {
                var _a;
                if (this.currentLoco) {
                    var loco = { address: (_a = this.currentLoco) === null || _a === void 0 ? void 0 : _a.address, direction: this.currentLoco.direction, speed: this.getSpeedPercentage(20), funcMap: 0 };
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.setLoco, data: loco });
                }
            };
            this.btnSpeed40 = shadow.getElementById("btnSpeed40");
            this.btnSpeed40.onclick = (e) => {
                var _a;
                if (this.currentLoco) {
                    var loco = { address: (_a = this.currentLoco) === null || _a === void 0 ? void 0 : _a.address, direction: this.currentLoco.direction, speed: this.getSpeedPercentage(40), funcMap: 0 };
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.setLoco, data: loco });
                }
            };
            this.btnSpeed80 = shadow.getElementById("btnSpeed80");
            this.btnSpeed80.onclick = (e) => {
                var _a;
                if (this.currentLoco) {
                    var loco = { address: (_a = this.currentLoco) === null || _a === void 0 ? void 0 : _a.address, direction: this.currentLoco.direction, speed: this.getSpeedPercentage(80), funcMap: 0 };
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.setLoco, data: loco });
                }
            };
            this.btnSpeed100 = shadow.getElementById("btnSpeed100");
            this.btnSpeed100.onclick = (e) => {
                var _a;
                if (this.currentLoco) {
                    var loco = { address: (_a = this.currentLoco) === null || _a === void 0 ? void 0 : _a.address, direction: this.currentLoco.direction, speed: this.getSpeedPercentage(100), funcMap: 0 };
                    ws_1.wsClient.send({ type: dcc_1.ApiCommands.setLoco, data: loco });
                }
            };
            this.fnButtons = shadow.getElementById("fnButtons");
            this.modal = shadow.getElementById("modal");
            for (var i = 0; i <= 28; i++) {
                const btn = document.createElement('button');
                this.buttons[i] = btn;
                // btn.style.backgroundColor = "cornflowerblue"
                // btn.style.backgroundColor = "#bbb"
                //btn.className = 'fnbutton'
                btn.fn = i;
                btn.function = undefined;
                btn.onpointerdown = (e) => {
                    var _a, _b, _c;
                    if (this.currentLoco) {
                        if (btn.function) {
                            if (btn.function.momentary) {
                                var f = { id: btn.fn, address: (_a = this.currentLoco) === null || _a === void 0 ? void 0 : _a.address, isOn: true };
                                ws_1.wsClient.send({ type: dcc_1.ApiCommands.setLocoFunction, data: f });
                            }
                            else {
                                var f = { id: btn.fn, address: (_b = this.currentLoco) === null || _b === void 0 ? void 0 : _b.address, isOn: !btn.function.isOn };
                                ws_1.wsClient.send({ type: dcc_1.ApiCommands.setLocoFunction, data: f });
                            }
                        }
                        else {
                            const on = ((this.currentLoco.functionMap >> btn.fn) & 1) > 0;
                            var f = { id: btn.fn, address: (_c = this.currentLoco) === null || _c === void 0 ? void 0 : _c.address, isOn: !on };
                            ws_1.wsClient.send({ type: dcc_1.ApiCommands.setLocoFunction, data: f });
                        }
                    }
                };
                btn.onpointerup = (e) => {
                    var _a;
                    if (btn.function && btn.function.momentary && this.currentLoco) {
                        var f = { id: btn.fn, address: (_a = this.currentLoco) === null || _a === void 0 ? void 0 : _a.address, isOn: false };
                        ws_1.wsClient.send({ type: dcc_1.ApiCommands.setLocoFunction, data: f });
                    }
                };
                btn.innerHTML = `F${i}`;
                this.fnButtons.appendChild(btn);
            }
        }
        init() {
            this.fetchLocomotives();
        }
        connectedCallback() {
        }
        fetchLocomotives() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`/locomotives`);
                    this.locomotives = yield response.json();
                    //this.render();
                    if (this.locomotives.length > 0) {
                        this.locomotives.forEach((l) => {
                            l.speed = 0;
                            var loco = { address: l.address, direction: 0, funcMap: 0, speed: 0 };
                            ws_1.wsClient.send({ type: dcc_1.ApiCommands.getLoco, data: loco });
                        });
                        this.currentLoco = this.locomotives[0];
                    }
                }
                catch (error) {
                    console.error("Error fetching locomotives:", error);
                }
            });
        }
        openLocoSelector() {
            const locoList = this.shadowRoot.getElementById("locoList");
            locoList.innerHTML = "";
            this.locomotives.forEach((loco) => {
                var _a;
                const locoItem = document.createElement("div");
                locoItem.classList.add("loco-item");
                locoItem.innerHTML = `
                <div style="width: 60%">
                    <img src="${loco.imageUrl}" alt="${loco.name}">
                </div>
                <div>#${loco.address} ${loco.name}</div>
            `;
                if (loco.id === ((_a = this.currentLoco) === null || _a === void 0 ? void 0 : _a.id)) {
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
        closeLocoSelector() {
            this.modal.style.display = "none";
        }
        render() {
            this.locomotives.forEach((l) => {
                // const loco = document.createElement('div')
                // loco.innerHTML = l.name
                // this.header.appendChild(loco)
            });
        }
        renderLocoFunctions() {
            var _a, _b, _c, _d;
            this.locoImage.src = this.currentLoco.imageUrl;
            this.locoName.innerText = `#${this.currentLoco.address} ${this.currentLoco.name}`;
            for (var i = 0; i <= 28; i++) {
                //this.buttons[i].style.backgroundColor = "#bbb"
                this.buttons[i].className = '';
                this.buttons[i].function = undefined;
                this.buttons[i].innerHTML = `F${i}`;
            }
            (_b = (_a = this.currentLoco) === null || _a === void 0 ? void 0 : _a.functions) === null || _b === void 0 ? void 0 : _b.forEach((f) => {
                //this.buttons[f.id].style.backgroundColor = "cornflowerblue"
                this.buttons[f.id].className = 'fnbutton';
                this.buttons[f.id].innerHTML = `F${f.id}<br>${f.name}`;
                this.buttons[f.id].function = f;
            });
            this.updateUI();
            return;
            this.fnButtons.innerHTML = "";
            (_d = (_c = this.currentLoco) === null || _c === void 0 ? void 0 : _c.functions) === null || _d === void 0 ? void 0 : _d.forEach((f) => {
                const btn = document.createElement('button');
                btn.style.backgroundColor = "cornflowerblue";
                btn.function = f;
                btn.onclick = (e) => {
                    var _a;
                    console.log((_a = btn.function) === null || _a === void 0 ? void 0 : _a.name);
                };
                btn.innerHTML = f.name;
                this.fnButtons.appendChild(btn);
            });
            //this.body.appendChild(locoElement)
        }
        get currentLoco() {
            return this._currentLoco;
        }
        set currentLoco(v) {
            this._currentLoco = v;
            this.renderLocoFunctions();
        }
        getSpeedPercentage(perc, maxSpeed = 127) {
            return Math.round((maxSpeed * (perc / 100.0)));
        }
        getClosestSpeedThreshold(speed, maxSpeed = 127) {
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
            return percentageThresholds.reduce((closest, current) => Math.abs(speedPercentage - current) < Math.abs(speedPercentage - closest) ? current : closest);
        }
        calculateRealSpeed(modelSpeed) {
            const scaleFactor = 87; // H0 méretarány
            const realSpeed = (modelSpeed * scaleFactor) * 3600 / 100000; // átváltás km/h-ra
            return Math.round(realSpeed * 10) / 10; // Egy tizedes jegyre kerekítés
        }
        calculateRealTrainSpeed(dccSpeed, realMaxSpeed = 120) {
            if (dccSpeed < 0 || dccSpeed > 127) {
                throw new Error("A DCC sebességnek 0 és 127 között kell lennie.");
            }
            const realSpeed = (dccSpeed / 127) * realMaxSpeed;
            return Math.round(realSpeed * 10) / 10; // Kerekítés 1 tizedes jegyre
        }
        updateUI() {
            if (this.currentLoco) {
                const speed = this.getClosestSpeedThreshold(this.currentLoco.speed);
                this.btnReverse.style.backgroundColor = this.currentLoco.direction == dcc_1.Z21Directions.reverse ? 'lime' : 'gray';
                this.btnStop.style.backgroundColor = this.currentLoco.speed == 0 ? 'orange' : 'gray';
                this.btnForward.style.backgroundColor = this.currentLoco.direction == dcc_1.Z21Directions.forward ? 'lime' : 'gray';
                this.btnSpeed5.style.backgroundColor = speed == 5 ? 'lime' : 'gray';
                this.btnSpeed10.style.backgroundColor = speed == 10 ? 'lime' : 'gray';
                this.btnSpeed20.style.backgroundColor = speed == 20 ? 'lime' : 'gray';
                this.btnSpeed40.style.backgroundColor = speed == 40 ? 'lime' : 'gray';
                this.btnSpeed80.style.backgroundColor = speed == 80 ? 'lime' : 'gray';
                this.btnSpeed100.style.backgroundColor = speed == 100 ? 'lime' : 'gray';
                this.locoInfoElement.innerHTML = this.currentLoco.speed.toString();
                for (var i = 0; i <= 28; i++) {
                    var on = ((this.currentLoco.functionMap >> i) & 1) == 1;
                    const fn = this.currentLoco.functions.find(f => f.id == i);
                    if (fn) {
                        fn.isOn = on;
                    }
                    if (on) {
                        this.buttons[i].classList.add('on');
                    }
                    else {
                        this.buttons[i].classList.remove('on');
                    }
                }
            }
            else {
                this.locoInfoElement.innerHTML = "Unknown Loco";
            }
        }
        processMessage(data) {
            if (data) {
                const loco = this.locomotives.find(l => l.address == data.address);
                if (loco) {
                    loco.speed = data.speed;
                    loco.direction = data.direction;
                    loco.functionMap = data.funcMap;
                    if (this.currentLoco && this.currentLoco.address == loco.address) {
                        this.updateUI();
                    }
                }
            }
            else {
                console.log("controlPanel.processMessage:  data undefined");
            }
        }
        get power() {
            return this._power;
        }
        set power(v) {
            if (v) {
                this.btnEmergency.classList.remove('on');
            }
            else {
                this.btnEmergency.classList.add('on');
            }
            this._power = v;
        }
    }
    exports.LocoControlPanel = LocoControlPanel;
    customElements.define('loco-control-panel', LocoControlPanel);
});
