self.onmessage = function(e) {
    setTimeout(() => {
        self.postMessage("t");
    }, 100);
};