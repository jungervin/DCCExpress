// import { Views } from "../editor/views";
// import { RailStates, RailView, View } from "../editor/view";

// export class PathFinder {
//     elems?: Views;
//     //items: View[] = []

//     constructor(elems: Views) {
//         this.elems = elems
//     }

//     start(obj: RailView) {
//         //this.items.push(obj)
//         obj.isVisited = true;
//         obj.isRoute = true

//         var p1 = obj.getNextItemXy()
//         var p2 = obj.getPrevItemXy()
//             // var p2 = obj.getPrevItemXy()

//         var next = this.elems!.getObjectXy(p1)
//         if (next instanceof RailView) {
//             if (!next.isVisited && (obj.pos.isEqual(next.getNextItemXy()) || obj.pos.isEqual(next.getPrevItemXy()))) {
//                 next.isRoute = true
//                 this.start(next)
//             }
//         }

//         var prev = this.elems!.getObjectXy(p2)
//         if (prev instanceof RailView) {
//             if (!prev.isVisited && (obj.pos.isEqual(prev.getNextItemXy()) || obj.pos.isEqual(prev.getPrevItemXy()))) {
//                 prev.isRoute = true
//                 this.start(prev)
//             }
//         }


//     }

// }

