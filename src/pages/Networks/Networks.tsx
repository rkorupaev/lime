// @ts-nocheck
import * as React from 'react';
import Box from '@mui/material/Box';
import NetworksPackageList from "./NetworksPackageList/NetworksPackageList";
import NetworkInfo from "./NetworkInfo/NetworkInfo";

export const Networks = () => {
    return (
        <Box sx={{display: 'flex', mt: '64px', flexGrow: '1', width: 'calc(100vw - 240px)'}}>
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
                <Box sx={{display: 'flex', borderTop: '1px solid rgba(0, 0, 0, 0.12)'}}>
                    <NetworksPackageList/>
                    <NetworkInfo/>
                </Box>
            </Box>
        </Box>
    );
}
