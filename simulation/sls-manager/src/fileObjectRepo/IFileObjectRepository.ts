export interface IFileObjectRepository {
    addFile(clientId: string, file: FileObject): void;
    removeFile(clientId: string, path: string): boolean;
    getFileRecords(clientId: string): FileObject[];
}