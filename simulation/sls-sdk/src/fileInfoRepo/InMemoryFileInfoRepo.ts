import { strict as assert } from 'assert'
import { IFileInfoRepository } from "./IFileInfoRepository";

export class InMemoryFileInfoRepo implements IFileInfoRepository {
    private repo: Map<string, FileInfo[]> = new Map()

    addFile(ownerClientId: string, file: FileInfo): void {
        const alreadyExistingFile = this.getFileInfo(ownerClientId, file.virtualPath)
        if (alreadyExistingFile) {
            assert.deepEqual(alreadyExistingFile, file)
            return
        }
        let files = this.getFileInfos(ownerClientId)
        files.push(file)
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
        let fileInfos = this.repo.get(ownerClientId)
        if (!fileInfos) {
            fileInfos = []
            this.repo.set(ownerClientId, fileInfos)
        }
        return fileInfos
    }
    getFileInfo(ownerClientId: string, virtualPath: string): FileInfo {
        for (const f of this.getFileInfos(ownerClientId))
            if (f.virtualPath === virtualPath)
                return f
        return null
    }
}
