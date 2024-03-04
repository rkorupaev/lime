import {makeAutoObservable} from 'mobx'

export interface SnackbarSettings {
    label?: string
    severity: Severity
    opened: boolean
}

export enum Severity {
    error = 'error',
    success = 'success',
    info = 'info',
    warning = 'warning',
}

class SnackbarStore {
    settings: SnackbarSettings = {label: '', severity: Severity.success, opened: false}

    constructor() {
        makeAutoObservable(this)
    }

    setSnackbarSettings(settings: SnackbarSettings) {
        this.settings = settings
    }

    closeSnackbarSettings() {
        this.settings = {...this.settings, opened: false}
    }
}

export default new SnackbarStore()
