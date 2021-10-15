export interface IFileInfoRepository {
    addFile(clientId: string, file: FileInfo): void;
    removeFile(clientId: string, path: string): boolean;
    getFileInfos(clientId: string): FileInfo[];
}