import { App } from "../app";
import { iSetLocoFunction, iLocomotive, Z21Directions, iData, ApiCommands, iLoco, iSetTurnout, iSetBlock, iSetOutput, iSetBasicAccessory } from "../../../common/src/dcc";
import { wsClient } from "./ws";
import { TurnoutDoubleElement, TurnoutElement } from "../editor/turnout";
import { RouteSwitchElement } from "../editor/route";
import { FastClock } from "../editor/clock";
import { Tasks } from "./task";
import { audioManager } from "../editor/audioButton";
import { PulseDetector } from "../../../common/src/logicCircuits"
import { toastManager } from "../controls/toastManager";
import { SensorShapeElement } from "../editor/sensor";
import { SchedulerButtonShapeElement } from "../editor/schedulerButton";
import { Signal1Element } from "../editor/signals";
import { View } from "../editor/view";
import { BlockElement } from "../editor/block";

export class Api {

    static app: App
    static edges: { [key: number]: boolean } = {}

    static init(app: App) {
        Api.app = app
    }

    static playSound(filename: string) {
        audioManager.play(filename)
    }

    static setBlockLocoAddress(blockName: string, locoAddress: number): void {
        Api.app.editor.views.getBlockElements().forEach((b) => {
            if(b.locoAddress == locoAddress) {
                b.setLoco(0)
            }
            // else if(b.name == blockName){
            //     b.setLoco(locoAddress)
            // }
        }) 
        const block = Api.app.editor.views.getBlockElements().find((b) => {
            return b.name == blockName
        })
        if(block) {
            block.setLoco(locoAddress)
        }

        const b: iSetBlock = { blockName: blockName, locoAddress: locoAddress }
        wsClient.send({ type: ApiCommands.setBlock, data: b } as iData)
    }
    static fetchBlocks() {
        wsClient.send({ type: ApiCommands.fetchBlocks, data: "" } as iData)
    }

    static getBlockElement(blockName: string) : BlockElement | undefined
    {
        return Api.app.editor.views.getBlockElements().find((b) => {
            return b.name == blockName
        })
    }
    static getLocoAddressFromBlock(blockName: string): number {
        const b = Api.app.editor.views.getBlockElements().find((b) => {
            return b.name == blockName
        })
        if(b) {
            return b.locoAddress
        }
        // Legyen foglat!
        return Number.NaN
    }
    static getBlockIsFree(blockName: string) {
        const a = Api.getLocoAddressFromBlock(blockName)
        return a == 0
    }
    static getBlockIsNotFree(blockName: string) {
        const a = Api.getLocoAddressFromBlock(blockName)
        return a > 0
    }

    static getSensorElement(address: number): SensorShapeElement | undefined {
        const s = Api.app.editor.views.getSensor(address)
        if (s) {
            return s
        }
        return undefined
    }

    static getSensorValue(address: number): boolean {
        return Api.app.sensors[address]
    }

    static sensorIsOn(address: number) {
        return Api.app.sensors[address] === true
    }

    static sensorIsOff(address: number) {
        return Api.app.sensors[address] === true
    }

    static getSensorDuration(address: number, state: boolean) {
        PulseDetector.getSensor(address, state)
    }

    static detectRisingEdge(address: number): boolean {
        const currentState = Api.getSensorValue(address);
        if (!(address in Api.edges)) {
            Api.edges[address] = currentState;
            return false;
        }

        const rising = !Api.edges[address] && currentState;
        Api.edges[address] = currentState;
        return rising;
    }

