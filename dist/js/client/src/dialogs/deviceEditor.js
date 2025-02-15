var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../../../common/src/dcc", "bootstrap"], function (require, exports, dcc_1, bootstrap) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DeviceEditor = void 0;
    bootstrap = __importStar(bootstrap);
    class DeviceEditor {
        constructor(containerId) {
            this.devices = [];
            const container = document.getElementById(containerId);
            if (!container)
                throw new Error("Container not found");
            this.tableContainer = container;
            this.addModal = new bootstrap.Modal(document.getElementById('addDeviceModal'));
            this.z21Modal = new bootstrap.Modal(document.getElementById('Z21-MODAL'));
            document.getElementById('add-device').onclick = (e) => {
                var _a;
                document.getElementById("deviceName").value = "";
                document.getElementById("deviceType").value = "";
                (_a = this.addModal) === null || _a === void 0 ? void 0 : _a.show();
            };
            document.getElementById('btnAddDevice').onclick = (e) => {
                var _a;
                // TODO: Check the values
                (_a = this.addModal) === null || _a === void 0 ? void 0 : _a.hide();
                var device = { id: undefined,
                    name: document.getElementById("deviceName").value,
                    type: parseInt(document.getElementById("deviceType").value),
                    ip: '127.0.0.1',
                    port: 21105 };
                this.saveDevice(device);
            };
            this.fetchDevices();
        }
        fetchDevices() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    //const response = await fetch(`${document.location.origin}/devices`);
                    const response = yield fetch('/devices');
                    this.devices = yield response.json();
                    this.render();
                    const edits = this.tableContainer.querySelectorAll(".edit-device");
                    edits.forEach((btn) => {
                        btn.onclick = (e) => {
                            const clickedButton = e.currentTarget;
                            const parentRow = clickedButton.closest("tr");
                            if (parentRow) {
                                switch (parentRow.children[1].innerText) {
                                    case 'Z21':
                                        alert("Z21");
                                        break;
                                    default: alert("Unknow");
                                }
                            }
                            else {
                                console.log("No parent <tr> found");
                            }
                        };
                    });
                }
                catch (error) {
                    console.error("Error fetching devices:", error);
                }
            });
        }
        saveDevice(device) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const method = device.id ? "PUT" : "POST";
                    const endpoint = device.id ? `${document.location.origin}/devices/${device.id}` : "/devices";
                    const response = yield fetch(`${endpoint}`, {
                        method,
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(device),
                    });
                    if (!response.ok)
                        throw new Error("Failed to save device");
                    yield this.fetchDevices();
                }
                catch (error) {
                    console.error("Error saving device:", error);
                }
            });
        }
        deleteDevice(id) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`/locomotives/${id}`, {
                        method: "DELETE",
                    });
                    if (!response.ok)
                        throw new Error("Failed to delete device");
                    yield this.fetchDevices();
                }
                catch (error) {
                    console.error("Error deleting locomotive:", error);
                }
            });
        }
        render() {
            this.tableContainer.innerHTML = `
        
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${this.devices
                .map((device) => `
                    <tr data-id="${device.id}">
                        <td>${device.name}<br>${device.id}</td>
                        <td>${(0, dcc_1.getCommandCenterType)(device.type)}</td>
                        <td id="${device.id}Status">#NULL</td>
                        <td>
                            <button class="btn btn-warning btn-sm edit-device">Edit</button>
                            <button class="btn btn-danger btn-sm delete-delete">Delete</button>
                        </td>
                    </tr>
                `)
                .join("")}
            </tbody>
        </table>
    `;
        }
    }
    exports.DeviceEditor = DeviceEditor;
    const manager = new DeviceEditor("table-container");
});
