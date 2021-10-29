type DeleteFileRequestMsg = RequestMsg & {
    clientId: string,
    virtualPath: string
}
