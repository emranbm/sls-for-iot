type ReadFileRequestMsg = RequestMsg & {
    clientId: string,
    virtualPath: string
}
