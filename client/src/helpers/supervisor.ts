import { View } from "../editor/view";
import { TurnoutElement, TurnoutLeftElement } from "../editor/turnout";
import { Api } from "./api";
import { Point } from "./math";
import { RailView } from "../editor/view";
import { BlockElement } from "../editor/block";

export class BlockStore {
    private blocks = new Map<string, BlockElement>();

    add(block: BlockElement): boolean {
        if (this.blocks.has(block.name)) {
            return false;
        }
        this.blocks.set(block.name, block);
        return true;
    }

    get(name: string): BlockElement | undefined {
        return this.blocks.get(name);
    }

    has(name: string): boolean {
        return this.blocks.has(name);
    }

    getAll(): BlockElement[] {
        return Array.from(this.blocks.values());
    }

    remove(name: string): boolean {
        return this.blocks.delete(name);
    }

    clear() {
        this.blocks.clear();
    }
}

class Segment {
    from: TurnoutElement | undefined
    to: TurnoutElement | undefined
}

export class Supervisor {
    segments: Segment[] = []


    clearVisits() {
        var items = Api.app.editor.views.getRailElements()
        items.forEach((e) => {
            e.isVisited = false;
            e.isRoute = false;
        })
    }

    getObjectXy(point: Point) {
        var elem = Api.app.editor.views.getRailElements().find((elem: View) => {
            return elem.x == point.x && elem.y == point.y
        })
        return elem
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

    findSensorElement(address: number): RailView | undefined {
        return Api.app.editor.views.getRailElements().find(elem => elem.rbusAddress == address) 
    }

    startWalk(obj: RailView, items: RailView[]) {
        obj.isVisited = true;
        items.push(obj)

        var p1 = obj.getNextItemXy()
        var p2 = obj.getPrevItemXy()

        var next = this.getObjectXy(p1)

        if (next) {
            if (!next.isVisited && (obj.pos.isEqual(next.getNextItemXy()) || obj.pos.isEqual(next.getPrevItemXy()))) {
                this.startWalk(next, items)
            }
        }

        var prev = this.getObjectXy(p2)
        if (prev) {
            if (!prev.isVisited && (obj.pos.isEqual(prev.getNextItemXy()) || obj.pos.isEqual(prev.getPrevItemXy()))) {
                this.startWalk(prev, items)
            }
        }
    }

    findRailView(x: number, y: number) {
        for (const e of Api.app.editor.views.elements) {
            if (e instanceof RailView && e.x == x && e.y == y) {
                return e
            }
        }
    }

    findRoute(x: number, y: number) {
        this.clearVisits()
        const t = this.findRailView(x, y)
        var next_items: RailView[] = []
        var prev_items: RailView[] = []
        if (t) {
            t.isVisited = true

            var p1 = t.getNextItemXy()
            var p2 = t.getPrevItemXy()
            var next = this.getObjectXy(p1)
            var prev = this.getObjectXy(p2)

            this.startWalk(next as RailView, next_items)
            this.startWalk(prev as RailView, prev_items)

            this.clearVisits()
            t.isRoute = true
            next_items.forEach((e) => {
                e.isRoute = true;
            })
            prev_items.forEach((e) => {
                e.isRoute = true;
            })

            const blocks = Api.app.editor.views.getBlockElements()

            for (const be of blocks) {
                const forward = next_items.find((re) => {
                    return be.x == re.x && be.y == re.y
                })
                if(forward) {
                    be.locoAddress = 10
                }

                const reverse = prev_items.find((re) => {
                    return be.x == re.x && be.y == re.y
                })
                if(reverse) {
                    be.locoAddress = 10
                }
            }
        }
    }
}

export const supervisor = new Supervisor()