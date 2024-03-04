// @ts-nocheck
import React, {useState} from 'react';
import Button from "@mui/material/Button";
import {Stack} from "@mui/material";
import Box from "@mui/material/Box";
import LabelAndInput from "../../../shared/LabelAndInput/LabelAndInput";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import CommandService, {CommandTypes} from "../../../services/CommandService";
import snackbarStore, {Severity} from "../../../stores/snackbarStore";
import deviceStore from "../../../stores/deviceStore";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import ModalWrapper from "../../../shared/Modal/Modal";
import DestroyAppModal from "../../../shared/Modal/DestroyAppModal/DestroyAppModal";
import WarningIcon from '@mui/icons-material/Warning';

const onlyDigits = /\D/g;
//TODO надо ли? или пусть юзер сам тыкает правильные урлы?
const validURL = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

const Controls = () => {
    const queryClient = useQueryClient()
    const [phone, setPhone] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    const [notification, setNotification] = useState<{ title: string, message: string }>({title: '', message: ''});
    const [isTouched, setIsTouched] = useState({url: false, title: false, text: false});
    const [isDestroyModalOpened, setIsDestroyModalOpened] = useState<boolean>(false);

    const handlePhoneChange = (phone) => {
        setPhone('+' + phone);
    }

    const handleOnBlur = () => {
        if (phone === '+') setPhone('');
    }

    const clearEntries = (type: number) => {
        switch (type) {
            case 23:
                setNotification({title: '', message: ''});
                break;
            case 13:
                setUrl('');
                setIsTouched({...isTouched, url: false});
                break;
            case 4:
                setPhone('');
                break;
            default:
                return;
        }
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
        onSuccess: (data: unknown, variables) => {
            clearEntries(variables.body.command_type);
            queryClient.invalidateQueries({queryKey: ['getCommands']})
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

    return (
        <Paper sx={{p: '16px'}}>
            <Typography variant={'h5'} component={'p'} sx={{mb: '8px'}}>Доступные команды:</Typography>
            <Stack spacing={1}>
                <Box sx={{display: 'flex'}}>
                    <LabelAndInput value={phone}
                                   onChange={(e) => handlePhoneChange(e.target.value.replace(onlyDigits, ""))}
                                   label='Номер телефона'
                                   placeholder='+79991234567'
                                   type={'text'}
                                   autoComplete='off' labelWidth={135} onBlur={() => handleOnBlur()}/>
                    <Button variant='contained'
                            sx={{width: '250px', ml: '16px'}} disabled={phone.length < 2} onClick={() => createCommand({
                        device_id: deviceStore.currentDeviceIndex, body: {
                            command_type: CommandTypes.MAKE_A_CALL,
                            content: {
                                address: phone
                            }
                        }
                    })}
                    >Выполнить звонок</Button>
                </Box>
                <Box sx={{display: 'flex'}}>
                    <LabelAndInput value={url}
                                   onChange={(e) => setUrl(e.target.value)}
                                   label='URL'
                                   placeholder='https://www.youtube.com'
                                   type={'text'}
                                   autoComplete='off' labelWidth={135}
                                   error={isTouched.url && !validURL.test(url)}
                                   onFocus={() => setIsTouched({...isTouched, url: true})}
                    />
                    <Tooltip placement='top'
                             title={!validURL.test(url) ? "Некорректный формат" : ''}>
                    <span>
                    <Button variant='contained'
                            sx={{width: '250px', ml: '16px'}} disabled={!url.length || !validURL.test(url)}
                            onClick={() => createCommand({
                                device_id: deviceStore.currentDeviceIndex, body: {
                                    command_type: CommandTypes.BROWSE_URL,
                                    content: {
                                        url: url
                                    }
                                }
                            })}
                    >Открыть страницу</Button>
                         </span>
                    </Tooltip>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <LabelAndInput value={notification.title}
                                   onChange={(e) => setNotification({...notification, title: e.target.value})}
                                   label='Уведомление'
                                   type={'text'}
                                   autoComplete='off' labelWidth={135}
                                   error={notification.title.length > 20}
                                   placeholder='Заголовок'
                    />
                    <TextField
                        variant='outlined'
                        size='small'
                        value={notification.message}
                        onChange={(e) => setNotification({...notification, message: e.target.value})}
                        sx={{
                            ml: '16px',
                            '& .MuiFormHelperText-root': {
                                position: 'absolute',
                                top: '7px',
                                right: '0',
                                pointerEvents: 'none',
                            },
                        }}
                        type={'text'}
                        // helperText={helperText}
                        // onFocus={onFocus}
                        error={notification.message.length > 100}
                        autoComplete='off'
                        placeholder='Содержание'
                    />

                    <Tooltip placement='top'
                             title={(notification.title.length > 20 || notification.message.length > 100) ? "Длинна превышена" : ''}>
                    <span>
                         <Button variant='contained'
                                 sx={{width: '250px', ml: '16px'}}
                                 disabled={!notification.title.length || !notification.message.length || notification.title.length > 20 || notification.message.length > 100}
                                 onClick={() => createCommand({
                                     device_id: deviceStore.currentDeviceIndex, body: {
                                         command_type: CommandTypes.VIEW_NOTIFICATIONS,
                                         content: notification
                                     }
                                 })}
                         >Отправить уведомление</Button>
                    </span>
                    </Tooltip>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Typography>Удалить это приложение с телефона</Typography>
                    <Button variant='contained'
                            sx={{width: '250px', ml: '16px'}}
                            onClick={() => setIsDestroyModalOpened(true)} color={'error'}
                    ><WarningIcon/> Удалить</Button>
                </Box>
            </Stack>
            <ModalWrapper open={isDestroyModalOpened} setOpen={setIsDestroyModalOpened}
                          modalTitle='Удалить приложение с телефона'>
                <DestroyAppModal handleClose={setIsDestroyModalOpened}/>
            </ModalWrapper>
        </Paper>
    );
};

export default Controls;
