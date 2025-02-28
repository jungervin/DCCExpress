// function getUUID() {
//     return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
//         (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
//     );
// }
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LocomotiveManager {
        constructor(containerId) {
            this.locomotives = [];
            const container = document.getElementById(containerId);
            if (!container)
                throw new Error("Container not found");
            this.tableContainer = container;
            const dialogContainer = document.createElement("div");
            dialogContainer.id = "dialog-container";
            document.body.appendChild(dialogContainer);
            this.dialogContainer = dialogContainer;
            //this.serverUrl = serverUrl;
            this.fetchLocomotives();
        }
        fetchLocomotives() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`/locomotives`);
                    this.locomotives = yield response.json();
                    this.render();
                }
                catch (error) {
                    console.error("Error fetching locomotives:", error);
                }
            });
        }
        saveLocomotive(locomotive) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const method = locomotive.id ? "PUT" : "POST";
                    const endpoint = locomotive.id ? `/locomotives/${locomotive.id}` : "/locomotives";
                    const response = yield fetch(`${endpoint}`, {
                        method,
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(locomotive),
                    });
                    if (!response.ok)
                        throw new Error("Failed to save locomotive");
                    yield this.fetchLocomotives();
                }
                catch (error) {
                    console.error("Error saving locomotive:", error);
                }
            });
        }
        deleteLocomotive(id) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`/locomotives/${id}`, {
                        method: "DELETE",
                    });
                    if (!response.ok)
                        throw new Error("Failed to delete locomotive");
                    yield this.fetchLocomotives();
                }
                catch (error) {
                    console.error("Error deleting locomotive:", error);
                }
            });
        }
        render() {
            this.tableContainer.innerHTML = `
            <button class="btn btn-primary mb-3" id="add-locomotive">Add Locomotive</button>
            <table class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Speed Mode</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.locomotives
                .map((locomotive) => `
                        <tr data-id="${locomotive.id}">
                            <td><img src="${locomotive.imageUrl}" alt="${locomotive.name}" style=" height: 80px;"></td>
                            <td>${locomotive.name}</td>
                            <td>${locomotive.address}</td>
                            <td>${locomotive.speedMode}</td>
                            <td>
                                <button class="btn btn-primary btn-sm duplicate">Duplicate</button>
                                <button class="btn btn-warning btn-sm edit-locomotive">Edit</button>
                                 <button class="btn btn-info btn-sm edit-functions">Edit Functions</button>
                                <button class="btn btn-danger btn-sm delete-locomotive">Delete</button>
                            </td>
                        </tr>
                    `)
                .join("")}
                </tbody>
            </table>
        `;
            this.attachEventListeners();
        }
        attachEventListeners() {
            var _a;
            (_a = this.tableContainer.querySelector("#add-locomotive")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
                this.openDialog();
            });
            this.tableContainer.querySelectorAll(".duplicate").forEach((button) => button.addEventListener("click", (event) => {
                const row = event.target.closest("tr");
                if (row) {
                    const id = row.getAttribute("data-id");
                    const locomotive = this.locomotives.find((loco) => loco.id === id);
                    if (locomotive) {
                        const clone = JSON.parse(JSON.stringify(locomotive));
                        clone.id = undefined;
                        clone.address = 3;
                        clone.name = "KLÓN";
                        this.locomotives.push(clone);
                        this.openDialog(clone);
                    }
                }
            }));
            this.tableContainer.querySelectorAll(".edit-locomotive").forEach((button) => button.addEventListener("click", (event) => {
                const row = event.target.closest("tr");
                if (row) {
                    const id = row.getAttribute("data-id");
                    const locomotive = this.locomotives.find((loco) => loco.id === id);
                    if (locomotive) {
                        this.openDialog(locomotive);
                    }
                }
            }));
            this.tableContainer.querySelectorAll(".delete-locomotive").forEach((button) => button.addEventListener("click", (event) => {
                const row = event.target.closest("tr");
                if (row) {
                    const id = row.getAttribute("data-id");
                    if (id)
                        this.deleteLocomotive(id);
                }
            }));
            this.tableContainer.querySelectorAll(".edit-functions").forEach((button) => {
                button.addEventListener("click", (event) => {
                    const row = event.target.closest("tr");
                    if (row) {
                        const id = row.getAttribute("data-id");
                        const locomotive = this.locomotives.find((loco) => loco.id === id);
                        if (locomotive) {
                            this.openFunctionEditor(locomotive);
                        }
                    }
                });
            });
        }
        openDialog(existing) {
            this.dialogContainer.innerHTML = `
            <div class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${existing ? "Edit Locomotive" : "Add Locomotive"}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="locomotive-form">
                                
                                <div class="mb-3">
                                    <label for="locomotiveImage" class="form-label">Image</label>
                                    <img id="locomotiveImage" src="${existing ? existing.imageUrl : "/images/locos/dummyLoco.webp"}" style="border: solid 1px #ddd; padding: 8px; height:100px; max-width: 400px;display: block; margin-top: 10px;">
                                </div>

                                <div class="mb-3">
                                    <label for="locomotiveImageFile" class="form-label">New Image</label>
                                    <input type="file" class="form-control" id="locomotiveImageFile">
                                </div>


                                <div class="mb-3">
                                    <label for="name" class="form-label">Name</label>
                                    <input type="text" class="form-control" id="name" value="${(existing === null || existing === void 0 ? void 0 : existing.name) || ""}">
                                </div>
                                <div class="mb-3">
                                    <label for="address" class="form-label">Address</label>
                                    <input type="number" class="form-control" id="address" value="${(existing === null || existing === void 0 ? void 0 : existing.address) || ""}">
                                </div>

                                <div class="mb-3">
                                    <label for="speedMode" class="form-label">Speed Mode</label>
                                    <input type="text" class="form-control" id="speedMode" value="${(existing === null || existing === void 0 ? void 0 : existing.speedMode) || ""}">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="cancel-button">Cancel</button>
                            <button type="button" class="btn btn-primary" id="save-button">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
            const modal = this.dialogContainer.querySelector(".modal");
            const cancelButton = modal === null || modal === void 0 ? void 0 : modal.querySelector("#cancel-button");
            const saveButton = modal === null || modal === void 0 ? void 0 : modal.querySelector("#save-button");
            const imageInputFile = modal === null || modal === void 0 ? void 0 : modal.querySelector("#locomotiveImageFile");
            const locomotiveImage = modal === null || modal === void 0 ? void 0 : modal.querySelector("#locomotiveImage");
            imageInputFile.addEventListener("change", (event) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const file = (_a = imageInputFile.files) === null || _a === void 0 ? void 0 : _a[0];
                if (file) {
                    const formData = new FormData();
                    formData.append("image", file);
                    try {
                        const response = yield fetch(`/upload`, {
                            method: "POST",
                            body: formData,
                        });
                        if (response.ok) {
                            const data = yield response.json();
                            //const imageUrlInput = modal?.querySelector("#locomotiveImageUrl") as HTMLInputElement;
                            //imageInput.value = data.url;
                            locomotiveImage.src = data.url;
                        }
                        else {
                            console.error("Failed to upload image");
                        }
                    }
                    catch (error) {
                        console.error("Error uploading image:", error);
                    }
                }
            }));
            cancelButton === null || cancelButton === void 0 ? void 0 : cancelButton.addEventListener("click", () => {
                this.dialogContainer.innerHTML = "";
            });
            saveButton === null || saveButton === void 0 ? void 0 : saveButton.addEventListener("click", () => {
                const id = existing ? existing === null || existing === void 0 ? void 0 : existing.id : null;
                const name = (modal === null || modal === void 0 ? void 0 : modal.querySelector("#name")).value;
                const address = parseInt((modal === null || modal === void 0 ? void 0 : modal.querySelector("#address")).value);
                const url = new URL(locomotiveImage.src);
                const imageUrl = url.pathname;
                const speedMode = (modal === null || modal === void 0 ? void 0 : modal.querySelector("#speedMode")).value;
                const functions = existing ? existing.functions : [];
                if (name && address && imageUrl && speedMode) {
                    const locomotive = {
                        id,
                        name,
                        address,
                        imageUrl,
                        speedMode,
                        functions,
                        speed: 0,
                        direction: 0,
                        functionMap: 0,
                    };
                    this.saveLocomotive(locomotive);
                    this.dialogContainer.innerHTML = "";
                }
            });
        }
        openFunctionEditor(locomotive) {
            var _a;
            const functionEditor = document.createElement("div");
            functionEditor.innerHTML = `
            <div class="modal" role="dialog" data-bs-backdrop="static" data-bs-keyboard="true" style="display: block; background: rgba(0,0,0,0.5);">
                <div class="modal-dialog" style="max-width: 800px;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Functions for ${locomotive.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" style="max-height: 480px; overflow-y: auto;">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>#F</th>
                                        <th>Name</th>
                                        <th>Momentary</th>
                                        <th>Test</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="functionTableBody">
                                    <!-- Function rows will be dynamically added here -->

                                    ${((_a = locomotive.functions) === null || _a === void 0 ? void 0 : _a.map((func) => `
                                            <tr>
                                                <td><input type="number" class="form-control" value="${func.id}"></td>
                                                <td><input type="text" class="form-control" value="${func.name}"></td>
                                                <td><input type="checkbox" class="form-check-input" ${func.momentary ? "checked" : ""}></td>
                                                <td><button class="btn btn-primary btn-sm test-function" address="${locomotive.address}" function="${func.id}">TEST</button></td>
                                                <td><button class="btn btn-danger btn-sm delete-function">Delete</button></td>
                                            </tr>
                                        `).join("")) || ""}


                                </tbody>
                            </table>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-success" id="addFunction">Add Function</button>
                            <button  id="saveFunctionsButton" type="button" class="btn btn-primary" data-dismiss="modal">OK</button>
                            <button  id="cancelFunctionsButton" type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
            document.body.appendChild(functionEditor);
            const functionTableBody = functionEditor.querySelector("#functionTableBody");
            const btnTest = functionTableBody.querySelector(".test-function");
            const testelems = functionTableBody.querySelectorAll(".test-function");
            testelems.forEach((elem) => {
                elem.addEventListener("mousedown", (e) => {
                    // Az esemény kiváltó gomb
                    const clickedButton = e.currentTarget;
                    // A gomb szülő <tr> elemének megkeresése
                    const parentRow = clickedButton.closest("tr");
                    if (parentRow) {
                        const idInput = parentRow.querySelector("input[type='number']");
                        const nameInput = parentRow.querySelector("input[type='text']");
                        const momentaryInput = parentRow.querySelector("input[type='checkbox']");
                        const rowData = {
                            id: idInput ? parseInt(idInput.value, 10) : null,
                            name: nameInput ? nameInput.value : "",
                            momentary: momentaryInput ? momentaryInput.checked : false,
                        };
                        console.log(rowData);
                    }
                    else {
                        console.log("No parent <tr> found");
                    }
                });
            });
            const addFunctionButton = functionEditor.querySelector("#addFunction");
            addFunctionButton.addEventListener("click", () => {
                var _a;
                const functionTableBody = functionEditor.querySelector("#functionTableBody");
                const newRow = document.createElement("tr");
                newRow.innerHTML = `
            <td><input type="number" class="form-control" placeholder="Fn"></td>
            <td><input type="text" class="form-control" placeholder="Name"></td>
            <td><input type="checkbox" class="form-check-input"></td>
            <td><button class="btn btn-primary btn-sm test-function">TEST</button></td>
            <td>
                <button class="btn btn-danger btn-sm delete-function">Delete</button>
            </td>
        `;
                functionTableBody.appendChild(newRow);
                // Add event listener for delete button
                (_a = newRow.querySelector(".delete-function")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
                    newRow.remove();
                });
            });
            const cancelFunctionsButton = functionEditor.querySelector("#cancelFunctionsButton");
            cancelFunctionsButton.addEventListener("click", () => {
                functionEditor.remove();
            });
            const saveFunctionsButton = functionEditor.querySelector("#saveFunctionsButton");
            saveFunctionsButton.addEventListener("click", () => {
                const functionTableBody = functionEditor.querySelector("#functionTableBody");
                locomotive.functions = Array.from(functionTableBody.querySelectorAll("tr")).map((row) => {
                    const idInput = row.querySelector("input[type='number']");
                    const nameInput = row.querySelector("input[type='text']");
                    const momentaryInput = row.querySelector("input[type='checkbox']");
                    return {
                        id: parseInt(idInput.value, 10),
                        name: nameInput.value,
                        momentary: momentaryInput.checked,
                        isOn: false
                    };
                });
                this.saveLocomotive(locomotive);
                functionEditor.remove();
            });
        }
    }
    const manager = new LocomotiveManager("table-container");
});
