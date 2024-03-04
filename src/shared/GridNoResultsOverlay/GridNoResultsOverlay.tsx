import React from 'react';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AnnouncementIcon from "@mui/icons-material/Announcement";

const GridNoResultsOverlay = ({text}: {text: string}) => {
    return (
        <Stack height="100%" alignItems="center" justifyContent="center" flexDirection="row">
            <Typography variant='h4' component='p' sx={{fontSize: '22px', marginRight: '12px'}}>
                {text}
            </Typography>
            <AnnouncementIcon color='warning'/>
        </Stack>
    );
};

export default GridNoResultsOverlay;
