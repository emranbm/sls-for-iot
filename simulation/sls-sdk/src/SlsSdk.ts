import * as MQTT from "async-mqtt"
import { AsyncMqttClient } from "async-mqtt"
import * as diskusage from "diskusage"
import { promises as fs } from 'fs'
import { MessageUtils, Topics } from 'sls-shared-utils'
import { ClientTopics } from 'sls-shared-utils/Topics';
import { ConcurrentSaveError } from "./errors/ConcurrentSaveError"
import { SaveError } from "./errors/SaveError"
import { SdkNotStartedError } from './errors/SdkNotStartedError';
import { TimeoutError } from "./errors/TimeoutError"

const HEART_BEAT_INTERVAL = 10000
const SAVE_ATTEMPT_TIMEOUT = 10000

export class SlsSdk {
    private mqttClient: AsyncMqttClient = null
    private clientId: string
    private isSending: boolean = false
    private brokerUrl: string
    private storageRoot: string
    private messageUtils: MessageUtils
    private clientTopics: ClientTopics
    private currentSaveAttempt: SaveAttemptInfo = null

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
        await fs.mkdir(this.storageRoot, { recursive: true })
        await this.mqttClient.subscribe(this.clientTopics.baseTopic)
        await this.mqttClient.subscribe(this.clientTopics.findSaveHostResponse)
        await this.mqttClient.subscribe(this.clientTopics.saveResponse)
        this.mqttClient.on('message', this.onMessage.bind(this))
        await this.sendHeartBeat()
        setInterval(() => {
            if (this.isSending)
                return
            this.sendHeartBeat()
        }, HEART_BEAT_INTERVAL)
    }

    public get isStarted() {
        return this.mqttClient !== null
    }

    private checkStarted() {
        if (!this.isStarted)
            throw new SdkNotStartedError()
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
        this.checkStarted()
        if (this.currentSaveAttempt !== null)
            throw new ConcurrentSaveError()
        this.currentSaveAttempt = {
            saveRequestId: Math.random().toString(),
            content,
            virtualPath,
            fulfilled: false
        }
        let msg: FindSaveHostRequestMsg = {
            clientId: this.clientId,
            neededBytes: Buffer.byteLength(content, 'utf-8'),
            requestId: this.currentSaveAttempt.saveRequestId
        }
        await this.messageUtils.sendMessage(Topics.manager.findSaveHostRequest, msg)
        return new Promise<void>((resolve, reject) => {
            this.currentSaveAttempt.resolve = resolve
            this.currentSaveAttempt.reject = reject
            setTimeout(() => {
                if (this.currentSaveAttempt !== null && !this.currentSaveAttempt.fulfilled) {
                    this.currentSaveAttempt.reject(new TimeoutError(SAVE_ATTEMPT_TIMEOUT))
                    this.currentSaveAttempt = null
                }
            }, SAVE_ATTEMPT_TIMEOUT);
        })
    }

    public async readFile(virtualPath: string): Promise<string> {
        this.checkStarted()
        throw new Error("Not implemented!")
    }

    public async listFiles(): Promise<string[]> {
        this.checkStarted()
        throw new Error("Not implemented!")
    }

    public async deleteFile(virtualPath: string): Promise<void> {
        this.checkStarted()
        throw new Error("Not implemented!")
    }

    private onMessage(topic: string, message: Buffer) {
        console.debug(`Message received on topic "${topic}"`)
        const msgStr = message.toString()
        console.debug(msgStr)
        const msg = JSON.parse(msgStr)
        switch (topic) {
            case this.clientTopics.findSaveHostResponse:
                this.handleFindSaveHostResponse(msg)
                break
            case this.clientTopics.save:
                this.handleSaveRequest(msg)
                break
            case this.clientTopics.saveResponse:
                this.handleSaveResponse(msg)
                break
            default:
                throw new Error(`Unexpected topic: ${topic}`)
        }
    }

    private async handleFindSaveHostResponse(msg: FindSaveHostResponseMsg) {
        if (!msg.canSave) {
            this.currentSaveAttempt.reject(new SaveError(msg.description))
            return
        }
        const saveMsg: SaveRequestMsg = {
            requestId: msg.requestId,
            clientId: this.clientId,
            file: {
                name: this.currentSaveAttempt.virtualPath,
                content: this.currentSaveAttempt.content,
            }
        }
        await this.messageUtils.sendMessage(Topics.client(msg.clientInfo.clientId).save, saveMsg)
    }

    private async handleSaveRequest(msg: SaveRequestMsg) {
        const clientDir = `${this.storageRoot}/${msg.clientId}`
        await fs.mkdir(clientDir, { recursive: true })
        await fs.writeFile(`${clientDir}/${msg.file.name}`, msg.file.content)
        let respMsg: SaveResponseMsg = {
            requestId: msg.requestId,
            saved: true
        }
        await this.messageUtils.sendMessage(Topics.client(msg.clientId).saveResponse, respMsg)
    }

    private async handleSaveResponse(msg: SaveResponseMsg) {
        if (msg.saved)
            this.currentSaveAttempt.resolve()
        else
            this.currentSaveAttempt.reject(new SaveError(JSON.stringify(msg)))
        this.currentSaveAttempt = null
    }
}