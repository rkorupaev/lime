// @ts-nocheck
import './Sidebar.scss'
import {observer} from 'mobx-react-lite'
import IconButton from '@mui/material/IconButton'
import React, {useEffect, useMemo, useState} from 'react'
import NestedList from './NestedList/NestedList'
import Toolbar from '@mui/material/Toolbar'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import Drawer from '@mui/material/Drawer'
import {createTheme, styled, ThemeProvider} from '@mui/material/styles'
import MuiDrawer from '@mui/material/Drawer'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar'
import DashboardIcon from '@mui/icons-material/Dashboard'
import MapIcon from '@mui/icons-material/Map'
import ImportContactsIcon from '@mui/icons-material/ImportContacts'
import SmsIcon from '@mui/icons-material/Sms'
import CallIcon from '@mui/icons-material/Call'
import MicIcon from '@mui/icons-material/Mic'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import TuneIcon from '@mui/icons-material/Tune'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import userStore from '../../../stores/userStore'
import AuthService from '../../../services/AuthService'
import {useMutation} from '@tanstack/react-query'
import snackbarStore from '../../../stores/snackbarStore'
import LogoutIcon from '@mui/icons-material/Logout'
import ModalWrapper from '../../../shared/Modal/Modal'
import UserSettings from '../../../pages/Layout/UserSettings/UserSettings'
import ChangePasswordModal from '../../../shared/Modal/ChangePasswordModal/ChangePasswordModal'
import {useLocation} from 'react-router-dom'
import deviceStore from '../../../stores/deviceStore'
import smsStore from '../../../stores/smsStore'
import contactsStore from '../../../stores/contactsStore'
import WifiIcon from '@mui/icons-material/Wifi'
import {toJS} from 'mobx'
import {LocalStorageKeys} from '../../../config'
import FaceIcon from '@mui/icons-material/Face'
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch'
import networksStore from '../../../stores/networksStore'
import microStore from '../../../stores/microStore'
import ControlCameraIcon from '@mui/icons-material/ControlCamera'
import FilesStore from '../../FilesControl/store/filesStore'
import clsx from 'clsx'

const getPageTitle = (url: string): string => {
    const titles: {[index: string]: string} = {
        '/contacts': 'Контакты',
        '/dashboard': 'Панель управления',
        '/sms': 'Сообщения',
        '/': 'Панель управления',
        '/call_journal': 'Журнал вызовов',
        '/location': 'Журнал геолокаций',
        '/app_stat': 'Статистика приложений',
        '/networks': 'Сети Wi-Fi',
        '/accounts': 'Аккаунты',
        '/notifications': 'Уведомления',
        '/settings': 'Настройки',
        '/buffer': 'Журнал буфера обмена ',
        '/env_record': 'Запись окружения',
        '/camera': 'Управление камерой',
        '/files': 'Управление файлами',
        '/control_panel': 'Управление телефоном',
    }

    return titles[url]
}

