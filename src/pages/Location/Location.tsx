// @ts-nocheck
import * as React from 'react';
import Box from '@mui/material/Box';
import {MapWidget} from "./MapWidget";
import deviceStore from "../../stores/deviceStore";
import 'dayjs/locale/ru.js';
import {toJS} from "mobx";
import NotListedLocationIcon from "@mui/icons-material/NotListedLocation";
import {useEffect} from "react";
import gpsStore from "../../stores/gpsStore";
import {observer} from "mobx-react-lite";
import {useMutation} from "@tanstack/react-query";
import GpsService from "../../services/GpsService";

const INITIAL_GPS_COUNT = 100;

const Location = () => {
    useEffect(() => {
        getLocations({device_id: deviceStore.currentDeviceIndex, limit: INITIAL_GPS_COUNT});
    },[]);

    const {
        mutateAsync: getLocations,
        error: getLocationsError,
        isLoading: getLocationsLoading,
    } = useMutation({
        mutationFn: GpsService.getGpsLocations,
        retry: (err: unknown) => {
            if (err.response?.status === 400) {
                return false;
            }
        },
        onMutate: () => {
            gpsStore.setIsLoading(true);
        },
        onSuccess: (data: unknown) => {
            gpsStore.setLocations(data.data);
            gpsStore.setMaxDate(data.headers['x-max-date-till']);
            gpsStore.setMinDate(data.headers['x-min-date-from']);
            gpsStore.setCount(data.headers['x-total-count']);
        },
        onError: (data: unknown) => {
            // snackbarStore.setSnackbarSettings({
            //     label: data.data.detail,
            //     severity: Severity.error,
            //     opened: true
            // });
        },
        onSettled: () => {
            gpsStore.setIsLoading(false);
        }
    });

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
                {gpsStore.locations[0] ?
                    <MapWidget coords={toJS(gpsStore.locations)} getLocations={getLocations}/>
                    : <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                    }}>Данных от геолокации нет<NotListedLocationIcon color={'info'}/></Box>}

            </Box>
        </Box>
    );
}

export default observer(Location);
