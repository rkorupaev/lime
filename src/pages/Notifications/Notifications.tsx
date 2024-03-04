import * as React from 'react'
import {useEffect} from 'react'
import deviceStore from '../../stores/deviceStore'
import clsx from 'clsx'
import {DateTimePicker} from '@mui/x-date-pickers'
import {Dayjs} from 'dayjs'
import NotificationStore from '../../stores/notificationStore'
import ClearIcon from '@mui/icons-material/Clear'
import {observer} from 'mobx-react-lite'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import {AppView} from './AppView/AppView'
import {LineView} from './LineView/LineView'
import {useQueryClient} from '@tanstack/react-query'

export const Notifications = observer(() => {
    Notifications.displayName = 'Notifications'
    const queryClient = useQueryClient()

    const {view, maxDate, dateTill, dateFrom, minDate} = NotificationStore

    const handleSetView = () => {
        queryClient.removeQueries({queryKey: ['appsNotification']})
        NotificationStore.setMinDate(null)
        NotificationStore.setMaxDate(null)
        NotificationStore.setDateFrom(null)
        NotificationStore.setDateTill(null)
        NotificationStore.setAppsPage(1)
        NotificationStore.setFeedPage(1)
        if (NotificationStore.view === 'line') {
            NotificationStore.setView('apps')
            NotificationStore.setFeedNotifications([])
        } else {
            NotificationStore.setView('line')
            NotificationStore.setAppNotifications([])
        }
    }

    const handleClear = () => {
        NotificationStore.setDateFrom(null)
        NotificationStore.setDateTill(null)
        NotificationStore.setAppsPage(1)
        queryClient.invalidateQueries({queryKey: ['appsNotification']})
        queryClient.invalidateQueries({queryKey: ['getNotificationCount']})
    }

    const handleSetDayStart = (e: Dayjs | null) => {
        if (e) {
            NotificationStore.setAppNotifications([])
            NotificationStore.setFeedNotifications([])
            NotificationStore.setDateFrom(e)
            NotificationStore.setAppsPage(1)
            NotificationStore.setFeedPage(1)
        }
    }

    const handleSetDayEnd = (e: Dayjs | null) => {
        if (e) {
            NotificationStore.setAppNotifications([])
            NotificationStore.setFeedNotifications([])
            NotificationStore.setDateTill(e)
            NotificationStore.setAppsPage(1)
            NotificationStore.setFeedPage(1)
        }
    }

    useEffect(() => {
        if (!dateTill && !dateFrom) {
            queryClient.resetQueries({queryKey: ['getNotificationCount']})
            queryClient.invalidateQueries({queryKey: ['appsNotification']})
        }
    }, [dateTill, dateFrom, queryClient])

    useEffect(() => {
        return () => {
            NotificationStore.setAppNotifications([])
            NotificationStore.setFeedNotifications([])
            NotificationStore.setAppsPage(1)
            NotificationStore.setFeedPage(1)
            NotificationStore.setDateFrom(null)
            NotificationStore.setDateTill(null)
            NotificationStore.setActiveApp('')
            queryClient.removeQueries({queryKey: ['appsNotification']})
        }
    }, [])

    if (!deviceStore.currentDeviceIndex) {
        return (
            <div className={'flex w-full mt-headerHeight h-contentHeight justify-center'}>
                <p className={'text-xl text-slate-600 text-center mt-10'}>Девайс не выбран</p>
            </div>
        )
    } else {
        return (
            <div className={'flex w-full mt-headerHeight h-contentHeight text-slate-600 flex-col'}>
                <div
                    className={
                        'flex items-center px-8 h-notificationHeader shrink-0 justify-between border-b border-b-gray-300'
                    }
                >
                    <div className={'flex gap-6 items-center'}>
                        <p
                            className={clsx(
                                'text-xl transition-all ease-in-out duration-300',
                                view === 'line' && 'underline text-slate-900 scale-105'
                            )}
                        >
                            Лента
                        </p>
                        <label className='relative inline-flex items-center cursor-pointer'>
                            <input
                                type='checkbox'
                                checked={view === 'apps'}
                                onChange={handleSetView}
                                className='sr-only peer'
                            />
                            <div className="w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all bg-blue-600"></div>
                        </label>
                        <p
                            className={clsx(
                                'text-xl transition-all ease-in-out duration-300',
                                view === 'apps' && 'underline text-slate-900 scale-110'
                            )}
                        >
                            Приложения
                        </p>
                    </div>
                    <div className={'flex gap-6 items-center'}>
                        <p className={'text-xl'}>Период:</p>
                        <DateTimePicker
                            className={'shadow'}
                            slotProps={{textField: {size: 'small'}}}
                            value={dateFrom}
                            defaultValue={null}
                            minDateTime={minDate || undefined}
                            maxDateTime={maxDate || undefined}
                            // disabled={view === 'apps' && !activeApp}
                            label={'С'}
                            onAccept={handleSetDayStart}
                            disableFuture
                            reduceAnimations
                            localeText={{
                                fieldMonthPlaceholder: () => 'ММ',
                                fieldYearPlaceholder: (params) => 'Г'.repeat(params.digitAmount),
                                fieldDayPlaceholder: () => 'ДД',
                                fieldHoursPlaceholder: () => 'чч',
                                fieldMinutesPlaceholder: () => 'мм',
                            }}
                        />
                        <DateTimePicker
                            className={'shadow'}
                            slotProps={{textField: {size: 'small'}}}
                            label={'По'}
                            onAccept={handleSetDayEnd}
                            disableFuture
                            // disabled={view === 'apps' && !activeApp}
                            value={dateTill}
                            minDateTime={minDate || undefined}
                            maxDateTime={maxDate || undefined}
                            reduceAnimations
                            localeText={{
                                fieldMonthPlaceholder: () => 'ММ',
                                fieldYearPlaceholder: (params) => 'Г'.repeat(params.digitAmount),
                                fieldDayPlaceholder: () => 'ДД',
                                fieldHoursPlaceholder: () => 'чч',
                                fieldMinutesPlaceholder: () => 'мм',
                            }}
                        />
                        <Tooltip title={'Сбросить'}>
                            <Button
                                onClick={handleClear}
                                variant={'contained'}
                                size={'small'}
                                color={'info'}
                                className={'h-10'}
                            >
                                <ClearIcon />
                            </Button>
                        </Tooltip>
                    </div>
                </div>
                {view === 'apps' ? <AppView /> : <LineView />}
            </div>
        )
    }
})
