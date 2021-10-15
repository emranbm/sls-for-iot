import { IFileInfoRepository } from "./IFileInfoRepository";

export class InMemoryFileInfoRepo implements IFileInfoRepository {
    private repo: Map<string, FileInfo[]> = new Map()

    addFile(clientId: string, file: FileInfo): void {
        let files: FileInfo[] = this.repo.get(clientId)
        if (!files)
            files = []
        files.push(file)
        this.repo.set(clientId, files)
    }
    removeFile(clientId: string, virtualPath: string): boolean {
        let files: FileInfo[] = this.repo.get(clientId)
        if (!files)
            return false
        const newFiles = []
        let removed = false
        for (let f of files)
            if (f.virtualPath !== virtualPath)
                newFiles.push(f)
            else
                removed = true
        return removed
    }
    getFileInfos(clientId: string): FileInfo[] {
        return this.repo.get(clientId)
    }

}
