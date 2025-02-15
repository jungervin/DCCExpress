export class Page {
    elements: any[] = []
    constructor(name: string) {

    }
}

export class Pages {
    pages: Page[] = []
    constructor() {

    }

    
    private _currentPage : Page | undefined;
    public get currentPage() : Page | undefined {
        return this._currentPage;
    }
    public set currentPage(v : Page | undefined) {
        this._currentPage = v;
    }
    
}