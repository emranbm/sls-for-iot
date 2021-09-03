import * as config from "./config.json"
import { SlsSdk as LocalSlsSdk } from "./SlsSdk"

async function main() {
    const ID = process.argv[2]
    if (!ID) {
        console.error("Specify client id as an argument.")
        process.exit(1)
    }
    console.log(`Client ID: ${ID}`)
    const engine = new SlsSdk(config.brokerUrl, ID)
    engine.start()
}

// A hack to export SlsSdk while keeping this file as "main" in package.json
export class SlsSdk extends LocalSlsSdk { }

if (require.main === module)
    main()
