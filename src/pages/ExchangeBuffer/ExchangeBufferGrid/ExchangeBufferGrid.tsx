// @ts-nocheck
import React, {useEffect} from 'react';
import {DataGridPro} from "@mui/x-data-grid-pro";
import {observer} from "mobx-react-lite";
import {useMutation} from "@tanstack/react-query";
import deviceStore from "../../../stores/deviceStore";
import snackbarStore, {Severity} from "../../../stores/snackbarStore";
import GridNoRowBlock from "../../../shared/GridNoRowBlock/GridNoRowBlock";
import GridNoResultsOverlay from "../../../shared/GridNoResultsOverlay/GridNoResultsOverlay";
import Typography from "@mui/material/Typography";
import {prettifyDate} from "../../../utils/utils";
import ExchangeBufferService from "../../../services/ExchangeBufferService";
import bufferExchangeStore from "../../../stores/bufferExchangeStore";

const columns = [
    {
        field: 'date', headerName: 'Дата', flex: 1, minWidth: 100,
        renderCell: (cellValue: any) => {
            return (
                <Typography variant='p'
                            component='p'>{prettifyDate(cellValue.row.date)}</Typography>
            )
        },
    },
    {
        field: 'text', headerName: 'Текст операции', flex: 3, minWidth: 200,
    },
];

const ExchangeBufferGrid = () => {
    const {
        mutateAsync: getOperations,
        error: getOperationsError,
        isLoading: getOperationsLoading,
    } = useMutation({
        mutationFn: ExchangeBufferService.getOperations,
        retry: (err: unknown) => {
            if (err.response?.status === 400) {
                return false;
            }
        },
        onMutate: () => {
            bufferExchangeStore.setIsLoading(true);
        },
        onSuccess: (data: unknown) => {
            bufferExchangeStore.setOperations(data.data);
        },
        onError: (data: unknown) => {
            snackbarStore.setSnackbarSettings({
                label: data.data.detail,
                severity: Severity.error,
                opened: true
            });
        },
        onSettled: () => {
            bufferExchangeStore.setIsLoading(false);
        }
    });

    useEffect(() => {
        //@ts-ignore
        if (deviceStore.currentDevice) getOperations({device_id: deviceStore.currentDeviceIndex});
    }, []);

    return (
        <>
            <DataGridPro
                rowHeight={50}
                rows={bufferExchangeStore.operations}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                density='compact'
                sx={{
                    fontSize: '12px',
                    maxHeight: 'calc(100vh - 64px)',
                    minHeight: 'calc(100vh - 64px)',
                    backgroundColor: 'white'
                }}
                getRowId={(row) => row.id}
                loading={bufferExchangeStore.isLoading}
                NoRowsOverlay={() => (
                    <GridNoRowBlock label="Журнал буфера обмена пустой"/>
                )}
                noResultsOverlay={() => (
                    <GridNoResultsOverlay text="Операций буфера обмена по вашему запросу не найдено"/>
                )}
            />
        </>

    )
        ;
};

export default observer(ExchangeBufferGrid);
