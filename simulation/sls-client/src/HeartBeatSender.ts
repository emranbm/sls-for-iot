import { AsyncMqttClient } from "async-mqtt";
import * as diskusage from "diskusage"
import * as config from "./config.json"

export class HeartBeatSender {
    private client: AsyncMqttClient
    private clientId: string
    private isSending: boolean = false

    public static get HEART_BEAT_INTERVAL_MS() { return config.heartBeatInterval }
    public static get TOPIC_HEART_BEAT() { return "sls/manager/heart-bit" }

    constructor(client: AsyncMqttClient, clientId: string) {
        this.client = client
        this.clientId = clientId
    }

    public start() {
        setInterval(() => {
            if (this.isSending)
                return
            this.sendHeartBeat()
        }, HeartBeatSender.HEART_BEAT_INTERVAL_MS)
    }

    private async sendHeartBeat() {
        this.isSending = true
        const info = await diskusage.check('/')
        const msg: HeartBeatMsg = {
            clientId: this.clientId,
            freeBytes: info.available,
            totalBytes: info.total
        }
        await this.client.publish(HeartBeatSender.TOPIC_HEART_BEAT, JSON.stringify(msg))
        this.isSending = false
    }
}