import * as MQTT from "async-mqtt"
import * as config from "./config.json"
import { ClientEngine } from "./ClientEngine"

async function main() {
    const ID = process.argv[2]
    if (!ID){
        console.error("Specify client id as an argument.")
        process.exit(1)
    }
    console.log(`Client ID: ${ID}`)
    console.log(`Connecting to broker at: ${config.brokerUrl}`)
    const mqttClient = await MQTT.connectAsync(config.brokerUrl)
    const engine = new ClientEngine(mqttClient, ID)
    engine.start()
}

main()
