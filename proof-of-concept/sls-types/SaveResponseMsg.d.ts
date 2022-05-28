type SaveResponseMsg = ResponseMsg & {
    clientId: string,
    saved: boolean,
    description?: string
}
