"use strict";
// import { iBasicAccessory, iTurnout } from "../../common/src/dcc";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandCenter = void 0;
class CommandCenter {
    constructor(name) {
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
    }
}
exports.CommandCenter = CommandCenter;
//# sourceMappingURL=commandcenter.js.map