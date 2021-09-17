export class ClientTopics {
    private clientId: string
    constructor(clientId: string) {
        this.clientId = clientId
    }

    public get baseTopic() { return `sls/client/${this.clientId}` }
    public get save() { return `${this.baseTopic}/save` }
    public get saveResponse() { return `${this.baseTopic}/save-response` }
}

export class ManagerTopics {
    public get baseTopic() { return "sls/manager" }
    public get heartBeat() { return `${this.baseTopic}/heart-bit` }
    public get saveRequest() { return `${this.baseTopic}/save-request` }
}

const managerTopics = new ManagerTopics()

export class Topics {
    public static client(clientId: string): ClientTopics { return new ClientTopics(clientId) }
    public static get manager(): ManagerTopics { return managerTopics }
}