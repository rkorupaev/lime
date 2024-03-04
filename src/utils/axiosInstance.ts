import axios from 'axios'
import {API_BASE_IP, LocalStorageKeys} from '../config'
import {CONFIG} from '../services/config'
import userStore from '../stores/userStore'

const axiosInstance = axios.create({
    baseURL: API_BASE_IP,
})

const refreshInstance = axios.create({
    baseURL: API_BASE_IP,
})

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN)
    config.headers.Authorization = `Bearer ${token}`
    return config
})

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const origRes = error.config
        if (error.response.status === 401 && error.config && !error.config._isRetry) {
            try {
                origRes._isRetry = true
                const refresh_token = localStorage.getItem(LocalStorageKeys.REFRESH_TOKEN)
                const res = await refreshInstance.post<{access_token: string}>(`${CONFIG.auth_url}refresh`, {
                    refresh_token,
                })
                localStorage.setItem(LocalStorageKeys.ACCESS_TOKEN, res.data.access_token)
                return axiosInstance.request(origRes)
            } catch (e) {
                localStorage.removeItem(LocalStorageKeys.ACCESS_TOKEN)
                localStorage.removeItem(LocalStorageKeys.REFRESH_TOKEN)
                localStorage.removeItem(LocalStorageKeys.CURRENT_DEVICE)
                userStore.setIsAuth(false)
            }
        } else {
            return Promise.reject(error.response)
        }
    }
)

export default axiosInstance
