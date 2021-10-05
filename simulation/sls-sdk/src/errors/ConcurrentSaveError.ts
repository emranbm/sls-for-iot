export class ConcurrentSaveError extends Error {
    constructor() {
        super("Another save is already in progress!")
    }
}