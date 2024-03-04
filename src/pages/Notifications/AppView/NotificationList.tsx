import * as React from 'react'
import {useEffect} from 'react'
import {useQuery} from '@tanstack/react-query'
import deviceStore from '../../../stores/deviceStore'
import NotificationService from '../../../services/NotificationService'
import dayjs from 'dayjs'
import CircularProgress from '@mui/material/CircularProgress'
import NotificationStore from '../../../stores/notificationStore'
import {AppViewContent} from './AppViewContent'
import {observer} from 'mobx-react-lite'

interface NotificationListProps {
    package_name: string
}

const limit = 50

export const NotificationList = observer((props: NotificationListProps) => {
    NotificationList.displayName = 'NotificationList'
    const {package_name} = props
    const {dateTill, dateFrom, isAppScrollEnd, appNotifications, appsPage} = NotificationStore

    const {
        data: appNotificationsData,
        isPending: appNotificationsPending,
        error: appNotificationsError,
    } = useQuery({
        queryFn: () =>
            NotificationService.getNotifications({
                device_id: deviceStore.currentDeviceIndex!,
                limit,
                package_name,
                port_time__from: dateFrom ? dayjs(dateFrom).utc().toISOString() : undefined,
                port_time__till: dateTill ? dayjs(dateTill).utc().toISOString() : undefined,
                page: appsPage,
            }),
        queryKey: ['appNotifications', package_name, appsPage, dateFrom, dateTill],
    })

    useEffect(() => {
        if (isAppScrollEnd && appNotificationsData?.count && appNotificationsData?.count > appsPage * limit) {
            NotificationStore.setAppsPage(appsPage + 1)
            NotificationStore.setIsAppScrollEnd(false)
        }
    }, [isAppScrollEnd, appNotificationsData, appsPage])

    useEffect(() => {
        if (appNotificationsData) {
            NotificationStore.addAppNotifications(appNotificationsData.apiResponse)
        }
    }, [appNotificationsData])

    if (appNotificationsPending && !appNotificationsError && !appNotifications.length) {
        return (
            <div className={'flex w-full mt-56 justify-center'}>
                <CircularProgress size={150} />
            </div>
        )
    } else if (appNotificationsError) {
        return (
            <div className={'flex w-full mt-56 justify-center'}>
                <p className={'text-3xl text-slate-600'}>Не удалось загрузить данные об уведомлениях</p>
            </div>
        )
    } else if (appNotificationsData?.apiResponse.length === 0) {
        return (
            <div className={'flex w-full mt-56 justify-center'}>
                <p className={'text-3xl text-slate-600'}>Нет уведомлений для данного устройства</p>
            </div>
        )
    } else return <AppViewContent notifications={appNotifications} />
})
