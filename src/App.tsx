import './App.css'
import * as React from 'react'
import {RouterProvider} from 'react-router-dom'
import {useEffect, useState} from 'react'
import AuthPage from './pages/AuthPage/AuthPage'
import userStore from './stores/userStore'
import {router} from './utils/browserRouter'
import {QueryProvider} from './utils/queryProvider'
import CustomizedSnackbars from './shared/CustomizedSnackbars/CustomizedSnackbars'
import {observer} from 'mobx-react-lite'
import Box from '@mui/material/Box'

function App() {
    const [snackBarSettings, setSnackBarSettings] = useState({
        label: 'Сохранение успешно',
        severity: 'success',
        opened: false,
    })

    useEffect(() => {
        console.log(`Текущая версия проекта: ${import.meta.env.VITE_APP_VERSION}`)
    }, [])

    if (!userStore.isAuth) {
        return (
            <QueryProvider>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        backgroundColor: '#f0f9ff',
                    }}
                >
                    <AuthPage setSnackBarSettings={setSnackBarSettings} />
                    <CustomizedSnackbars snackBarSettings={snackBarSettings} />
                </Box>
            </QueryProvider>
        )
    }

    return (
        <QueryProvider>
            <RouterProvider router={router} />
        </QueryProvider>
    )
}

export default observer(App)
