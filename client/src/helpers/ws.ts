import { ApiCommands, iData, iSetTurnout } from "../../../common/src/dcc";

class WebSocketClient {

    private socket!: WebSocket;
    onConnected?: () => void;
    onError?: () => void;

    sendTurnoutCmd(t: iSetTurnout) {
        this.send({ type: ApiCommands.setTurnout, data: t } as iData)
    }

    constructor() {
        // Induláskor azonnali csatlakozás
        //this.connect();
    }

    public connect(): void {
        const protocol = document.location.protocol === "https:" ? "wss:" : "ws:";
        const host = document.location.host;
        const url = `${protocol}//${host}/ws`; 
        
        // Node red listening /ws
        //const url = `ws://192.168.1.42:1880/ws`;

        console.log(`Connecting to ${url}`);

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log("WebSocket connection established.");
            if (this.onConnected) {
                setTimeout(() => this.onConnected!(), 100);                
            }
        };

        
        this.socket.onmessage = (event) => {
            try {
                const message: iData = JSON.parse(event.data);
                this.onMessage(message);
            } catch (error) {
                console.error("Invalid message format received:", event.data);
            }
        };

        this.socket.onclose = () => {
            if (this.onError) {
                this.onError()
            }
            console.warn("WebSocket connection closed. Reconnecting...");
            setTimeout(() => this.connect(), 1000); // Újracsatlakozás azonnal
        };

        this.socket.onerror = (error) => {
            if (this.onError) {
                this.onError()
            }
            console.error("WebSocket error:", error);
        };
    }

    send(data: iData): void {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.warn("Cannot send message. WebSocket is not open.");
        }
    }

    onMessage(message: iData): void {
        console.log("Processing message:", message);
    }
}


export const wsClient = new WebSocketClient();
