import * as MQTT from "async-mqtt";
import { Client } from "./clientRepo/Client";
import { ClientRepoProvider } from "./clientRepo/ClientRepoProvider";
import * as config from "./config.json"

const TOPIC_HEART_BEAT = "sls/manager/heart-bit"

async function main() {
    console.log(`Connecting to broker at: ${config.brokerUrl}`)
    const mqttClient = await MQTT.connectAsync(config.brokerUrl)

    await mqttClient.subscribe(TOPIC_HEART_BEAT)

    mqttClient.on("message", onMessage)
}

function onMessage(topic: string, message: Buffer) {
    console.debug(`Message received from topic "${topic}"`)
    const msgStr = message.toString()
    console.debug(msgStr)
    const msg = JSON.parse(msgStr)
    switch (topic) {
        case TOPIC_HEART_BEAT:
            const heartBeatMsg = msg as HeartBeatMsg
            ClientRepoProvider.getClientRepo()
                .addOrUpdateClient(Client.fromHeartBeatMsg(heartBeatMsg))
            break
        default:
            throw new Error(`Unexpected topic: ${topic}`)
    }
}

main()
