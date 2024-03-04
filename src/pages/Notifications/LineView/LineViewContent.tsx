import {observer} from 'mobx-react-lite'
import {RenderIcon} from '../../../shared/RenderIcon/RenderIcon'
import {dateToLocalString} from '../../../utils/utils'
import * as React from 'react'
import NotificationStore, {FeedApps} from '../../../stores/notificationStore'
import {useEffect, useRef} from 'react'
import useScrollEnd from '../../../shared/hooks/useScrollEnd'

export const LineViewContent = observer(({feedNotifications}: {feedNotifications: FeedApps[]}) => {
    LineViewContent.displayName = 'LineViewContent'
    const containerRef = useRef<HTMLDivElement>(null)
    const isScrollEnd = useScrollEnd(containerRef)

    useEffect(() => {
        isScrollEnd && NotificationStore.setIsFeedScrollEnd(true)
    }, [isScrollEnd])

    return (
        <div
            ref={containerRef}
            className={'flex w-full h-notificationContent max-h-notificationContent overflow-auto text-slate-700 p-7'}
        >
            <div className={'flex flex-col items-center gap-4 w-10/12 mx-auto'}>
                {feedNotifications.map((item) => {
                    if (item.content !== 'null') {
                        return (
                            <div
                                key={item.id}
                                className={'flex flex-col border-gray-300 items-start rounded-lg w-full'}
                            >
                                <div
                                    className={
                                        ' bg-blue-200 rounded-t-lg border-b-none border border-gray-300 px-2 py-1 flex gap-3 items-center'
                                    }
                                >
                                    <RenderIcon package_name={item.package_name} />
                                    <p>{item.app_name}</p>
                                </div>
                                <div
                                    className={
                                        'flex w-full justify-between bg-gray-200 px-2 py-1 border border-gray-300 rounded-tr-lg'
                                    }
                                >
                                    <p>{item.title === 'null' ? '' : item.title}</p>
                                    <p>{dateToLocalString({dateUTC: item.port_time})}</p>
                                </div>

                                <div
                                    className={
                                        'py-4 px-3 bg-blue-50 rounded-b-lg w-full border border-gray-300 border-t-0'
                                    }
                                >
                                    {item.content}
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
        </div>
    )
})
