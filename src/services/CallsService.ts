// @ts-nocheck
import axiosInstance from "../utils/axiosInstance";
import {CONFIG} from "./config";

export interface CallsQueryConfig{
    device_id?: string,
    limit?: number,
    page?: number,
    id?: string,
    call_id?: string,
    address?: string,
    type?: string,
    duration?: string,
    duration__gte?: string,
    duration__lte?: string,
    date?: string,
    date__gte?: string,
    date__lte?: string,
}

interface CallData {
    call_id: number;
    type: number;
    block_reason: number;
    missed_reason: number;
    duration: number;
    name: string;
    number_type: string;
    address: string;
    date: string;
    last_modified: string;
    call_screening_app_name: string;
    geocoded_location: string;
    via_number: string;
    device_id: string;
    log_time: string;
}

export default class CallsService {
    static async getCalls(config: CallsQueryConfig): Promise<CallData> {
        const id = config.device_id;
        delete config.device_id;
        return await axiosInstance.get(CONFIG.front_url + 'call/'+ id, {params: config});
    }
}


