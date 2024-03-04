import axiosInstance from '../utils/axiosInstance'
import {CONFIG} from './config'
import {ApiResponseWithCount, SortingColumn} from '../shared/types/sharedTypes'
import {AxiosResponse} from 'axios'

export interface GetFilesFilesProps {
    device_id: string
    limit: number
    page: number
    sort_by?: SortingColumn | null
}

export interface GetFilesResponse {
    id: number
    static_path: string
    log_time: string
    from_device: boolean
    source_path: string
    mime_type: string
    thumbnail: string
}

export default class FilesService {
    static async connectToDevice(device_id: string) {
        return await axiosInstance.post(`${CONFIG.front_url}connection/toggle/${device_id}`, {
            connect: true,
        })
    }

    static async getFiles(config: GetFilesFilesProps): Promise<ApiResponseWithCount<GetFilesResponse[]>> {
        const {device_id, sort_by, page, limit} = config

        const params: {device_id: string; sort_by?: string; page: number; limit: number} = {
            device_id,
            limit,
            page,
        }
        if (sort_by) {
            sort_by.order === 'asc' ? (params.sort_by = `+${sort_by.name}`) : (params.sort_by = `-${sort_by.name}`)
        }

        const apiResponse = await axiosInstance.get(`${CONFIG.front_url}files/`, {params})

        // @ts-ignore
        return {apiResponse: apiResponse.data, count: apiResponse.headers.get('x-total-count') || 0}
    }

    static async deleteFile(ids: number): Promise<AxiosResponse<number[]>> {
        return await axiosInstance.delete(`${CONFIG.front_url}files/`, {params: {ids}})
    }

    static async downloadFile(static_path: string): Promise<any> {
        const res = await axiosInstance.get(`${CONFIG.front_url}files/static/${static_path}`, {
            params: {static_path},
            responseType: 'blob',
        })
        // console.log(res.headers)

        return res
    }

    static async downloadThumbnail(thumbnail_uuid: string): Promise<any> {
        const res = await axiosInstance.get(`${CONFIG.front_url}files/thumbnail/${thumbnail_uuid}`, {
            params: {thumbnail_uuid},
            responseType: 'blob',
        })

        return res
    }
}
