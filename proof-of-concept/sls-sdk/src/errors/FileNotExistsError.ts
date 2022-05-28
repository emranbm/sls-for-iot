export class FileNotExistsError extends Error {
    constructor(){
        super("The file doesn't exist!")
    }
}