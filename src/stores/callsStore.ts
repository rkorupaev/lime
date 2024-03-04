// @ts-nocheck
import {makeAutoObservable, toJS} from "mobx";

class CallsStore {

    calls = [];

    selectedCallIndex: number | null = null;
    selectedCall: unknown | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setCalls(data) {
        this.calls = data;
    }

    setSelectedCallsIndex(index: number) {
    }

    _setSelectedContact(index: number) {
    }

    addCall(call) {
        this.calls.push(call);
    }

    deleteCall(id) {
        const copy = structuredClone(toJS(this.calls));
        const deletedCallIndex = copy.findIndex(call => call.call_id === id);
        copy[deletedCallIndex].deleted = true;
        this.calls = copy;
    }
}

export default new CallsStore();
