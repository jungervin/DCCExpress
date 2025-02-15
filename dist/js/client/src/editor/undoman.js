"use strict";
// import { RailView } from "./view";
// export interface GridState {
//     elements: RailView[];
//     // grid: any[]; // A grid aktuális állapota, ha szükséges
// }
// export class UndoRedoManager<T> {
//     private undoStack: T[] = [];
//     private redoStack: T[] = [];
//     // Állapot hozzáadása az undo verembe
//     addState(state: T): void {
//         this.undoStack.push(state);
//         this.redoStack = []; // Új műveletkor a redo verem kiürül
//     }
//     // Undo művelet
//     undo(): T | null {
//         if (this.undoStack.length > 0) {
//             const state = this.undoStack.pop()!;
//             this.redoStack.push(state);
//             return this.undoStack[this.undoStack.length - 1] || null;
//         }
//         return null;
//     }
//     // Redo művelet
//     redo(): T | null {
//         if (this.redoStack.length > 0) {
//             const state = this.redoStack.pop()!;
//             this.undoStack.push(state);
//             return state;
//         }
//         return null;
//     }
// }
