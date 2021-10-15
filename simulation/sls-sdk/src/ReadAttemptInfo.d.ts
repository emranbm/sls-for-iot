import { ManagedPromise } from "sls-shared-utils";

type ReadAttemptInfo = {
    readRequestId: string,
    virtualPath: string,
    managedPromise: ManagedPromise<string>
}
