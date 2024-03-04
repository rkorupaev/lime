// @ts-nocheck
import React, {useCallback, useEffect} from 'react'
import deviceStore from '../../../stores/deviceStore'
import accountsStore from '../../../stores/accountsStore'
import {observer} from 'mobx-react-lite'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import AccountItem from './AccountItem/AccountItem'
import {useMutation} from '@tanstack/react-query'
import AppService, {GetAppsStatsDayResponse} from '../../../services/AppService'
import {LocalStorageKeys} from '../../../config'
import {LocalStorageIcon} from '../../../shared/types/sharedTypes'
import dayjs from 'dayjs'
import {toJS} from 'mobx'

const AccountsWidget = () => {
    useEffect(() => {
        if (deviceStore.currentDeviceIndex) accountsStore.getAccounts({id: deviceStore.currentDeviceIndex})
    }, [deviceStore.currentDevice])

    const {mutate: getAppDetail} = useMutation({
        mutationFn: AppService.getAppsDetails,
        mutationKey: ['getAppDetails'],
        onSuccess: (data, variables) => {
            const localItems = localStorage.getItem(LocalStorageKeys.APP_ICONS_KEY)
            if (localItems) {
                localStorage.setItem(
                    LocalStorageKeys.APP_ICONS_KEY,
                    JSON.stringify({
                        ...(JSON.parse(localItems) as LocalStorageIcon),
                        [variables.package_name]: {iconSrc: data.data.icon, updateDate: dayjs().toISOString()},
                    })
                )
            } else
                localStorage.setItem(
                    LocalStorageKeys.APP_ICONS_KEY,
                    JSON.stringify({
                        [variables.package_name]: {iconSrc: data.data.icon, updateDate: dayjs().toISOString()},
                    })
                )
        },
        onError: (error, variables) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (error?.status && error.status === 404) {
                const localItems = localStorage.getItem(LocalStorageKeys.APP_ICONS_KEY)
                if (localItems) {
                    localStorage.setItem(
                        LocalStorageKeys.APP_ICONS_KEY,
                        JSON.stringify({
                            ...(JSON.parse(localItems) as LocalStorageIcon),
                            [variables.package_name]: {iconSrc: 'error', updateDate: dayjs().toISOString()},
                        })
                    )
                } else
                    localStorage.setItem(
                        LocalStorageKeys.APP_ICONS_KEY,
                        JSON.stringify({
                            [variables.package_name]: {iconSrc: 'error', updateDate: dayjs().toISOString()},
                        })
                    )
            }
        },
    })

    const fillLocalStorage = useCallback(
        (appData) => {
            for (const element of appData) {
                if (deviceStore.currentDeviceIndex && element.type) {
                    const localAppData = localStorage.getItem(LocalStorageKeys.APP_ICONS_KEY)
                    if (localAppData && deviceStore.currentDeviceIndex) {
                        if (!JSON.parse(localAppData)[element.type]) {
                            getAppDetail({
                                device_id: deviceStore.currentDeviceIndex,
                                package_name: element.type,
                            })
                        } else if (
                            dayjs().diff(
                                dayjs((JSON.parse(localAppData) as LocalStorageIcon)[element.type].updateDate),
                                'day'
                            ) > 7
                        ) {
                            getAppDetail({
                                device_id: deviceStore.currentDeviceIndex,
                                package_name: element.type,
                            })
                        }
                    } else if (!localAppData && deviceStore.currentDeviceIndex) {
                        getAppDetail({
                            device_id: deviceStore.currentDeviceIndex,
                            package_name: element.type,
                        })
                    }
                }
            }
        },
        [getAppDetail]
    )

    useEffect(() => {
        accountsStore.accounts && fillLocalStorage(accountsStore.accounts)
    }, [accountsStore.accounts, fillLocalStorage])

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', p: '16px', maxHeight: 'calc(100vh - 96px)'}}>
            <Typography variant='h6' component='h6'>
                Аккаунты на устройстве:
            </Typography>
            {accountsStore.accounts.length ? (
                <List sx={{overflowY: 'auto'}}>
                    {accountsStore.accounts.map((item, index) => (
                        <AccountItem key={index} item={item} />
                    ))}
                </List>
            ) : (
                <Typography variant='body1' component='p'>
                    Информации нет
                </Typography>
            )}
        </Box>
    )
}

export default observer(AccountsWidget)
