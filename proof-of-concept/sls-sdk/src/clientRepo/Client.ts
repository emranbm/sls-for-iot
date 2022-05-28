export class Client {
    id: string;
    freeBytes?: number;
    totalBytes?: number;
    lastUpdated: Date;

    constructor(id: string, freeBytes?: number, totalBytes?: number, lastUpdated: Date = new Date()) {
        this.id = id
        this.freeBytes = freeBytes
        this.totalBytes = totalBytes
        this.lastUpdated = lastUpdated
    }

    get freeSpaceRatio() {
        return this.freeBytes / this.totalBytes
    }

    get usedSpaceRatio() {
        return 1 - this.freeSpaceRatio
    }

    static fromHeartBeatMsg(heartBeatMsg: HeartBeatMsg): Client {
        return new Client(heartBeatMsg.clientId, heartBeatMsg.freeBytes, heartBeatMsg.totalBytes)
    }
}
