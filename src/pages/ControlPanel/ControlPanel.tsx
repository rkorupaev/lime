// @ts-nocheck
import * as React from 'react';
import Box from '@mui/material/Box';
import {CommandHistory} from "./CommandHistory/CommandHistory";
import Controls from "./Controls/Controls";

export const ControlPanel = () => {
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
                    p: '16px'
                }}
            >
                <Controls/>
                <CommandHistory/>
            </Box>
        </Box>
    );
}
