import React from 'react'
import Box from '@mui/material/Box'
import AccountsWidget from './AccountsWidget/AccountsWidget'
import Paper from '@mui/material/Paper'

const Accounts = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                mt: '64px',
                width: '100%',
            }}
        >
            <Box
                component='main'
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
                    flexGrow: 1,
                    height: 'calc(100vh - 64px)',
                    overflow: 'auto',
                    p: '16px',
                }}
            >
                <Paper sx={{display: 'flex', flexDirection: 'column'}}>
                    <AccountsWidget />
                </Paper>
            </Box>
        </Box>
    )
}

export default Accounts
