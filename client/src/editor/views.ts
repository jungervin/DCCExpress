import { Socket } from "socket.io-client"
import { TurnoutElement, TurnoutLeftElement, TurnoutRightElement } from "./turnout"
import { RailStates, RailView, View } from "./view"
import { RouteSwitchElement } from "./route"
import { TrackElement } from "./track"
import { TrackEndElement } from "./trackend"
import { TrackCornerElement } from "./corner"
import { TrackCurveElement } from "./curve"
import { Point } from "../helpers/math"
// import { SignalElement } from "../components/signalElement"
import { Signal1Element, Signal2Element } from "./signals"


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


    getSignal(addr: number) {
        return this.getSignalElements().find((s) => s.address == addr)
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

    // getTurnout(address: number) : TurnoutElement | undefined{
    //     return this.getTurnoutElements().find((t) => {
    //         return t.hasAddress(address)
    //     })
    // }

    getSensor(addr: number) {
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