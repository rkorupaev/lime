import {observer} from 'mobx-react-lite'
import {useQuery} from '@tanstack/react-query'
import SettingsService, {SIM} from '../../services/SettingsService'
import deviceStore from '../../stores/deviceStore'
import * as React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import {LuBluetooth, LuBluetoothOff} from 'react-icons/lu'
import {MdOutlineGpsNotFixed, MdOutlineGpsOff} from 'react-icons/md'
import {MdOutlineWifi, MdOutlineWifiOff} from 'react-icons/md'
import {SettingForm} from './SettingForm'
import dayjs from 'dayjs'
import {NamesForm} from './NamesForm'
import {SyncTimeForm} from './SyncTimeForm'

export const Settings = observer(() => {
    Settings.displayName = 'Settings'

    const getLastConnectionString = (time: string) => {
        const connectionTime = dayjs.utc(time)
        const nowTime = dayjs.utc(dayjs())
        const dur = dayjs.duration(nowTime.diff(connectionTime))

        let str: string
        dur.minutes() < 10 ? (str = 'm мин назад') : (str = 'mm мин назад')
        if (dur.hours()) {
            dur.hours() < 10 ? (str = `H ч, ${str}`) : (str = `HH ч, ${str}`)
        }
        if (dur.days()) {
            dur.hours() < 10 ? (str = `D д, ${str}`) : (str = `DD д, ${str}`)
        }
        return dur.format(str)
    }

    if (!deviceStore.currentDeviceIndex) {
        return (
            <div className={'flex w-full mt-headerHeight h-contentHeight justify-center'}>
                <p className={'text-xl text-slate-600 text-center mt-10'}>Девайс не выбран</p>
            </div>
        )
    } else {
        const {
            data: getDeviceSettingsData,
            error: getDeviceSettingsError,
            // isLoading: getDeviceSettingsIsLoading,
            isFetching: getDeviceSettingsIsFetching,
        } = useQuery({
            queryFn: () => SettingsService.getDeviceSettings({device_id: deviceStore.currentDeviceIndex!}),
            queryKey: ['deviceSettings'],
            // placeholderData: (previousData) => previousData,
        })

        if (getDeviceSettingsIsFetching && !getDeviceSettingsError) {
            return (
                <div className={'flex w-full mt-56 justify-center'}>
                    <CircularProgress size={150} />
                </div>
            )
        } else if (getDeviceSettingsError) {
            return (
                <div className={'flex w-full mt-56 justify-center'}>
                    <p className={'text-3xl text-slate-600'}>Не удалось загрузить данные о настройках</p>
                </div>
            )
        } else if (getDeviceSettingsData?.data)
            return (
                <div className={'flex w-full mt-headerHeight h-contentHeight text-slate-600 p-5 gap-5 bg-gray-50'}>
                    <div
                        className={
                            'flex max-w-[50%] grow flex-col rounded-lg border border-gray-300 shadow-lg p-5 bg-white overflow-auto'
                        }
                    >
                        <p className={'text-center text-2xl'}>Информация об устройстве</p>
                        <NamesForm settings={getDeviceSettingsData.data} />
                        <div className={'flex gap-7 justify-between mt-5 px-5'}>
                            <div className={'flex flex-col gap-5 shrink-0 max-w-[45%]'}>
                                <div className={'flex flex-col gap-2'}>
                                    <p className={'text-lg font-semibold'}>Последнее подключение</p>
                                    <p>
                                        {getDeviceSettingsData.data.last_connection
                                            ? getLastConnectionString(getDeviceSettingsData.data.last_connection)
                                            : 'Нет данных'}
                                    </p>
                                </div>
                                <div className={'flex flex-col gap-2'}>
                                    <p className={'text-lg font-semibold'}>Уровень заряда</p>
                                    <p>
                                        {getDeviceSettingsData.data.battery_lvl
                                            ? `${getDeviceSettingsData.data.battery_lvl}%`
                                            : 'Нет данных'}
                                    </p>
                                </div>
                                <div className={'flex flex-col gap-2'}>
                                    <p className={'text-lg font-semibold'}>Состояние батареи</p>
                                    <p>
                                        {getDeviceSettingsData.data.battery_state ? (
                                            <BatteryState state={getDeviceSettingsData.data.battery_state} />
                                        ) : (
                                            'Нет данных'
                                        )}
                                    </p>
                                </div>
                                <SettingContent
                                    title={'Версия приложения'}
                                    content={getDeviceSettingsData.data.app_version}
                                />
                                <SettingContent title={'GPS статус'} content={getDeviceSettingsData.data.gps_on} />
                                <SettingContent title={'WI-FI статус'} content={getDeviceSettingsData.data.wifi_on} />
                                <SettingContent title={'WI-FI сеть'} content={getDeviceSettingsData.data.wifi_ssid} />
                                <SettingContent
                                    title={'Bluetooth статус'}
                                    content={getDeviceSettingsData.data.bluetooth_on}
                                />
                            </div>

                            <div className={'flex flex-col gap-5 shrink-0 max-w-[45%]'}>
                                <SettingContent
                                    title={'Версия андроида'}
                                    content={getDeviceSettingsData.data.android_version}
                                />
                                <SettingContent
                                    title={'Производитель'}
                                    content={getDeviceSettingsData.data.manufacture}
                                />
                                <SettingContent title={'Устройство'} content={getDeviceSettingsData.data.device} />
                                <SettingContent title={'Версия сборки'} content={getDeviceSettingsData.data.build_id} />
                                <SettingContent title={'ID устройства'} content={getDeviceSettingsData.data.id} />

                                <div className={'flex flex-col gap-2'}>
                                    <p className={'text-lg font-semibold'}>Права</p>
                                    {getDeviceSettingsData.data.last_permissions.length > 0 ? (
                                        <Permissions items={getDeviceSettingsData.data.last_permissions} />
                                    ) : (
                                        <p>Все права выданы</p>
                                    )}
                                </div>
                                <div className={'flex flex-col gap-2'}>
                                    <p className={'text-lg font-semibold'}>SIM-карты</p>

                                    {getDeviceSettingsData.data.sim_cards.length > 0 ? (
                                        <Sims sims={getDeviceSettingsData.data.sim_cards} />
                                    ) : (
                                        <p>Нет данных</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className={
                            'flex max-w-[50%] grow flex-col rounded-lg border border-gray-300 shadow-lg p-5 bg-white overflow-auto'
                        }
                    >
                        <p className={'text-center text-2xl'}>Настройки мониторинга</p>
                        <SyncTimeForm settings={getDeviceSettingsData.data} />
                        <SettingForm settings={getDeviceSettingsData.data} />
                    </div>
                </div>
            )
    }
})

const SettingContent = ({title, content}: {title: string; content: string | number | boolean | null}) => {
    const renderContent = (content: string | number | boolean | null) => {
        if (content === null) {
            return 'Нет данных'
        } else if (typeof content === 'boolean') {
            if (content) {
                if (title.includes('Bluetooth')) {
                    return <LuBluetooth className={'text-green-300 w-5 h-5'} />
                } else if (title.includes('GPS')) {
                    return <MdOutlineGpsNotFixed className={'text-green-300 w-5 h-5'} />
                } else if (title.includes('WI-FI статус')) {
                    return <MdOutlineWifi className={'text-green-300 w-5 h-5'} />
                } else return 'Включен'
            } else {
                if (title.includes('Bluetooth')) {
                    return <LuBluetoothOff className={'text-red-400 w-5 h-5'} />
                } else if (title.includes('GPS')) {
                    return <MdOutlineGpsOff className={'text-red-400 w-5 h-5'} />
                } else if (title.includes('WI-FI статус')) {
                    return <MdOutlineWifiOff className={'text-red-400 w-5 h-5'} />
                } else return 'Выключен'
            }
        } else return content
    }

    return (
        <div className={'flex flex-col gap-2'}>
            <p className={'text-lg font-semibold'}>{title}</p>
            <p className={'break-all'}>{renderContent(content)}</p>
        </div>
    )
}

const BatteryState = ({state}: {state: string}) => {
    switch (state) {
        case 'UNKNOWN':
            return 'Неизвестно'
        case 'DISCHARGING':
            return 'Разряжается'
        case 'CHARGING':
            return 'Заряжается'
        case 'FULL':
            return 'Заряжен'
        default:
            return 'Неизвестно'
    }
}

type PermissionsProps = {
    items: {name: string}[]
}

const Permissions = (props: PermissionsProps) => {
    const {items} = props

    return (
        <div className={'flex flex-col gap-3'}>
            <p className={'text-md font-semibold'}>Не выданные разрешения</p>
            {items.map((item) => (
                <p key={item.name} className={'break-all'}>
                    {item.name}
                </p>
            ))}
        </div>
    )
}

const Sims = ({sims}: {sims: SIM[]}) => {
    return (
        <div className={'flex flex-col gap-3'}>
            {sims.map((item) => (
                <p key={item.card_id} className={'break-all'}>
                    {item.display_name}
                </p>
            ))}
        </div>
    )
}
