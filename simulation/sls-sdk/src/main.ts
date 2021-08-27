import * as config from "./config.json"
import { SlsSdk } from "./SlsSdk"

async function main() {
    const ID = process.argv[2]
    if (!ID){
        console.error("Specify client id as an argument.")
        process.exit(1)
    }
    console.log(`Client ID: ${ID}`)
    const engine = new SlsSdk(config.brokerUrl, ID)
    engine.start()
}

main()
