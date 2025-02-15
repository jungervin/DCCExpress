define(["require", "exports", "../../../common/src/dcc"], function (require, exports, dcc_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wsClient = void 0;
    class WebSocketClient {
        sendTurnoutCmd(t) {
            this.send({ type: dcc_1.ApiCommands.setTurnout, data: t });
        }
        constructor() {
            // Induláskor azonnali csatlakozás
            //this.connect();
        }
        connect() {
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
                    this.onConnected();
                }
            };
            this.socket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    this.onMessage(message);
                }
                catch (error) {
                    console.error("Invalid message format received:", event.data);
                }
            };
            this.socket.onclose = () => {
                if (this.onError) {
                    this.onError();
                }
                console.warn("WebSocket connection closed. Reconnecting...");
                setTimeout(() => this.connect(), 1000); // Újracsatlakozás azonnal
            };
            this.socket.onerror = (error) => {
                if (this.onError) {
                    this.onError();
                }
                console.error("WebSocket error:", error);
            };
        }
        send(data) {
            if (this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify(data));
            }
            else {
                console.warn("Cannot send message. WebSocket is not open.");
            }
        }
        onMessage(message) {
            // Itt dolgozhatod fel az üzeneteket
            console.log("Processing message:", message);
        }
    }
    // Példa használatra
    exports.wsClient = new WebSocketClient();
});
// // Üzenet küldése
// setTimeout(() => {
//     wsClient.send({ type: ApiCommands.Turnouts, data: "Hello from client!" });
// }, 3000);
