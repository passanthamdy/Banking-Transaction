
export class APIResponse<T>{

    constructor(instant?: Partial<APIResponse<T>>) {
        Object.assign(this, instant)
    }

    Status: number;
    Data: T;
   
}

