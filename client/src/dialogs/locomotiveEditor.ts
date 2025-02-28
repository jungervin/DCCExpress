// function getUUID() {
//     return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
//         (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
//     );
// }

import { getUUID } from "../helpers/utility";
import { ApiCommands, iLocomotive, iSetLocoFunction } from "../../../common/src/dcc";
import { wsClient } from "../helpers/ws";
import { remove } from "lodash";


class LocomotiveManager {
    private locomotives: iLocomotive[] = [];
    private tableContainer: HTMLElement;
    //private serverUrl: string;
    private dialogContainer: HTMLElement;

    constructor(containerId: string) {
        const container = document.getElementById(containerId);
        if (!container) throw new Error("Container not found");
        this.tableContainer = container;

        const dialogContainer = document.createElement("div");
        dialogContainer.id = "dialog-container";
        document.body.appendChild(dialogContainer);
        this.dialogContainer = dialogContainer;

        //this.serverUrl = serverUrl;
        this.fetchLocomotives();
        wsClient.connect()
    }

    private async fetchLocomotives() {
        try {
            const response = await fetch(`/locomotives`);
            const locos = await response.json();
            this.locomotives = locos.sort((a: iLocomotive, b: iLocomotive) => a.address - b.address);
            this.render();
        } catch (error) {
            console.error("Error fetching locomotives:", error);
        }
    }

