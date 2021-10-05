type FindSaveHostResponseMsg = {
    requestId: string,
    canSave: boolean,
    description?: string,
    clientInfo?: ClientInfo
}
