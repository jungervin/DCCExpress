"use strict";
// import { iBasicAccessory, iTurnout } from "../../common/src/dcc";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandCenter = void 0;
class CommandCenter {
    constructor(name, init) {
        //uuid: string = ""
        this.name = "";
        this.locos = {};
        this.turnouts = {};
        //decoders: { [address: number]: iSetBasicAccessory } = {};
        this.accessories = {};
        this.TURNOUT_WAIT_TIME = 500;
        this.BASICACCESSORY_WAIT_TIME = 10;
        // this.uuid = uuid
        this.name = name;
        this.powerInfo = {
            info: 0,
            current: 0,
            trackVoltageOn: true,
            emergencyStop: false,
            programmingModeActive: false,
            shortCircuit: false,
        };
    }
}
exports.CommandCenter = CommandCenter;
//# sourceMappingURL=commandcenter.js.map