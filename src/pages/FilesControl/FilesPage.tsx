import deviceStore from '../../stores/deviceStore'
import {observer} from 'mobx-react-lite'
import {useState} from 'react'
import clsx from 'clsx'
import {DeviceFilesTab} from './DeviceFilesTab'
import {FilesControlTab} from './FilesControlTab'

export const FilesPage = observer(() => {
    FilesPage.displayName = 'FilesPage'
    const [tabNum, setTabNum] = useState<1 | 2>(1)

    if (!deviceStore.currentDeviceIndex) {
        return (
            <div className={'flex w-full mt-headerHeight h-contentHeight justify-center'}>
                <p className={'text-xl text-slate-600 text-center mt-10'}>Девайс не выбран</p>
            </div>
        )
    } else {
        return (
            <div className={'flex w-full mt-headerHeight h-contentHeight flex-col'}>
                <div className='text-md font-medium text-center text-gray-500 border-b border-gray-200'>
                    <ul className='flex flex-wrap -mb-px justify-center'>
                        <li className='me-2' onClick={() => setTabNum(1)}>
                            <div
                                className={clsx(
                                    'inline-block p-4 border-b-2 rounded-t-lg transition-all duration-150 cursor-pointer',
                                    tabNum === 1
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                                )}
                            >
                                Файлы на телефоне
                            </div>
                        </li>
                        <li className='me-2' onClick={() => setTabNum(2)}>
                            <div
                                className={clsx(
                                    'inline-block p-4 border-b-2 rounded-t-lg transition-all duration-150 cursor-pointer',
                                    tabNum === 2
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                                )}
                            >
                                Управление файлами
                            </div>
                        </li>
                    </ul>
                </div>
                {tabNum === 1 ? <DeviceFilesTab /> : <FilesControlTab />}
            </div>
        )
    }
})
