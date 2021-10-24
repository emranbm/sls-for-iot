import { AsyncMqttClient } from "async-mqtt";

export class MessageHelper {
    private mqttClient: AsyncMqttClient

    constructor(mqttClient: AsyncMqttClient) {
        this.mqttClient = mqttClient
    }

    public async sendMessage(topic: string, msg: any): Promise<void> {
        await this.mqttClient.publish(topic, JSON.stringify(msg))
    }
}
