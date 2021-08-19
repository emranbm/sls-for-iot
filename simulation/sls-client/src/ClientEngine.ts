import { AsyncMqttClient } from "async-mqtt";
import * as diskusage from "diskusage"
import * as config from "./config.json"

export class ClientEngine {
    private mqttClient: AsyncMqttClient
    private clientId: string
    private isSending: boolean = false

    public static get HEART_BEAT_INTERVAL_MS() { return config.heartBeatInterval }
    public static get TOPIC_HEART_BEAT() { return "sls/manager/heart-bit" }
    public static get STORAGE_ROOT_DIRECTORY() { return config.storageRoot }

    constructor(mqttClient: AsyncMqttClient, clientId: string) {
        this.mqttClient = mqttClient
        this.clientId = clientId
    }

    public async start() {
        await this.mqttClient.subscribe(`sls/client/${this.clientId}`)
        this.mqttClient.on('message', this.onMessage.bind(this))
        setInterval(() => {
            if (this.isSending)
                return
            this.sendHeartBeat()
        }, ClientEngine.HEART_BEAT_INTERVAL_MS)
    }

    private async sendHeartBeat() {
        this.isSending = true
        const info = await diskusage.check(ClientEngine.STORAGE_ROOT_DIRECTORY)
        const msg: HeartBeatMsg = {
            clientId: this.clientId,
            freeBytes: info.available,
            totalBytes: info.total
        }
        await this.mqttClient.publish(ClientEngine.TOPIC_HEART_BEAT, JSON.stringify(msg))
        this.isSending = false
    }

    private onMessage(topic: string, message: Buffer) {
        console.log(`Message received from topic "${topic}"`)
        console.log(message.toString())
    }
}