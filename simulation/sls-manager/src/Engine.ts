import { AsyncMqttClient } from "async-mqtt";
import { Client } from "./clientRepo/Client";
import { ClientRepoFactory } from "./clientRepo/ClientRepoFactory";
import { FreeSpaceFinderFactory } from "./freeSpaceFinder/FreeSpaceFinderFactory";

const TOPIC_HEART_BEAT = "sls/manager/heart-bit"
const TOPIC_SAVE_REQUEST = "sls/manager/save-request"

export class Engine {
    private mqttClient: AsyncMqttClient
    constructor(mqttClient: AsyncMqttClient) {
        this.mqttClient = mqttClient
    }

    public async start() {
        await this.mqttClient.subscribe(TOPIC_HEART_BEAT)
        await this.mqttClient.subscribe(TOPIC_SAVE_REQUEST)

        this.mqttClient.on("message", this.onMessage.bind(this))
    }

    private onMessage(topic: string, message: Buffer) {
        console.debug(`Message received from topic "${topic}"`)
        const msgStr = message.toString()
        console.debug(msgStr)
        const msg = JSON.parse(msgStr)
        switch (topic) {
            case TOPIC_HEART_BEAT:
                this.handleHeartBeat(msg)
                break
            case TOPIC_SAVE_REQUEST:
                this.handleSaveRequest(msg)
                break
            default:
                throw new Error(`Unexpected topic: ${topic}`)
        }
    }

    private handleHeartBeat(msg: HeartBeatMsg): void {
        ClientRepoFactory.instance.addOrUpdateClient(Client.fromHeartBeatMsg(msg))
    }

    private handleSaveRequest(msg: SaveRequestMsg): void {
        let freeClient = FreeSpaceFinderFactory.instance.findFreeClient(ClientRepoFactory.instance, msg.neededBytes)
        let respMsg: ClientInfoMsg = freeClient || { clientId: null, freeBytes: null, totalBytes: null }
        this.sendMessageToClient(msg.clientId, respMsg)
    }

    public async sendMessageToClient(clientId: string, msg: any): Promise<void> {
        await this.mqttClient.publish(`sls/client/${clientId}`, JSON.stringify(msg))
    }
}