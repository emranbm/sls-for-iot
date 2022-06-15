import { Client } from "../clientRepo/Client";
import { IClientRepository } from "../clientRepo/IClientRepository";
import { IFreeSpaceFinder } from "./IFreeSpaceFinder";

export class RandomFreeSpaceFinder implements IFreeSpaceFinder {
    findFreeClient(clientRepo: IClientRepository, neededBytes: number): Client {
        const availableClients = Array.from(clientRepo.getClients()).filter(c => c.freeBytes >= neededBytes)
        if (availableClients.length === 0)
            return null
        const clientIndex = Math.floor(Math.random() * availableClients.length)
        return availableClients[clientIndex]
    }
}