import * as MQTT from "async-mqtt";
import * as config from "./config.json"
import { Engine } from "./Engine";

async function main() {
    console.log(`Connecting to broker at: ${config.brokerUrl}`)
    const mqttClient = await MQTT.connectAsync(config.brokerUrl)
    const engine = new Engine(mqttClient)
    engine.start()
}

main()
