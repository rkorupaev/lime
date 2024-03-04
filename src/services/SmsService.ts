// @ts-nocheck
import axiosInstance from "../utils/axiosInstance";
import {CONFIG} from "./config";

export interface GetSmsQuery {
    id: string,
    config: SmsQueryConfig
}

export interface SmsQueryConfig{
    device_id?: string,
    limit?: number,
    page?: number,
    id?: string,
    read?: string,
    type?: string,
    address?: string,
    date?: string,
}

interface SmsData {
    date: string;
    date_sent: string;
    body: string;
    read: boolean;
    address: string;
    service_center: string;
    status: number;
    subject: string;
    type: number;
    error_code: number;
    looked: boolean;
    protocol: number;
    seen: boolean;
    device_id: string;
    log_time: string;
    id: number;
}

export default class SmsService {
    static async getAddresses(config: GetSmsQuery): Promise<SmsData> {
        const id = config.id;
        delete config.id;
        return await axiosInstance.get(CONFIG.front_url + 'sms/'+ id + `/addresses`, {params: config});
    }

    static async getAddressSms(config: GetSmsQuery): Promise<SmsData> {
        const id = config.id;
        delete config.id;
        return await axiosInstance.get(CONFIG.front_url + 'sms/'+ id + `/addresses/sms-list`, {params: config});
    }
}