    private async saveLocomotive(locomotive: iLocomotive) {
        try {
            const method = locomotive.id ? "PUT" : "POST";
            const endpoint = locomotive.id ? `/locomotives/${locomotive.id}` : "/locomotives";

            const response = await fetch(`${endpoint}`, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(locomotive),
            });

            if (!response.ok) throw new Error("Failed to save locomotive");

            await this.fetchLocomotives();
        } catch (error) {
            console.error("Error saving locomotive:", error);
        }
    }

    private async deleteLocomotive(id: string) {
        if (confirm("Are you sure you want to delete the locomotive?")) {
            try {
                const response = await fetch(`/locomotives/${id}`, {
                    method: "DELETE",
                });

                if (!response.ok) throw new Error("Failed to delete locomotive");

                await this.fetchLocomotives();
            } catch (error) {
                console.error("Error deleting locomotive:", error);
            }
        }
    }

    private render() {
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
                .map(
                    (locomotive) => `
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
                    `
                )
                .join("")}
                </tbody>
            </table>
        `;

        this.attachEventListeners();
    }

    private attachEventListeners() {
        this.tableContainer.querySelector("#add-locomotive")?.addEventListener("click", () => {
            this.openDialog();
        });

        this.tableContainer.querySelectorAll(".duplicate").forEach((button) =>
            button.addEventListener("click", (event) => {
                const row = (event.target as HTMLElement).closest("tr");
                if (row) {
                    const id = row.getAttribute("data-id");
                    const locomotive = this.locomotives.find((loco) => loco.id === id);
                    if (locomotive) {
                        const clone = JSON.parse(JSON.stringify(locomotive)) as iLocomotive
                        clone.id = undefined
                        clone.address = 3
                        clone.name = "KLÓN"
                        this.locomotives.push(clone)
                        this.openDialog(clone);

                    }
                }
            })
        );


        this.tableContainer.querySelectorAll(".edit-locomotive").forEach((button) =>
            button.addEventListener("click", (event) => {
                const row = (event.target as HTMLElement).closest("tr");
                if (row) {
                    const id = row.getAttribute("data-id");
                    const locomotive = this.locomotives.find((loco) => loco.id === id);
                    if (locomotive) {
                        this.openDialog(locomotive);
                    }
                }
            })
        );

        this.tableContainer.querySelectorAll(".delete-locomotive").forEach((button) =>
            button.addEventListener("click", (event) => {
                const row = (event.target as HTMLElement).closest("tr");
                if (row) {
                    const id = row.getAttribute("data-id");
                    if (id) this.deleteLocomotive(id);
                }
            })
        );

        this.tableContainer.querySelectorAll(".edit-functions").forEach((button) => {
            button.addEventListener("click", (event) => {
                const row = (event.target as HTMLElement).closest("tr");
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

    private openDialog(existing?: iLocomotive) {
        this.dialogContainer.innerHTML = `
            <div class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${existing ? "Edit Locomotive" : "Add Locomotive"}</h5>
                            <button id="locoDialogClose" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                                    <input type="text" class="form-control" id="name" value="${existing?.name || ""}">
                                </div>
                                <div class="mb-3">
                                    <label for="address" class="form-label">Address</label>
                                    <input type="number" class="form-control" id="address" value="${existing?.address || ""}">
                                </div>

                                <div class="mb-3">
                                    <label for="speedMode" class="form-label">Speed Mode</label>
                                    <input type="text" class="form-control" id="speedMode" value="${existing?.speedMode || ""}">
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
        const cancelButton = modal?.querySelector("#cancel-button");
        const saveButton = modal?.querySelector("#save-button");
        const imageInputFile = modal?.querySelector("#locomotiveImageFile") as HTMLInputElement;
        const locomotiveImage = modal?.querySelector("#locomotiveImage") as HTMLImageElement;

        const locoDialogClose = this.dialogContainer.querySelector("#locoDialogClose") as HTMLElement
        locoDialogClose.onclick = (e) => {
            this.dialogContainer.innerHTML = ""
        }


        imageInputFile.addEventListener("change", async (event) => {
            const file = imageInputFile.files?.[0];
            if (file) {
                const formData = new FormData();
                formData.append("image", file);

                try {
                    const response = await fetch(`/upload`, {
                        method: "POST",
                        body: formData,
                    });

                    if (response.ok) {
                        const data = await response.json();
                        //const imageUrlInput = modal?.querySelector("#locomotiveImageUrl") as HTMLInputElement;
                        //imageInput.value = data.url;
                        locomotiveImage.src = data.url
                    } else {
                        console.error("Failed to upload image");
                    }
                } catch (error) {
                    console.error("Error uploading image:", error);
                }
            }
        });

        cancelButton?.addEventListener("click", () => {
            this.dialogContainer.innerHTML = ""
        });

        saveButton?.addEventListener("click", () => {
            const id = existing ? existing?.id : null!
            const name = (modal?.querySelector("#name") as HTMLInputElement).value;
            const address = parseInt((modal?.querySelector("#address") as HTMLInputElement).value);
            const url = new URL(locomotiveImage.src);
            const imageUrl = url.pathname;
            const speedMode = (modal?.querySelector("#speedMode") as HTMLInputElement).value;
            const functions = existing ? existing.functions : [];

            if (name && address && imageUrl && speedMode) {
                const locomotive: iLocomotive = {
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
                this.dialogContainer.innerHTML = ""
            }
        });
    }

    private openFunctionEditor(locomotive: iLocomotive): void {
        const functionEditor = document.createElement("div");
        functionEditor.innerHTML = `
            <div class="modal" role="dialog" data-bs-backdrop="static" data-bs-keyboard="true" style="display: block; background: rgba(0,0,0,0.5);">
                <div class="modal-dialog" style="max-width: 800px;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Functions for ${locomotive.name}</h5>
                            <button id="functionDialogClose" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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

                                    ${locomotive.functions
                ?.map((func) => `
                                            <tr>
                                                <td><input type="number" class="form-control" value="${func.id}"></td>
                                                <td><input type="text" class="form-control" value="${func.name}"></td>
                                                <td><input type="checkbox" class="form-check-input" ${func.momentary ? "checked" : ""}></td>
                                                <td><button class="btn btn-secondary btn-sm test-function" address="${locomotive.address}" function="${func.id}">TEST</button></td>
                                                <td><button class="btn btn-danger btn-sm delete-function">Delete</button></td>
                                            </tr>
                                        `).join("") || ""}


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

        const functionTableBody = functionEditor.querySelector("#functionTableBody") as HTMLElement;
        const btnTest = functionTableBody.querySelector(".test-function")
        const testelems = functionTableBody.querySelectorAll(".test-function")

        const functionDialogClose = functionEditor.querySelector("#functionDialogClose") as HTMLElement
        functionDialogClose.onclick = (e) => {
            functionEditor.innerHTML = ""
        }

        testelems.forEach((elem) => {
            elem.addEventListener("mousedown", (e) => {
                const clickedButton = e.currentTarget as HTMLButtonElement;
                const parentRow = clickedButton.closest("tr");
                if (parentRow) {
                    const idInput = parentRow.querySelector("input[type='number']") as HTMLInputElement;
                    const nameInput = parentRow.querySelector("input[type='text']") as HTMLInputElement;
                    const momentaryInput = parentRow.querySelector("input[type='checkbox']") as HTMLInputElement;
                    const rowData = {
                        id: idInput ? parseInt(idInput.value, 10) : null,
                        name: nameInput ? nameInput.value : "",
                        momentary: momentaryInput ? momentaryInput.checked : false,
                    };
                    if (clickedButton.classList.contains("btn-secondary")) {
                        clickedButton.classList.remove("btn-secondary")
                        clickedButton.classList.add("btn-primary")
                        const data: iSetLocoFunction = { address: locomotive.address, id: rowData.id!, isOn: true }
                        wsClient.send({ type: ApiCommands.setLocoFunction, data: data })
                    } else {
                        clickedButton.classList.add("btn-secondary")
                        clickedButton.classList.remove("btn-primary")
                        const data: iSetLocoFunction = { address: locomotive.address, id: rowData.id!, isOn: false }
                        wsClient.send({ type: ApiCommands.setLocoFunction, data: data })
                    }

                    console.log(rowData)
                } else {
                    console.log("No parent <tr> found");
                }
            })

            elem.addEventListener("mouseup", (e) => {
                const clickedButton = e.currentTarget as HTMLButtonElement;
                const parentRow = clickedButton.closest("tr");
                if (parentRow) {
                    const idInput = parentRow.querySelector("input[type='number']") as HTMLInputElement;
                    const nameInput = parentRow.querySelector("input[type='text']") as HTMLInputElement;
                    const momentaryInput = parentRow.querySelector("input[type='checkbox']") as HTMLInputElement;
                    if (momentaryInput.checked == true) {

                        clickedButton.classList.add("btn-secondary")
                        clickedButton.classList.remove("btn-primary")

                        const data: iSetLocoFunction = { address: locomotive.address, id: parseInt(idInput.value, 10), isOn: false }
                        wsClient.send({ type: ApiCommands.setLocoFunction, data: data })
                    }

                } else {
                    console.log("No parent <tr> found");
                }
            })
        })




        const addFunctionButton = functionEditor.querySelector("#addFunction") as HTMLButtonElement;
        addFunctionButton.addEventListener("click", () => {
            const functionTableBody = functionEditor.querySelector("#functionTableBody") as HTMLElement;
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
            newRow.querySelector(".delete-function")?.addEventListener("click", () => {
                newRow.remove();
            });


        });

        const cancelFunctionsButton = functionEditor.querySelector("#cancelFunctionsButton") as HTMLButtonElement;
        cancelFunctionsButton.addEventListener("click", () => {
            functionEditor.innerHTML = ""
        });

        const saveFunctionsButton = functionEditor.querySelector("#saveFunctionsButton") as HTMLButtonElement;
        saveFunctionsButton.addEventListener("click", () => {
            const functionTableBody = functionEditor.querySelector("#functionTableBody") as HTMLElement;
            locomotive.functions = Array.from(functionTableBody.querySelectorAll("tr")).map((row) => {
                const idInput = row.querySelector("input[type='number']") as HTMLInputElement;
                const nameInput = row.querySelector("input[type='text']") as HTMLInputElement;
                const momentaryInput = row.querySelector("input[type='checkbox']") as HTMLInputElement;

                return {
                    id: parseInt(idInput.value, 10),
                    name: nameInput.value,
                    momentary: momentaryInput.checked,
                    isOn: false
                };
            });

            this.saveLocomotive(locomotive);
            functionEditor.innerHTML = ""
        });


    }

}

const manager = new LocomotiveManager("table-container");
