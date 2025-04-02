define(["require", "exports", "./api", "../editor/view"], function (require, exports, api_1, view_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.supervisor = exports.Supervisor = exports.BlockStore = void 0;
    class BlockStore {
        constructor() {
            this.blocks = new Map();
        }
        add(block) {
            if (this.blocks.has(block.name)) {
                return false;
            }
            this.blocks.set(block.name, block);
            return true;
        }
        get(name) {
            return this.blocks.get(name);
        }
        has(name) {
            return this.blocks.has(name);
        }
        getAll() {
            return Array.from(this.blocks.values());
        }
        remove(name) {
            return this.blocks.delete(name);
        }
        clear() {
            this.blocks.clear();
        }
    }
    exports.BlockStore = BlockStore;
    class Segment {
    }
    class Supervisor {
        constructor() {
            this.segments = [];
        }
        clearVisits() {
            var items = api_1.Api.app.editor.views.getRailElements();
            items.forEach((e) => {
                e.isVisited = false;
                e.isRoute = false;
            });
        }
        getObjectXy(point) {
            var elem = api_1.Api.app.editor.views.getRailElements().find((elem) => {
                return elem.x == point.x && elem.y == point.y;
            });
            return elem;
        }
        // Csak az egyik elemet adhatja vissza, mert a másik már visitednek lkell lennie!
        // getNextElement(elem: RailView): RailView | undefined {
        //     if (elem instanceof TurnoutElement) {
        //         return elem
        //     }
        //     elem.isVisited = true
        //     elem.isRoute = true;
        //     const p1 = elem.getNextItemXy()
        //     const p2 = elem.getPrevItemXy()
        //     const next = this.getObjectXy(p1)
        //     const prev = this.getObjectXy(p2)
        //     if (next) {
        //         if (!next.isVisited && (elem.pos.isEqual(next.getNextItemXy()) || elem.pos.isEqual(next.getPrevItemXy()))) {
        //             next.isVisited = true;
        //             if (next instanceof TurnoutElement) {
        //                 return next
        //             } else {
        //                 next.isRoute = true;
        //                 return this.getNextElement(next)
        //             }
        //         } else {
        //         }
        //     }
        //     if (prev) {
        //         if (!prev.isVisited && (elem.pos.isEqual(prev.getNextItemXy()) || elem.pos.isEqual(prev.getPrevItemXy()))) {
        //             prev.isVisited = true;
        //             if (prev instanceof TurnoutElement) {
        //                 return prev
        //             } else {
        //                 prev.isRoute = true;
        //                 return this.getNextElement(prev)
        //             }
        //         } else {
        //             //return this.getNextElement(prev)
        //         }
        //     }
        //     return elem
        // }
        findSensorElement(address) {
            return api_1.Api.app.editor.views.getRailElements().find(elem => elem.rbusAddress == address);
        }
        startWalk(obj, items) {
            obj.isVisited = true;
            items.push(obj);
            var p1 = obj.getNextItemXy();
            var p2 = obj.getPrevItemXy();
            var next = this.getObjectXy(p1);
            if (next) {
                if (!next.isVisited && (obj.pos.isEqual(next.getNextItemXy()) || obj.pos.isEqual(next.getPrevItemXy()))) {
                    this.startWalk(next, items);
                }
            }
            var prev = this.getObjectXy(p2);
            if (prev) {
                if (!prev.isVisited && (obj.pos.isEqual(prev.getNextItemXy()) || obj.pos.isEqual(prev.getPrevItemXy()))) {
                    this.startWalk(prev, items);
                }
            }
        }
        findRailView(x, y) {
            for (const e of api_1.Api.app.editor.views.elements) {
                if (e instanceof view_1.RailView && e.x == x && e.y == y) {
                    return e;
                }
            }
        }
        findRoute(x, y) {
            this.clearVisits();
            const t = this.findRailView(x, y);
            var next_items = [];
            var prev_items = [];
            if (t) {
                t.isVisited = true;
                var p1 = t.getNextItemXy();
                var p2 = t.getPrevItemXy();
                var next = this.getObjectXy(p1);
                var prev = this.getObjectXy(p2);
                this.startWalk(next, next_items);
                this.startWalk(prev, prev_items);
                this.clearVisits();
                t.isRoute = true;
                next_items.forEach((e) => {
                    e.isRoute = true;
                });
                prev_items.forEach((e) => {
                    e.isRoute = true;
                });
                const blocks = api_1.Api.app.editor.views.getBlockElements();
                for (const be of blocks) {
                    const forward = next_items.find((re) => {
                        return be.x == re.x && be.y == re.y;
                    });
                    if (forward) {
                        be.locoAddress = 10;
                    }
                    const reverse = prev_items.find((re) => {
                        return be.x == re.x && be.y == re.y;
                    });
                    if (reverse) {
                        be.locoAddress = 10;
                    }
                }
            }
        }
    }
    exports.Supervisor = Supervisor;
    exports.supervisor = new Supervisor();
});
