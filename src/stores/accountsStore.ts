// @ts-nocheck
import {makeAutoObservable} from "mobx";
import AccountsService from "../services/AccountsService";
import AppService from "../services/AppService";

class AccountsStore {

    accounts = [];

    isLoading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAccounts(data) {
        this.accounts = data;
    }

    getAccounts(config) {
        this.setIsLoading(true);
        return AccountsService.getAccounts(config).then((res) => {
            this.setAccounts(res.data);
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            this.setIsLoading(false);
        })
    }

    getAccountIcon(config){
        return AppService.getAppsDetails(config).then((res) => {
            console.log(res);
        })
    }

    setIsLoading(status: boolean) {
        this.isLoading = status;
    }

}

export default new AccountsStore();
