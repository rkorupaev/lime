import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import {LicenseInfo} from '@mui/x-data-grid-pro'

LicenseInfo.setLicenseKey(
    '70dbc723a7dbe040e93caec1a931b694Tz02MjQ4NCxFPTE3MTEwMjQ4MTE3MDcsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI='
)

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
