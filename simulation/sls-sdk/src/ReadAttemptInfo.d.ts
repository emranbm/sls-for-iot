import { ManagedPromise } from "./utils/ManagedPromise";

type ReadAttemptInfo = {
    readRequestId: string,
    virtualPath: string,
    managedPromise: ManagedPromise<string>
}
