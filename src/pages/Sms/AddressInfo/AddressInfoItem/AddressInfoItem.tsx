// @ts-nocheck
import React from 'react';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import smsStore from "../../../../stores/smsStore";
import {observer} from "mobx-react-lite";
import {prettifyDate} from "../../../../utils/utils";

const infoWrapperStyles = {
    display: 'flex', width: '60%',
    alignItems: 'flex-start',
    marginTop: '8px',
}

const outboxWrapper = {
    marginLeft: 'auto',
    marginRight: '31px',
}

const iconWrapperStyles = {
    display: 'flex', width: '100%',
}

const inboxMessage = {
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    borderTopLeftRadius: 0,
    p: '12px',
    width: '100%',
    ml: '24px !important'
}

const outboxMessage = {
    alignSelf: 'center',
    backgroundColor: '#e3e3e3',
    borderRadius: '16px',
    borderTopRightRadius: 0,
    p: '12px',
    width: '100%',
    ml: '24px !important'
}


const AddressInfoItem = ({item}) => {
    return (
            <Box sx={item.type === 1 ? infoWrapperStyles : {...infoWrapperStyles, ...outboxWrapper}}>
                <Box sx={{display: 'flex', flexGrow: 1}}>
                    <Stack spacing={0.5} sx={iconWrapperStyles}>
                        {item.type === 1 &&
                        <Typography variant="body1" component='p' sx={item.type === 1 ? {
                            alignSelf: 'flex-start',
                            ml: '16px !important'
                        } : {alignSelf: 'flex-end', ml: '16px !important'}}>
                            {smsStore.selectedAdress?.address}
                        </Typography>}
                        <Typography variant="body1" component='p' sx={item.type === 1 ? inboxMessage : outboxMessage}>
                            {item.body}
                        </Typography>
                        <Typography variant="body1" component='p'
                                    sx={item.type === 1 ? {alignSelf: 'flex-end',} : {alignSelf: 'flex-start', ml: '16px !important'}}>
                            {prettifyDate(item.date)}
                        </Typography>
                    </Stack>
                </Box>
            </Box>
    );
};


export default observer(AddressInfoItem);
