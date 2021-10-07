import { AsyncMqttClient } from "async-mqtt";
import { Client } from "./clientRepo/Client";
import { Topics, MessageUtils } from 'sls-shared-utils';
import { IClientRepository } from './clientRepo/IClientRepository';
import { InMemoryClientRepo } from './clientRepo/InMemoryClientRepo';
import { IFileInfoRepository } from './fileObjectRepo/IFileInfoRepository';
import { InMemoryFileInfoRepo } from './fileObjectRepo/InMemoryFileInfoRepo';
import { IFreeSpaceFinder } from './freeSpaceFinder/IFreeSpaceFinder';
import { FirstFitFreeSpaceFinder } from './freeSpaceFinder/FirstFitFreeSpaceFinder';

export class Engine {
    private mqttClient: AsyncMqttClient
    private messageUtils: MessageUtils
    private clientRepo: IClientRepository
    private freeSpaceFinder: IFreeSpaceFinder
    private fileInfoRepo: IFileInfoRepository

    constructor(mqttClient: AsyncMqttClient,
        clientRepo: IClientRepository = new InMemoryClientRepo(),
        freeSpaceFinder: IFreeSpaceFinder = new FirstFitFreeSpaceFinder(),
        fileInfoRepo: IFileInfoRepository = new InMemoryFileInfoRepo) {
        this.mqttClient = mqttClient
        this.messageUtils = new MessageUtils(mqttClient)
        this.clientRepo = clientRepo
        this.freeSpaceFinder = freeSpaceFinder
        this.fileInfoRepo = fileInfoRepo
    }

    public async start() {
        await this.mqttClient.subscribe(Topics.manager.heartBeat)
        await this.mqttClient.subscribe(Topics.manager.findSaveHostRequest)
        this.mqttClient.on("message", this.onMessage.bind(this))
    }

    private onMessage(topic: string, message: Buffer) {
        console.debug(`Message received on topic "${topic}"`)
        const msgStr = message.toString()
        console.debug(msgStr)
        const msg = JSON.parse(msgStr)
        switch (topic) {
            case Topics.manager.heartBeat:
                this.handleHeartBeat(msg)
                break
            case Topics.manager.findSaveHostRequest:
                this.handleFindSaveHostRequest(msg)
                break
            default:
                throw new Error(`Unexpected topic: ${topic}`)
        }
    }

    private handleHeartBeat(msg: HeartBeatMsg): void {
        this.clientRepo.addOrUpdateClient(Client.fromHeartBeatMsg(msg))
    }

    private handleFindSaveHostRequest(msg: FindSaveHostRequestMsg): void {
        let freeClient = this.freeSpaceFinder.findFreeClient(this.clientRepo, msg.neededBytes)
        let respMsg: FindSaveHostResponseMsg = {
            requestId: msg.requestId,
            canSave: !!freeClient,
            clientInfo: freeClient ? {
                clientId: freeClient.id,
                freeBytes: freeClient.freeBytes,
                totalBytes: freeClient.totalBytes
            } : null,
            description: freeClient ? undefined : "No free client found."
        }
        this.messageUtils.sendMessage(Topics.client(msg.clientId).findSaveHostResponse, respMsg)
    }
}