import { App } from "../app";
import { iSetLocoFunction, iLocomotive, Z21Directions, iData, ApiCommands, iLoco } from "../../../common/src/dcc";
import { wsClient } from "./ws";

export class Api {
    static app : App




    static getLoco(address: number): iLocomotive | undefined {
        return Api.app.locoControlPanel.locomotives.find(l => l.address === address)
    }

    static setLoco(address: number, speed: number, direction: Z21Directions) {
        const loco = Api.getLoco(address)
        if (loco) {
            loco.speed = speed
            loco.direction = direction
            var l: iLoco = { address: address, direction: direction, speed: speed, funcMap: 0 }
            wsClient.send({ type: ApiCommands.setLoco, data: l } as iData)
        }
    }
    static setLocoSpeed(address: number, speed: number) {
        const loco = Api.getLoco(address)
        if (loco) {
            loco.speed = speed
            Api.setLoco(address, speed, loco.direction)
        }
    }
    static setLocoDirection(address: number, direction: Z21Directions) {
        const loco = Api.getLoco(address)
        if (loco) {
            loco.direction = direction
            Api.setLoco(address, loco.speed, direction)
        }
    }

    static setLocoFunction(address: number, id: number, isOn: boolean) {
        const loco = Api.getLoco(address)
        if (loco) {
            const data: iSetLocoFunction = {address: address, id: id, isOn: isOn}
            wsClient.send({type: ApiCommands.setLocoFunction, data: data} as iData)
        }
    }

    static getTurnout(address: number)  {
        return Api.app.editor.views.getTurnoutElements().find(t => t.address === address)
    }

    static getSensor(address: number): boolean {
        return Api.app.sensors[address]
    }
}