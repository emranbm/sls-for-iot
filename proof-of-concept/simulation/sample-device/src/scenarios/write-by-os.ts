/*
This scenario represents a device writing randomly to the local storage with a given probabilty.
*/

import { argv } from 'process';
import { SlsSdk } from 'sls-sdk';
import * as fs from 'fs'
const asyncfs = fs.promises

async function main() {
    const writeChance = argv[2]
    const CONTENT = Array(4097).join("a")

    const clientId = Math.random().toString()
    const sdk = new SlsSdk("mqtt://10.0.0.254:1883", clientId, '/tmp/sls-root')
    console.log("Starting SDK...")
    await sdk.start()

    console.log("Device with loaded SLS SDK started and going to write randomly and locally every 10 seconds by chance of " + writeChance)

    let index = 0

    setInterval(async () => {
        if (isChanceMet(writeChance)) {
            await asyncfs.writeFile(`/tmp/${index++}.txt`, CONTENT)
        }
    }, 10_000)

    function isChanceMet(chance) {
        return Math.random() < chance
    }

}

main()
