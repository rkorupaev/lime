/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import axiosInstance from '../utils/axiosInstance'
import {CONFIG} from './config'

export default class MicroFilesService {
    static async getMicroFiles(config) {
        return await axiosInstance.get(`${CONFIG.front_url}files/microphone/`, {params: config})
    }

    static async downloadMicroFile(config) {
        const {id} = config;
        delete config.id;
        return await axiosInstance.get(`${CONFIG.front_url}files/microphone/` + id, {params: config, responseType: 'blob'})
    }

    static async deleteMicroFile(config) {
        return await axiosInstance.delete(`${CONFIG.front_url}files/microphone/`, {params: config,paramsSerializer: {indexes: null}})
    }
}
