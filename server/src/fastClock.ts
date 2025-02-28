import { ApiCommands, iTimeInfo } from "../../common/src/dcc";
import { broadcastAll } from "./ws";

export class FastClock {
    private static interval: NodeJS.Timeout | undefined;
    private static fastClockFactor: number = 1
    private static time: Date = new Date()
    static start() {
      if(FastClock.interval) {
        clearInterval(FastClock.interval)
      }
      FastClock.interval = setInterval(() => {
            FastClock.time.setSeconds(FastClock.time.getSeconds() + 1)
            broadcastAll({type: ApiCommands.timeInfo, data: {timestamp: FastClock.time.getTime()} as iTimeInfo})
      }, 1000 / FastClock.fastClockFactor)
    }
  
    static setFastClockFactor(factor: number) {
      factor = Math.max(1, Math.min(5, factor))
      FastClock.fastClockFactor = factor
      FastClock.start()
    }
}
