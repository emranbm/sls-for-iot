import { AsyncMqttClient } from "async-mqtt";
import { Client } from "./clientRepo/Client";
import { Topics, MessageUtils, MqttSubscribeManager } from 'sls-shared-utils';
import { IClientRepository } from './clientRepo/IClientRepository';
import { InMemoryClientRepo } from './clientRepo/InMemoryClientRepo';
import { IFileInfoRepository } from './fileInfoRepo/IFileInfoRepository';
import { InMemoryFileInfoRepo } from './fileInfoRepo/InMemoryFileInfoRepo';
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
        const subscribeManager = new MqttSubscribeManager(this.mqttClient, this)
        await subscribeManager.subscribe(Topics.manager.heartBeat, this.handleHeartBeat)
        await subscribeManager.subscribe(Topics.manager.findSaveHostRequest, this.handleFindSaveHostRequest)
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