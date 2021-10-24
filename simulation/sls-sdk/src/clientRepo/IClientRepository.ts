import { Client } from "./Client";

export interface IClientRepository {
    addOrUpdateClient(client: Client): void;
    getClient(id: string): Client | null;
    getClients(): Iterable<Client>;
    removeClient(id: string): boolean;
}
