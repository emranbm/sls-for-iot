type DeleteFileResponseMsg = ResponseMsg & {
    clientId: string,
    deleted: boolean,
    description?: string
}
