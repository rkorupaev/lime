import {useEffect, useState} from 'react'
import {useQuery} from '@tanstack/react-query'
import AppService from '../../services/AppService'
import deviceStore from '../../stores/deviceStore'
import {PieChartWrapper, secondsToHHMMss} from './PieChart/PieChart'
import {observer} from 'mobx-react-lite'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation'
import Divider from '@mui/material/Divider'
import {AppTable} from './AppTable/AppTable'
import {DatePicker} from '@mui/x-date-pickers'
import dayjs, {Dayjs} from 'dayjs'
import {RenderIcon} from '../../shared/RenderIcon/RenderIcon'
import {useFillAppIcons} from '../../shared/hooks/useFillAppIcons'

export const AppStat = observer(() => {
    const [date, setDate] = useState(dayjs())
    const {fillLocalStorage} = useFillAppIcons()

    if (!deviceStore.currentDeviceIndex) {
        return (
            <div className={'flex w-full mt-headerHeight h-contentHeight justify-center'}>
                <p className={'text-xl text-slate-600 text-center mt-10'}>Девайс не выбран</p>
            </div>
        )
    } else {
        const {data: dayCurrentStat, isPending: getCurrentStatLoading} = useQuery({
            queryFn: () =>
                AppService.getAppsStatsDay({
                    device_id: deviceStore.currentDeviceIndex!,
                    day: dayjs(date).format('YYYY-MM-DD'),
                }),
            queryKey: ['appCurrentStat', date],
        })

        const {data: getAvailableDaysStatsData} = useQuery({
            queryFn: () =>
                AppService.getAvailableDaysStats({
                    device_id: deviceStore.currentDeviceIndex!,
                }),
            queryKey: ['getAvailableDaysStats'],
        })

        useEffect(() => {
            if (dayCurrentStat) {
                const topTen = dayCurrentStat.data
                    .toSorted((a, b) => (a.foreground_time < b.foreground_time ? 1 : -1))
                    .slice(0, 10)
                fillLocalStorage(topTen)
            }
        }, [dayCurrentStat, fillLocalStorage])

        const handleDayChange = (date: Dayjs | null) => {
            if (date && deviceStore.currentDeviceIndex) {
                setDate(date)
            }
        }

        return (
            <div
                className={
                    'flex w-full flex-col mt-headerHeight h-contentHeight text-slate-600 p-5 gap-5 bg-gray-50 overflow-auto'
                }
            >
                <p className={'text-3xl mb-5 text-center'}>Статистика использования приложений</p>
                <Divider />
                <div className={'flex justify-around mt-6 flex-wrap'}>
                    <div className={'flex flex-col w-6/12'}>
                        <Stack direction='column' sx={{flexGrow: 0, alignItems: 'center'}}>
                            <DatePicker
                                disableFuture
                                label={'Дата'}
                                shouldDisableDate={(day: Dayjs) =>
                                    !getAvailableDaysStatsData?.data.includes(dayjs(day).format('YYYY-MM-DD'))
                                }
                                value={date}
                                onChange={handleDayChange}
                                minDate={dayjs().subtract(6, 'days')}
                            />

                            {getCurrentStatLoading ? (
                                <CircularProgress sx={{mt: '150px'}} size={80} />
                            ) : (
                                <>
                                    {dayCurrentStat?.data && !!dayCurrentStat?.data.length ? (
                                        <PieChartWrapper data={dayCurrentStat?.data} />
                                    ) : (
                                        <div className={'flex justify-center items-center w-full h-[400px]'}>
                                            Данных о статистике нет
                                            <NotListedLocationIcon color={'info'} />
                                        </div>
                                    )}
                                </>
                            )}
                        </Stack>
                    </div>
                    <div className={'flex flex-col w-6/12'}>
                        <Stack sx={{flexGrow: 0, alignItems: 'center'}}>
                            <div className={'flex justify-center items-center h-14'}>
                                <Typography sx={{width: '100%'}} align={'center'} component='p' variant='h5'>
                                    Топ 10
                                </Typography>
                            </div>
                            {getCurrentStatLoading ? (
                                <CircularProgress sx={{mt: '150px'}} size={80} />
                            ) : (
                                <>
                                    {dayCurrentStat?.data && !!dayCurrentStat?.data.length ? (
                                        <Stack spacing={2} mt={5} sx={{width: '80%'}}>
                                            {dayCurrentStat && dayCurrentStat.data
                                                .toSorted((a, b) => (a.foreground_time < b.foreground_time ? 1 : -1))
                                                .slice(0, 10)
                                                .map((item) => (
                                                    <Stack key={item.app_name} direction={'row'} sx={{width: '80%'}}>
                                                        <RenderIcon data={item} package_name={item.package_name} />
                                                        <Typography sx={{ml: '16px'}}>{item.app_name}</Typography>
                                                        <Typography sx={{ml: 'auto'}}>
                                                            {secondsToHHMMss(item.foreground_time)}
                                                        </Typography>
                                                    </Stack>
                                                ))}
                                        </Stack>
                                    ) : (
                                        <div className={'flex justify-center items-center w-full h-[400px]'}>
                                            Данных о статистике нет
                                            <NotListedLocationIcon color={'info'} />
                                        </div>
                                    )}
                                </>
                            )}
                        </Stack>
                    </div>
                </div>
                <p className={'text-center text-3xl mt-7'}>Список приложений</p>
                <AppTable />
            </div>
        )
    }
})
