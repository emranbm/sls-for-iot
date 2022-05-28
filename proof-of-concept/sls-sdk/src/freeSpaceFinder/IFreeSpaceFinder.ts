import { Client } from "../clientRepo/Client";
import { IClientRepository } from "../clientRepo/IClientRepository";

export interface IFreeSpaceFinder{
    findFreeClient(clientRepo: IClientRepository, neededBytes: number): Client | null;
}