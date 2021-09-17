export class SdkNotStartedError extends Error {
    constructor(){
        super("Sdk is not started yet! Try to start it first.")
    }
}
