// @ts-nocheck
import React, {useEffect, useState} from "react";
import Stack from "@mui/material/Stack";
import {observer} from "mobx-react-lite";
import LabelAndInput from "../../LabelAndInput/LabelAndInput";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useMutation} from "@tanstack/react-query";
import SnackbarStore, {Severity} from "../../../stores/snackbarStore";
import deviceStore from "../../../stores/deviceStore";
import CommandService, {CommandTypes} from "../../../services/CommandService";
import Typography from "@mui/material/Typography";
import smsStore from "../../../stores/smsStore";
import snackbarStore from "../../../stores/snackbarStore";

const onlyDigits = /\D/g;

const SendSmsModal = ({handleClose}) => {
    const [phone, setPhone] = useState(smsStore.selectedAdressIndex || '');
    const [text, setText] = useState('');
    const [error, setError] = useState(false);
    const [isTouched, setIsTouched] = useState({phone: false, text: false});

    useEffect(() => {
        setError(phone.length < 2 || text > 100);
    }, [phone, text]);

    const handleCloseModal = () => {
        handleClose(false);
        setPhone('');
        setText('');
        setError(false);
        setIsTouched({phone: false, text: false});
    }

    const handlePhoneChange = (phone) => {
        setPhone('+' + phone);
    }

    const handleOnBlur = () => {
        if (phone === '+') setPhone('');
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

    const handleOnSend = () => {
        createCommand({
            device_id: deviceStore.currentDeviceIndex, body: {
                command_type: CommandTypes.SEND_SMS,
                content: {
                    address:phone,
                    body: text
                }
            }
        });
        handleCloseModal();
    }

    return (
        <>
            <Stack spacing={0.5}>
                <LabelAndInput value={phone} onChange={(e) => handlePhoneChange(e.target.value.replace(onlyDigits, ""))}
                               label='Номер телефона'
                               helperText={isTouched.phone && phone.length < 2 ? 'Это поле обязательное' : ''}
                               error={isTouched.phone && phone.length < 2}
                               type={'text'}
                               onFocus={() => setIsTouched({...isTouched, phone: true})}
                               autoComplete='off' onBlur={() => handleOnBlur()}/>
                <LabelAndInput value={text} onChange={(e) => setText(e.target.value)}
                               label='Текст сообщения'
                               error={isTouched.text && text.length > 100}
                               type={'text'}
                               onFocus={() => setIsTouched({...isTouched, text: true})}
                               autoComplete='off' multiline={true} rows={3}/>
                <Box sx={{display: 'flex', alignSelf: 'flex-end'}}>
                    {text.length > 100 &&
                    <Typography variant="body2" component="p" sx={{color: 'red'}}>
                        Превышен лимит символов
                    </Typography>}
                    <Typography variant="body2" component="p" sx={{ml: '4px'}}>
                        {text.length} / 100
                    </Typography>
                </Box>
            </Stack>
            <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-around', marginTop: '12px'}}>
                <Button variant='outlined' onClick={handleCloseModal} color='error' sx={{width: '150px'}}
                >Отменить</Button>
                <Button variant='contained'
                        onClick={() => handleOnSend()}
                        color='success'
                        sx={{width: '250px'}}
                        disabled={error || text.length > 100}
                >Отправить сообщение</Button>
            </Box>
        </>
    );
};

export default observer(SendSmsModal);
