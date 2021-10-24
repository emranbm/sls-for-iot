import { ManagedPromise } from "./utils/ManagedPromise";

type SaveAttemptInfo = {
    saveRequestId: string,
    file: FileObject,
    managedPromise: ManagedPromise<void>
}