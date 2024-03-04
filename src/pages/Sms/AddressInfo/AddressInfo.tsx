// @ts-nocheck
import React, {useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
import {observer} from "mobx-react-lite";
import smsStore from "../../../stores/smsStore";
import AddressInfoItem from "./AddressInfoItem/AddressInfoItem";
import {toJS} from "mobx";
import AddressFilters from "./AddressFilters/AddressFilters";
import {useMutation} from "@tanstack/react-query";
import SmsService from "../../../services/SmsService";
import deviceStore from "../../../stores/deviceStore";
import {Virtuoso} from "react-virtuoso";

const AddressInfo = () => {
    const [smsList, setSmsList] = useState([]);

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
        if (toJS(smsStore.selectedAdressIndex)) getAddressSms({
            id: deviceStore.currentDeviceIndex,
            address: smsStore.selectedAdressIndex
        });
    }, [smsStore.selectedAdressIndex]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxHeight: 'calc(100vh - 153px)',
            minHeight: 'calc(100vh - 153px)',
            overflow: 'auto'
        }}>
            {(smsStore?.sms.length !== 0 || smsList?.length !== 0) && <AddressFilters setSmsList={setSmsList}/>}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column', m: '12px',
            }}>
                {!smsStore.selectedAdressIndex ? <Typography variant="h5" component='h5' sx={{alignSelf: "center"}}>
                    Выберите диалог в списке
                </Typography> : smsList?.length ? <Virtuoso
                        totalCount={smsList.length}
                        style={{ height: 'calc(100vh - 285px' }}
                        data={smsList}
                        itemContent={(index, item) => (
                            <AddressInfoItem key={index} item={item}/>
                        )}
                    />
                    : <Typography variant="h5" component='h5' sx={{alignSelf: "center"}}>
                        Сообщений по вашему фильтру не найдено
                    </Typography>}
            </Box>
        </Box>
    );
};

export default observer(AddressInfo);
