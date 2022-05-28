export class DeleteError extends Error {
    constructor(description?: string) {
        let msg = "Couldn't delete file!"
        if (description){
            msg += "\nDescription: "
            msg += description
        }
        super(msg)
    }
}
