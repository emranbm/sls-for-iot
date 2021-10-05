type SaveAttemptInfo = {
    saveRequestId: string,
    content: string,
    virtualPath: string,
    fulfilled: boolean,
    resolve?: Function,
    reject?: Function,
}