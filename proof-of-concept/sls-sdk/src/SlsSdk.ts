import * as MQTT from "async-mqtt"
import { AsyncMqttClient } from "async-mqtt"
import * as diskusage from "diskusage"
import { promises as fs } from 'fs'
import { SaveError } from "./errors/SaveError"
import { SdkNotStartedError } from './errors/SdkNotStartedError';
import logger, { setClientIdForLogs } from "./logger"
import { IFileInfoRepository } from './fileInfoRepo/IFileInfoRepository';
import { InMemoryFileInfoRepo } from './fileInfoRepo/InMemoryFileInfoRepo';
import { FileExistsError } from './errors/FileExistsError';
import { FileNotExistsError } from './errors/FileNotExistsError';
import { IClientRepository } from "./clientRepo/IClientRepository"
import { InMemoryClientRepo } from "./clientRepo/InMemoryClientRepo"
import { Client } from "./clientRepo/Client"
import { IFreeSpaceFinder } from "./freeSpaceFinder/IFreeSpaceFinder"
import { FirstFitFreeSpaceFinder } from "./freeSpaceFinder/FirstFitFreeSpaceFinder"
import { MessageHelper } from "./utils/MessageHelper"
import { ClientTopics, Topics } from "./utils/Topics"
import { DeleteError } from './errors/DeleteError';

const HEART_BEAT_INTERVAL = 10000

export class SlsSdk {
    private mqttClient: AsyncMqttClient = null
    private _clientId: string
    private isSending: boolean = false
    private brokerUrl: string
    private storageRoot: string
    private messageHelper: MessageHelper
    private clientTopics: ClientTopics
    private fileInfoRepo: IFileInfoRepository
    private clientRepo: IClientRepository
    private freeSpaceFinder: IFreeSpaceFinder

    constructor(brokerUrl: string,
        clientId: string,
        storageRoot: string = './storage/',
        logLevel: string = "info",
        fileInfoRepo: IFileInfoRepository = new InMemoryFileInfoRepo(),
        clientRepo: IClientRepository = new InMemoryClientRepo(),
        freeSpaceFinder: IFreeSpaceFinder = new FirstFitFreeSpaceFinder(),
    ) {
        this.brokerUrl = brokerUrl
        this._clientId = clientId
        this.storageRoot = storageRoot
        this.clientTopics = Topics.client(clientId)
        logger.level = logLevel
        this.fileInfoRepo = fileInfoRepo
        this.clientRepo = clientRepo
        this.freeSpaceFinder = freeSpaceFinder
        setClientIdForLogs(clientId)
    }

    public get clientId() {
        return this._clientId
    }

    public async start() {
        logger.debug(`Connecting to broker at: ${this.brokerUrl}`)
        this.mqttClient = await MQTT.connectAsync(this.brokerUrl)
        this.messageHelper = new MessageHelper(this.mqttClient, this)
        await fs.mkdir(this.storageRoot, { recursive: true })
        await this.messageHelper.subscribe(Topics.general.heartBeat, this.handleHeartBeat)
        await this.messageHelper.subscribe(this.clientTopics.save, this.handleSaveRequest)
        await this.messageHelper.subscribe(this.clientTopics.saveResponse)
        await this.messageHelper.subscribe(this.clientTopics.read, this.handleReadRequest)
        await this.messageHelper.subscribe(this.clientTopics.readResponse)
        await this.messageHelper.subscribe(this.clientTopics.delete, this.handleDeleteRequest)
        await this.messageHelper.subscribe(this.clientTopics.deleteResponse)
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
        await this.mqttClient.publish(Topics.general.heartBeat, JSON.stringify(msg))
        this.isSending = false
    }

    public async saveFile(content: string, virtualPath: string): Promise<void> {
        this.checkStarted()
        for (const fileInfo of this.fileInfoRepo.getFileInfos(this.clientId))
            if (fileInfo.virtualPath === virtualPath)
                throw new FileExistsError()
        const clientInfo = this.freeSpaceFinder.findFreeClient(this.clientRepo, Buffer.byteLength(content, 'utf-8'))
        if (!clientInfo)
            throw new SaveError("No free client found!")
        const saveRequest: SaveRequestMsg = {
            requestId: Math.random().toString(),
            clientId: this.clientId,
            file: {
                content,
                virtualPath,
                hostClientId: clientInfo.id
            }
        }
        const response = <SaveResponseMsg>await this.messageHelper.sendRequest(Topics.client(clientInfo.id).save, saveRequest)
        if (response.saved) {
            this.fileInfoRepo.addFile(this.clientId, saveRequest.file)
        } else
            throw new SaveError(JSON.stringify(response))
    }

