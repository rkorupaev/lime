// @ts-nocheck
import React from 'react';
import {Box} from "@mui/material";
import NetworksGrid from "./NetworksGrid/NetworksGrid";
import {MapWidget} from "../../Dashboard/MapWidget";
import {toJS} from "mobx";
import NotListedLocationIcon from "@mui/icons-material/NotListedLocation";
import networksStore from "../../../stores/networksStore";
import {observer} from "mobx-react-lite";

const NetworkInfo = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxHeight: 'calc(100vh - 65px)',
            minHeight: 'calc(100vh - 65px)',
            overflow: 'auto',
            p: '16px'
        }}>
            <Box sx={{ display: 'flex', flexGrow: 1, mb: '16px'}}>
                {networksStore.currentNetworkData?.gps ?
                    <MapWidget
                        coords={[toJS(networksStore.currentNetworkData).gps] || []}/>
                    : <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}>Данных от геолокации нет<NotListedLocationIcon color={'info'}/></Box>}
            </Box>
            <NetworksGrid/>
        </Box>
    );
};

export default observer(NetworkInfo);
