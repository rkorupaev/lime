import React from 'react';
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";
import Box from "@mui/material/Box";

const PageNotFound = () => {
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1}}>
            <Typography variant='h2' component='h2' sx={{fontSize: '150px'}}>
                404
            </Typography>
            <Typography variant='h3' component='h3'>
                страница не найдена
            </Typography>
            <Typography variant='p' component='p'>
                страница, на которую вы пытаетесь попасть, не существует или была удалена
            </Typography>
            {/*<Typography variant='p' component='p'>*/}
            {/*    Перейдите на*/}
            {/*    <Link to='/events'> страницу Событий (или какую-то другую) </Link>*/}
            {/*</Typography>*/}
        </Box>
    );
};

export default PageNotFound;
