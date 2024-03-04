// @ts-nocheck
import {makeAutoObservable} from "mobx";

class AppStore {

    apps = [];
    appStatsDay = [];
    appStatsWeek = [];

    isLoading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    setApps(data) {
        this.apps = data;
    }

    setStatsDay(data) {
        this.appStatsDay = data;
    }

    setStatsWeek(data) {
        this.appStatsWeek = data;
    }

    setIsLoading(status: boolean) {
        this.isLoading = status;
    }

}

export default new AppStore();
