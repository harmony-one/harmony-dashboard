// For test: asios.get('...').delay(1000)
Promise.prototype.delay = function(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(this);
        }, time);
    });
}