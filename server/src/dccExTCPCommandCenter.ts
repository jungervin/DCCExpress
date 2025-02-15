import { DCCExCommandCenter } from "./dccExCommandCenter";
import { TCPClient } from "./tcpClient";

export class DCCExTCPCommancenter extends DCCExCommandCenter {
  ip: string;
  port: number;
  aliveTask?: NodeJS.Timeout;
  mainTask?: NodeJS.Timeout;
  tcpClient: TCPClient
  lastSentTime: number = 0;


  constructor(name: string, ip: string, port: number) {
    super(name);
    this.ip = ip;
    this.port = port;
    this.tcpClient = new TCPClient(ip, port, 5000, 5000,
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

  write() {
    if (this.tcpClient) {
      if (this.buffer.length > 0) {
        const msg = this.buffer.shift() as string;
        this.tcpClient.send(msg, (err?: Error) => {
          if (err) {
            console.log("tcpClient.write Error:", err);
          }
        });
        this.lastSentTime = performance.now();
      }
    }
  }
  error(err: Error) {
    console.log("DCCEx TCP Error:", err)
  }
  start() {

    //return;
    this.stop();
    if (this.tcpClient) {
      this.tcpClient.start();
    }

    this.mainTask = setInterval(() => {
      this.write();
      if (performance.now() - this.lastSentTime > 5000) {
        this.lastSentTime = performance.now()
        this.send("<#>");
      }
    }, 100);
  }

  stop() {
    if (this.mainTask) {
      clearInterval(this.mainTask);
      this.mainTask = undefined;
    }
    if (this.aliveTask) {
      clearInterval(this.aliveTask);
      this.aliveTask = undefined;
    }

    if (this.tcpClient) {
      this.tcpClient.stop()
    }

  }
}
