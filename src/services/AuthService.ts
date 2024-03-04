import axiosInstance from '../utils/axiosInstance'
import {CONFIG} from './config'

export default class AuthService {
    static async login(creds: {user: string; password: string}) {
        return await axiosInstance.post(`${CONFIG.auth_url}login`, {
            username: creds.user,
            password: creds.password,
        })
    }

    static async logout() {
        return await axiosInstance.post(`${CONFIG.auth_url}logout`)
    }
}
