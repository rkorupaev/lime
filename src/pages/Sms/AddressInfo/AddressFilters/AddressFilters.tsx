// @ts-nocheck
import React, {useCallback, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";

import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import ClearIcon from '@mui/icons-material/Clear';
import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from "@mui/icons-material/Search";
import {useMutation} from "@tanstack/react-query";
import SmsService from "../../../../services/SmsService";
import smsStore from "../../../../stores/smsStore";
import deviceStore from "../../../../stores/deviceStore";
import {DateTimePicker} from "@mui/x-date-pickers";
import Box from "@mui/material/Box";
import dayjs, {Dayjs} from "dayjs";
import {toJS} from "mobx";

const AddressFilters = ({setSmsList}) => {

    const initialDateEnd = toJS(smsStore.sms)[0].date;
    const initialDateStart = toJS(smsStore.sms).at(-1).date;
    const [searchValue, setSearchValue] = useState<string>('');
    const [dateStart, setDateStart] = useState<Dayjs>(() => dayjs(initialDateStart));
    const [dateEnd, setDateEnd] = useState<Dayjs>(() => dayjs(initialDateEnd));


    useEffect(() => {
        setSearchValue('');
        setDateStart(dayjs(toJS(smsStore.sms).at(-1).date));
        setDateEnd(dayjs(toJS(smsStore.sms)[0].date));
    }, [smsStore.sms]);

    const {
        mutateAsync: getSms,
        error: getSmsError,
        isLoading: getSmsLoading,
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
            let filteredData = data.data;
            if (searchValue) filteredData = filteredData.filter(item => item?.body.toLowerCase().includes(searchValue.toLowerCase()));
            setSmsList(filteredData);
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

    const filterSms = () => {
        getSms({
            id: deviceStore.currentDeviceIndex,
            address: smsStore.selectedAdressIndex,
            date__from: dateStart.format(),
            date__till: dateEnd.format()
        });
    };

    const clearFilter = () => {
        setSearchValue('');
        getSms({
            id: deviceStore.currentDeviceIndex,
            address: smsStore.selectedAdressIndex,
        }).then(() => {
            setDateStart(dayjs(toJS(smsStore.sms).at(-1).date));
            setDateEnd(dayjs(toJS(smsStore.sms)[0].date));
        });
    }

    const handleSetDateStart = (e: Dayjs | null) => {
        if (e) {
            setDateStart(e);
        }
    }

    const handleSetDateEnd = (e: Dayjs | null) => {
        if (e) {
            setDateEnd(e);
        }
    }


    return (
        <>
            <Box sx={{borderBottom: '1px solid rgba(0, 0, 0, 0.12)'}}>
                <Box sx={{display: 'flex', m: '8px', flexWrap: 'wrap'}}>
                    <DateTimePicker
                        value={dateStart}
                        ampm={false}
                        onAccept={handleSetDateStart}
                        minDateTime={dayjs(initialDateStart)}
                        maxDateTime={
                            dateEnd.isBefore(dayjs(initialDateEnd))
                                ? dateEnd
                                : dayjs(initialDateEnd)
                        }
                        sx={{
                            '& .MuiInputBase-input': {paddingBlock: '10px'}, mr: '8px', mb: '8px', height: '40px'
                        }}
                        label='Время начала'
                    />
                    <DateTimePicker
                        value={dateEnd}
                        ampm={false}
                        onAccept={handleSetDateEnd}
                        minDateTime={dateStart.isAfter(dayjs(initialDateStart)) ? dateStart : dayjs(initialDateStart)}
                        maxDateTime={dayjs(initialDateEnd)}
                        sx={{'& .MuiInputBase-input': {paddingBlock: '10px'}, mr: '8px', mb: '8px', height: '40px'}}
                        label='Время окончания'
                    />
                    <TextField variant="outlined" size="small" value={searchValue}
                               onChange={(e) => setSearchValue(e.currentTarget.value)}
                               placeholder="Введи текст поиска..."
                               sx={{'& .MuiInputBase-input': {height: '26px'}}}
                    />
                    <LoadingButton variant='contained'
                                   onClick={() => filterSms()}
                                   sx={{ml: '14px', maxHeight: '43px'}}
                                   loading={smsStore.isLoading}><SearchIcon/></LoadingButton>
                    <LoadingButton variant='contained'
                                   onClick={() => clearFilter()}
                                   sx={{ml: '14px', maxHeight: '43px'}}
                                   loading={smsStore.isLoading}><ClearIcon/></LoadingButton>
                </Box>
            </Box>
        </>
    );
};


export default observer(AddressFilters);
