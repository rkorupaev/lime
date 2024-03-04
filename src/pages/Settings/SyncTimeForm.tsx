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
    period: string
}

const inputClasses =
    'bg-gray-50 border w-16 border-gray-300 ml-auto h-10 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:text-gray-400'

export const SyncTimeForm = observer((props: NamesFormProps) => {
    SyncTimeForm.displayName = 'SyncTimeForm'
    const {settings} = props
    const queryClient = useQueryClient()

    const {mutate: putConnectionTimeMutate} = useMutation({
        mutationFn: SettingsService.putConnectionTime,
        mutationKey: ['putConnectionTimePatch'],
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
        formState: {errors, isValid, defaultValues},
    } = useForm<FormValues>({
        defaultValues: {
            period: settings.connection?.period.toString(),
        },
        mode: 'onChange',
    })

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        putConnectionTimeMutate({device_id: deviceStore.currentDeviceIndex!, body: {period: +data.period}})
    }

    return (
        <form
            className={'flex justify-between items-end p-5 mx-2 mt-5 shadow rounded-md border border-gray-300'}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className={'flex gap-3 items-center w-full'}>
                <label htmlFor='name'>Период синхронизации, мин</label>
                {errors['period'] && (
                    <p className={'text-red-500 text-sm ml-auto'}>{errors['period']?.message?.toString()}</p>
                )}
                <input
                    type='text'
                    {...register('period', {
                        pattern: {value: /^\d{2,}$/, message: 'Не менее 10 мин'},
                        required: {value: true, message: 'Обязательное поле'},
                    })}
                    className={inputClasses}
                />
                <Button
                    disabled={!isValid || JSON.stringify(watch()) === JSON.stringify(defaultValues)}
                    type={'submit'}
                    variant={'contained'}
                    className={'h-10'}
                >
                    Обновить
                </Button>
            </div>
        </form>
    )
})
