import {observer} from 'mobx-react-lite'
import SettingsService, {GetDeviceSettingsResponse} from '../../services/SettingsService'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import SnackbarStore, {Severity} from '../../stores/snackbarStore'
import {SubmitHandler, useForm} from 'react-hook-form'
import deviceStore from '../../stores/deviceStore'
import Button from '@mui/material/Button'

interface NamesFormProps {
    settings: GetDeviceSettingsResponse
}

interface FormValues {
    phone: string
    name: string
}

const inputClasses =
    'bg-gray-50 border border-gray-300 h-10 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:text-gray-400'

export const NamesForm = observer((props: NamesFormProps) => {
    NamesForm.displayName = 'NamesForm'
    const {settings} = props
    const queryClient = useQueryClient()

    const {mutate: putDeviceNamesMutate} = useMutation({
        mutationFn: SettingsService.putDeviceNames,
        mutationKey: ['putDeviceNamesPost'],
        onSuccess: () => {
            SnackbarStore.setSnackbarSettings({
                label: 'Настройки сохранены',
                opened: true,
                severity: Severity.success,
            })
            queryClient.invalidateQueries({queryKey: ['deviceSettings']})
        },
        onError: () => {
            SnackbarStore.setSnackbarSettings({
                label: 'Не удалось применить настройки',
                opened: true,
                severity: Severity.error,
            })
        },
    })

    const {
        register,
        handleSubmit,
        watch,
        formState: {defaultValues},
    } = useForm<FormValues>({
        defaultValues: {
            name: settings.name || undefined,
            phone: settings.phone || undefined,
        },
    })

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        putDeviceNamesMutate({device_id: deviceStore.currentDeviceIndex!, body: data})
    }

    return (
        <form
            className={'flex justify-between items-end p-5 mx-1 mt-5 shadow rounded-md border border-gray-300'}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className={'flex flex-col gap-2 mr-2'}>
                <label htmlFor='name'>Имя устройства</label>
                <input type='text' {...register('name')} className={inputClasses} />
            </div>
            <div className={'flex flex-col gap-2 mr-2'}>
                <label htmlFor='phone'>Номер устройства</label>
                <input type='text' {...register('phone')} className={inputClasses} />
            </div>
            <Button
                disabled={JSON.stringify(watch()) === JSON.stringify(defaultValues)}
                type={'submit'}
                variant={'contained'}
                className={'h-10'}
            >
                Обновить
            </Button>
        </form>
    )
})
