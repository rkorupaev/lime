import * as React from 'react';
import Box from '@mui/material/Box';

export const CallRecord = () => {
    return (
        <Box sx={{display: 'flex', mt: '64px' }}>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                тут будет грид с записями звонков и панель управления
            </Box>
        </Box>
    );
}
