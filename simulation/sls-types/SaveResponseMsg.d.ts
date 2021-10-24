type SaveResponseMsg = RequestBoundMsg & {
    saved: boolean,
    description?: string
}
