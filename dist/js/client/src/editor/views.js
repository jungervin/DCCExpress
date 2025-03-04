define(["require", "exports", "./turnout", "./view", "./route", "./signals", "./button", "./block", "./sensor"], function (require, exports, turnout_1, view_1, route_1, signals_1, button_1, block_1, sensor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Views = void 0;
    class Views {
        // socket: Socket | undefined
        constructor() {
            this.elements = new Array();
        }
        add(view) {
            //this.elements.unshift(view as RailView)
            this.elements.push(view);
        }
        unselectAll() {
            this.elements.forEach((elem) => {
                elem.isSelected = false;
            });
        }
        moveRel(dx, dy) {
        }
        remove(elem) {
        }
        removeAll() {
        }
        get currentElement() {
            return this._currentElement;
        }
        set currentElement(v) {
            this._currentElement = v;
        }
        getElements() {
            // var items: View[] = []
            // this.elements.forEach((elem: View) => {
            //     if (elem instanceof TrackElement || elem instanceof TrackEndElement || elem instanceof TrackCurveElement || elem instanceof TrackCornerElement) {
            //         items.push(elem)
            //     }
            // })
            return this.elements;
        }
        getElement(name) {
            return this.elements.find((e) => { return e.name === name; });
        }
        getBlockElements() {
            var items = [];
            this.elements.forEach((elem) => {
                if (elem instanceof block_1.BlockElement) {
                    items.push(elem);
                }
            });
            return items;
        }
        getSignal(addr) {
            return this.getSignalElements().find((s) => s.address == addr);
        }
        getAccessoryElements() {
            var items = [];
            this.elements.forEach((elem) => {
                if (elem instanceof button_1.AccessoryAddressElement) {
                    items.push(elem);
                }
            });
            return items;
        }
        getSignalElements() {
            var items = [];
            this.elements.forEach((elem) => {
                if (elem instanceof signals_1.Signal1Element) {
                    items.push(elem);
                }
            });
            return items;
        }
        getTurnout(addr) {
            return this.getTurnoutElements().find((t) => t.address == addr);
        }
        getTurnoutElements() {
            var items = [];
            this.elements.forEach((elem) => {
                if (elem instanceof turnout_1.TurnoutElement) {
                    items.push(elem);
                }
            });
            return items;
        }
        getButtonElements() {
            var items = [];
            this.elements.forEach((elem) => {
                if (elem instanceof button_1.ButtonShapeElement) {
                    items.push(elem);
                }
            });
            return items;
        }
        getButton(addr) {
            return this.getButtonElements().find((t) => t.address == addr);
        }
        getSensorElements() {
            var items = [];
            this.elements.forEach((elem) => {
                if (elem instanceof sensor_1.SensorShapeElement) {
                    items.push(elem);
                }
            });
            return items;
        }
        getSensor(addr) {
            return this.getSensorElements().find((t) => t.address == addr);
        }
        // getTurnout(address: number) : TurnoutElement | undefined{
        //     return this.getTurnoutElements().find((t) => {
        //         return t.hasAddress(address)
        //     })
        // }
        getRSensor(addr) {
            return this.getRailElements().find(s => s.rbusAddress == addr);
        }
        getRailElements() {
            var items = [];
            this.elements.forEach((elem) => {
                if (elem instanceof view_1.RailView) {
                    items.push(elem);
                }
            });
            return items;
        }
        getRouteSwitchElements() {
            var items = [];
            this.elements.forEach((elem) => {
                if (elem instanceof route_1.RouteSwitchElement) {
                    items.push(elem);
                }
            });
            return items;
        }
        getObjectXy(point) {
            var elem = this.getRailElements().find((elem) => {
                return elem.x == point.x && elem.y == point.y;
            });
            return elem;
        }
        startWalk(obj) {
            // Lehet meg kellene vizsgálni, hogy a következő elem az
            // a route váltóiban szerepel e?
            // vagy váltótól váltói kellene vizsgálódni??
            obj.isVisited = true;
            obj.isRoute = true;
            var p1 = obj.getNextItemXy();
            var p2 = obj.getPrevItemXy();
            var next = this.getObjectXy(p1);
            if (next) {
                if (!next.isVisited && (obj.pos.isEqual(next.getNextItemXy()) || obj.pos.isEqual(next.getPrevItemXy()))) {
                    next.isRoute = true;
                    this.startWalk(next);
                }
            }
            var prev = this.getObjectXy(p2);
            if (prev) {
                if (!prev.isVisited && (obj.pos.isEqual(prev.getNextItemXy()) || obj.pos.isEqual(prev.getPrevItemXy()))) {
                    prev.isRoute = true;
                    this.startWalk(prev);
                }
            }
        }
    }
    exports.Views = Views;
});
