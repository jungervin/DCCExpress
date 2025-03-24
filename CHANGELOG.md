# 📜 Changelog

## 2025-03-23
New task manager instructions added:
```ts
ifMoving()
ifStopped()
ifForward()
ifReverse()
waitForStop()
waitForStart()
ifSpeedGreaterThan(speed: number)
ifSpeedLessThan(speed: number)
getLocoFromBlock(blockName: string)
setBlockLocoAddress(blockName: string, locoAddress: number)
~~setBlock(blockName: string, locoAddress: number) ~~

```


## 2025-03-22
New task manager instructions added:
```ts
setBlock(blockName: string, locoAddress: number)
ifBlockIsFree(blockName: string)
ifBlockIsNotFree(blockName: string)
```

## 2025-03-21
* DCCEx Comman Center Initialization (Command Center Dialog)

New task manager instructions added:
```ts
setOutput(address: number, on: boolean)
ifOutputIsOn(address: number)
ifOutputIsOff(address: number)
setAccessory(address: number, on: boolean)
ifAccessoryIsOn(address: number)
ifAccessoryIsOff(address: number)
setSignalGreen(address: number)
ifSignalIsGreen(address: number)
setSignalRed(address: number)
ifSignalIsRed(address: number)
setSignalYellow(address: number)
ifSignalIsYellow(address: number)
setSignalWhite(address: number)
fSignalIsWhite(address: number)
ifSensorIsOn(address: number)
ifSensorIsOff(address: number)
```

## 2025-03-20
New task manager instructions added:
```ts
ifClosed(address: number)
ifOpen(address: number)
else()
endIf()
goto(label: string)
break(text: string = "")
```
## 2025-03-19
* blocks
* WebSocket sensor handling, e.g., Node-RED
```ts
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

## 2025-03-16
* dcc-ex sensors
* wiki Command-Centers: The sensors can also be used as RBus sensors

## 2025-03-15
* index.html
* wiki

## 2025-03-14
* DCCEx Serialport max packet size to 5
* Serial Port List: node .\bin\serialportList.js

## 2025-03-08
* There may be issues with starting the EXE; instead, the server can be launched using the start.bat file in the extracted folder.
* Serial port usage is mostly working, but further testing is needed.

## 2025-03-07
* POM mode has been added to CV Programming
* DCC-EX turnout operation extended to support basic accessory decoders.
* Settings: Display railway signals as single-lamp
* ControlPanel: currentLoco save to localStorage
* some bugfix

## 2025-03-06
* Y turnout added.
* Programming window implemented, currently works only with the DCC-EX command station.

