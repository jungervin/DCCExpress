// export class List<T> { 
//     private items: T[] = [];
//     private selectedIndex: number | null = null;

//     add(item: T): void {
//         this.items.push(item);
//     }

//     remove(item: T): boolean {
//         const index = this.items.indexOf(item);
//         if (index !== -1) {
//             this.items.splice(index, 1);
//             if (this.selectedIndex === index) {
//                 this.selectedIndex = null;
//             } else if (this.selectedIndex !== null && this.selectedIndex > index) {
//                 this.selectedIndex--;
//             }
//             return true;
//         }
//         return false;
//     }

//     indexOf(item: T): number {
//         return this.items.indexOf(item);
//     }

//     set selectedElement(item: T | null) {
//         if (item === null) {
//             this.selectedIndex = null;
//         } else {
//             const index = this.indexOf(item);
//             if (index !== -1) {
//                 this.selectedIndex = index;
//             } else {
//                 throw new Error("Element not found in the list");
//             }
//         }
//     }

//     get selectedElement(): T | null {
//         return this.selectedIndex !== null ? this.items[this.selectedIndex] : null;
//     }


//     get allItems(): T[] {
//         return [...this.items]; 
//     }

//     clear(): void {
//         this.items = [];
//         this.selectedIndex = null;
//     }

//     get size(): number {
//         return this.items.length;
//     }
// }
