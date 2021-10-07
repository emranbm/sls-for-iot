import { IFileObjRepository } from "./IFileObjRepository";

export class InMemoryFileObjRepo implements IFileObjRepository {
    private repo: Map<string, FileObj[]>

    addFile(clientId: string, file: FileObj): void {
        let files: FileObj[] = this.repo.get(clientId)
        if (!files)
            files = []
        files.push(file)
        this.repo.set(clientId, files)
    }
    removeFile(clientId: string, path: string): boolean {
        let files: FileObj[] = this.repo.get(clientId)
        if (!files)
            return false
        const newFiles = []
        let removed = false
        for (let f of files)
            if (f.name !== path)
                newFiles.push(f)
            else
                removed = true
        return removed
    }
    getFileRecords(clientId: string): FileObj[] {
        return this.repo.get(clientId)
    }

}
