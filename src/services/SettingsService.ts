import {AxiosResponse} from 'axios'
import axiosInstance from '../utils/axiosInstance'
import {CONFIG} from './config'

export interface GetDeviceSettingsProps {
    device_id: string
}

export interface SetDeviceSettingsProps {
    device_id: string
    body: SetDeviceSettingsBody[]
}

export interface SetDeviceSettingsBody {
    work_type: number
    is_active: boolean
    period: number | null
}

export interface SyncStatus {
    command: number
    status: number
    log_time: string
}

export interface CameraType {
    camera_id: number
    type: number
}

type Connection = {
    connect: boolean
    period: number
    last_connect: string | null
}

type GPS = {
    longitude: number
    latitude: number
    date: string
    accuracy: string | null
    ip: string
    device_id: string
}

export type SIM = {
    card_id: number
    is_data_on: boolean | null
    is_data_roaming_on: boolean | null
    network_type: number | null
    display_name: string | null
}

export interface GetDeviceSettingsResponse {
    phone: string | null
    name: string | null
    id: string
    fingerprint: string | null
    android_version: string | null
    device: string | null
    manufacture: string | null
    build_id: string | null
    display: string | null
    user_key: string | null
    app_version: string | null
    log_time: string
    last_connection: string | null
    battery_state: string | null
    battery_lvl: string | null
    sync_status: SyncStatus[]
    switches: SetDeviceSettingsBody[]
    cameras: CameraType[]
    connection: Connection | null
    last_gps: GPS[]
    last_permissions: {name: string}[]
    sim_cards: SIM[]
    gps_on: boolean | null
    bluetooth_on: boolean | null
    wifi_on: boolean | null
    wifi_ssid: string | null
}

export interface PutDeviceNamesProps {
    device_id: string
    body: {phone: string; name: string}
}

export interface putConnectionTimeProps {
    device_id: string
    body: {period: number}
}

export interface putConnectionTimeResponse {
    connect: boolean
    period: number
    last_connect: string
    device_id: string
}

export default class SettingsService {
    static async getDeviceSettings(config: GetDeviceSettingsProps): Promise<AxiosResponse<GetDeviceSettingsResponse>> {
        const {device_id} = config
        return await axiosInstance.get(`${CONFIG.front_url}device/${device_id}`, {params: config})
    }

    static async setDeviceSettings(config: SetDeviceSettingsProps): Promise<AxiosResponse<GetDeviceSettingsResponse>> {
        const {device_id, body} = config
        return await axiosInstance.post(`${CONFIG.front_url}command/toggle/${device_id}`, body, {params: {device_id}})
    }

    static async putDeviceNames(config: PutDeviceNamesProps): Promise<AxiosResponse<string>> {
        const {device_id, body} = config
        return await axiosInstance.patch(`${CONFIG.front_url}device/${device_id}`, body, {params: {device_id}})
    }

    static async putConnectionTime(config: putConnectionTimeProps): Promise<AxiosResponse<putConnectionTimeResponse>> {
        const {device_id, body} = config
        return await axiosInstance.patch(`${CONFIG.front_url}connection/${device_id}`, body, {params: {device_id}})
    }
}
