import { AsyncMqttClient } from "async-mqtt";
import { Client } from "./clientRepo/Client";
import { ClientRepoFactory } from "./clientRepo/ClientRepoFactory";
import { FreeSpaceFinderFactory } from "./freeSpaceFinder/FreeSpaceFinderFactory";
import { Topics, MessageUtils } from 'sls-shared-utils';

export class Engine {
    private mqttClient: AsyncMqttClient
    private messageUtils: MessageUtils

    constructor(mqttClient: AsyncMqttClient) {
        this.mqttClient = mqttClient
        this.messageUtils = new MessageUtils(mqttClient)
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
        ClientRepoFactory.instance.addOrUpdateClient(Client.fromHeartBeatMsg(msg))
    }

    private handleFindSaveHostRequest(msg: FindSaveHostRequestMsg): void {
        let freeClient = FreeSpaceFinderFactory.instance.findFreeClient(ClientRepoFactory.instance, msg.neededBytes)
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