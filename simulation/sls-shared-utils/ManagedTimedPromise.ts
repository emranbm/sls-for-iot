import { ManagedPromise } from "./ManagedPromise";
import { TimeoutError } from './TimeoutError';

export class ManagedTimedPromise<T> extends ManagedPromise<T> {
    private timeout: number
    private timeoutId: NodeJS.Timeout

    /**
     * 
     * @param timeout In milliseconds
     */
    constructor(timeout: number) {
        super()
        this.timeout = timeout
        this.timeoutId = setTimeout(this.onTimeout, this.timeout)
        this.then(this.clearTimeout, this.clearTimeout)
    }

    private clearTimeout(){
        clearTimeout(this.timeoutId)
    }

    private onTimeout() {
        if (!this.fulfilled)
            this.doReject(new TimeoutError(this.timeout))
    }
}