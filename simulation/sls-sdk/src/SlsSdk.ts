import * as MQTT from "async-mqtt"
import { AsyncMqttClient } from "async-mqtt"
import * as diskusage from "diskusage"
import { promises as fs } from 'fs'
import { MessageUtils, Topics } from 'sls-shared-utils'
import { ClientTopics } from 'sls-shared-utils/Topics';

const HEART_BEAT_INTERVAL = 10000

export class SlsSdk {
    private mqttClient: AsyncMqttClient
    private clientId: string
    private isSending: boolean = false
    private brokerUrl: string
    private storageRoot: string
    private messageUtils: MessageUtils
    private clientTopics: ClientTopics

    constructor(brokerUrl: string, clientId: string, storageRoot: string = './storage/') {
        this.brokerUrl = brokerUrl
        this.clientId = clientId
        this.storageRoot = storageRoot
        this.clientTopics = Topics.client(clientId)
    }

    public async start() {
        console.log(`Connecting to broker at: ${this.brokerUrl}`)
        this.mqttClient = await MQTT.connectAsync(this.brokerUrl)
        this.messageUtils = new MessageUtils(this.mqttClient)
        await this.mqttClient.subscribe(this.clientTopics.baseTopic)
        await this.mqttClient.subscribe(this.clientTopics.saveResponse)
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
        await this.mqttClient.publish(Topics.manager.heartBeat, JSON.stringify(msg))
        this.isSending = false
    }

    public async saveFile(content: string, virtualPath: string): Promise<void> {
        throw new Error("Not implemented!")
    }

    public async readFile(virtualPath: string): Promise<string> {
        throw new Error("Not implemented!")
    }

    public async listFiles(): Promise<string[]> {
        throw new Error("Not implemented!")
    }

    public async deleteFile(virtualPath: string): Promise<void> {
        throw new Error("Not implemented!")
    }

    private onMessage(topic: string, message: Buffer) {
        console.debug(`Message received from topic "${topic}"`)
        const msgStr = message.toString()
        console.debug(msgStr)
        const msg = JSON.parse(msgStr)
        switch (topic) {
            case this.clientTopics.saveResponse:
                this.handleSaveResponse(msg)
                break
            case this.clientTopics.save:
                this.handleSave(msg)
                break
            default:
                throw new Error(`Unexpected topic: ${topic}`)
        }
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
        await this.messageUtils.sendMessage(Topics.client(msg.clientInfo.clientId).save, saveMsg)
    }

    private async handleSave(msg: SaveMsg) {
        const clientDir = `${this.storageRoot}/${msg.clientId}`
        await fs.mkdir(clientDir, { recursive: true })
        await fs.writeFile(`${clientDir}/${msg.file.name}`, msg.file.content)
    }
}