import { ApiCommands } from "../../common/src/dcc";
import { DCCExCommandCenter } from "./dccExCommandCenter";
import { TCPClient } from "./tcpClient";
import { broadcastAll } from "./ws";

export class DCCExTCPCommancenter extends DCCExCommandCenter {
  ip: string;
  port: number;
  // aliveTask?: NodeJS.Timeout;
  mainTask?: NodeJS.Timeout;
  tcpClient: TCPClient
  lastSentTime: number = 0;
  MAIN_TASK_INTERVAL: number = 50;


  constructor(name: string, ip: string, port: number) {
    super(name);
    this.ip = ip;
    this.port = port;
    this.tcpClient = new TCPClient(ip, port, 5000,
      this.connected.bind(this),
      this.received.bind(this),
      this.error.bind(this))
  }

  getConnectionString(): string {
    return "tcp://" + this.ip + ":" + this.port
  }

  send(msg: string) {
    if (this.buffer.length < 100) {
      this.buffer.push(msg);
    } else {
      console.log("DCCEx TCP Command Center Buffer is Full! size:", this.buffer.length);
    }
  }

  processBuffer() {
    if (this.tcpClient) {
      if (this.buffer.length > 0) {
        var data = ""
        var i = 0

        while (this.buffer.length > 0 && i < 10) {
          data += this.buffer.shift()
          i++
        }

        this.tcpClient.send(data, (err?: Error) => {
          if (err) {
            console.log("tcpClient.write Error:", err);
            broadcastAll({ type: ApiCommands.UnsuccessfulOperation, data: "DCCEx TCP processBuffer()" })
          } else {
            this.lastSentTime = performance.now()
          }
        });
      }
    }
  }
  error(err: Error) {
    console.log("DCCEx TCP Error:", err)
  }
  start() {
    this.stop();
    if (this.tcpClient) {
      this.tcpClient.start();
    }

    this.mainTask = setInterval(() => {
      this.processBuffer();
      if (performance.now() - this.lastSentTime > 5000) {
        this.put("<#>");
      }
    }, this.MAIN_TASK_INTERVAL);
  }

  stop() {
    if (this.mainTask) {
      clearInterval(this.mainTask);
      this.mainTask = undefined;
    }
    // if (this.aliveTask) {
    //   clearInterval(this.aliveTask);
    //   this.aliveTask = undefined;
    // }

    if (this.tcpClient) {
      this.tcpClient.stop()
    }

  }
}
