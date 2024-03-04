// @ts-nocheck
import React from "react";
import {observer} from "mobx-react-lite";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import {useMutation} from "@tanstack/react-query";
import SnackbarStore, {Severity} from "../../../stores/snackbarStore";
import MicroFilesService from "../../../services/MicroFilesService";
import microStore from "../../../stores/microStore";

const DeleteRecordModal = ({handleClose, currentRecord}) => {
    const handleCloseModal = () => {
        handleClose(false);
    }

    const {
        mutateAsync: deleteRecord,
        error: deleteRecordError,
        isLoading: deleteRecordLoading,
    } = useMutation({
        mutationFn: MicroFilesService.deleteMicroFile,
        retry: (err: unknown) => {
            if (err.response?.status === 400) {
                return false;
            }
        },
        onMutate: () => {
          microStore.setIsLoading(true);
        },
        onSuccess: (data) => {
            microStore.setRecords(microStore.records.filter(record => record.id !== data.data[0]));
            microStore.deleteFileFromStore(data.data[0]);
            handleCloseModal();
            SnackbarStore.setSnackbarSettings({
                label: 'Запись успешно удалена',
                severity: Severity.success,
                opened: true
            });
        },
        onError: (data) => {
            SnackbarStore.setSnackbarSettings({
                label: data.detail,
                severity: Severity.error,
                opened: true
            });
        },
        onSettled: () => {
            microStore.setIsLoading(false);
        }
    });

    return (
        <>
            <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-around', marginTop: '12px'}}>
                <Button variant='outlined' onClick={handleCloseModal} color='error' sx={{width: '150px', mr: '16px'}}
                        disabled={microStore.isLoading}
                >Отменить</Button>
                <LoadingButton variant='contained'
                               onClick={() => deleteRecord({ids: [currentRecord]})}
                               color='error'
                               sx={{width: '250px'}}
                               loadingIndicator="Удаляю..."
                               loading={microStore.isLoading}>Удалить запись</LoadingButton>
            </Box>
        </>
    );
};

export default observer(DeleteRecordModal);
