type SaveRequestAckMsg = {
    requestId: string,
    canSave: boolean,
    description?: string,
    clientInfo?: ClientInfo
}
