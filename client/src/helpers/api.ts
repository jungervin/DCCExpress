import { App } from "../app";
import { iSetLocoFunction, iLocomotive, Z21Directions, iData, ApiCommands, iLoco, iSetTurnout, iSetBlock } from "../../../common/src/dcc";
import { wsClient } from "./ws";
import { TurnoutDoubleElement, TurnoutElement } from "../editor/turnout";
import { RouteSwitchElement } from "../editor/route";
import { FastClock } from "../editor/clock";
import { Tasks } from "./task";
import { audioManager } from "../editor/audioButton";

export class Api {
    static app: App
    static edges:{ [key: number]: boolean } = {}

    static init(app: App) {
        Api.app = app
    }

    static playSound(filename: string) {
        audioManager.play(filename)
    }

    static setBlock(blockName: string, locoAddress: number) {
        const b: iSetBlock = {blockName: blockName, locoAddress: locoAddress}
        wsClient.send({type: ApiCommands.setBlock, data: b} as iData)
    }
    static getSensor(address: number): boolean {
        return Api.app.sensors[address]
    }

    static detectRisingEdge(address: number): boolean {
        const currentState = Api.getSensor(address); 
        if (!(address in Api.edges)) {
            Api.edges[address] = currentState;
            return false;
        }
    
        const rising = !Api.edges[address] && currentState;
        Api.edges[address] = currentState;
        return rising;
    }
    
    static detectFallingEdge(address: number): boolean {
        const currentState = Api.getSensor(address); 
        if (!(address in Api.edges)) {
            Api.edges[address] = currentState;
            return false;
        }
        const falling = Api.edges[address] && !currentState;
        Api.edges[address] = currentState;
        return falling;
    }  
    
    static emergencyStop() {
        wsClient.send({ type: ApiCommands.emergencyStop, data: "" } as iData)
    }

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
            const data: iSetLocoFunction = { address: address, id: id, isOn: isOn }
            wsClient.send({ type: ApiCommands.setLocoFunction, data: data } as iData)
        }
    }

    static setTurnout(address: number, isClosed: boolean) {
        const turnout = Api.getTurnout(address)
        if (turnout) {
            if (Object.getPrototypeOf(turnout) == TurnoutDoubleElement.prototype) {
                const td = turnout as TurnoutDoubleElement
                if (td.address === address) {
                    var t: iSetTurnout = { address: address, isClosed: isClosed ? td.t1ClosedValue : td.t1OpenValue, outputMode: td.outputMode }
                    wsClient.send({ type: ApiCommands.setTurnout, data: t } as iData)
                }
                else if (td.address2 === address) {
                    var t: iSetTurnout = { address: address, isClosed: isClosed ? td.t2ClosedValue : td.t2OpenValue, outputMode: td.outputMode }
                    wsClient.send({ type: ApiCommands.setTurnout, data: t } as iData)
                }
            } else {
                const to = turnout as TurnoutElement
                var t: iSetTurnout = { address: address, isClosed: isClosed ? to.t1ClosedValue : to.t1OpenValue, outputMode: to.outputMode }
                wsClient.send({ type: ApiCommands.setTurnout, data: t } as iData)
            }
        }
    }

    static getTurnout(address: number) {
        for (let t of Api.app.editor.views.getTurnoutElements()) {
            if (t.address === address) {
                return t
            }
            if (Object.getPrototypeOf(t) == TurnoutDoubleElement.prototype) {
                const to = t as TurnoutDoubleElement
                if (to.address === address || to.address2 === address) {
                    return t
                }
            }
        }
        return undefined
    }

    static getSignal(address: number) {
        return Api.app.editor.views.getSignal(address)
    }


    static getRoute(name: string): RouteSwitchElement | undefined {
        return Api.app.editor.views.getRouteSwitchElements().find(r => r.name === name)
    }

    static setRoute(name: string) {
        const route = Api.getRoute(name)
        if (route) {
            route.setRoute(0, Api.app.editor.views.getTurnoutElements())
        }
    }

    static getClock(): FastClock | undefined {
        return Api.app.editor.fastClock!
    }

    static getClockMinutes(): number {
        const clock = Api.getClock()
        if (clock) {
            return clock.currentTime.getMinutes()
        }
        return -1
    }

    static getElement(name: string) {
        return Api.app.editor.views.getElement(name)
    }

    
    static get tasks(): Tasks {
        return Api.app.tasks
    }

    static async loadLocomotives(): Promise<iLocomotive[] | undefined>{
        try {
            const response = await fetch(`/locomotives`);
            return await response.json();
            //this.render();
            // if (locomotives.length > 0) {
            //     locomotives.forEach((l: iLocomotive) => {
            //         l.speed = 0
            //         var loco: iLoco = { address: l.address, direction: 0, funcMap: 0, speed: 0 }
            //         wsClient.send({ type: ApiCommands.getLoco, data: loco } as iData)
            //     })
            //     return locomotives
            // }
        } catch (error) {
            console.error("Error fetching locomotives:", error);
        }
    }
}