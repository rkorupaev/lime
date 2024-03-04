import {createBrowserRouter} from 'react-router-dom'
import React from 'react'
import Layout from '../pages/Layout/Layout'
import {Contacts} from '../pages/Contacts/Contacts'
import {CallJournal} from '../pages/CallJournal/CallJournal'
import {EnvRecord} from '../pages/EnvRecord/EnvRecord'
import {CallRecord} from '../pages/CallRecord/CallRecord'
import {Camera} from '../pages/Camera/Camera'
import {ExchangeBuffer} from '../pages/ExchangeBuffer/ExchangeBuffer'
import Dashboard from '../pages/Dashboard/Dashboard'
import Sms from '../pages/Sms/Sms'
import {AppStat} from '../pages/AppStat/AppStat'
import {Networks} from '../pages/Networks/Networks'
import Location from '../pages/Location/Location'
import Accounts from '../pages/Accounts/Accounts'
import {Notifications} from '../pages/Notifications/Notifications'
import {Settings} from '../pages/Settings/Settings'
import {CameraControl} from '../pages/CameraControl/CameraControl'
import {FilesPage} from '../pages/FilesControl/FilesPage'
import {ControlPanel} from '../pages/ControlPanel/ControlPanel'

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: '/',
                children: [
                    {
                        element: <Dashboard />,
                        index: true,
                    },
                    {
                        path: 'dashboard',
                        element: <Dashboard />,
                    },
                    {
                        path: 'contacts',
                        element: <Contacts />,
                    },
                    {
                        path: 'sms',
                        element: <Sms />,
                    },
                    {
                        path: 'call_journal',
                        element: <CallJournal />,
                    },
                    {
                        path: 'app_stat',
                        element: <AppStat />,
                    },
                    {
                        path: 'location',
                        element: <Location />,
                    },
                    {
                        path: 'env_record',
                        element: <EnvRecord />,
                    },
                    {
                        path: 'call_record',
                        element: <CallRecord />,
                    },
                    {
                        path: 'cam',
                        element: <Camera />,
                    },
                    {
                        path: 'exchange_buffer',
                        element: <ExchangeBuffer />,
                    },
                    {
                        path: 'networks',
                        element: <Networks />,
                    },
                    {
                        path: 'accounts',
                        element: <Accounts />,
                    },
                    {
                        path: 'notifications',
                        element: <Notifications />,
                    },
                    {
                        path: 'buffer',
                        element: <ExchangeBuffer />,
                    },
                    {
                        path: 'settings',
                        element: <Settings />,
                    },
                    {
                        path: 'env_record',
                        element: <EnvRecord />,
                    },
                    {
                        path: 'camera',
                        element: <CameraControl />,
                    },
                    {
                        path: 'control_panel',
                        element: <ControlPanel />,
                    },
                    {
                        path: 'files',
                        element: <FilesPage />,
                    },
                    // {
                    //     path: 'applications',
                    //     children: [
                    //         {
                    //             element: <EngMenu/>,
                    //             index: true,
                    //         },
                    //
                    //     ],
                    // },
                ],
            },
        ],
    },
])
