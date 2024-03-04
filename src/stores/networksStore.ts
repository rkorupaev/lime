// @ts-nocheck
import {makeAutoObservable} from "mobx";
import NetworksService from "../services/NetworksService";

class NetworksStore {

    networks = [];
    currentNetworkData = null;
    currentNetworkIndex = null;
    isLoading = false;
    totalCount = null;

    constructor() {
        makeAutoObservable(this);
    }

    setNetworks(data, initial) {
        if (initial) {
            this.networks = data;
        } else {
            const copy = [...this.networks, ...data];
            this.networks = copy;
        }
    }

    setCurrentNetworkIndex(index) {
        this.currentNetworkIndex = index;
    }

    getCurrentNetworkData(config) {
        this.setIsLoading(true);
        NetworksService.getNetworkDetails(config).then((res) => {
            this.setCurrentNetworkData(res.data);
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
           this.setIsLoading(false);
        });
    }

    setCurrentNetworkData(data) {
        this.currentNetworkData = data;
    }

    setIsLoading(status) {
        this.isLoading = status;
    }

    setTotalCount(count) {
        this.totalCount = count;
    }
}

export default new NetworksStore();
