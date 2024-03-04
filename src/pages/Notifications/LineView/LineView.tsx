import * as React from 'react'
import {useEffect} from 'react'
import {useQuery} from '@tanstack/react-query'
import NotificationService from '../../../services/NotificationService'
import deviceStore from '../../../stores/deviceStore'
import AppService from '../../../services/AppService'
import dayjs from 'dayjs'
import CircularProgress from '@mui/material/CircularProgress'
import NotificationStore from '../../../stores/notificationStore'
import {observer} from 'mobx-react-lite'
import {LineViewContent} from './LineViewContent'
import {useFillAppIcons} from '../../../shared/hooks/useFillAppIcons'
import {dateToUTCISOString} from '../../../utils/utils'

const limit = 30

export const LineView = observer(() => {
    LineView.displayName = 'LineView'
    const {feedNotifications, feedPage, dateFrom, dateTill, isFeedScrollEnd} = NotificationStore
    const {fillLocalStorage} = useFillAppIcons()

    const {
        data: appsNotificationData,
        isPending: appsNotificationPending,
        error: appsNotificationError,
    } = useQuery({
        queryFn: () =>
            NotificationService.getNotifications({
                device_id: deviceStore.currentDeviceIndex!,
                limit,
                page: feedPage,
                port_time__from: dateFrom ? dateToUTCISOString(dateFrom) : undefined,
                port_time__till: dateTill ? dateToUTCISOString(dateTill) : undefined,
            }),
        queryKey: ['appsNotification', feedPage, dateFrom, dateTill],
    })

    const {data: appsData} = useQuery({
        queryFn: () => AppService.getApps({device_id: deviceStore.currentDeviceIndex!}),
        queryKey: ['appsData'],
        enabled: !!deviceStore.currentDeviceIndex,
    })

    // Effects

    useEffect(() => {
        if (isFeedScrollEnd && appsNotificationData?.count && appsNotificationData?.count > feedPage * limit) {
            NotificationStore.setFeedPage(feedPage + 1)
            NotificationStore.setIsFeedScrollEnd(false)
        }
    }, [isFeedScrollEnd, appsNotificationData?.count, feedPage])

    useEffect(() => {
        appsNotificationData?.apiResponse && fillLocalStorage(appsNotificationData?.apiResponse)
        if (appsNotificationData && appsData) {
            const appsNotifications = appsNotificationData.apiResponse.map((item) => {
                const appName =
                    appsData.apiResponse.find((app) => app.package_name === item.package_name)?.app_name ||
                    item.package_name
                return {...item, app_name: appName}
            })
            NotificationStore.addFeedNotifications(appsNotifications)
            NotificationStore.setMinDate(dayjs(appsNotificationData['x-min-date-from']))
            NotificationStore.setMaxDate(dayjs(appsNotificationData['x-max-date-till']))
        }
    }, [appsData, appsNotificationData, fillLocalStorage])

    if (appsNotificationPending && !appsNotificationError && !feedNotifications.length) {
        return (
            <div className={'flex w-full mt-56 justify-center'}>
                <CircularProgress size={150} />
            </div>
        )
    } else if (appsNotificationError) {
        return (
            <div className={'flex w-full mt-56 justify-center'}>
                <p className={'text-3xl text-slate-600'}>Не удалось загрузить данные об уведомлениях</p>
            </div>
        )
    } else if (feedNotifications.length === 0) {
        return (
            <div className={'flex w-full mt-56 justify-center'}>
                <p className={'text-3xl text-slate-600'}>Нет уведомлений для данного устройства</p>
            </div>
        )
    } else return <LineViewContent feedNotifications={feedNotifications} />
})
