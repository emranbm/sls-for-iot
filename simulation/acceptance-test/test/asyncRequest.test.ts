import * as MQTT from "async-mqtt"
import * as assert from "assert";
import { MessageHelper } from 'sls-sdk/src/utils/MessageHelper';
import { Utils } from './Utils';


describe("Async request", function () {
    describe("MessageHelper", function () {
        it("should return response as promise", async function () {
            const mqttClient = await MQTT.connectAsync(Utils.BROKER_URL)
            const messageHelper = new MessageHelper(mqttClient)
            messageHelper.subscribe('some/topic', () => { })
            const request: RequestMsg = { requestId: "1" }
            const requestPromise = messageHelper.sendRequest("some/topic", request)
            const response: ResponseMsg = { responseId: "1" }
            await messageHelper.sendMessage("some/topic", response)
            const receivedResponse = await requestPromise
            assert.equal(receivedResponse.responseId, "1")
        })
    })
})
