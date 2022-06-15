/*
This scenario represents a device writing randomly through the SLS SDK with a given probabilty.
*/

import { argv } from 'process';
import { SlsSdk } from 'sls-sdk';
import { InMemoryFileInfoRepo } from 'sls-sdk/build/fileInfoRepo/InMemoryFileInfoRepo';
import { InMemoryClientRepo } from 'sls-sdk/build/clientRepo/InMemoryClientRepo';
import { RandomFreeSpaceFinder } from 'sls-sdk/build/freeSpaceFinder/RandomFreeSpaceFinder';

async function main() {
    const writeChance = argv[2]
    const maxAvailableBytes = Number(argv[3]) > 0 ? Number(argv[3]) : Number.MAX_VALUE
    const CONTENT = Array(4097).join("a")

    const clientId = Math.random().toString()
    const sdk = new SlsSdk("mqtt://10.0.0.254:1883", clientId, '/tmp/sls-root',
    "info",
    new InMemoryFileInfoRepo(),
    new InMemoryClientRepo(),
    new RandomFreeSpaceFinder(),
    maxAvailableBytes)
    console.log("Starting SDK...")
    await sdk.start()

    console.log("Device with loaded SLS SDK started and going to write randomly every 10 seconds by chance of " + writeChance)

    let index = 0

    setInterval(async () => {
        if (isChanceMet(writeChance)) {
            await sdk.saveFile(CONTENT, index++ + ".txt")
        }
    }, 10_000)

    function isChanceMet(chance) {
        return Math.random() < chance
    }

}

main()
