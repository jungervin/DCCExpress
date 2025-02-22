import { App } from "../app";
import { iSetLocoFunction, iLocomotive, Z21Directions, iData, ApiCommands, iLoco, iSetTurnout } from "../../../common/src/dcc";
import { wsClient } from "./ws";
import { TurnoutDoubleElement, TurnoutElement } from "../editor/turnout";

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

    static setTurnout(address: number, isClosed: boolean) {
        const turnout = Api.getTurnout(address) 
        if (turnout) {
            if(Object.getPrototypeOf(turnout) == TurnoutDoubleElement.prototype) {
                const to = turnout as TurnoutDoubleElement   
                if(to.address === address) {
                var t: iSetTurnout = { address: address, isClosed: isClosed ? to.t1ClosedValue : to.t1OpenValue }
                wsClient.send({type: ApiCommands.setTurnout, data: t} as iData)
                }
                else if(to.address2 === address) {
                    var t: iSetTurnout = { address: address, isClosed: isClosed ? to.t2ClosedValue : to.t2OpenValue }
                    wsClient.send({type: ApiCommands.setTurnout, data: t} as iData)
                }
            } else {
                const to = turnout as TurnoutElement
                var t: iSetTurnout = { address: address, isClosed: isClosed ? to.t1ClosedValue : to.t1OpenValue }
                wsClient.send({type: ApiCommands.setTurnout, data: t} as iData)
    
            }

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

        for(let t of Api.app.editor.views.getTurnoutElements()) {
         
            if(t.address === address) {
                return t
            }
            if(Object.getPrototypeOf(t) == TurnoutDoubleElement.prototype) {
                const to = t as TurnoutDoubleElement
                if(to.address === address || to.address2 === address) {
                    return t
                }
            }
        }
        return undefined
    }

    static getSensor(address: number): boolean {
        return Api.app.sensors[address]
    }
}