export class TimeoutError extends Error{
    constructor(waitedMS?: number){
        let msg = "Timed out waiting"
        if (waitedMS)
            msg += ` for ${waitedMS} milliseconds`
        super(msg)
    }
}