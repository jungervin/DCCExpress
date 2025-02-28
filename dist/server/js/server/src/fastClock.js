"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastClock = void 0;
const dcc_1 = require("../../common/src/dcc");
const ws_1 = require("./ws");
class FastClock {
    static start() {
        if (FastClock.interval) {
            clearInterval(FastClock.interval);
        }
        FastClock.interval = setInterval(() => {
            FastClock.time.setSeconds(FastClock.time.getSeconds() + 1);
            (0, ws_1.broadcastAll)({ type: dcc_1.ApiCommands.timeInfo, data: { timestamp: FastClock.time.getTime() } });
        }, 1000 / FastClock.fastClockFactor);
    }
    static setFastClockFactor(factor) {
        factor = Math.max(1, Math.min(5, factor));
        FastClock.fastClockFactor = factor;
        FastClock.start();
    }
}
exports.FastClock = FastClock;
FastClock.fastClockFactor = 1;
FastClock.time = new Date();
//# sourceMappingURL=fastClock.js.map