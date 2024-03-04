// @ts-nocheck
import React, {useEffect, useState} from "react";
import Stack from "@mui/material/Stack";
import {observer} from "mobx-react-lite";
import LabelAndInput from "../../LabelAndInput/LabelAndInput";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useMutation} from "@tanstack/react-query";
import SnackbarStore, {Severity} from "../../../stores/snackbarStore";
import CommandService, {CommandTypes} from "../../../services/CommandService";
import snackbarStore from "../../../stores/snackbarStore";
import deviceStore from "../../../stores/deviceStore";

const onlyDigits = /\D/g;

const AddContactModal = ({handleClose}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState(false);
    const [isTouched, setIsTouched] = useState({newPassword: false, oldPassword: false, validatePassword: false});

    useEffect(() => {
        setError(!name && !email && phone.length < 2);
    }, [name, email, phone]);

    const handleCloseModal = () => {
        handleClose(false);
        setName('');
        setEmail('');
        setPhone('');
        setError(false);
        setIsTouched({name: false, email: false, phone: false});
    }

    const {
        mutateAsync: createCommand,
        error: createCommandError,
        isLoading: createCommandLoading,
    } = useMutation({
        mutationFn: CommandService.createCommand,
        retry: (err: unknown) => {
            if (err.response?.status === 400) {
                return false;
            }
        },
        onSuccess: (data: unknown) => {
            snackbarStore.setSnackbarSettings({
                label: "Команда отправлена",
                severity: Severity.success,
                opened: true
            });
        },
        onError: (data: unknown) => {
            snackbarStore.setSnackbarSettings({
                label: data.data.detail,
                severity: Severity.error,
                opened: true
            });
        }
    });

    const handlePhoneChange = (phone) => {
        setPhone('+' + phone);
    }

    const handleOnBlur = () => {
        if (phone === '+') setPhone('');
    }

    const handleOnSave = () => {
        createCommand({
            device_id: deviceStore.currentDeviceIndex, body: {
                command_type: CommandTypes.ADD_CONTACT,
                content: {
                    contact_id:  null,
                    phones: [{
                        number: phone,
                        type: 1
                    }],
                    emails: [
                        {
                            address: email,
                            type: 1
                        }
                    ],
                    name: {
                        display_name: name,
                        given_name: name,
                    }
                }
            }
        });
        handleCloseModal();
    }

    return (
        <>
            <Stack spacing={0.5}>
                <LabelAndInput value={name} onChange={(e) => setName(e.target.value)}
                               label='Имя контакта'
                               helperText={isTouched.name && error ? 'Одно из полей обязательное' : ''}
                               error={isTouched.name && error}
                               type={'text'}
                               onFocus={() => setIsTouched({...isTouched, name: true})}
                               autoComplete='off' labelWidth={160} />
                <LabelAndInput value={email} onChange={(e) => setEmail(e.target.value)}
                               label='Эл. почта контакта'
                               helperText={isTouched.email && error ? 'Одно из полей обязательное' : ''}
                               error={isTouched.email && error}
                               type={'text'}
                               onFocus={() => setIsTouched({...isTouched, email: true})}
                               autoComplete='off' labelWidth={160} />
                <LabelAndInput value={phone} onChange={(e) => handlePhoneChange(e.target.value.replace(onlyDigits, ""))}
                               label='Номер телефона'
                               helperText={isTouched.phone && error ? 'Одно из полей обязательное' : '' }
                               error={isTouched.phone &&  error}
                               type={'text'}
                               onFocus={() => setIsTouched({...isTouched, phone: true})}
                               autoComplete='off' labelWidth={160} onBlur={() => handleOnBlur()}/>
            </Stack>
            <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-around', marginTop: '12px'}}>
                <Button variant='outlined' onClick={handleCloseModal} color='error' sx={{width: '150px'}}
                >Отменить</Button>
                <Button variant='contained'
                               onClick={() => deviceStore.currentDeviceIndex && handleOnSave()}
                               color='success'
                               sx={{width: '250px'}}
                               disabled={error}
                               >Сохранить новый контакт</Button>
            </Box>
        </>
    );
};

export default observer(AddContactModal);
