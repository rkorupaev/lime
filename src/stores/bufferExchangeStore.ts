// @ts-nocheck
import {makeAutoObservable} from "mobx";

interface Operation {
    date: string,
    text: string,
    log_time: string,
    is_file: boolean
}


class BufferExchangeStore {

    operations: Operation[] = [];
    isLoading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    setOperations(data: Operation[]) {
        this.operations = data;
    }

    setIsLoading(status: boolean) {
        this.isLoading = status;
    }

}

export default new BufferExchangeStore();
