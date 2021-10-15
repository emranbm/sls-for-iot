export interface IFileInfoRepository {
    addFile(ownerClientId: string, file: FileInfo): void;
    removeFile(ownerClientId: string, virtualPath: string): boolean;
    getFileInfos(ownerClientId: string): FileInfo[];
    hasFile(ownerClientId: string, virtualPath: string): boolean;
}