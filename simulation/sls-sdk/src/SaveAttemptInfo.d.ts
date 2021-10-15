type SaveAttemptInfo = {
    saveRequestId: string,
    file: FileObject,
    fulfilled: boolean,
    resolve?: Function,
    reject?: Function,
}