import * as MQTT from "async-mqtt"
import { AsyncMqttClient } from "async-mqtt";
import * as diskusage from "diskusage"
import { promises as fs } from 'fs'

const TOPIC_HEART_BEAT = "sls/manager/heart-bit"
const SUB_TOPIC_SAVE_RESPONSE = "save-response"
const SUB_TOPIC_SAVE = "save-response"
const HEART_BEAT_INTERVAL = 10000

export class SlsSdk {
    private mqttClient: AsyncMqttClient
    private clientId: string
    private isSending: boolean = false
    private baseTopic: string
    private brokerUrl: string
    private storageRoot: string

    constructor(brokerUrl: string, clientId: string, storageRoot: string = './storage/') {
        this.brokerUrl = brokerUrl
        this.clientId = clientId
        this.storageRoot = storageRoot
        this.baseTopic = `sls/client/${this.clientId}`
    }

    public async start() {
        console.log(`Connecting to broker at: ${this.brokerUrl}`)
        this.mqttClient = await MQTT.connectAsync(this.brokerUrl)
        await this.mqttClient.subscribe(this.baseTopic)
        await this.mqttClient.subscribe(`${this.baseTopic}/${SUB_TOPIC_SAVE_RESPONSE}`)
        this.mqttClient.on('message', this.onMessage.bind(this))
        setInterval(() => {
            if (this.isSending)
                return
            this.sendHeartBeat()
        }, HEART_BEAT_INTERVAL)
    }

    private async sendHeartBeat() {
        this.isSending = true
        const info = await diskusage.check(this.storageRoot)
        const msg: HeartBeatMsg = {
            clientId: this.clientId,
            freeBytes: info.available,
            totalBytes: info.total
        }
        await this.mqttClient.publish(TOPIC_HEART_BEAT, JSON.stringify(msg))
        this.isSending = false
    }

    private onMessage(topic: string, message: Buffer) {
        console.debug(`Message received from topic "${topic}"`)
        const msgStr = message.toString()
        console.debug(msgStr)
        const msg = JSON.parse(msgStr)
        switch (topic) {
            case `${this.baseTopic}/${SUB_TOPIC_SAVE_RESPONSE}`:
                this.handleSaveResponse(msg)
                break
            case `${this.baseTopic}/${SUB_TOPIC_SAVE}`:
                this.handleSave(msg)
                break
            default:
                throw new Error(`Unexpected topic: ${topic}`)
        }
    }

    public async sendMessageToClient(clientId: string, subTopic: string, msg: any): Promise<void> {
        await this.mqttClient.publish(`sls/client/${clientId}/${subTopic}`, JSON.stringify(msg))
    }

    private async handleSaveResponse(msg: SaveRequestResponseMsg) {
        if (!msg.canSave) {
            console.log("Can't save right now!")
            return
        }
        const saveMsg: SaveMsg = {
            clientId: this.clientId,
            file: { // TODO: Send a real file. Issue #1
                name: "my-file.data",
                content: "sample-data",
            }
        }
        await this.sendMessageToClient(msg.clientInfo.clientId, SUB_TOPIC_SAVE, saveMsg)
    }

    private async handleSave(msg: SaveMsg) {
        const clientDir = `${this.storageRoot}/${msg.clientId}`
        await fs.mkdir(clientDir, { recursive: true })
        await fs.writeFile(`${clientDir}/${msg.file.name}`, msg.file.content)
    }
}