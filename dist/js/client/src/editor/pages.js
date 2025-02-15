define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Pages = exports.Page = void 0;
    class Page {
        constructor(name) {
            this.elements = [];
        }
    }
    exports.Page = Page;
    class Pages {
        constructor() {
            this.pages = [];
        }
        get currentPage() {
            return this._currentPage;
        }
        set currentPage(v) {
            this._currentPage = v;
        }
    }
    exports.Pages = Pages;
});
