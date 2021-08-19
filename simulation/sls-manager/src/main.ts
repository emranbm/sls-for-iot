import * as MQTT from "async-mqtt";
import { Client } from "./clientRepo/Client";
import { ClientRepoFactory } from "./clientRepo/ClientRepoFactory";
import * as config from "./config.json"
import { Engine } from "./Engine";
import { FreeSpaceFinderFactory } from "./freeSpaceFinder/FreeSpaceFinderFactory";

const TOPIC_HEART_BEAT = "sls/manager/heart-bit"
const TOPIC_SAVE_REQUEST = "sls/manager/save-request"

async function main() {
    console.log(`Connecting to broker at: ${config.brokerUrl}`)
    const mqttClient = await MQTT.connectAsync(config.brokerUrl)
    const engine = new Engine(mqttClient)
    engine.start()
}

main()
