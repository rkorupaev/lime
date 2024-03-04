// @ts-nocheck
import {makeAutoObservable} from "mobx";
import GpsService from "../services/GpsService";

class GpsStore {

    locations = [];
    minDate = null;
    maxDate = null;
    count = 0;

    isLoading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    getLocations(config) {
        this.setIsLoading(true);

        return GpsService.getGpsLocations(config).then((res) => {
          this.setLocations(res.data);
          this.setMaxDate(res.headers['x-max-date-till']);
          this.setMinDate(res.headers['x-min-date-from']);
          this.setCount(res.headers['x-total-count']);
        }).catch((error)=> {
            console.log(error);
        }).finally(() => {
            this.setIsLoading(false);
        })
    }

    setLocations(data) {
        this.locations = data;
    }

    setMinDate(data) {
        this.minDate = data;
    }

    setMaxDate(data) {
        this.maxDate = data;
    }

    setCount(data) {
        this.count = data;
    }

    setIsLoading(status: boolean) {
        this.isLoading = status;
    }

}

export default new GpsStore();
