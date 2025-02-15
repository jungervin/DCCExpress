import { ApiCommands,  iData, iLoco} from "../../common/src/dcc";
import { Globals } from "./helpers/globals";
import { wsClient } from "./helpers/ws";
import { LocoControlPanel } from "./components/controlPanel";


console.log(ApiCommands)
console.log(LocoControlPanel)

export class LocoApp {
    cp: LocoControlPanel ;
    constructor() {

        wsClient.onConnected = () => {

            this.cp.init()
            //wsClient.send({ type: ApiCommands.getCommandCenters, data: "" })
            //wsClient.send({ type: ApiCommands.configLoad, data: "" })

        }
        wsClient.onError = () => {
            //this.toolbar.wsStatus?.setAttribute("fill", "red")
        }

        wsClient.onMessage = (msg: iData) => {
            switch (msg.type) {

                // case ApiCommands.commandCenterInfos:
                //     Globals.devices = msg.data as iCommandCenter[]
                //     break;

                case ApiCommands.locoInfo:
                    this.cp.processMessage(msg.data as iLoco)
                    break;
                
                    
            }
        }


        
        this.cp = document.createElement('loco-control-panel') as LocoControlPanel
        document.body.appendChild(this.cp)
        
        wsClient.connect()
    }
}

const App = new LocoApp()
