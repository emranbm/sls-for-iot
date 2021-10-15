export interface IFileInfoRepository {
    addFile(clientId: string, file: FileInfo): void;
    removeFile(clientId: string, virtualPath: string): boolean;
    getFileInfos(clientId: string): FileInfo[];
}