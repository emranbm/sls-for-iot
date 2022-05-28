export class ClientTopics {
    private clientId: string
    constructor(clientId: string) {
        this.clientId = clientId
    }

    public get baseTopic() { return `sls/client/${this.clientId}` }
    public get save() { return `${this.baseTopic}/save` }
    public get saveResponse() { return `${this.baseTopic}/save-response` }
    public get read() { return `${this.baseTopic}/read` }
    public get readResponse() { return `${this.baseTopic}/read-response` }
    public get delete() { return `${this.baseTopic}/delete` }
    public get deleteResponse() { return `${this.baseTopic}/delete-response` }
}

export class GeneralTopics {
    public get baseTopic() { return "sls/general" }
    public get heartBeat() { return `${this.baseTopic}/heart-bit` }
}

const generalTopics = new GeneralTopics()

export class Topics {
    public static client(clientId: string): ClientTopics { return new ClientTopics(clientId) }
    public static get general(): GeneralTopics { return generalTopics }
}
