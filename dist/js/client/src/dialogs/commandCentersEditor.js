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
    exports.CommandCentersEditor = void 0;
    bootstrap = __importStar(bootstrap);
    class CommandCentersEditor {
        constructor(tableId) {
            this.commandCenters = [];
            const table = document.getElementById(tableId);
            if (!table)
                throw new Error("Container not found");
            this.table = table;
            this.addModal = new bootstrap.Modal(document.getElementById('addDeviceModal'));
            this.z21Modal = new bootstrap.Modal(document.getElementById('Z21-MODAL'));
            this.z21OK = document.getElementById("btnZ21Ok");
            document.getElementById('add-device').onclick = (e) => {
                var _a;
                document.getElementById("deviceName").value = "";
                document.getElementById("deviceType").value = "";
                (_a = this.addModal) === null || _a === void 0 ? void 0 : _a.show();
            };
            document.getElementById('btnAddDevice').onclick = (e) => {
                var _a, _b;
                // TODO: Check the values
                (_a = this.addModal) === null || _a === void 0 ? void 0 : _a.hide();
                if (document.getElementById("deviceType").value == "0") {
                    document.getElementById("z21Ip").value = "";
                    document.getElementById("z21Port").value = "21105";
                    this.z21OK.onclick = (e) => {
                        var _a;
                        var device = {
                            uuid: undefined,
                            isLocoController: false,
                            name: document.getElementById("deviceName").value,
                            type: parseInt(document.getElementById("deviceType").value),
                            ip: document.getElementById("z21Ip").value,
                            port: parseInt(document.getElementById("z21Port").value)
                        };
                        this.saveDevice(device);
                        (_a = this.z21Modal) === null || _a === void 0 ? void 0 : _a.hide();
                    };
                    (_b = this.z21Modal) === null || _b === void 0 ? void 0 : _b.show();
                }
            };
            this.fetchDevices();
        }
        fetchDevices() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    //const response = await fetch(`${document.location.origin}/devices`);
                    const response = yield fetch('/devices');
                    this.commandCenters = yield response.json();
                    this.render();
                }
                catch (error) {
                    console.error("Error fetching devices:", error);
                }
            });
        }
        saveDevice(device) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const method = device.uuid ? "PUT" : "POST";
                    const endpoint = device.uuid ? `/devices/${device.uuid}` : "/devices";
                    //const endpoint = device.id ? `/devices/${device.id}` : "/devices";
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
                    const response = yield fetch(`/devices/${id}`, {
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
            const tbody = this.table.querySelector("tbody");
            tbody.innerHTML = "";
            if (this.commandCenters) {
                this.commandCenters.forEach((cc) => {
                    const tr = document.createElement("tr");
                    const tdName = document.createElement("td");
                    tdName.innerHTML = cc.name;
                    tr.appendChild(tdName);
                    const tdType = document.createElement("td");
                    tdType.innerHTML = (0, dcc_1.getCommandCenterType)(cc.type);
                    tr.appendChild(tdType);
                    const tdDefault = document.createElement("td");
                    tdDefault.innerHTML = "Default";
                    tr.appendChild(tdDefault);
                    const tdStatus = document.createElement("td");
                    tdStatus.innerHTML = "Status";
                    tr.appendChild(tdStatus);
                    const tdActions = document.createElement("td");
                    tr.appendChild(tdActions);
                    const btnEdit = document.createElement("button");
                    btnEdit.className = "btn btn-primary btn-sm me-1";
                    btnEdit.innerHTML = "EDIT...";
                    tdActions.appendChild(btnEdit);
                    btnEdit.commandCenter = cc;
                    btnEdit.onclick = (e) => {
                        document.getElementById("z21Ip").value = btnEdit.commandCenter.ip;
                        document.getElementById("z21Port").value = btnEdit.commandCenter.port.toString();
                        this.z21Modal.show();
                        this.z21OK.onclick = (e) => {
                            var _a;
                            btnEdit.commandCenter.ip = document.getElementById("z21Ip").value,
                                btnEdit.commandCenter.port = parseInt(document.getElementById("z21Port").value);
                            this.saveDevice(btnEdit.commandCenter);
                            (_a = this.z21Modal) === null || _a === void 0 ? void 0 : _a.hide();
                        };
                    };
                    const btnDelete = document.createElement("button");
                    btnDelete.className = "btn btn-danger btn-sm";
                    btnDelete.innerHTML = "DELETE...";
                    tdActions.appendChild(btnDelete);
                    btnDelete.onclick = (e) => {
                        this.deleteDevice(cc.uuid);
                    };
                    tbody.appendChild(tr);
                });
            }
        }
    }
    exports.CommandCentersEditor = CommandCentersEditor;
    const manager = new CommandCentersEditor("cc-table");
});
