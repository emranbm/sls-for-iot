type SaveAttemptInfo = {
    saveRequestId: string,
    content: string,
    virtualPath: string,
    resolve?: Function,
    reject?: Function
}