// @ts-nocheck
import axiosInstance from "../utils/axiosInstance";
import {CONFIG} from "./config";

export default class GpsService {
    static async getGpsLocations(config) {
        const id = config.device_id;
        delete config.device_id;
        return await axiosInstance.get(CONFIG.front_url + 'gps/'+id, {params: config} );
    }
}
