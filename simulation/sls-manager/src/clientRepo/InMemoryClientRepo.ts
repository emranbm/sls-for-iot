class InMemoryClientRepo implements IClientRepostory {
    private repo: Map<string, Client> = new Map()

    addOrUpdateClient(client: Client): void {
        this.repo.set(client.id, client)
    }
    getClient(id: string): Client {
        return this.repo.get(id)
    }
    removeClient(id: string): boolean {
        return this.repo.delete(id)
    }

}