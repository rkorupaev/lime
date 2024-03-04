import {makeAutoObservable} from 'mobx'
import {Coords, ModalType} from '../model/types/filesTypes'

class FilesStore {
    constructor() {
        makeAutoObservable(this)
    }

    connectedDeviceId: string = ''
    activeDevices: string[] = []
    isConnectionRequestSent: boolean = false
    clickMenuCoords: Coords = {} as Coords
    copiedFilePath: string = ''
    movedFilePath: string = ''
    modalInput: string = ''
    currentFolderPath: string = ''
    currentFilePath: string = ''
    isDialogOpen: boolean = false
    modalType: ModalType = 'rename'

    setIsConnectionRequestSent(bool: boolean) {
        this.isConnectionRequestSent = bool
    }

    setConnectedDeviceId(id: string) {
        this.connectedDeviceId = id
    }

    setActiveDevices(devices: string[]) {
        this.activeDevices = devices
    }

    setClickMenuCoords(coords: Coords) {
        this.clickMenuCoords = coords
    }

    setCopiedFilePath(path: string) {
        this.movedFilePath = ''
        this.copiedFilePath = path
    }

    setMovedFilePath(path: string) {
        this.copiedFilePath = ''
        this.movedFilePath = path
    }

    setModalInput(key: string) {
        this.modalInput = key
    }

    setCurrentFolderPath(path: string) {
        this.currentFolderPath = path
    }

    setCurrentFilePath(path: string) {
        this.currentFilePath = path
    }

    setIsDialogOpen(bool: boolean) {
        this.isDialogOpen = bool
    }

    setModalType(type: ModalType) {
        this.modalType = type
    }
}

export default new FilesStore()
