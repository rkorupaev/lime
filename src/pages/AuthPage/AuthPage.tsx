// @ts-nocheck
import React, {useRef, useState} from 'react'
import styles from './AuthPage.module.scss'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import AccountCircle from '@mui/icons-material/AccountCircle'
import PasswordIcon from '@mui/icons-material/Password'
import Box from '@mui/material/Box'
import LabelAndInput from '../../shared/LabelAndInput/LabelAndInput'
import {useMutation} from '@tanstack/react-query'
import AuthService from '../../services/AuthService'
import userStore from '../../stores/userStore'
import UserService from '../../services/UserService'
import {LocalStorageKeys} from '../../config'

interface AuthData {
    user: string
    password: string
}

const AuthPage = ({setSnackBarSettings}) => {
    const [data, setData] = useState<AuthData>({
        user: '',
        password: '',
    })

    const userData = useRef()
    userData.current = data

    const {
        mutateAsync: logIn,
        // error: logInError,
        // isLoading: logInLoading,
    } = useMutation({
        mutationFn: AuthService.login,
        retry: (err: unknown) => {
            if (err.response?.status === 400) {
                return false
            }
        },
        onSuccess: (data) => {
            localStorage.setItem(LocalStorageKeys.ACCESS_TOKEN, data.data.access_token)
            localStorage.setItem(LocalStorageKeys.REFRESH_TOKEN, data.data.refresh_token)
            getUser()
        },
        onError: (data) => {
            setSnackBarSettings({
                label: 'Неверный логин или пароль! ' + data.data.detail,
                severity: 'error',
                opened: true,
            })
        },
    })

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
            userStore.setIsAuth(true)
        },
        onError: (data) => {
            setSnackBarSettings({
                label: data.detail,
                severity: 'error',
                opened: true,
            })
        },
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        await logIn(userData.current)
    }

    const onClearButtonCLick = () => {
        setData({
            user: '',
            password: '',
        })
    }

    return (
        <form onSubmit={handleSubmit} className={styles.auth__form}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'}}>
                <Typography id='modal-modal-title' variant='h5' component='h5'>
                    Авторизация
                </Typography>
            </Box>
            <Stack spacing={3}>
                <LabelAndInput
                    label='Пользователь'
                    value={data.user}
                    onChange={(e: any) => setData({...data, user: e.target.value})}
                    inputIcon={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <AccountCircle color='primary' />
                            </InputAdornment>
                        ),
                    }}
                />
                <LabelAndInput
                    label='Пароль'
                    value={data.password}
                    onChange={(e: any) => setData({...data, password: e.target.value})}
                    type='password'
                    inputIcon={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <PasswordIcon color='primary' />
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>
            <Box className={styles.buttons__container}>
                <Button variant='outlined' onClick={onClearButtonCLick}>
                    Очистить
                </Button>
                <Button
                    variant='contained'
                    type={'submit'}
                    disabled={data.user.length === 0 || data.password.length === 0}
                >
                    Вход
                </Button>
            </Box>
        </form>
    )
}

export default AuthPage
