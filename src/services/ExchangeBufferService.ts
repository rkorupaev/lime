// @ts-nocheck
import axiosInstance from "../utils/axiosInstance";
import {CONFIG} from "./config";

// export interface CallsQueryConfig{
//     device_id?: string,
//     limit?: number,
//     page?: number,
//     id?: string,
//     call_id?: string,
//     address?: string,
//     type?: string,
//     duration?: string,
//     duration__gte?: string,
//     duration__lte?: string,
//     date?: string,
//     date__gte?: string,
//     date__lte?: string,
// }

interface ResData {
    date: string,
    text: string,
    log_time: string,
    is_file: boolean
}

export default class ExchangeBufferService {
    static async getOperations(config: unknown): Promise<ResData[]> {
        const id = config.device_id;
        delete config.device_id;
        return await axiosInstance.get(CONFIG.front_url + 'clipboards/'+ id, {params: config});
    }
}


