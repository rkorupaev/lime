// @ts-nocheck
import {makeAutoObservable} from "mobx";

class SmsStore {

    addresses = [];
    sms = [];

    selectedAdressIndex: string | null = null;
    selectedAdress: unknown | null = null;

    isLoading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAddresses(data) {
        this.addresses = data;
    }

    setSms(data) {
        this.sms = data;
    }

    setSelectedAdressIndex(adress: string | null) {
        this.selectedAdressIndex = adress;
        this._setSelectedAdress(adress);
    }

    _setSelectedAdress(address: string | null) {
        if (!address) {
            this.selectedAdress = null;
        }
        else {
            this.selectedAdress = this.sms.find(item => item.address === address);
        }
    }

    setIsLoading(status){
        this.isLoading = status;
    }
}

export default new SmsStore();
