// @ts-nocheck
import React, {useState} from 'react';
import {Box} from "@mui/material";
import Button from "@mui/material/Button";
import {observer} from "mobx-react-lite";
import LabelAndSelect from "../../../shared/LabelAndSelect/LabelAndSelect";
import CommandService, {CommandTypes} from "../../../services/CommandService";
import deviceStore from "../../../stores/deviceStore";
import {useMutation} from "@tanstack/react-query";
import snackbarStore, {Severity} from "../../../stores/snackbarStore";

const timeVariants = [{id: 0, name: '30 секунд', value: 30}, {id: 1, name: '1 минута', value: 60}, {
    id: 2,
    name: '2 минуты',
    value: 120
}, {id: 3, name: '3 минуты', value: 180}, {id: 4, name: '4 минуты', value: 240},  {id: 5, name: '5 минуты', value: 300}];

const RecordsControl = () => {
    const [selectedDuration, setSelectedDuration] = useState(30);

    const handleSelectChange = (field, value) => {
        setSelectedDuration(value);
    }

    const {
        mutateAsync: createCommand,
        error: createCommandError,
        isLoading: createCommandLoading,
    } = useMutation({
        mutationFn: CommandService.createCommand,
        retry: (err: unknown) => {
            if (err.response?.status === 400) {
                return false;
            }
        },
        onSuccess: (data: unknown) => {
            snackbarStore.setSnackbarSettings({
                label: "Команда отправлена",
                severity: Severity.success,
                opened: true
            });
        },
        onError: (data: unknown) => {
            snackbarStore.setSnackbarSettings({
                label: data.data.detail,
                severity: Severity.error,
                opened: true
            });
        }
    });

    return (
        <Box sx={{display: 'flex', p: '16px'}}>
            <Button onClick={() => deviceStore.currentDeviceIndex && createCommand({
                device_id: deviceStore.currentDeviceIndex, body: {
                    command_type: CommandTypes.RECORD_MICROPHONE,
                    content: {duration: selectedDuration}
                }
            })} variant={'contained'} sx={{mr: '16px'}} disabled={!deviceStore.currentDeviceIndex}>Записать окружение</Button>
            <Box sx={{width: '370px'}}>
                <LabelAndSelect items={timeVariants} currentItem={selectedDuration} onChange={handleSelectChange}
                                label='Продолжительность записи' labelWidth="230px" disabled={!deviceStore.currentDeviceIndex}/>
            </Box>
        </Box>
    );
};

export default observer(RecordsControl);
