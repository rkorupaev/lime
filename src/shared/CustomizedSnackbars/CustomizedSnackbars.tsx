// @ts-nocheck
import * as React from 'react'
import {forwardRef} from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import {observer} from 'mobx-react-lite'
import snackbarStore from '../../stores/snackbarStore'

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const CustomizedSnackbars = ({snackBarSettings}) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        snackbarStore.closeSnackbarSettings()
    }

    return (
        <Snackbar
            open={snackBarSettings.opened}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={snackBarSettings.anchorOrigin}
        >
            <Alert
                onClose={handleClose}
                severity={snackBarSettings.severity}
                sx={{width: '100%'}}
                size={snackBarSettings.size}
            >
                {snackBarSettings.label}
            </Alert>
        </Snackbar>
    )
}

export default observer(CustomizedSnackbars)
