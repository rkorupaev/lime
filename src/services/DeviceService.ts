import axiosInstance from "../utils/axiosInstance";
import {Device} from "stores/deviceStore";

const BASE_AUTH_URL = '/api/front/v1/';

export interface DeviceQueryConfig{
    limit?: number,
    page?: number,
    id?: string,
    log_time?: string,
    log_time__gte?: string,
    log_time__lte?: string,
    android_version?: string,
}

export default class DeviceService {
    static async getDevices(config: DeviceQueryConfig): Promise<Device[]> {
        return await axiosInstance.get(BASE_AUTH_URL + 'device/', {params: config});
    }

    static async getChartData(config:any): Promise<[]> {
        const {id} = config;
        delete config.id;
        return await axiosInstance.get(BASE_AUTH_URL + 'device/battery/' + id, {params: config});
    }

    static async getGeoData(id: string): Promise<[]> {
        return await axiosInstance.get(BASE_AUTH_URL + 'gps/' + id);
    }
}
