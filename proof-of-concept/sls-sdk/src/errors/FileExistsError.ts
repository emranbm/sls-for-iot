import { SaveError } from "./SaveError";

export class FileExistsError extends SaveError {
    constructor(){
        super("The file already exists. To update an existing file, it should be deleted first.")
    }
}