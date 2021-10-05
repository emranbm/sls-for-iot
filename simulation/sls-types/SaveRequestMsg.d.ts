type SaveRequestMsg = {
    requestId: string,
    clientId: string,
    file: FileObj
}

type FileObj = {
    name: string,
    content: string,
    expireAt?: Date
}
