import { IFileObjectRepository } from "./IFileObjectRepository"
import { InMemoryFileObjectRepo } from './InMemoryFileObjectRepo';

export class FileObjectRepoFactory {
    private static i: IFileObjectRepository
    public static get instance(): IFileObjectRepository {
        if (!FileObjectRepoFactory.i)
        FileObjectRepoFactory.i = new InMemoryFileObjectRepo()
        return FileObjectRepoFactory.i
    }
}
