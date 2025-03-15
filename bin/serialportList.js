import { SerialPort } from 'serialport';

SerialPort.list()
    .then(ports => {
        console.log("Available Serial Ports:");
        ports.forEach(port => {
            console.log(port);
        });
    })
    .catch(error => console.error("Error listing serial ports:", error));
