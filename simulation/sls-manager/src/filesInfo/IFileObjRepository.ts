export interface IFileObjRepository {
    addFile(clientId: string, file: FileObj): void;
    removeFile(clientId: string, path: string): boolean;
    getFileRecords(clientId: string): FileObj[];
}