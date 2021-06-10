export enum ResultType{
    None,
    Error,
    Success
}

export class ArbitrageResultInfo {
    public message: string
    public type: ResultType

    constructor(message: string, type: ResultType) {
        this.message = message
        this.type = type
    }
}