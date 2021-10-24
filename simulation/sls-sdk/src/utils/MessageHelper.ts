import { AsyncMqttClient } from "async-mqtt";

export class MessageHelper {
    private mqttClient: AsyncMqttClient
    private subscribedTopics: Map<string, Function> = new Map()
    private handlersThisArg: any

    constructor(mqttClient: AsyncMqttClient, handlersThisArg: any = null) {
        this.handlersThisArg = handlersThisArg ?? this
        this.mqttClient = mqttClient
        this.mqttClient.on('message', this.onMessage.bind(this))
    }

    public async sendMessage(topic: string, msg: any): Promise<void> {
        await this.mqttClient.publish(topic, JSON.stringify(msg))
    }

    public async subscribe(topic: string, handler: Function) {
        if (this.subscribedTopics.has(topic))
            throw Error("Already subscribed on this topic.")
        await this.mqttClient.subscribe(topic)
        this.subscribedTopics.set(topic, handler)
    }

    private async onMessage(topic: string, message: Buffer) {
        const handler = this.subscribedTopics.get(topic)
        if (!handler) {
            throw Error(`No handler found for topic ${topic}`)
            return
        }
        const msgStr = message.toString()
        const msg = JSON.parse(msgStr)
        handler.apply(this.handlersThisArg, [msg])
    }
}
