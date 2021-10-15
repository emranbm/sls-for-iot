import { ManagedPromise } from "sls-shared-utils";

type SaveAttemptInfo = {
    saveRequestId: string,
    file: FileObject,
    managedPromise: ManagedPromise<void>
}