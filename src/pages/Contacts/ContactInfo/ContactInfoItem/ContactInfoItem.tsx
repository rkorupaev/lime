// @ts-nocheck
import React from 'react';
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LabelAndText from "../../../../shared/LabelAndText/LabelAndText";
import {observer} from "mobx-react-lite";

const infoWrapperStyles = {
    display: 'flex', width: '100%',
    alignItems: 'flex-start',
}

const iconWrapperStyles = {
    display: 'flex', mr: '16px', width: '160px'
}

export interface ContactInfoItem {
    label?: string,
    icon?: React.ReactElement,
    items?: string[],
}

const ContactInfoItem = ({label, icon: Icon, items = []}: ContactInfoItem) => {
    return (
        <>
            <Divider/>
            <Box sx={infoWrapperStyles}>
                <Box sx={iconWrapperStyles}>
                    <Icon color={"info"} sx={{mr: '8px'}}/>
                    <Typography variant="body1" component='p' sx={{alignSelf: 'center'}}>
                        {label}
                    </Typography>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    {items!.map((item, index) => (<Typography key={index} id="modal-modal-title" variant="p" component="p"
                        >
                            : {item}
                        </Typography>
                    ))}
                </Box>
            </Box>
        </>
    );
};

export default observer(ContactInfoItem);
