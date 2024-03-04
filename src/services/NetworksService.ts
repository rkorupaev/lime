// @ts-nocheck
import axiosInstance from "../utils/axiosInstance";
import {CONFIG} from "./config";

export default class NetworksService {
    static async getNetworksList(config) {
        const id = config.device_id;
        delete config.device_id;

        return await axiosInstance.get(CONFIG.front_url + 'networks/packages/'+ id, {params: config});
    }

    static async getNetworkDetails(config) {
        const id = config.device_id;
        delete config.device_id;

        return await axiosInstance.get(CONFIG.front_url + 'networks/packages/'+ id + '/details', {params: config});
    }
}
