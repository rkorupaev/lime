import {observer} from 'mobx-react-lite'
import SettingsService, {GetDeviceSettingsResponse, SetDeviceSettingsBody} from '../../services/SettingsService'
import {SubmitHandler, useForm} from 'react-hook-form'
import Button from '@mui/material/Button'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import SnackbarStore, {Severity} from '../../stores/snackbarStore'
import deviceStore from '../../stores/deviceStore'

interface SettingFormProps {
    settings: GetDeviceSettingsResponse
}

interface FormValues {
    sms: boolean
    call: boolean
    gps: boolean
    wifi_bool: boolean
    wifi_period: string | null
    apps_bool: boolean
    apps_period: string | null
    notifications: boolean
    accounts_bool: boolean
    accounts_period: string | null
    contacts: boolean
    statistics_bool: boolean
    statistics_period: string | null
    clipboard_bool: boolean
    clipboard_period: string | null
}

const checkboxClasses =
    "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"

const inputClasses =
    'bg-gray-50 w-16 h-10 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:text-gray-400'

export const SettingForm = observer((props: SettingFormProps) => {
    SettingForm.displayName = 'SettingForm'
    const {settings} = props
    const queryClient = useQueryClient()

    const {mutate: setDeviceSettingsMutate} = useMutation({
        mutationFn: SettingsService.setDeviceSettings,
        mutationKey: ['deviceSettingsPost'],
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
        formState: {errors, isValid, defaultValues, dirtyFields},
    } = useForm<FormValues>({
        defaultValues: {
            sms: settings.switches.find((item) => item.work_type === 2)?.is_active,
            call: settings.switches.find((item) => item.work_type === 3)?.is_active,
            gps: settings.switches.find((item) => item.work_type === 7)?.is_active,
            wifi_bool: settings.switches.find((item) => item.work_type === 8)?.is_active,
            wifi_period: settings.switches.find((item) => item.work_type === 8)?.period?.toString(),
            apps_bool: settings.switches.find((item) => item.work_type === 9)?.is_active,
            apps_period: settings.switches.find((item) => item.work_type === 9)?.period?.toString(),
            notifications: settings.switches.find((item) => item.work_type === 11)?.is_active,
            accounts_bool: settings.switches.find((item) => item.work_type === 12)?.is_active,
            accounts_period: settings.switches.find((item) => item.work_type === 12)?.period?.toString(),
            contacts: settings.switches.find((item) => item.work_type === 13)?.is_active,
            statistics_bool: settings.switches.find((item) => item.work_type === 14)?.is_active,
            statistics_period: settings.switches.find((item) => item.work_type === 14)?.period?.toString(),
            clipboard_bool: settings.switches.find((item) => item.work_type === 15)?.is_active,
            clipboard_period: settings.switches.find((item) => item.work_type === 15)?.period?.toString(),
        },
        mode: 'onChange',
    })

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const postBody: SetDeviceSettingsBody[] = []
        Object.keys(dirtyFields).forEach((key) => {
            if (key === 'sms') {
                postBody.push({
                    work_type: 2,
                    is_active: data.sms,
                    period: null,
                })
            } else if (key === 'call') {
                postBody.push({
                    work_type: 3,
                    is_active: data.call,
                    period: null,
                })
            } else if (key === 'gps') {
                postBody.push({
                    work_type: 7,
                    is_active: data.gps,
                    period: null,
                })
            } else if (key === 'wifi_bool') {
                postBody.push({
                    work_type: 8,
                    is_active: data.wifi_bool,
                    period: null,
                })
            } else if (key === 'wifi_period') {
                const type = postBody.find((item) => item.work_type === 8)
                if (type) {
                    type.period = data.wifi_period ? +data.wifi_period : null
                } else {
                    postBody.push({
                        work_type: 8,
                        is_active: true,
                        period: data.wifi_period ? +data.wifi_period : null,
                    })
                }
            } else if (key === 'apps_bool') {
                postBody.push({
                    work_type: 9,
                    is_active: data.apps_bool,
                    period: null,
                })
            } else if (key === 'apps_period') {
                const type = postBody.find((item) => item.work_type === 9)
                if (type) {
                    type.period = data.apps_period ? +data.apps_period : null
                } else {
                    postBody.push({
                        work_type: 9,
                        is_active: true,
                        period: data.apps_period ? +data.apps_period : null,
                    })
                }
            } else if (key === 'notifications') {
                postBody.push({
                    work_type: 11,
                    is_active: data.notifications,
                    period: null,
                })
            } else if (key === 'accounts_bool') {
                postBody.push({
                    work_type: 12,
                    is_active: data.accounts_bool,
                    period: null,
                })
            } else if (key === 'accounts_period') {
                const type = postBody.find((item) => item.work_type === 12)
                if (type) {
                    type.period = data.accounts_period ? +data.accounts_period : null
                } else {
                    postBody.push({
                        work_type: 12,
                        is_active: true,
                        period: data.accounts_period ? +data.accounts_period : null,
                    })
                }
            } else if (key === 'contacts') {
                postBody.push({
                    work_type: 13,
                    is_active: data.contacts,
                    period: null,
                })
            } else if (key === 'statistics_bool') {
                postBody.push({
                    work_type: 14,
                    is_active: data.statistics_bool,
                    period: null,
                })
            } else if (key === 'statistics_period') {
                const type = postBody.find((item) => item.work_type === 14)
                if (type) {
                    type.period = data.statistics_period ? +data.statistics_period : null
                } else {
                    postBody.push({
                        work_type: 14,
                        is_active: true,
                        period: data.statistics_period ? +data.statistics_period : null,
                    })
                }
            } else if (key === 'clipboard_bool') {
                postBody.push({
                    work_type: 15,
                    is_active: data.clipboard_bool,
                    period: null,
                })
            } else if (key === 'clipboard_period') {
                const type = postBody.find((item) => item.work_type === 15)
                if (type) {
                    type.period = data.clipboard_period ? +data.clipboard_period : null
                } else {
                    postBody.push({
                        work_type: 15,
                        is_active: true,
                        period: data.clipboard_period ? +data.clipboard_period : null,
                    })
                }
            }
        })
        setDeviceSettingsMutate({device_id: deviceStore.currentDeviceIndex!, body: postBody})
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={'flex flex-col gap-3 mt-5 px-7'}>
            <RenderCheckbox name={'Сообщения'} register={register} bool_name={'sms'} />
            <RenderCheckbox name={'Звонки'} register={register} bool_name={'call'} />
            <RenderCheckbox name={'GPS'} register={register} bool_name={'gps'} />
            <RenderComplexItem
                name={'WI-FI'}
                bool_name={'wifi_bool'}
                period_name={'wifi_period'}
                watch={watch}
                register={register}
                errors={errors}
            />
            <RenderComplexItem
                name={'Приложения'}
                bool_name={'apps_bool'}
                period_name={'apps_period'}
                watch={watch}
                register={register}
                errors={errors}
            />
            <RenderCheckbox name={'Уведомления'} register={register} bool_name={'notifications'} />
            <RenderComplexItem
                name={'Аккаунты'}
                bool_name={'accounts_bool'}
                period_name={'accounts_period'}
                watch={watch}
                register={register}
                errors={errors}
            />
            <RenderCheckbox name={'Контакты'} register={register} bool_name={'contacts'} />
            <RenderComplexItem
                name={'Статистика'}
                bool_name={'statistics_bool'}
                period_name={'statistics_period'}
                watch={watch}
                register={register}
                errors={errors}
            />
            <RenderComplexItem
                name={'Буфер обмена'}
                bool_name={'clipboard_bool'}
                period_name={'clipboard_period'}
                watch={watch}
                register={register}
                errors={errors}
            />
            <div className={'flex justify-center'}>
                <Button
                    type={'submit'}
                    disabled={!isValid || JSON.stringify(watch()) === JSON.stringify(defaultValues)}
                    variant={'contained'}
                    className={'mx-auto grow-0'}
                >
                    Сохранить
                </Button>
            </div>
        </form>
    )
})

