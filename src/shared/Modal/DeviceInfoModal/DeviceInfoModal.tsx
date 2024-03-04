// @ts-nocheck
import React from "react";
import Stack from "@mui/material/Stack";
import {observer} from "mobx-react-lite";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LabelAndText from "../../LabelAndText/LabelAndText";
import deviceStore from "../../../stores/deviceStore";
import {Tooltip, Typography} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {prettifyDate} from "../../../utils/utils";

const getCommandName = (id) => {
    const names = {
        1: "Контакты",
        2: "Смс",
        3: "Звонки",
        4: "Камера",
        5: "Файлы",
        6: "Аудио",
        7: "Геолокации",
        8: "Сети вайфай",
        9: "Приложения",
        10: "Разрешения",
        11: "Оповещения",
        12: "Аккаунты",
        13: "Контакты",
        14: "Статистика приложений",
        15: "Буфер обмена",
    }

    return names[id];
}

const getColor = (id) => {
    const colors = {
        0: "info",
        1: "",
        2: "warning",
        3: "success",
        4: "",

    }

    return colors[id];
}

const getColorTooltip = (id) => {
    const tootips = {
        0: "Начато",
        1: "Не закончено",
        2: "Ошибка агента",
        3: "Выполнено",
        4: "Нет прав",

    }

    return tootips[id];
}

const DeviceInfoModal = ({handleClose}) => {
    const handleCloseModal = () => {
        handleClose(false);
    }

    const device = deviceStore.currentDevice;
    const sync_status = device?.sync_status;

    return (
        <>
            <Stack spacing={0.5}>
                <LabelAndText label="Модель" text={device.device || 'данных нет'}/>
                <LabelAndText label="Производитель" text={device.manufacture || 'данных нет'}/>
                <LabelAndText label="Номер сборки" text={device.build_id || 'данных нет'}/>
                <Typography component='p' variant='body1'>Статус синхронизации данных:</Typography>
                {sync_status.length ? sync_status.map(status => (<Box sx={{display: 'flex'}}>
                    <Typography component='p' variant='body1'
                                sx={{width: '100px', maxWidth: '100px'}}>{getCommandName(status.command)}:</Typography>
                    <Tooltip title={getColorTooltip(status.status)} placement='right'>
                        <CheckCircleIcon color={getColor(status.status)} sx={{ml: '12px', mr: '12px'}}/>
                    </Tooltip>
                    <Typography component='p' variant='body1'>{prettifyDate(status.log_time)}</Typography>
                </Box>)) : <Typography component='p' variant='body1'
                                       sx={{alignSelf: 'center'}}>Данных нет</Typography>}
            </Stack>
            <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-around', marginTop: '18px'}}>
                <Button variant='outlined' onClick={handleCloseModal} color='info' sx={{width: '150px'}}
                >Закрыть</Button>
            </Box>
        </>
    );
};

export default observer(DeviceInfoModal);
