self.onmessage = function(e) {
    setTimeout(() => {
        self.postMessage("tick");
    }, 250);
};