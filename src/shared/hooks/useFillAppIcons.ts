import {useMutation} from '@tanstack/react-query'
import AppService from '../../services/AppService'
import {LocalStorageKeys} from '../../config'
import dayjs from 'dayjs'
import IconsStore from '../../stores/iconsStore'
import deviceStore from '../../stores/deviceStore'
import {useCallback} from 'react'
import {ObjectWithPackageName} from '../types/sharedTypes'

export const useFillAppIcons = () => {
    const {mutate: getAppDetail} = useMutation({
        mutationFn: AppService.getAppsDetails,
        mutationKey: ['getAppDetails'],
        onSuccess: (data, variables) => {
            IconsStore.addAppIcon(data.data.icon, variables.package_name)
        },
        onError: (error, variables) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (error?.status && error.status === 404) {
                IconsStore.addAppIcon('error', variables.package_name)
            }
        },
    })

    const fillLocalStorage = useCallback(
        (data: ObjectWithPackageName[]) => {
            if (data && deviceStore.currentDeviceIndex) {
                const uniqueObjectsArray: ObjectWithPackageName[] = []
                const uniqueNamesSet = new Set()

                data.forEach((obj) => {
                    if (!uniqueNamesSet.has(obj.package_name)) {
                        uniqueNamesSet.add(obj.package_name)
                        uniqueObjectsArray.push(obj)
                    }
                })
                for (const element of uniqueObjectsArray) {
                    if (element.package_name) {
                        const localItems = localStorage.getItem(LocalStorageKeys.APP_ICONS_KEY)
                        if (localItems) {
                            const parsedLocalItems = JSON.parse(localItems)
                            if (!parsedLocalItems[element.package_name]) {
                                getAppDetail({
                                    device_id: deviceStore.currentDeviceIndex,
                                    package_name: element.package_name,
                                })
                            } else if (
                                dayjs().diff(dayjs(parsedLocalItems[element.package_name].updateDate), 'day') > 7
                            ) {
                                getAppDetail({
                                    device_id: deviceStore.currentDeviceIndex,
                                    package_name: element.package_name,
                                })
                            }
                        } else if (!localItems) {
                            getAppDetail({
                                device_id: deviceStore.currentDeviceIndex,
                                package_name: element.package_name,
                            })
                        }
                    }
                }
            }
        },
        [getAppDetail]
    )

    return {fillLocalStorage}
}
