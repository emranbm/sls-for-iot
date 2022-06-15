/*
This scenario represents a device having the SLS SDK loaded but doing nothing.
*/

import { SlsSdk } from 'sls-sdk';

const clientId = Math.random().toString()
const sdk = new SlsSdk("mqtt://10.0.0.254:1883", clientId, '/tmp/sls-root')
sdk.start()

console.log("Device with loaded SLS SDK started and doing nothing!")

setInterval(() => {
    console.log("No-op SDK device: Doing nothing!");
}, 10_000)
