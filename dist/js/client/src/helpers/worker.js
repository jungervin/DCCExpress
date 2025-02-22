"use strict";
self.onmessage = function (e) {
    const interval = e.data.interval || 50;
    setInterval(() => {
        self.postMessage("tick");
    }, interval);
};
