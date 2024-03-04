import * as React from 'react'
import {ChangeEvent, useEffect, useState} from 'react'
import NotificationService from '../../../services/NotificationService'
import {useQuery} from '@tanstack/react-query'
import deviceStore from '../../../stores/deviceStore'
import dayjs from 'dayjs'
import CircularProgress from '@mui/material/CircularProgress'
import clsx from 'clsx'
import {RenderIcon} from '../../../shared/RenderIcon/RenderIcon'
import {NotificationList} from './NotificationList'
import NotificationStore from '../../../stores/notificationStore'
import {observer} from 'mobx-react-lite'
import {DebounceInput} from 'react-debounce-input'
import {useFillAppIcons} from '../../../shared/hooks/useFillAppIcons'
import {dateToUTCISOString} from '../../../utils/utils'

export const AppView = observer(() => {
    AppView.displayName = 'AppView'
    const {dateTill, dateFrom, activeApp} = NotificationStore
    const {fillLocalStorage} = useFillAppIcons()
    const [searchValue, setSearchValue] = useState('')

    const {
        data: appsNotificationData,
        isPending: appsNotificationPending,
        error: appsNotificationError,
    } = useQuery({
        queryFn: () =>
            NotificationService.getAppsNotification({
                device_id: deviceStore.currentDeviceIndex!,
                port_time__from: dateFrom ? dateToUTCISOString(dateFrom) : undefined,
                port_time__till: dateTill ? dateToUTCISOString(dateTill) : undefined,
                app_name__ilike: searchValue,
            }),
        queryKey: ['appsNotification', searchValue, dateFrom, dateTill],
    })

    const {data: getNotificationCountData} = useQuery({
        queryFn: () =>
            NotificationService.getNotificationCount({
                device_id: deviceStore.currentDeviceIndex!,
                port_time__from: dateFrom ? dateToUTCISOString(dateFrom) : undefined,
                port_time__till: dateTill ? dateToUTCISOString(dateTill) : undefined,
            }),
        queryKey: ['getNotificationCount', dateTill, dateFrom],
        enabled: !!dateFrom || !!dateTill,
    })

    // Effects

    useEffect(() => {
        if (appsNotificationData) {
            NotificationStore.setMinDate(dayjs(appsNotificationData['x-min-date-from']))
            NotificationStore.setMaxDate(dayjs(appsNotificationData['x-max-date-till']))
            fillLocalStorage(appsNotificationData.apiResponse)
        }
    }, [appsNotificationData, fillLocalStorage])

    // Handlers

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }

    const handleActiveApp = (package_name: string) => {
        if (activeApp !== package_name) {
            NotificationStore.setAppsPage(1)
            NotificationStore.setActiveApp(package_name)
            NotificationStore.setAppNotifications([])
        }
    }

    if (appsNotificationPending && !appsNotificationError) {
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
    } else if (appsNotificationData?.apiResponse.length === 0) {
        return (
            <div className={'flex w-full mt-56 justify-center'}>
                <p className={'text-3xl text-slate-600'}>Нет уведомлений для данного запроса</p>
            </div>
        )
    } else
        return (
            <div className={'flex w-full h-contentHeight text-slate-600'}>
                <div
                    className={
                        'w-72 border-r border-r-slate-300 py-5 h-notificationContent max-h-notificationContent overflow-auto shrink-0'
                    }
                >
                    <DebounceInput
                        debounceTimeout={1000}
                        placeholder={'Поиск по названию..'}
                        value={searchValue}
                        onChange={handleSearch}
                        type='text'
                        className='block mx-auto w-11/12 mb-5 font-medium rounded-md border border-gray-300 p-2 text-sm disabled:cursor-not-allowed disabled:opacity-50'
                    />
                    <ul className={'flex flex-col gap-1'}>
                        {appsNotificationData?.apiResponse && !!appsNotificationData.apiResponse.length ? (
                            appsNotificationData.apiResponse.map((item) => (
                                <li
                                    key={item.package_name}
                                    className={clsx(
                                        'flex gap-3 items-center py-2 px-3 cursor-pointer rounded-md',
                                        item.package_name === activeApp && 'bg-cyan-200',
                                        item.package_name !== activeApp && 'hover:bg-gray-100'
                                    )}
                                    onClick={() => handleActiveApp(item.package_name)}
                                >
                                    <RenderIcon package_name={item.package_name} />
                                    <p className={'truncate overflow-ellipsis'}>{item.app_name}</p>
                                    <div
                                        className={
                                            'px-2 border border-gray-300 bg-green-100 text-slate-800 rounded-xl ml-auto shrink-0 '
                                        }
                                    >
                                        {getNotificationCountData?.data &&
                                        getNotificationCountData.data[item.package_name]
                                            ? getNotificationCountData.data[item.package_name]
                                            : item.notify_count}
                                        {/*{item.notify_count}*/}
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p className={'text-center'}>Не найдено результатов</p>
                        )}
                    </ul>
                </div>
                {activeApp ? (
                    <NotificationList package_name={activeApp} />
                ) : (
                    <div className={'h-notificationContent w-full flex justify-center items-center px-5'}>
                        <p className={'text-3xl text-center'}>Выберите приложение для загрузки уведомлений</p>
                    </div>
                )}
            </div>
        )
})