    static detectFallingEdge(address: number): boolean {
        const currentState = Api.getSensorValue(address);
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

    static setTurnoutElement(address: number, isClosed: boolean) {
        const turnout = Api.getTurnoutElement(address)
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

    static getTurnoutElement(address: number): TurnoutElement | undefined {
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

    static getTurnoutState(address: number): boolean {
        for (let t of Api.app.editor.views.getTurnoutElements()) {
            if (t.address === address) {
                return t.t1Closed
            }
            if (Object.getPrototypeOf(t) == TurnoutDoubleElement.prototype) {
                const to = t as TurnoutDoubleElement
                if (to.address === address || to.address2 === address) {
                    return to.t2Closed
                }
            }
        }
        return false
    }

    static getTaskButtonElement(taskName: string): SchedulerButtonShapeElement | undefined {
        return Api.app.editor.views.getSchedulerButtonByTaskName(taskName)
    }

    static getSignalElement(address: number) : Signal1Element | undefined {
        return Api.app.editor.views.getSignalElement(address)
    }

    static getRouteSwitchElement(name: string): RouteSwitchElement | undefined {
        return Api.app.editor.views.getRouteSwitchElements().find(r => r.name === name)
    }

    static setRoute(name: string) : void {
        const route = Api.getRouteSwitchElement(name)
        if (route) {
            route.setRoute(0, Api.app.editor.views.getTurnoutElements())
        }
    }

    static getClockElement(): FastClock | undefined {
        return Api.app.editor.fastClock!
    }

    static getClockMinutes(): number {
        const clock = Api.getClockElement()
        if (clock) {
            return clock.currentTime.getMinutes()
        }
        return -1
    }

    static getElement(name: string) : View | undefined {
        return Api.app.editor.views.getElement(name)
    }

    static setOutputState(address: number, on: boolean): void {
        const aa = Api.app.editor.views.getAccessoryElements().find((a) => {
            return a.address == address
        })

        if (aa) {
            const data: iSetOutput = { address: address, value: on } as iSetBasicAccessory
            wsClient.send({ type: ApiCommands.setOutput, data: data } as iData)
        } else {

            const data: iSetOutput = { address: address, value: on } as iSetBasicAccessory
            wsClient.send({ type: ApiCommands.setOutput, data: data } as iData)
        }
    }

    static getOutputState(address: number) : boolean {
        return Api.app.outputs[address]
    }

    static setAccessoryState(address: number, on: boolean) {
        const aa = Api.app.editor.views.getAccessoryElements().find((a) => {
            return a.address == address
        })

        if (aa) {
            const data: iSetBasicAccessory = { address: address, value: on } as iSetBasicAccessory
            wsClient.send({ type: ApiCommands.setBasicAccessory, data: data } as iData)
        } else {
            const data: iSetBasicAccessory = { address: address, value: on } as iSetBasicAccessory
            wsClient.send({ type: ApiCommands.setBasicAccessory, data: data } as iData)
        }
    }

    static getAccessoryState(address: number) {
        return Api.app.decoders[address]
    }

    static setSignalGreen(address: number): void {
        const sig = Api.getSignalElement(address)
        if (sig) {
            sig.sendGreenIfNotGreen()
        } else {
            toastManager.showToast(`Could not find Signal By Address: ${address}`, 'error')
        }
    }

    static getSignalIsGreen(address: number): boolean {
        const sig = Api.getSignalElement(address)
        if (sig) {
            return sig.isGreen
        }
        toastManager.showToast(`Could not find Signal By Address: ${address}`, 'error')
        return false
    }

    static setSignalRed(address: number): void {
        const sig = Api.getSignalElement(address)
        if (sig) {
            sig.sendRedIfNotRed()
        } else {
            toastManager.showToast(`Could not find Signal By Address: ${address}`, 'error')
        }
    }

    static getSignalIsRed(address: number): boolean {
        const sig = Api.getSignalElement(address)
        if (sig) {
            return sig.isRed
        }
        toastManager.showToast(`Could not find Signal By Address: ${address}`, 'error')
        return false
    }

    static setSignalYellow(address: number): void {
        const sig = Api.getSignalElement(address)
        if (sig) {
            sig.sendYellowIfNotYellow()
        } else {
            toastManager.showToast(`Could not find Signal By Address: ${address}`, 'error')
        }
    }

    static getSignalIsYellow(address: number): boolean {
        const sig = Api.getSignalElement(address)
        if (sig) {
            return sig.isYellow
        }
        toastManager.showToast(`Could not find Signal By Address: ${address}`, 'error')
        return false
    }

    static setSignalWhite(address: number) : void {
        const sig = Api.getSignalElement(address)
        if (sig) {
            sig.sendWhiteIfNotWhite()
        } else {
            toastManager.showToast(`Could not find Signal By Address: ${address}`, 'error')
        }
    }

    static getSignalIsWhite(address: number): boolean {
        const sig = Api.getSignalElement(address)
        if (sig) {
            return sig.isWhite
        }
        toastManager.showToast(`Could not find Signal By Address: ${address}`, 'error')
        return false
    }


    static get tasks(): Tasks {
        return Api.app.tasks
    }

    static async loadLocomotives(): Promise<iLocomotive[] | undefined> {
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