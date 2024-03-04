import {AxiosResponse} from 'axios'
import axiosInstance from '../utils/axiosInstance'
import {CONFIG} from './config'
import {ApiResponseWithCountAndDate} from '../shared/types/sharedTypes'
import dayjs from 'dayjs'

export interface GetAppsNotificationProps {
    device_id: string
    port_time__from?: string
    port_time__till?: string
    app_name__ilike?: string
}

export interface GetAppsNotificationResponse {
    package_name: string
    app_name: string
    first_port_time: string
    last_port_time: string
    notify_count: number
}

export interface GetNotificationsProps {
    device_id: string
    limit?: number
    package_name?: string
    port_time__from?: string
    port_time__till?: string
    page?: number
}

export interface GetNotificationsResponse {
    package_name: string
    title: string
    content: string
    key: string
    port_time: string
    log_time: string
    id: number
}

export default class NotificationService {
    static async getAppsNotification(
        config: GetAppsNotificationProps
    ): Promise<ApiResponseWithCountAndDate<GetAppsNotificationResponse[]>> {
        const {device_id, port_time__from, port_time__till, app_name__ilike} = config
        const params: Partial<GetAppsNotificationProps> = {}

        if (port_time__from) {
            params.port_time__from = port_time__from
        }
        if (port_time__till) {
            params.port_time__till = port_time__from
        }
        if (app_name__ilike) {
            params.app_name__ilike = app_name__ilike
        }
        const res = await axiosInstance.get(`${CONFIG.front_url}notifications/${device_id}/apps`, {params})

        return {
            apiResponse: res.data,
            // @ts-ignore
            count: res.headers.get('x-total-count') || 0,
            // @ts-ignore
            'x-max-date-till': res.headers.get('x-max-date-till') || 0,
            // @ts-ignore
            'x-min-date-from': res.headers.get('x-min-date-from') || 0,
        }
    }

    static async getNotificationCount(config: GetAppsNotificationProps): Promise<AxiosResponse<{[T: string]: number}>> {
        const {device_id, port_time__from, port_time__till} = config
        const params: GetAppsNotificationProps = {
            device_id,
        }
        if (port_time__from) {
            params.port_time__from = port_time__from
        }
        if (port_time__till) {
            params.port_time__till = port_time__from
        }
        return await axiosInstance.get(`${CONFIG.front_url}notifications${device_id}/apps/count`, {params: config})
    }

    static async getNotifications(
        config: GetNotificationsProps
    ): Promise<ApiResponseWithCountAndDate<GetNotificationsResponse[]>> {
        const {device_id, port_time__from, port_time__till, limit, package_name, page} = config
        const params: GetNotificationsProps = {
            device_id,
        }
        if (limit) {
            params.limit = limit
        }
        if (package_name) {
            params.package_name = package_name
        }
        if (port_time__from) {
            params.port_time__from = dayjs(port_time__from).utc().toISOString()
        }
        if (port_time__till) {
            params.port_time__till = dayjs(port_time__till).utc().toISOString()
        }
        if (page) {
            params.page = page
        }

        const res = await axiosInstance.get(`${CONFIG.front_url}notifications/${device_id}`, {params: config})

        return {
            apiResponse: res.data,
            // @ts-ignore
            count: res.headers.get('x-total-count') || 0,
            // @ts-ignore
            'x-max-date-till': res.headers.get('x-max-date-till') || 0,
            // @ts-ignore
            'x-min-date-from': res.headers.get('x-min-date-from') || 0,
        }
    }
}
