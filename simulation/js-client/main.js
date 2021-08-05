const MQTT = require("async-mqtt");

async function main() {
    const client = await MQTT.connectAsync("mqtt://localhost:1883")

    await client.subscribe('sls/general')

    client.on('message', onMessage)
}

function onMessage(topic, message){
    console.log(`Message received from topic "${topic}"`)
    console.log(message.toString())
}

main()