const Sidebar = observer(() => {
    const location = useLocation()

    const drawerWidth: number = 240

    const [open, setOpen] = React.useState(true)
    const [changeUserPasswordModalOpened, setChangeUserPasswordModalOpened] = useState(false)

    const toggleDrawer = () => {
        setOpen(!open)
    }

    const defaultTheme = createTheme()

    interface AppBarProps extends MuiAppBarProps {
        open?: boolean
    }

    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open',
    })<AppBarProps>(({theme, open}) => ({
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }))

    const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(({theme, open}) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }))

    const listItems = useMemo(
        () => [
            {
                key: 'dashboard',
                route: 'dashboard',
                label: 'Панель управления',
                color: 'info',
                icon: DashboardIcon,
                items: [],
            },
            {
                key: 'contacts',
                route: 'contacts',
                label: 'Контакты',
                color: 'info',
                icon: ImportContactsIcon,
                items: [],
            },
            // {
            //     key: "charts",
            //     route: "charts",
            //     label: "Графики",
            //     icon: StackedLineChartIcon,
            //     color: 'info',
            //     items: [],
            // },
            {
                key: 'location',
                route: 'location',
                label: 'Геолокация',
                icon: MapIcon,
                color: 'info',
                items: [],
            },
            {
                key: 'sms',
                route: 'sms',
                label: 'Сообщения',
                icon: SmsIcon,
                color: 'info',
                items: [],
            },
            {
                key: 'call_journal',
                route: 'call_journal',
                label: 'Журнал вызовов',
                icon: CallIcon,
                color: 'info',
                items: [],
            },
            {
                key: 'app_stat',
                route: 'app_stat',
                label: 'Статистика приложений',
                icon: QueryStatsIcon,
                color: 'info',
                items: [],
            },
            {
                key: 'networks',
                route: 'networks',
                label: 'Сети Wi-Fi',
                icon: WifiIcon,
                color: 'info',
                items: [],
            },
            {
                key: 'accounts',
                route: 'accounts',
                label: 'Аккаунты',
                icon: FaceIcon,
                color: 'info',
                items: [],
            },
            {
                key: 'notifications',
                route: 'notifications',
                label: 'Уведомления',
                icon: NotificationsIcon,
                color: 'info',
                items: [],
            },
            {
                key: 'buffer',
                route: 'buffer',
                label: 'Журнал буфера обмена',
                icon: ContentPasteSearchIcon,
                color: 'info',
                items: [],
            },
            {
                key: 'camera',
                route: 'camera',
                label: 'Управление камерой',
                icon: CameraAltIcon,
                color: 'info',
                items: [],
            },
            {
                key: 'files',
                route: 'files',
                label: 'Управление файлами',
                icon: InsertDriveFileIcon,
                color: 'info',
                items: [],
            },
            {
                key: 'env_record',
                route: 'env_record',
                label: 'Запись окружения',
                icon: MicIcon,
                color: 'info',
                items: [],
            },
            {
                key: 'control_panel',
                route: 'control_panel',
                label: 'Управление телефоном',
                icon: ControlCameraIcon,
                color: 'info',
                items: [],
            },
            {
                key: 'settings',
                route: 'settings',
                label: 'Настройки',
                icon: TuneIcon,
                color: 'info',
                items: [],
            },
            // {
            //     key: "env_record",
            //     route: "env_record",
            //     label: "Запись окружения",
            //     icon: MicIcon,
            //     color: 'info',
            //     items: [],
            // },
            // {
            //     key: "call_record",
            //     route: "call_record",
            //     label: "Запись звонков",
            //     icon: RadioButtonCheckedIcon,
            //     color: 'error',
            //     items: [],
            // },
            // {
            //     key: "cam",
            //     route: "cam",
            //     label: "Доступ к камере",
            //     icon: CameraAltIcon,
            //     color: 'info',
            //     items: [],
            // },
        ],
        []
    )

    const {
        mutateAsync: logOut,
        error: logOutError,
        isLoading: logOutLoading,
    } = useMutation({
        mutationFn: AuthService.logout,
        retry: (err: unknown) => {
            if (err.response?.status === 400) {
                return false
            }
        },
        onSuccess: (data) => {
            localStorage.removeItem(LocalStorageKeys.ACCESS_TOKEN)
            localStorage.removeItem(LocalStorageKeys.REFRESH_TOKEN)
            localStorage.removeItem(LocalStorageKeys.CURRENT_DEVICE)
            userStore.setIsAuth(false)
        },
        onError: (data) => {
            snackbarStore.setSnackbarSettings({
                label: data.data.detail,
                severity: 'error',
                opened: true,
            })
        },
    })

    useEffect(() => {
        smsStore.setSelectedAdressIndex(null)
        contactsStore.setSelectedContactIndex(null)
        networksStore.setCurrentNetworkIndex(null)
        networksStore.setCurrentNetworkData(null)
        microStore.resetWaveforms()
    }, [deviceStore.currentDevice])

    const setDeviceSelectItems = () => {
        return toJS(deviceStore.devices).map((device) => ({
            number: device.id,
            name: device.device,
        }))
    }

    const isDeviceConnected =
        FilesStore.connectedDeviceId === deviceStore.currentDeviceIndex ||
        FilesStore.activeDevices.includes(deviceStore.currentDeviceIndex)

    return (
        <ThemeProvider theme={defaultTheme}>
            <AppBar position='absolute' open={open}>
                <Toolbar
                    sx={{
                        pr: '24px',
                    }}
                >
                    <IconButton
                        edge='start'
                        color='inherit'
                        aria-label='open drawer'
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: '36px',
                            ...(open && {display: 'none'}),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography component='p' color='inherit' noWrap sx={{mr: '12px'}}>
                        {getPageTitle(location.pathname)}
                    </Typography>
                    {/*{(location.pathname === '/' || location.pathname === '/dashboard') ?*/}
                    <Tooltip
                        title={
                            deviceStore.currentDevice?.device.length > 21 ? `${deviceStore.currentDevice?.device}` : ''
                        }
                        placement='bottom'
                    >
                        <Typography
                            component='p'
                            sx={{
                                marginRight: '8px',
                                ml: 'auto',
                                mr: '16px',
                                width: '300px',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Устройство: {deviceStore.currentDevice?.device || 'не выбрано'}
                        </Typography>
                    </Tooltip>
                    <div className={'flex items-center gap-4 mr-6'}>
                        <div
                            className={clsx(
                                'w-6 h-6 rounded-full border border-gray-400',
                                isDeviceConnected ? 'bg-green-600' : 'bg-red-500'
                            )}
                        />
                        <p>{isDeviceConnected ? 'Девайс подключен' : 'Девайс не подключен'}</p>
                    </div>
                    {/*:*/}
                    {/*    <Box sx={{ ml: 'auto',*/}
                    {/*        mr: '16px', width: '300px', marginRight: '8px',}}>*/}
                    {/*        <LabelAndSelect items={setDeviceSelectItems()} currentItem={deviceStore.currentDeviceIndex} label="Устройство" onChange={() => {*/}
                    {/*        }}/>*/}
                    {/*    </Box>}*/}
                    <Box sx={{flexGrow: 0, display: 'flex', alignItems: 'center'}}>
                        <Typography component='p' sx={{marginRight: '8px'}}>
                            Пользователь: {userStore.user?.username}
                        </Typography>
                        <UserSettings setChangeUserPasswordModalOpened={setChangeUserPasswordModalOpened} />
                        <Button
                            variant='outlined'
                            color='inherit'
                            startIcon={<LogoutIcon />}
                            size='small'
                            onClick={logOut}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
                <ModalWrapper
                    open={changeUserPasswordModalOpened}
                    setOpen={setChangeUserPasswordModalOpened}
                    modalTitle='Окно смены пароля'
                >
                    <ChangePasswordModal handleClose={setChangeUserPasswordModalOpened} />
                </ModalWrapper>
            </AppBar>
            <Drawer variant='permanent' open={open} sx={{height: '100vh'}}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: [1],
                    }}
                >
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component='nav'>
                    <NestedList items={listItems} />
                </List>
            </Drawer>
        </ThemeProvider>
    )
})

export default Sidebar
