// @ts-nocheck
import React, {useEffect} from 'react';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import {observer} from "mobx-react-lite";
import networksStore from "../../../stores/networksStore";
import {prettifyDate} from "../../../utils/utils";
import {useMutation} from "@tanstack/react-query";
import NetworksService from "../../../services/NetworksService";
import deviceStore from "../../../stores/deviceStore";
import {Virtuoso} from "react-virtuoso";
import {Box, Typography} from "@mui/material";
import {toJS} from "mobx";

const PAGE_COUNT = 30;

const NetworksPackageList = () => {
    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
    ) => {
        if (networksStore.currentNetworkIndex !== index) {
            networksStore.setCurrentNetworkIndex(index);
            networksStore.getCurrentNetworkData({
                device_id: deviceStore.currentDeviceIndex,
                date: networksStore.networks[index]
            });
        }
    };

    const {
        mutateAsync: getNetworks,
        error: getNetworksError,
        isLoading: getNetworksLoading,
    } = useMutation({
        mutationFn: NetworksService.getNetworksList,
        retry: (err: unknown) => {
            if (err.response?.status === 400) {
                return false;
            }
        },
        onMutate: () => {
            networksStore.setIsLoading(true);
        },
        onSuccess: (data: unknown, variables: unknown) => {
            networksStore.setTotalCount(data.headers['x-total-count']);
            networksStore.setNetworks(data.data, variables.initial);
        },
        onError: (data: unknown) => {
            // snackbarStore.setSnackbarSettings({
            //     label: data.data.detail,
            //     severity: Severity.error,
            //     opened: true
            // });
        },
        onSettled: () => {
            networksStore.setIsLoading(false);
        }
    });

    useEffect(() => {
        //@ts-ignore
        if (deviceStore.currentDevice) getNetworks({device_id: deviceStore.currentDeviceIndex, limit: PAGE_COUNT, page: 1, initial: true });
    }, []);

    const loadMore = (index) => {
        if (deviceStore.currentDevice && networksStore.totalCount - index - 1 > 0 ) getNetworks({device_id: deviceStore.currentDeviceIndex, limit: PAGE_COUNT, page: Math.ceil(index / PAGE_COUNT) + 1 });
    }

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column', m: '12px',
                width: 300
            }}>
                {networksStore.networks.length ? <Virtuoso
                        totalCount={networksStore.totalCount}
                        style={{ height: 'calc(100vh - 94px' }}
                        data={networksStore.networks}
                        endReached={index => loadMore(index)}
                        overscan={200}
                        itemContent={(index, item) => (
                            <ListItemButton
                                selected={networksStore.currentNetworkIndex === index}
                                onClick={(event) => handleListItemClick(event, index)}
                                key={index}
                            >
                                <ListItemText
                                    primary={prettifyDate(item)}
                                    sx={{wordBreak: 'break-all'}}/>
                            </ListItemButton>
                        )}
                    />
                    : <Typography variant="h5" component='h5' sx={{alignSelf: "center"}}>
                    Данных нет
                    </Typography>}
            </Box>
        </>
    );
};

export default observer(NetworksPackageList);
