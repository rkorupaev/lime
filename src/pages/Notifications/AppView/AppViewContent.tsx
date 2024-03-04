import * as React from 'react'
import {useEffect, useRef} from 'react'
import {GetNotificationsResponse} from '../../../services/NotificationService'
import useScrollEnd from '../../../shared/hooks/useScrollEnd'
import NotificationStore from '../../../stores/notificationStore'
import {dateToLocalString} from '../../../utils/utils'
import {observer} from 'mobx-react-lite'

export const AppViewContent = observer(({notifications}: {notifications: GetNotificationsResponse[]}) => {
    AppViewContent.displayName = 'AppViewContent'
    const containerRef = useRef<HTMLDivElement>(null)
    const isScrollEnd = useScrollEnd(containerRef)

    useEffect(() => {
        isScrollEnd && NotificationStore.setIsAppScrollEnd(true)
    }, [isScrollEnd])

    return (
        <div
            className={'flex w-full h-notificationContent max-h-notificationContent overflow-auto text-slate-700 p-5'}
            ref={containerRef}
        >
            <div className={'flex flex-col items-center gap-4 w-10/12 mx-auto '}>
                {notifications.map((item) => {
                    // if (item.content !== 'null') {
                    return (
                        <div
                            key={`${item.id}${item.package_name}`}
                            className={'flex w-full flex-col bg-blue-50 rounded-lg border border-gray-300'}
                        >
                            <div
                                className={
                                    'flex w-full justify-between bg-gray-200 px-2 py-1 border-b border-b-gray-300 rounded-t-lg'
                                }
                            >
                                <p>{item.title === 'null' ? '' : item.title}</p>
                                <p>{dateToLocalString({dateUTC: item.port_time})}</p>
                            </div>

                            <div className={'py-4 px-3'}>{item.content}</div>
                        </div>
                    )
                    // }
                })}
            </div>
        </div>
    )
})
