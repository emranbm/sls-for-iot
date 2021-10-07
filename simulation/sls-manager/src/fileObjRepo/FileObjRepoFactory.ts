import { IFileObjRepository } from "./IFileObjRepository"
import { InMemoryFileObjRepo } from './InMemoryFileObjRepo';

export class FileObjRepoFactory {
    private static i: IFileObjRepository
    public static get instance(): IFileObjRepository {
        if (!FileObjRepoFactory.i)
        FileObjRepoFactory.i = new InMemoryFileObjRepo()
        return FileObjRepoFactory.i
    }
}
