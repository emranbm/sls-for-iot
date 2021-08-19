import * as MQTT from "async-mqtt"
import * as config from "./config.json"
import { HeartBeatSender } from "./HeartBeatSender"

async function main() {
    const ID = process.argv[2]
    if (!ID){
        console.error("Specify client id as an argument.")
        process.exit(1)
    }
    console.log(`Client ID: ${ID}`)
    console.log(`Connecting to broker at: ${config.brokerUrl}`)
    const mqttClient = await MQTT.connectAsync(config.brokerUrl)

    await mqttClient.subscribe(`sls/client/${ID}`)

    mqttClient.on('message', onMessage)

    new HeartBeatSender(mqttClient, ID).start()
}

function onMessage(topic: string, message: Buffer) {
    console.log(`Message received from topic "${topic}"`)
    console.log(message.toString())
}

main()
