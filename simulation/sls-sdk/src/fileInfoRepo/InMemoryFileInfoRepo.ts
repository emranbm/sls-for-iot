import { IFileInfoRepository } from "./IFileInfoRepository";

export class InMemoryFileInfoRepo implements IFileInfoRepository {
    private repo: Map<string, FileInfo[]> = new Map()

    addFile(ownerClientId: string, file: FileInfo): void {
        let files: FileInfo[] = this.repo.get(ownerClientId)
        if (!files)
            files = []
        files.push(file)
        this.repo.set(ownerClientId, files)
    }
    removeFile(ownerClientId: string, virtualPath: string): boolean {
        let files: FileInfo[] = this.repo.get(ownerClientId)
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
    getFileInfos(ownerClientId: string): FileInfo[] {
        return this.repo.get(ownerClientId) ?? []
    }
    getFileInfo(ownerClientId: string, virtualPath: string): FileInfo {
        for (const f of this.getFileInfos(ownerClientId))
            if (f.virtualPath === virtualPath)
                return f
        return null
    }
}
