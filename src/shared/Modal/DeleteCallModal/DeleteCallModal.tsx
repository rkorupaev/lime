// @ts-nocheck
import React from "react";
import {observer} from "mobx-react-lite";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useMutation} from "@tanstack/react-query";
import {Severity} from "../../../stores/snackbarStore";
import microStore from "../../../stores/microStore";
import CommandService, {CommandTypes} from "../../../services/CommandService";
import snackbarStore from "../../../stores/snackbarStore";
import deviceStore from "../../../stores/deviceStore";

const DeleteCallModal = ({handleClose, currentCall}) => {
    const handleCloseModal = () => {
        handleClose(false);
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

    const handleOnDelete = () => {
        createCommand({
            device_id: deviceStore.currentDeviceIndex, body: {
                command_type: CommandTypes.DEL_CALL,
                content: {
                    call_id: currentCall.call_id
                }
            }
        });
        handleCloseModal();
    }

    return (
        <>
            <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-around', marginTop: '12px'}}>
                <Button variant='outlined' onClick={handleCloseModal} color='error' sx={{width: '150px', mr: '16px'}}
                        disabled={microStore.isLoading}
                >Отменить</Button>
                <Button variant='contained'
                               onClick={() => handleOnDelete()}
                               color='error'
                               sx={{width: '250px'}}
                               >Удалить вызов</Button>
            </Box>
        </>
    );
};

export default observer(DeleteCallModal);
