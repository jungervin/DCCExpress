import { TurnoutElement } from "./turnout"
import { RailView, View } from "./view"
import { RouteSwitchElement } from "./route"
import { Point } from "../helpers/math"
import { Signal1Element } from "./signals"
import { AccessoryAddressElement, ButtonShapeElement } from "./button"
import { BlockElement } from "./block"
import { SensorShapeElement } from "./sensor"
import { SchedulerButtonShapeElement } from "./schedulerButton"


export class Views {
    elements: Array<View> = new Array<View>()
    // socket: Socket | undefined
    constructor() {

    }

    add(view: object) {
        //this.elements.unshift(view as RailView)
        this.elements.push(view as RailView)
    }

    unselectAll() {
        this.elements.forEach((elem) => {
            elem.isSelected = false
        });
    }

    moveRel(dx: number, dy: number) {

    }

    remove(elem: RailView) {

    }
    removeAll() {

    }


    private _currentElement: View | undefined;
    public get currentElement(): View {
        return this._currentElement!;
    }
    public set currentElement(v: View) {
        this._currentElement = v;
    }

    getElements(): View[] {
        // var items: View[] = []
        // this.elements.forEach((elem: View) => {
        //     if (elem instanceof TrackElement || elem instanceof TrackEndElement || elem instanceof TrackCurveElement || elem instanceof TrackCornerElement) {
        //         items.push(elem)
        //     }
        // })
        return this.elements
    }

    getElement(name: string) {
        return this.elements.find((e) => { return e.name === name})
    }

    getBlockElements(): BlockElement[] {
        var items: BlockElement[] = []
        this.elements.forEach((elem: View) => {
            if (elem instanceof BlockElement) {
                items.push(elem)
            }
        })
        return items
    }

    getSignal(addr: number) {
        return this.getSignalElements().find((s) => s.address == addr)
    }

    getAccessoryElements(): AccessoryAddressElement[] {
        var items: AccessoryAddressElement[] = []
        this.elements.forEach((elem: View) => {
            if (elem instanceof AccessoryAddressElement) {
                items.push(elem)
            }
        })
        return items
    }

    getSignalElements(): Signal1Element[] {
        var items: Signal1Element[] = []
        this.elements.forEach((elem: View) => {
            if (elem instanceof Signal1Element) {
                items.push(elem)
            }
        })
        return items
    }

    getTurnout(addr: number) {
        return this.getTurnoutElements().find((t) => t.address == addr)
    }

    getTurnoutElements(): TurnoutElement[] {
        var items: TurnoutElement[] = []
        this.elements.forEach((elem: View) => {
            if (elem instanceof TurnoutElement) {
                items.push(elem)
            }
        })
        return items
    }

    getButtonElements(): ButtonShapeElement[] {
        var items: ButtonShapeElement[] = []
        this.elements.forEach((elem: View) => {
            if (elem instanceof ButtonShapeElement) {
                items.push(elem)
            }
        })
        return items
    }

    getButton(addr: number) {
        return this.getButtonElements().find((t) => t.address == addr)
    }

    getSensorElements(): SensorShapeElement[] {
        var items: SensorShapeElement[] = []
        this.elements.forEach((elem: View) => {
            if (elem instanceof SensorShapeElement) {
                items.push(elem)
            }
        })
        return items
    }

    getSensor(addr: number) {
        return this.getSensorElements().find((t) => t.address == addr)
    }

    // getTurnout(address: number) : TurnoutElement | undefined{
    //     return this.getTurnoutElements().find((t) => {
    //         return t.hasAddress(address)
    //     })
    // }

    getRSensor(addr: number) {
        return this.getRailElements().find(s => s.rbusAddress == addr)
    }
    getRailElements(): RailView[] {
        var items: RailView[] = []
        this.elements.forEach((elem: View) => {
            if (elem instanceof RailView) {
                items.push(elem)
            }
        })
        return items
    }

    getRouteSwitchElements(): RouteSwitchElement[] {
        var items: RouteSwitchElement[] = []
        this.elements.forEach((elem: View) => {
            if (elem instanceof RouteSwitchElement) {
                items.push(elem)
            }
        })
        return items
    }

    getObjectXy(point: Point) {
        var elem = this.getRailElements().find((elem: View) => {
            return elem.x == point.x && elem.y == point.y
        })
        return elem
    }

    getSchedulerButtonElements(): SchedulerButtonShapeElement[] {
        var items: SchedulerButtonShapeElement[] = []
        this.elements.forEach((elem: View) => {
            if (elem instanceof SchedulerButtonShapeElement) {
                items.push(elem)
            }
        })
        return items
    }

    getSchedulerButtonByTaskName(taskName: string) {
        return this.getSchedulerButtonElements().find((elem: SchedulerButtonShapeElement) => {
            return elem.taskName == taskName
        })
    }

    startWalk(obj: RailView) {
        // Lehet meg kellene vizsgálni, hogy a következő elem az
        // a route váltóiban szerepel e?
        // vagy váltótól váltói kellene vizsgálódni??
        obj.isVisited = true;
        obj.isRoute = true

        var p1 = obj.getNextItemXy()
        var p2 = obj.getPrevItemXy()

        var next = this.getObjectXy(p1)
        if (next) {
            if (!next.isVisited && (obj.pos.isEqual(next.getNextItemXy()) || obj.pos.isEqual(next.getPrevItemXy()))) {
                next.isRoute = true
                this.startWalk(next)
            }
        }

        var prev = this.getObjectXy(p2)
        if (prev) {
            if (!prev.isVisited && (obj.pos.isEqual(prev.getNextItemXy()) || obj.pos.isEqual(prev.getPrevItemXy()))) {
                prev.isRoute = true
                this.startWalk(prev)
            }
        }
    }
}