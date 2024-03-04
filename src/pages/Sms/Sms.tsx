// @ts-nocheck
import * as React from 'react';
import Box from '@mui/material/Box';
import {useMutation} from "@tanstack/react-query";
import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import deviceStore from "../../stores/deviceStore";
import SmsService from "../../services/SmsService";
import smsStore from "../../stores/smsStore";
import AddressList from "./AddressList/AddressList";
import AddressInfo from "./AddressInfo/AddressInfo";
import FilterAndSyncBlock from "../../shared/FilterAndSyncBlock/FilterAndSyncBlock";
import 'dayjs/locale/ru.js';
import {Tooltip} from "@mui/material";
import Button from "@mui/material/Button";
import ModalWrapper from "../../shared/Modal/Modal";
import SendSmsModal from "../../shared/Modal/SendSmsModal/SendSmsModal";
import MessageIcon from '@mui/icons-material/Message';

const Sms = () => {
    const [searchValue, setSearchValue] = useState<string>('');
    const [openSendSms, setOpenSendSms] = useState<boolean>(false);

    const {
        mutateAsync: getAddresses,
        error: getSmsError,
        isLoading: getSmsLoading,
    } = useMutation({
        mutationFn: SmsService.getAddresses,
        retry: (err: unknown) => {
            if (err.response?.status === 400) {
                return false;
            }
        },
        onMutate: () => {
            smsStore.setIsLoading(true);
        },
        onSuccess: (data: unknown) => {
            smsStore.setAddresses(data.data);
        },
        onError: (data: unknown) => {
            // snackbarStore.setSnackbarSettings({
            //     label: data.data.detail,
            //     severity: Severity.error,
            //     opened: true
            // });
        },
        onSettled: () => {
            smsStore.setIsLoading(false);
        }
    });

    const {
        mutateAsync: getAddressSms,
    } = useMutation({
        mutationFn: SmsService.getAddressSms,
        retry: (err: unknown) => {
            if (err.response?.status === 400) {
                return false;
            }
        },
        onMutate: () => {
            smsStore.setIsLoading(true);
        },
        onSuccess: (data: unknown) => {
            smsStore.setSms(data.data);
            setSmsList(data.data);
        },
        onError: (data: unknown) => {
            // snackbarStore.setSnackbarSettings({
            //     label: data.data.detail,
            //     severity: Severity.error,
            //     opened: true
            // });
        },
        onSettled: () => {
            smsStore.setIsLoading(false);
        }
    });

    useEffect(() => {
        if (!smsStore.addresses.length) {
            smsStore.setSelectedAdressIndex(null)
        } else {
            smsStore.setSelectedAdressIndex(smsStore.addresses[0].address);
        }
    }, [smsStore.addresses.length]);

    useEffect(() => {
        if (deviceStore.currentDevice) getAddresses({id: deviceStore.currentDeviceIndex});
    }, []);

    const filterSms = () => {
        getAddresses({id: deviceStore.currentDeviceIndex, address__ilike: searchValue});
    }

    const clearSearch = () => {
        getAddresses({id: deviceStore.currentDeviceIndex});
        setSearchValue('');
    }

    return (
        <Box sx={{
            display: 'flex', mt: '64px', width: '100%'
        }}>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: 'calc(100vh - 64px)',
                    overflow: 'auto',
                }}
            >
                <Box sx={{display: 'flex', m: '12px'}}>
                    <FilterAndSyncBlock searchValue={searchValue} onSearchValueChange={setSearchValue}
                                        onFilter={filterSms}
                                        onSync={() => deviceStore.currentDevice && getAddresses({
                                            id: deviceStore.currentDeviceIndex,
                                            address__ilike: searchValue
                                        })}
                                        isLoading={smsStore.isLoading} onClear={clearSearch}/>
                    <Tooltip title='Отправить смс' placement='top'>
                        <Button variant='contained'
                                onClick={() => setOpenSendSms(true)}
                                sx={{ml: 'auto'}}
                        >
                            <MessageIcon/>
                        </Button>
                    </Tooltip>
                </Box>
                <Box sx={{display: 'flex', borderTop: '1px solid rgba(0, 0, 0, 0.12)'}}>
                    <AddressList/>
                    <AddressInfo/>
                </Box>
            </Box>
            <ModalWrapper
                open={openSendSms}
                setOpen={setOpenSendSms}
                modalTitle='Новое сообщение'
            >
                <SendSmsModal handleClose={setOpenSendSms}/>
            </ModalWrapper>
        </Box>
    );
}


export default observer(Sms);
