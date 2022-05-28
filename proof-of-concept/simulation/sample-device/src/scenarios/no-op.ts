/*
This scenario represents a device not having the SLS SDK and doing nothing.
It's useful for basic measurements, etc.
*/

console.log("No-op device is started!")

setInterval(() => {
    console.log("No-op device: Doing nothing!");
}, 10_000)
