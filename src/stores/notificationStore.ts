import {makeAutoObservable} from 'mobx'
import {Dayjs} from 'dayjs'
import {GetNotificationsResponse} from '../services/NotificationService'

export interface FeedApps extends GetNotificationsResponse {
    app_name: string
}

class NotificationStore {
    constructor() {
        makeAutoObservable(this)
    }

    view: 'line' | 'apps' = 'line'
    dateFrom: Dayjs | null = null
    dateTill: Dayjs | null = null
    minDate: Dayjs | null = null
    maxDate: Dayjs | null = null
    activeApp: string = ''
    isAppScrollEnd: boolean = false
    appNotifications: GetNotificationsResponse[] = []
    appsPage: number = 1
    feedNotifications: FeedApps[] = []
    feedPage: number = 1
    isFeedScrollEnd: boolean = false

    setView(data: 'line' | 'apps') {
        this.view = data
    }

    setDateFrom(data: Dayjs | null) {
        this.dateFrom = data
    }

    setDateTill(data: Dayjs | null) {
        this.dateTill = data
    }

    setMinDate(data: Dayjs | null) {
        this.minDate = data
    }

    setMaxDate(data: Dayjs | null) {
        this.maxDate = data
    }

    setActiveApp(app: string) {
        this.activeApp = app
    }

    setIsAppScrollEnd(bool: boolean) {
        this.isAppScrollEnd = bool
    }

    setAppNotifications(data: GetNotificationsResponse[]) {
        this.appNotifications = data
    }

    addAppNotifications(data: GetNotificationsResponse[]) {
        const previous = this.appNotifications
        this.appNotifications = [...previous, ...data]
    }

    setAppsPage(data: number) {
        this.appsPage = data
    }

    setFeedNotifications(data: FeedApps[]) {
        this.feedNotifications = data
    }

    addFeedNotifications(data: FeedApps[]) {
        const previous = this.feedNotifications
        this.feedNotifications = [...previous, ...data]
    }

    setFeedPage(data: number) {
        this.feedPage = data
    }

    setIsFeedScrollEnd(bool: boolean) {
        this.isFeedScrollEnd = bool
    }
}

export default new NotificationStore()
