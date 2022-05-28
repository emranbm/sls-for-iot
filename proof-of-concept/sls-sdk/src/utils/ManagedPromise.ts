/**
 * A specific Promise that can be resolved/rejected from the out of itself.
 */
export class ManagedPromise<T> {
    private _promise: Promise<T>
    private resolveFunc: (v: T) => void
    private rejectFunc: (e: any) => void
    private resolved: boolean = false
    private rejected: boolean = false
    private fulfilledWith: any

    constructor() {
        this._promise = new Promise((resolve, reject) => {
            this.resolveFunc = resolve
            this.rejectFunc = reject

            // Call the callback if the promise has fulfilled before.
            if (this.resolved)
                resolve(this.fulfilledWith)
            else if (this.rejected)
                reject(this.fulfilledWith)
        })
    }

    public get fulfilled(): boolean {
        return this.resolved || this.rejected
    }

    public doResolve(value: T = undefined): void {
        this.checkNotFulfilled()
        this.resolved = true
        this.fulfilledWith = value
        if (this.resolveFunc)
            this.resolveFunc(value)
    }

    public doReject(error: any = undefined): void {
        this.checkNotFulfilled()
        this.rejected = true
        this.fulfilledWith = error
        if (this.rejectFunc)
            this.rejectFunc(error)
    }

    public get promise(): Promise<T> {
        return this._promise
    }

    public then(onfulfilled, onrejected?) {
        return this.promise.then(onfulfilled, onrejected)
    }

    public catch(onrejected) {
        return this.promise.catch(onrejected)
    }

    public onFulfilled(callback) {
        return this.then(callback, callback)
    }

    private checkNotFulfilled(): void {
        if (this.fulfilled)
            throw new AlreadyFulfilledError()
    }
}

class AlreadyFulfilledError extends Error {
    constructor() {
        super("The promise is already fulfilled!")
    }
}
