define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DecoderDialog = exports.DecoderManager = void 0;
    class DecoderManager {
        constructor() {
            this.decoders = [];
        }
        addDecoder(address, status) {
            this.decoders.push({ address, status });
        }
        editDecoder(index, address, status) {
            if (this.decoders[index]) {
                this.decoders[index] = { address, status };
            }
        }
        deleteDecoder(index) {
            if (this.decoders[index]) {
                this.decoders.splice(index, 1);
            }
        }
        getDecoders() {
            return this.decoders;
        }
    }
    exports.DecoderManager = DecoderManager;
    class DecoderDialog {
        constructor(decoderManager) {
            this.decoderManager = decoderManager;
            this.dialogElement = document.createElement("div");
            this.dialogElement.style.position = "fixed";
            this.dialogElement.style.top = "50%";
            this.dialogElement.style.left = "50%";
            this.dialogElement.style.transform = "translate(-50%, -50%)";
            this.dialogElement.style.width = "400px";
            this.dialogElement.style.padding = "16px";
            this.dialogElement.style.backgroundColor = "white";
            this.dialogElement.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
            this.dialogElement.style.borderRadius = "8px";
            const table = document.createElement("table");
            table.style.width = "100%";
            table.style.borderCollapse = "collapse";
            const thead = table.createTHead();
            const headerRow = thead.insertRow();
            ["Address", "Status", "Actions"].forEach((header) => {
                const th = document.createElement("th");
                th.textContent = header;
                th.style.border = "1px solid #ccc";
                th.style.padding = "8px";
                th.style.textAlign = "left";
                headerRow.appendChild(th);
            });
            this.tableBody = table.createTBody();
            this.dialogElement.appendChild(table);
            const addButton = document.createElement("button");
            addButton.textContent = "Add Decoder";
            addButton.style.marginTop = "16px";
            addButton.onclick = () => this.addDecoder();
            this.dialogElement.appendChild(addButton);
            document.body.appendChild(this.dialogElement);
        }
        addDecoder() {
            const address = parseInt(prompt("Enter decoder address:", "0") || "0", 10);
            const status = prompt("Enter decoder status:", "") || "";
            this.decoderManager.addDecoder(address, status);
            this.refreshTable();
        }
        editDecoder(index) {
            const decoder = this.decoderManager.getDecoders()[index];
            const address = parseInt(prompt("Edit decoder address:", decoder.address.toString()) || "0", 10);
            const status = prompt("Edit decoder status:", decoder.status) || "";
            this.decoderManager.editDecoder(index, address, status);
            this.refreshTable();
        }
        deleteDecoder(index) {
            if (confirm("Are you sure you want to delete this decoder?")) {
                this.decoderManager.deleteDecoder(index);
                this.refreshTable();
            }
        }
        refreshTable() {
            this.tableBody.innerHTML = "";
            this.decoderManager.getDecoders().forEach((decoder, index) => {
                const row = this.tableBody.insertRow();
                const addressCell = row.insertCell();
                addressCell.textContent = decoder.address.toString();
                addressCell.style.border = "1px solid #ccc";
                addressCell.style.padding = "8px";
                const statusCell = row.insertCell();
                statusCell.textContent = decoder.status;
                statusCell.style.border = "1px solid #ccc";
                statusCell.style.padding = "8px";
                const actionsCell = row.insertCell();
                actionsCell.style.border = "1px solid #ccc";
                actionsCell.style.padding = "8px";
                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.onclick = () => this.editDecoder(index);
                actionsCell.appendChild(editButton);
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.style.marginLeft = "8px";
                deleteButton.onclick = () => this.deleteDecoder(index);
                actionsCell.appendChild(deleteButton);
            });
        }
        show() {
            this.refreshTable();
            this.dialogElement.style.display = "block";
        }
        hide() {
            this.dialogElement.style.display = "none";
        }
    }
    exports.DecoderDialog = DecoderDialog;
    const decoderManager = new DecoderManager();
    const decoderDialog = new DecoderDialog(decoderManager);
    document.addEventListener("DOMContentLoaded", () => {
        const openDialogButton = document.createElement("button");
        openDialogButton.textContent = "Manage Decoders";
        openDialogButton.onclick = () => decoderDialog.show();
        document.body.appendChild(openDialogButton);
    });
});
