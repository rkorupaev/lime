// @ts-nocheck
import {makeAutoObservable} from 'mobx'
import {LocalStorageKeys} from '../config'

export interface Device {
    id: string
    fingerprint: string
    android_version: string
    device: string
    manufacture: string
    build_id: string
    display: string
    log_time: string
    last_connection: string
    battery_state: string
    battery_lvl: number
}

export interface BatteryData {
    battery_state: string
    timestamp: string
    battery_lvl: number
    app_version: string
}

class DeviceStore {
    devices: Device[] = []
    currentDeviceBatteryData: BatteryData[] = []

    currentDevice: Device | null = JSON.parse(localStorage.getItem(LocalStorageKeys.CURRENT_DEVICE)) || null
    currentDeviceIndex: string | null = JSON.parse(localStorage.getItem(LocalStorageKeys.CURRENT_DEVICE))?.id || null

    isLoading: boolean = false

    constructor() {
        makeAutoObservable(this)
    }

    setDevices(devices: Device[]) {
        this.devices = devices
        if (!devices.length) {
            this.setCurrentDeviceIndex('')
        }

        this._setCurrentDevice(this.currentDeviceIndex)
    }

    setDeviceBatteryData(data: BatteryData[]) {
        this.currentDeviceBatteryData = data
    }

    setCurrentDeviceIndex(id: string) {
        this.currentDeviceIndex = id
        this._setCurrentDevice(id)
    }

    _setCurrentDevice(id: string | null) {
        this.currentDevice = this.devices.find((device) => device.id === id) || null
        localStorage.setItem(LocalStorageKeys.CURRENT_DEVICE, JSON.stringify(this.currentDevice))
    }

    setIsLoading(status: boolean) {
        this.isLoading = status
    }
}

export default new DeviceStore()
