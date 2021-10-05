export class SaveError extends Error {
    constructor(description?: string) {
        let msg = "File not saved!"
        if (description){
            msg += "\nDescription: "
            msg += description
        }
        super(msg)
    }
}