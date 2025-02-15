export class List<T> { 
    private items: T[] = [];
    private selectedIndex: number | null = null;

    // Hozzáadás a listához
    add(item: T): void {
        this.items.push(item);
    }

    // Eltávolítás a listából (érték alapján)
    remove(item: T): boolean {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
            // Frissítsük a kijelölt elemet, ha szükséges
            if (this.selectedIndex === index) {
                this.selectedIndex = null;
            } else if (this.selectedIndex !== null && this.selectedIndex > index) {
                this.selectedIndex--;
            }
            return true;
        }
        return false;
    }

    // Index keresése
    indexOf(item: T): number {
        return this.items.indexOf(item);
    }

    // Kiválasztott elem beállítása
    set selectedElement(item: T | null) {
        if (item === null) {
            this.selectedIndex = null;
        } else {
            const index = this.indexOf(item);
            if (index !== -1) {
                this.selectedIndex = index;
            } else {
                throw new Error("Element not found in the list");
            }
        }
    }

    // Kiválasztott elem lekérése
    get selectedElement(): T | null {
        return this.selectedIndex !== null ? this.items[this.selectedIndex] : null;
    }

    // Az összes elem lekérése
    get allItems(): T[] {
        return [...this.items]; // Másolatot adunk vissza, hogy ne lehessen közvetlenül módosítani
    }

    // Lista törlése
    clear(): void {
        this.items = [];
        this.selectedIndex = null;
    }

    // Lista mérete
    get size(): number {
        return this.items.length;
    }
}
