import {observer} from 'mobx-react-lite'
import Button from '@mui/material/Button'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import * as React from 'react'
import deviceStore from '../../stores/deviceStore'
import CommandService, {CommandTypes} from '../../services/CommandService'
import SnackbarStore, {Severity} from '../../stores/snackbarStore'
import {FilesTable} from './FilesTable'

export const CameraControl = observer(() => {
    CameraControl.displayName = 'CameraControl'
    const queryClient = useQueryClient()

    if (!deviceStore.currentDeviceIndex) {
        return (
            <div className={'flex w-full mt-headerHeight h-contentHeight justify-center'}>
                <p className={'text-xl text-slate-600 text-center mt-10'}>Девайс не выбран</p>
            </div>
        )
    } else {
        const {mutate: createCommandMutate} = useMutation({
            mutationFn: CommandService.createCommand,
            mutationKey: ['cameraCommand'],
            onSuccess: () => {
                SnackbarStore.setSnackbarSettings({
                    label: 'Команда отправлена',
                    opened: true,
                    severity: Severity.success,
                })
            },
            onError: () => {
                SnackbarStore.setSnackbarSettings({
                    label: 'Не удалось отправить команду',
                    opened: true,
                    severity: Severity.error,
                })
            },
        })

        const handleSendCommand = (camera_id: 1 | 0) => {
            createCommandMutate({
                device_id: deviceStore.currentDeviceIndex!,
                body: {command_type: CommandTypes.RECORD_CAMERA, content: {camera_id}},
            })
        }

        return (
            <div className={'flex flex-col w-full mt-headerHeight h-contentHeight text-slate-600 p-5 bg-gray-50'}>
                <div className='flex justify-between'>
                    {/*<button onClick={htdhtnoeu}>htdht</button>*/}
                    <div className={'flex items-center gap-5 shadow rounded-md border border-gray-300 p-5'}>
                        <p className={'text-xl'}>Послать команду на снимок:</p>
                        <Button onClick={() => handleSendCommand(0)} variant={'contained'}>
                            основной камерой
                        </Button>
                        <Button onClick={() => handleSendCommand(1)} variant={'contained'}>
                            фронтальной камерой
                        </Button>
                    </div>
                    <Button
                        onClick={() => queryClient.invalidateQueries({queryKey: ['cameraFiles']})}
                        variant={'contained'}
                        color={'info'}
                    >
                        Обновить список
                    </Button>
                </div>

                <p className={'text-center text-3xl mt-7'}>Список снимков</p>
                <FilesTable />
            </div>
        )
    }
})
