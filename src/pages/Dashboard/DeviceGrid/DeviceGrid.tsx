// @ts-nocheck
import React, {useEffect} from 'react'
import {DataGridPro} from '@mui/x-data-grid-pro'
import {observer} from 'mobx-react-lite'
import {useMutation} from '@tanstack/react-query'
import DeviceService from '../../../services/DeviceService'
import deviceStore from '../../../stores/deviceStore'
import snackbarStore, {Severity} from '../../../stores/snackbarStore'
import GridNoResultsOverlay from '../../../shared/GridNoResultsOverlay/GridNoResultsOverlay'
import GridNoRowBlock from '../../../shared/GridNoRowBlock/GridNoRowBlock'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InfoIcon from '@mui/icons-material/Info'
import {getLocales4DataGrid, prettifyDate} from '../../../utils/utils'

const DeviceGrid = ({openInfo}) => {
    const {currentDeviceIndex} = deviceStore

    const columns = [
        {
            field: '',
            headerName: '',
            width: 50,
            renderCell: (cellValue: any) => {
                return (
                    <IconButton onClick={(e) => openInfo(true)}>
                        <InfoIcon color={'info'} />
                    </IconButton>
                )
            },
            sortable: false,
            menu: false,
            resizable: false,
        },
        {
            field: 'name',
            headerName: 'Имя',
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'manufacture',
            headerName: 'Производитель',
            minWidth: 120,
            flex: 1,
        },
        {
            field: 'device',
            headerName: 'Модель',
            minWidth: 120,
            flex: 1,
        },
        {
            field: 'app_version',
            headerName: 'Версия приложения',
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'last_gps',
            headerName: 'IP',
            minWidth: 100,
            flex: 1,
            renderCell: (cellValue: any) => {
                return (
                    <Typography variant='p' component='p'>
                        {cellValue.row.last_gps.length > 0 ? cellValue.row.last_gps[0].ip : 'Неизвестно'}
                    </Typography>
                )
            },
        },
        {
            field: 'last_connection',
            headerName: 'Время последнего подключения',
            minWidth: 150,
            flex: 1,
            renderCell: (cellValue: any) => {
                return (
                    <Typography variant='p' component='p'>
                        {prettifyDate(cellValue.row.last_connection)}
                    </Typography>
                )
            },
        },
        // {field: 'battery_state', headerName: 'Статус батареи', minWidth: 100, flex: 1},
        {
            field: 'battery_lvl',
            headerName: 'Уровень заряда',
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'android_version',
            headerName: 'Версия андроида',
            minWidth: 100,
            flex: 1,
        },
    ]

    //TODO подумать логику обновления девайсов.
    const {
        mutateAsync: getDevices,
        error: getDevicesError,
        isLoading: getDevicesLoading,
    } = useMutation({
        mutationFn: DeviceService.getDevices,
        retry: (err: unknown) => {
            if (err.response?.status === 400) {
                return false
            }
        },
        onMutate: () => {
            deviceStore.setIsLoading(true)
        },
        onSuccess: (data: unknown) => {
            deviceStore.setDevices(data.data)
        },
        onError: (data: unknown) => {
            snackbarStore.setSnackbarSettings({
                label: data.data.detail,
                severity: Severity.error,
                opened: true,
            })
        },
        onSettled: () => {
            deviceStore.setIsLoading(false)
        },
    })

    useEffect(() => {
        getDevices()
    }, [])

    // console.log(deviceStore.currentDeviceIndex)

    return (
        <DataGridPro
            rowHeight={50}
            rows={deviceStore.devices}
            columns={columns}
            // disableColumnResize={true}
            pageSize={10}
            rowsPerPageOptions={[10]}
            density='compact'
            sx={{
                fontSize: '12px',
                maxHeight: '57vh',
                minHeight: '57vh',
                '& .MuiDataGrid-columnHeader--moving': {
                    backgroundColor: 'white',
                },
                '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                },
                '& .MuiDataGrid-row': {
                    cursor: 'pointer',
                },
                '& .MuiDataGrid-row.Mui-hovered': {
                    backgroundColor: '#cbd5e1',
                },
                '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#cbd5e1',
                },
            }}
            // disableColumnSelector
            // disableColumnMenu
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            disableMultipleRowSelection
            localeText={getLocales4DataGrid()}
            loading={deviceStore.isLoading}
            getRowClassName={(params) => (params.row.id === currentDeviceIndex ? 'bg-slate-200' : '')}
            onRowClick={(row) => deviceStore.setCurrentDeviceIndex(row.id as string)}
            NoRowsOverlay={() => <GridNoRowBlock label='Список устройств пуст' />}
            noResultsOverlay={() => <GridNoResultsOverlay text='Устройства по вашему запросу не найдены' />}
        />
    )
}

export default observer(DeviceGrid)
