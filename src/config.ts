const BASE_IP: string = '192.168.30.179'
// const BASE_IP: string = '192.168.30.195'
const IS_DEV = import.meta.env.DEV

const API_BASE_IP: string = IS_DEV ? `http://${BASE_IP}` : '/'
// const API_BASE_IP: string = IS_DEV ? `https://${BASE_IP}` : '/'

const WS_MY_SERVER_PATH = 'wss://192.168.30.195/front'
const WS_TEST_SERVER_PATH = 'ws://192.168.30.179/front'

const getWsString = () => {
    return window.location.hostname.includes('179')
        ? `ws://${window.location.hostname}/front`
        : `wss://${window.location.hostname}/front`
}

const WS_PATH: string = IS_DEV ? WS_TEST_SERVER_PATH : getWsString()

export {API_BASE_IP, WS_PATH}

// LocalStorage
export const LocalStorageKeys = {
    APP_ICONS_KEY: 'APP_ICONS_KEY',
    CURRENT_DEVICE: 'currentDevice',
    REFRESH_TOKEN: 'ref_token',
    ACCESS_TOKEN: 'token',
}