interface RCIProps {
    name: string
    bool_name: string
    period_name: string
    errors: any
    register: any
    watch: any
}

const RenderComplexItem = (props: RCIProps) => {
    const {errors, period_name, name, bool_name, register, watch} = props
    return (
        <div className={'flex gap-3 h-10 items-center justify-between'}>
            <p className={'font-semibold text-lg'}>{name}</p>
            {errors[period_name] && (
                <p className={'ml-auto text-red-500 text-sm'}>{errors[period_name]?.message?.toString()}</p>
            )}
            <div className={'flex gap-2 items-center justify-between w-44'}>
                <label className='relative inline-flex items-center cursor-pointer'>
                    <input type='checkbox' {...register(bool_name)} className='sr-only peer' />
                    <div className={checkboxClasses}></div>
                </label>

                <input
                    disabled={!watch(bool_name)}
                    type='text'
                    {...register(period_name, {
                        pattern: {value: /^\d{2,}$/, message: 'Не менее 10 мин'},
                        required: {value: true, message: 'Обязательное поле'},
                    })}
                    className={inputClasses}
                />
                <p>мин</p>
            </div>
        </div>
    )
}

interface RCProps {
    name: string
    bool_name: string
    register: any
}

const RenderCheckbox = (props: RCProps) => {
    const {name, bool_name, register} = props

    return (
        <div className={'flex gap-3 h-10 items-center justify-between'}>
            <p className={'font-semibold text-lg'}>{name}</p>
            <label className='relative inline-flex items-center cursor-pointer w-44 ml-auto'>
                <input type='checkbox' {...register(bool_name)} className='sr-only peer' />
                <div className={checkboxClasses}></div>
            </label>
        </div>
    )
}
