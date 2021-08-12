class ClientRepoProvider {
    private static repo: IClientRepostory
    static getClientRepo(): IClientRepostory {
        if (!this.repo)
            this.repo = new InMemoryClientRepo()
        return this.repo
    }
}