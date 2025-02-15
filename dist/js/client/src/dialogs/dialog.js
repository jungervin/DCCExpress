define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Dialog = exports.DialogResult = void 0;
    var DialogResult;
    (function (DialogResult) {
        DialogResult[DialogResult["cancel"] = 0] = "cancel";
        DialogResult[DialogResult["ok"] = 1] = "ok";
    })(DialogResult || (exports.DialogResult = DialogResult = {}));
    class Dialog extends HTMLElement {
        constructor() {
            super();
            this.x = 0;
            this.y = 0;
            this.w = 600;
            this.h = 600;
            this.dialogResult = DialogResult.cancel;
            this.dialogTitle = "NA";
            this.innerHTML = this.template;
        }
        get identity() {
            throw new Error('Az identity nincs megadva!');
        }
        get template() {
            throw new Error('A template nincs megadva!');
        }
        init(title, w, h) {
            this.id = this.identity;
            this.dialogTitle = title;
            this.w = w;
            this.h = h;
            this.style.zIndex = '10000';
            const bodyRect = document.body.getBoundingClientRect();
            this.x = (bodyRect.width - this.w) / 2;
            this.y = (bodyRect.height - this.h) / 2;
            this.style.position = 'absolute';
            this.style.left = `${this.x}px`;
            this.style.top = `${this.y}px`;
            this.style.width = `${this.w}px`;
            this.style.height = `${this.h}px`;
        }
        open(callback) {
            var _a;
            (_a = document.getElementById("dialog-overlay")) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
            document.body.appendChild(this);
            this.callback = callback;
            this.escapeListener = (e) => {
                if (e.key == 'Escape') {
                    this.close(DialogResult.cancel);
                }
                else if (e.key == 'Enter') {
                    this.close(DialogResult.ok);
                }
            };
            window.addEventListener('keydown', this.escapeListener);
        }
        close(result) {
            var _a;
            (_a = document.getElementById("dialog-overlay")) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
            const element = document.getElementById(this.id);
            if (element) {
                element.remove();
            }
            else {
                console.warn(`Elem nem található: ${this.id}`);
            }
            if (this.escapeListener) {
                window.removeEventListener('keydown', this.escapeListener);
                this.escapeListener = undefined;
            }
            if (this.callback) {
                this.callback(this, result);
            }
        }
    }
    exports.Dialog = Dialog;
    customElements.define('custom-dialog', Dialog);
});
