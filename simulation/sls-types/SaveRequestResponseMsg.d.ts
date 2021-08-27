type SaveRequestResponseMsg = {
    canSave: boolean,
    clientInfo?: ClientInfo
}

type ClientInfo = {
    clientId: string,
    freeBytes?: number,
    totalBytes?: number,
}
