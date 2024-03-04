// @ts-nocheck
import React, {useEffect, useState} from "react";
import Stack from "@mui/material/Stack";
import {observer} from "mobx-react-lite";
import LabelAndInput from "../../LabelAndInput/LabelAndInput";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import {useMutation} from "@tanstack/react-query";
import UserService from "../../../services/UserService";
import SnackbarStore, {Severity} from "../../../stores/snackbarStore";
import UserStore from "../../../stores/userStore";


const ChangePasswordModal = ({handleClose}) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [validatePassword, setValidatePassword] = useState('');
    const [error, setError] = useState(false);
    const [isTouched, setIsTouched] = useState({newPassword: false, oldPassword: false, validatePassword: false});

    useEffect(() => {
        if (newPassword !== validatePassword) {
            setError(true);
        } else {
            setError(false);
        }
    }, [newPassword, validatePassword]);

    const handleCloseModal = () => {
        handleClose(false);
        setNewPassword('');
        setOldPassword('');
        setValidatePassword('');
        setError(false);
        setIsTouched({newPassword: false, oldPassword: false, validatePassword: false});
    }

    const {
        mutateAsync: changePass,
        error: changePassError,
        isLoading: changePassLoading,
    } = useMutation({
        mutationFn: UserService.changeUserPassword,
        retry: (err: unknown) => {
            if (err.response?.status === 400) {
                return false;
            }
        },
        onSuccess: (data) => {
            handleCloseModal();
            UserStore.setIsAuth(false);
            // SnackbarStore.setSnackbarSettings({
            //     label: 'Пароль успешно изменен',
            //     severity: Severity.success,
            //     opened: true
            // });
        },
        onError: (data) => {
            SnackbarStore.setSnackbarSettings({
                label: data.data.detail,
                severity: Severity.error,
                opened: true
            });
        }
    });

    return (

        <>
            <Stack spacing={0.5}>
                <LabelAndInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                               label='Новый пароль'
                               helperText={newPassword.length === 0 ? 'Это поле обязательное' : ''}
                               error={newPassword.length === 0}
                               type={'password'}
                               onFocus={() => setIsTouched({...isTouched, newPassword: true})}
                               autoComplete='off'/>
                <LabelAndInput value={validatePassword} onChange={(e) => setValidatePassword(e.target.value)}
                               label='Повторите новый пароль'
                               helperText={error ? 'Пароли не совпадают' : ''}
                               error={error}
                               type={'password'}
                               onFocus={() => setIsTouched({...isTouched, validatePassword: true})}
                               autoComplete='off'/>
            </Stack>
            <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-around', marginTop: '12px'}}>
                <Button variant='outlined' onClick={handleCloseModal} color='error' sx={{width: '150px'}}
                        disabled={changePassLoading}
                >Отменить</Button>
                <LoadingButton variant='contained'
                               onClick={() => changePass(newPassword)}
                               color='success'
                               sx={{width: '250px'}}
                               disabled={newPassword.length < 3 || error}
                               loadingIndicator="Сохраняю..."
                               loading={changePassLoading}>Сохранить новый пароль</LoadingButton>
            </Box>
        </>
    );
};

export default observer(ChangePasswordModal);
