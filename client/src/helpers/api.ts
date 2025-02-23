import { App } from "../app";
import { iSetLocoFunction, iLocomotive, Z21Directions, iData, ApiCommands, iLoco, iSetTurnout } from "../../../common/src/dcc";
import { wsClient } from "./ws";
import { TurnoutDoubleElement, TurnoutElement } from "../editor/turnout";
import { RouteSwitchElement } from "../editor/route";
import { FastClock } from "../editor/clock";

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
                const td = turnout as TurnoutDoubleElement   
                if(td.address === address) {
                var t: iSetTurnout = { address: address, isClosed: isClosed ? td.t1ClosedValue : td.t1OpenValue }
                wsClient.send({type: ApiCommands.setTurnout, data: t} as iData)
                }
                else if(td.address2 === address) {
                    var t: iSetTurnout = { address: address, isClosed: isClosed ? td.t2ClosedValue : td.t2OpenValue }
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

        //return Api.app.turnouts[address]
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

    static getRoute(name: string) : RouteSwitchElement | undefined {
        return Api.app.editor.views.getRouteSwitchElements().find(r => r.name === name)
    }

    static setRoute(name: string) {
        const route = Api.getRoute(name)
        if(route) {
            
            route.setRoute(0, Api.app.editor.views.getTurnoutElements())
        }
        
    }

    static getClock() : FastClock | undefined {
        return Api.app.editor.fastClock!
    }

    static getClockMinutes() : number {
        const clock = Api.getClock()
        if(clock) {
            return clock.currentTime.getMinutes()
        }
        return -1
    }
}