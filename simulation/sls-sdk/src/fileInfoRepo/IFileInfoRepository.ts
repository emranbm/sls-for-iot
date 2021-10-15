export interface IFileInfoRepository {
    addFile(ownerClientId: string, file: FileInfo): void;
    removeFile(ownerClientId: string, virtualPath: string): boolean;
    getFileInfos(ownerClientId: string): FileInfo[];
    getFileInfo(ownerClientId: string, virtualPath: string): FileInfo;
}