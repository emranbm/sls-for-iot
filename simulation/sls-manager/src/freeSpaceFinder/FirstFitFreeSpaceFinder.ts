import { Client } from "../clientRepo/Client";
import { IClientRepository } from "../clientRepo/IClientRepository";
import { IFreeSpaceFinder } from "./IFreeSpaceFinder";

export class FirstFitFreeSpaceFinder implements IFreeSpaceFinder {
    findFreeClient(clientRepo: IClientRepository, neededBytes: number): Client {
        for (let c of clientRepo.getClients())
            if (c.freeBytes >= neededBytes)
                return c
        return null
    }

}