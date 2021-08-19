import { Client } from "./Client";

export interface IClientRepostory {
    addOrUpdateClient(client: Client): void;
    getClient(id: string): Client | null;
    removeClient(id: string): boolean;
}
