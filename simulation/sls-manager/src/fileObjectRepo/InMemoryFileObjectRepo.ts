import { IFileObjectRepository } from "./IFileObjectRepository";

export class InMemoryFileObjectRepo implements IFileObjectRepository {
    private repo: Map<string, FileObject[]>

    addFile(clientId: string, file: FileObject): void {
        let files: FileObject[] = this.repo.get(clientId)
        if (!files)
            files = []
        files.push(file)
        this.repo.set(clientId, files)
    }
    removeFile(clientId: string, path: string): boolean {
        let files: FileObject[] = this.repo.get(clientId)
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
    getFileRecords(clientId: string): FileObject[] {
        return this.repo.get(clientId)
    }

}
