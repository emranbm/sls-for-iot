export class ClientTopics {
    private clientId: string
    constructor(clientId: string) {
        this.clientId = clientId
    }

    public get baseTopic() { return `sls/client/${this.clientId}` }
    public get save() { return `${this.baseTopic}/save` }
    public get saveResponse() { return `${this.baseTopic}/save-response` }
    public get findSaveHostResponse() { return `${this.baseTopic}/find-save-host-response` }
    public get read() { return `${this.baseTopic}/read` }
    public get readResponse() { return `${this.baseTopic}/read-response` }
}

export class ManagerTopics {
    public get baseTopic() { return "sls/manager" }
    public get heartBeat() { return `${this.baseTopic}/heart-bit` }
    public get findSaveHostRequest() { return `${this.baseTopic}/find-save-host-request` }
}

const managerTopics = new ManagerTopics()

export class Topics {
    public static client(clientId: string): ClientTopics { return new ClientTopics(clientId) }
    public static get manager(): ManagerTopics { return managerTopics }
}
