# 📜 Changelog


#### 2025-03-19
* blocks
* WebSocket sensor handling, e.g., Node-RED
```js
// NodeRed: toggle sensor 6
var on = global.get("ws_on") || false;
msg.payload = {
    type: "wsSensorInfo",
    data: {
        address: 6,
        on: on
    }
};
global.set("ws_on", !on);
return msg;
```
* Task button
* Task list with controls
* worker.js implementation

#### 2025-03-16
* dcc-ex sensors
* wiki Command-Centers: The sensors can also be used as RBus sensors

#### 2025-03-15
* index.html
* wiki

#### 2025-03-14
* DCCEx Serialport max packet size to 5
* Serial Port List: node .\bin\serialportList.js

#### 2025-03-08
* There may be issues with starting the EXE; instead, the server can be launched using the start.bat file in the extracted folder.
* Serial port usage is mostly working, but further testing is needed.

#### 2025-03-07
* POM mode has been added to CV Programming
* DCC-EX turnout operation extended to support basic accessory decoders.
* Settings: Display railway signals as single-lamp
* ControlPanel: currentLoco save to localStorage
* some bugfix

#### 2025-03-06
* Y turnout added.
* Programming window implemented, currently works only with the DCC-EX command station.