    public async readFile(virtualPath: string): Promise<string> {
        this.checkStarted()
        const fileInfo = this.fileInfoRepo.getFileInfo(this.clientId, virtualPath)
        if (!fileInfo)
            throw new FileNotExistsError()
        const readRequestMsg: ReadFileRequestMsg = {
            requestId: Math.random().toString(),
            clientId: this.clientId,
            virtualPath
        }
        const response = <ReadFileResponseMsg>await this.messageHelper.sendRequest(Topics.client(fileInfo.hostClientId).read, readRequestMsg)
        if (!response.file)
            throw new FileNotExistsError()
        else
            return response.file.content
    }

    public async listFiles(): Promise<string[]> {
        this.checkStarted()
        const fileInfos = this.fileInfoRepo.getFileInfos(this.clientId)
        const filePaths = fileInfos.map(f => f.virtualPath)
        return filePaths
    }

    public async deleteFile(virtualPath: string): Promise<void> {
        this.checkStarted()
        const fileInfo = this.fileInfoRepo.getFileInfo(this.clientId, virtualPath)
        if (!fileInfo)
            throw new FileNotExistsError()
        const deleteRequest: DeleteFileRequestMsg = {
            clientId: this.clientId,
            requestId: Math.random().toString(),
            virtualPath
        }
        const response = <DeleteFileResponseMsg>await this.messageHelper.sendRequest(Topics.client(fileInfo.hostClientId).delete, deleteRequest)
        if (!response.deleted)
            throw new DeleteError(response.description)
    }

    private handleHeartBeat(msg: HeartBeatMsg): void {
        this.clientRepo.addOrUpdateClient(Client.fromHeartBeatMsg(msg))
    }

    private getClientDir(clientId: string): string {
        return `${this.storageRoot}/${clientId}`
    }

    private async handleSaveRequest(msg: SaveRequestMsg) {
        const clientDir = this.getClientDir(msg.clientId)
        await fs.mkdir(clientDir, { recursive: true })
        await fs.writeFile(`${clientDir}/${msg.file.virtualPath}`, msg.file.content)
        this.fileInfoRepo.addFile(msg.clientId, msg.file)
        let respMsg: SaveResponseMsg = {
            clientId: this.clientId,
            responseId: msg.requestId,
            saved: true
        }
        await this.messageHelper.sendMessage(Topics.client(msg.clientId).saveResponse, respMsg)
    }

    private async handleReadRequest(msg: ReadFileRequestMsg) {
        const fileInfo = this.fileInfoRepo.getFileInfo(msg.clientId, msg.virtualPath)
        const respMsg: ReadFileResponseMsg = {
            clientId: this.clientId,
            responseId: msg.requestId,
            file: null
        }
        if (fileInfo) {
            const content = await fs.readFile(`${this.getClientDir(fileInfo.hostClientId)}/${fileInfo.virtualPath}`)
            respMsg.file = {
                ...fileInfo,
                content: content.toString()
            }
        }
        await this.messageHelper.sendMessage(Topics.client(msg.clientId).readResponse, respMsg)
    }

    private async handleDeleteRequest(msg: DeleteFileRequestMsg) {
        const fileInfo = this.fileInfoRepo.getFileInfo(msg.clientId, msg.virtualPath)
        const response: DeleteFileResponseMsg = {
            clientId: this.clientId,
            responseId: msg.requestId,
            deleted: null
        }
        if (fileInfo) {
            await fs.rm(`${this.getClientDir(this.clientId)}/${fileInfo.virtualPath}`)
            response.deleted = true
        } else {
            response.deleted = false
            response.description = "File not exists."
        }
        await this.messageHelper.sendMessage(Topics.client(msg.clientId).deleteResponse, response)
    }
}
