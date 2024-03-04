// @ts-nocheck
import React from 'react';
import {prettifyDate} from "../../../../utils/utils";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import {RenderIcon} from "../../../../shared/RenderIcon/RenderIcon";

const AccountItem = ({item}) => {
    return (
        <ListItem>
            <RenderIcon data={item} package_name={item.type} />
            <Typography variant='body1' component='p' sx={{ ml: '16px', width: '250px'}}>{item.name}</Typography>
            <Typography variant='body1' component='p' sx={{ ml: '16px', mr: 'auto'}}>{item.type}</Typography>
            <Typography variant='body1' component='p'>{prettifyDate(item.log_time)}</Typography>
        </ListItem>
    );
};

export default AccountItem;
