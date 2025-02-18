import { DCCExCommandCenter } from "./dccExCommandCenter";
import { SerialClient } from "./serialClient";

export class DccExSerialCommandCenter extends DCCExCommandCenter {

    mainTask?: NodeJS.Timeout;
    serialClient: SerialClient;
    lastSentTime: number = 0;
    MAIN_TASK_INTERVAL: number = 50;

    constructor(name: string, portName: string, baudRate: number) {
        super(name);
        this.serialClient = new SerialClient(portName, baudRate,
            this.connected.bind(this),
            this.received.bind(this),
            this.error.bind(this))
    }


    processBuffer() {
        if (this.serialClient) {
            if (this.buffer.length > 0) {
                var data = ""
                var i = 0

                while (this.buffer.length > 0 && i < 10) {
                    data += this.buffer.shift()
                    i++
                }

                this.serialClient.send(data)
                this.lastSentTime = performance.now()
            }
        }
    }
    error(err: Error) {
        console.log("DCCEx TCP Error:", err)
    }
    start() {
        this.stop();
        if (this.serialClient) {
            this.serialClient.connect();
        }

        this.mainTask = setInterval(() => {
            this.processBuffer();
            if ((performance.now() - this.lastSentTime) > 5000) {
                this.put("<#>");
            }
        }, this.MAIN_TASK_INTERVAL);
    }

    stop() {
        if (this.mainTask) {
            clearInterval(this.mainTask);
            this.mainTask = undefined;
        }
        if (this.serialClient) {
            //this.serialClient.stop()
        }

    }

}