import { IClientRepository } from "./IClientRepository"
import { InMemoryClientRepo } from "./InMemoryClientRepo"

export class ClientRepoFactory {
    private static i: IClientRepository
    public static get instance(): IClientRepository {
        if (!ClientRepoFactory.i)
            ClientRepoFactory.i = new InMemoryClientRepo()
        return ClientRepoFactory.i
    }
}
