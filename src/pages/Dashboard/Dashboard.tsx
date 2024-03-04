// @ts-nocheck
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from "../../shared/Chart";
import DeviceGrid from "./DeviceGrid/DeviceGrid";
import {useMutation} from "@tanstack/react-query";
import DeviceService from "../../services/DeviceService";
import deviceStore from "../../stores/deviceStore";
import snackbarStore, {Severity} from "../../stores/snackbarStore";
import {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {MapWidget} from "./MapWidget";
import {toJS} from "mobx";
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
import DeviceInfoModal from "../../shared/Modal/DeviceInfoModal/DeviceInfoModal";
import ModalWrapper from "../../shared/Modal/Modal";
import 'dayjs/locale/ru.js';

const Dashboard = () => {

    const [infoModalOpened, setInfoModalOpened] = useState(false);
    const {
        mutateAsync: getChartData,
        error: getChartDataError,
        isLoading: getChartDataLoading,
    } = useMutation({
        mutationFn: DeviceService.getChartData,
        retry: (err: unknown) => {
            if (err.response?.status === 400) {
                return false;
            }
        },
        onSuccess: (data: unknown) => {
            deviceStore.setDeviceBatteryData(data.data);
        },
        onError: (data: unknown) => {
            // snackbarStore.setSnackbarSettings({
            //     label: data.data.detail,
            //     severity: Severity.error,
            //     opened: true
            // });
        }
    });

    useEffect(() => {
        if (deviceStore.currentDeviceIndex) getChartData({id: deviceStore.currentDeviceIndex, limit: 100});
    }, [deviceStore.currentDevice]);

    return (
        <Box sx={{display: 'flex', mt: '64px', flexGrow: 1,}}>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: 'calc(100vh - 64px)',
                    overflow: 'auto'
                }}
            >
                <Container maxWidth={false} sx={{mt: 4, mb: 4, flexGrow: 1, width: 'calc(100vw - 240px)'}}>
                    <Grid container spacing={3} sx={{width: '100%'}}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    height: 270,
                                }}
                            >
                                <Chart/>
                                <Box sx={{maxWidth: '50%', display: 'flex', flexGrow: 1}}>
                                    {deviceStore.currentDevice?.last_gps[0] ?
                                        <MapWidget
                                            coords={toJS(deviceStore.currentDevice).last_gps.length ? [toJS(deviceStore.currentDevice).last_gps[0]] : []}/>
                                        : <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%'
                                        }}>Данных от геолокации нет<NotListedLocationIcon color={'info'}/></Box>}
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                        <Paper sx={{display: 'flex', flexDirection: 'column'}}>
                            <DeviceGrid openInfo={setInfoModalOpened}/>
                        </Paper>
                    </Grid>
                    </Grid>
                </Container>
            </Box>
            <ModalWrapper open={infoModalOpened} setOpen={setInfoModalOpened}
                          modalTitle='Информация об устройстве'>
                <DeviceInfoModal handleClose={setInfoModalOpened}/>
            </ModalWrapper>
        </Box>
    );
}

export default observer(Dashboard);


