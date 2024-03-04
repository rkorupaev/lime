import * as React from 'react';
import Box from '@mui/material/Box';

export const Camera = () => {
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
                    height: 'calc(100vh - 64px)',
                    overflow: 'auto',
                }}
            >
                тут будет плитка из фото и панель управления
            </Box>
        </Box>
    );
}
