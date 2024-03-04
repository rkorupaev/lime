import {useMutation} from '@tanstack/react-query'
import FilesService from '../../services/FilesService'
import SnackbarStore, {Severity} from '../../stores/snackbarStore'
import FilesStore from './store/filesStore'
import deviceStore from '../../stores/deviceStore'
import Button from '@mui/material/Button'
import {FilesContent} from './FilesContent'
import {observer} from 'mobx-react-lite'

export const DeviceFilesTab = observer(() => {
    const {mutate: connectToDeviceMutate} = useMutation({
        mutationFn: FilesService.connectToDevice,
        mutationKey: ['connectToDevice'],
        onSuccess: async () => {
            SnackbarStore.setSnackbarSettings({
                label: 'Команда отправлена. Подключение произойдёт во время ближайшей синхронизации',
                opened: true,
                severity: Severity.success,
            })
            FilesStore.setIsConnectionRequestSent(true)
        },
        onError: () => {
            SnackbarStore.setSnackbarSettings({
                label: 'Не удалось удалить отправить команду на подключение',
                opened: true,
                severity: Severity.error,
            })
        },
    })

    if (
        FilesStore.connectedDeviceId !== deviceStore.currentDeviceIndex &&
        !FilesStore.activeDevices.includes(deviceStore.currentDeviceIndex!)
    ) {
        return (
            <div className={'flex w-full mt-headerHeight h-contentHeight flex-col'}>
                <p className={'text-xl text-slate-600 text-center mt-10'}>Девайс не подключен</p>
                <Button
                    variant={'contained'}
                    disabled={FilesStore.isConnectionRequestSent}
                    onClick={() => connectToDeviceMutate(deviceStore.currentDeviceIndex!)}
                    sx={{marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', width: 'max-content'}}
                >
                    Подключиться к устройству
                </Button>
                {FilesStore.isConnectionRequestSent && (
                    <p className={'text-center text-lg text-green-700 mt-10'}>
                        Команда отправлена. Подключение произойдёт во время ближайшей синхронизации
                    </p>
                )}
            </div>
        )
    } else {
        return <FilesContent />
    }
})
