import { AsyncMqttClient } from "async-mqtt";
import { ManagedTimedPromise } from './ManagedTimedPromise';

const REQUEST_TIMEOUT = 10000

export class MessageHelper {
    private mqttClient: AsyncMqttClient
    private subscribedTopics: Map<string, Function> = new Map()
    private handlersThisArg: any
    private pendingRequestPromises: Map<string, ManagedTimedPromise<ResponseMsg>> = new Map()

    constructor(mqttClient: AsyncMqttClient, handlersThisArg: any = null) {
        this.handlersThisArg = handlersThisArg ?? this
        this.mqttClient = mqttClient
        this.mqttClient.on('message', this.onMessage.bind(this))
    }

    public async sendRequest(topic: string, request: RequestMsg): Promise<ResponseMsg> {
        const managedPromise = new ManagedTimedPromise<ResponseMsg>(REQUEST_TIMEOUT)
        this.pendingRequestPromises.set(request.requestId, managedPromise)
        managedPromise.onFulfilled(() => this.pendingRequestPromises.delete(request.requestId))
        await this.sendMessage(topic, request)
        return managedPromise.promise
    }

    public async sendMessage(topic: string, msg: any): Promise<void> {
        await this.mqttClient.publish(topic, JSON.stringify(msg))
    }

    public async subscribe(topic: string, handler?: Function) {
        if (handler) {
            if (this.subscribedTopics.has(topic))
                throw Error("Already subscribed a handler on this topic.")
            else
                this.subscribedTopics.set(topic, handler)
        }
        await this.mqttClient.subscribe(topic)
    }

    private async onMessage(topic: string, message: Buffer) {
        const msgStr = message.toString()
        const msg = JSON.parse(msgStr)
        if (msg.responseId) {
            const requestPromise = this.pendingRequestPromises.get(msg.responseId)
            if (requestPromise) {
                requestPromise.doResolve(msg)
                return
            }
        }

        const handler = this.subscribedTopics.get(topic)
        if (!handler) {
            throw Error(`No handler found for topic ${topic}`)
            return
        }
        handler.apply(this.handlersThisArg, [msg])
    }
}
