import {AxiosResponse} from 'axios'
import axiosInstance from '../utils/axiosInstance'
import {CONFIG} from './config'
import {ApiResponseWithCount, SortingColumn} from '../shared/types/sharedTypes'

interface GetAppsProps {
    device_id: string
    sort_by?: SortingColumn | null
    limit?: number
    page?: number
    app_name__like?: string
}

interface GetAppsStatsDayProps {
    device_id: string
    day: string
    'include-app-info'?: boolean
}

export interface GetAppDetailsProps {
    device_id: string
    package_name: string
}

export interface GetAppDetailsResponse {
    developer: string
    score: number
    title: string
    icon: string
    request_timestamp: string
    genre: string
}

export interface GetAppsStatsDayResponse {
    app_name: string | null
    package_name: string | null
    foreground_time: number
    id: string
    date: string
    device_date: string
    app_info: {
        package_name: string
        google_play_info: {
            title: string | null
            icon: string | null
            request_timestamp: string
        } | null
        apk_pure_info: {
            title: string | null
            icon: string | null
            request_timestamp: string
        } | null
    } | null
}

export interface GetAppsResponse {
    app_name: string
    version_name: string
    version_code: number
    package_name: string
    log_time: string
}

export interface GetAppDetailsResponse {
    title: string
    icon: string
    score: number
    genre: string
    request_date: string
}

export default class AppService {
    static async getAppsStatsDay(config: GetAppsStatsDayProps): Promise<AxiosResponse<GetAppsStatsDayResponse[]>> {
        const {device_id} = config
        return await axiosInstance.get(`${CONFIG.front_url}applications/${device_id}/statistics`, {params: config})
    }

    static async getAvailableDaysStats({device_id}: {device_id: string}): Promise<AxiosResponse<string[]>> {
        return await axiosInstance.get(`${CONFIG.front_url}applications/${device_id}/statistics/days`)
    }

    static async getAppsDetails(config: GetAppDetailsProps): Promise<AxiosResponse<GetAppDetailsResponse>> {
        const {device_id} = config
        return await axiosInstance.get(`${CONFIG.front_url}applications/${device_id}/details`, {params: config})
    }

    static async getApps(config: GetAppsProps): Promise<ApiResponseWithCount<GetAppsResponse[]>> {
        const {device_id, sort_by, page, limit, app_name__like} = config
        const params: {device_id: string; sort_by?: string; page?: number; limit?: number; app_name__like?: string} = {
            device_id,
        }
        if (sort_by) {
            sort_by.order === 'asc' ? (params.sort_by = `+${sort_by.name}`) : (params.sort_by = `-${sort_by.name}`)
        }
        if (app_name__like) {
            params.app_name__like = app_name__like
        }
        if (limit) {
            params.limit = limit
        }
        if (page) {
            params.page = page
        }

        const apiResponse = await axiosInstance.get(CONFIG.front_url + 'applications/' + device_id, {params})

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return {apiResponse: apiResponse.data, count: apiResponse.headers.get('x-total-count') || 0}
    }
}
