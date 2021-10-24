import * as MQTT from "async-mqtt"
import { AsyncMqttClient } from "async-mqtt"
import * as diskusage from "diskusage"
import { promises as fs } from 'fs'
import { ConcurrentSaveError } from "./errors/ConcurrentSaveError"
import { SaveError } from "./errors/SaveError"
import { SdkNotStartedError } from './errors/SdkNotStartedError';
import logger, { setClientIdForLogs } from "./logger"
import { IFileInfoRepository } from './fileInfoRepo/IFileInfoRepository';
import { InMemoryFileInfoRepo } from './fileInfoRepo/InMemoryFileInfoRepo';
import { FileExistsError } from './errors/FileExistsError';
import { FileNotExistsError } from './errors/FileNotExistsError';
import { SaveAttemptInfo } from "./SaveAttemptInfo"
import { ReadAttemptInfo } from "./ReadAttemptInfo"
import { IClientRepository } from "./clientRepo/IClientRepository"
import { InMemoryClientRepo } from "./clientRepo/InMemoryClientRepo"
import { Client } from "./clientRepo/Client"
import { IFreeSpaceFinder } from "./freeSpaceFinder/IFreeSpaceFinder"
import { FirstFitFreeSpaceFinder } from "./freeSpaceFinder/FirstFitFreeSpaceFinder"
import { ArrayUtils } from "./utils/ArrayUtils"
import { ManagedTimedPromise } from "./utils/ManagedTimedPromise"
import { MessageHelper } from "./utils/MessageHelper"
import { ClientTopics, Topics } from "./utils/Topics"

const HEART_BEAT_INTERVAL = 10000
const SAVE_ATTEMPT_TIMEOUT = 10000
const READ_ATTEMPT_TIMEOUT = 10000

export class SlsSdk {
    private mqttClient: AsyncMqttClient = null
    private _clientId: string
    private isSending: boolean = false
    private brokerUrl: string
    private storageRoot: string
    private messageHelper: MessageHelper
    private clientTopics: ClientTopics
    private currentSaveAttempt: SaveAttemptInfo = null
    private currentReadAttempts: ReadAttemptInfo[] = []
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
        await this.messageHelper.subscribe(this.clientTopics.saveResponse, this.handleSaveResponse)
        await this.messageHelper.subscribe(this.clientTopics.read, this.handleReadRequest)
        await this.messageHelper.subscribe(this.clientTopics.readResponse, this.handleReadResponse)
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
        if (this.currentSaveAttempt !== null)
            throw new ConcurrentSaveError()
        for (const fileInfo of this.fileInfoRepo.getFileInfos(this.clientId))
            if (fileInfo.virtualPath === virtualPath)
                throw new FileExistsError()
        this.currentSaveAttempt = {
            saveRequestId: Math.random().toString(),
            file: {
                content,
                virtualPath,
            },
            managedPromise: new ManagedTimedPromise<void>(SAVE_ATTEMPT_TIMEOUT)
        }
        this.currentSaveAttempt.managedPromise.onFulfilled(() => this.currentSaveAttempt = null)
        const clientInfo = this.freeSpaceFinder.findFreeClient(this.clientRepo, Buffer.byteLength(content, 'utf-8'))
        if (!clientInfo)
            throw new SaveError("No free client found!")
        this.currentSaveAttempt.file.hostClientId = clientInfo.id
        const saveMsg: SaveRequestMsg = {
            requestId: this.currentSaveAttempt.saveRequestId,
            clientId: this.clientId,
            file: this.currentSaveAttempt.file
        }
        await this.messageHelper.sendMessage(Topics.client(clientInfo.id).save, saveMsg)
        return this.currentSaveAttempt.managedPromise.promise
    }

    public async readFile(virtualPath: string): Promise<string> {
        this.checkStarted()
        const fileInfo = this.fileInfoRepo.getFileInfo(this.clientId, virtualPath)
        if (!fileInfo)
            throw new FileNotExistsError()
        const readAttemptInfo: ReadAttemptInfo = {
            readRequestId: Math.random().toString(),
            virtualPath: virtualPath,
            managedPromise: new ManagedTimedPromise<string>(READ_ATTEMPT_TIMEOUT)
        }
        this.currentReadAttempts.push(readAttemptInfo)
        readAttemptInfo.managedPromise.onFulfilled(() => { ArrayUtils.remove(this.currentReadAttempts, readAttemptInfo) })
        const readReqestMsg: ReadFileRequestMsg = {
            clientId: this.clientId,
            requestId: readAttemptInfo.readRequestId,
            virtualPath: virtualPath
        }
        await this.messageHelper.sendMessage(Topics.client(fileInfo.hostClientId).read, readReqestMsg)
        return readAttemptInfo.managedPromise.promise
    }

    public async listFiles(): Promise<string[]> {
        this.checkStarted()
        throw new Error("Not implemented!")
    }

    public async deleteFile(virtualPath: string): Promise<void> {
        this.checkStarted()
        const fileInfo = this.fileInfoRepo.getFileInfo(this.clientId, virtualPath)
        if (! fileInfo)
            throw new FileNotExistsError()
        throw new Error("Not implemented!")
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
            requestId: msg.requestId,
            saved: true
        }
        await this.messageHelper.sendMessage(Topics.client(msg.clientId).saveResponse, respMsg)
    }

    private get anySaveAttemptInProgress(): boolean {
        return !!this.currentSaveAttempt
    }

    private async handleSaveResponse(msg: SaveResponseMsg) {
        if (!this.anySaveAttemptInProgress) {
            logger.warning("handleSaveResponse: A save response received, but no save attempt is in progress! It may be because of a late timed out response.")
            return
        }
        if (msg.requestId !== this.currentSaveAttempt?.saveRequestId) {
            logger.warning("handleSaveResponse: Save request id doesn't match the one waiting for. It may be because of a late timed out response.")
            return
        }
        if (msg.saved) {
            this.fileInfoRepo.addFile(this.clientId, this.currentSaveAttempt.file)
            this.currentSaveAttempt.managedPromise.doResolve()
        } else
            this.currentSaveAttempt.managedPromise.doReject(new SaveError(JSON.stringify(msg)))
    }

    private async handleReadRequest(msg: ReadFileRequestMsg) {
        const fileInfo = this.fileInfoRepo.getFileInfo(msg.clientId, msg.virtualPath)
        const respMsg: ReadFileResponseMsg = {
            clientId: this.clientId,
            requestId: msg.requestId,
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

    private async handleReadResponse(msg: ReadFileResponseMsg) {
        const readAttemptInfo = ArrayUtils.find(this.currentReadAttempts, i => i.readRequestId === msg.requestId)
        if (!readAttemptInfo) {
            logger.warning(`An orphaned read response received. Request ID: ${msg.requestId}`)
            return
        }
        if (!msg.file)
            readAttemptInfo.managedPromise.doReject(new FileNotExistsError())
        else
            readAttemptInfo.managedPromise.doResolve(msg.file.content)
    }
}