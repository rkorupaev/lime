// @ts-nocheck
import React, {useEffect, useState} from 'react';
import {DataGridPro} from "@mui/x-data-grid-pro";
import {observer} from "mobx-react-lite";
import {useMutation} from "@tanstack/react-query";
import deviceStore from "../../../stores/deviceStore";
import snackbarStore, {Severity} from "../../../stores/snackbarStore";
import GridNoRowBlock from "../../../shared/GridNoRowBlock/GridNoRowBlock";
import GridNoResultsOverlay from "../../../shared/GridNoResultsOverlay/GridNoResultsOverlay";
import CallsService from "../../../services/CallsService";
import callsStore from "../../../stores/callsStore";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMissedIcon from '@mui/icons-material/CallMissed';
import VoicemailIcon from '@mui/icons-material/Voicemail';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import {prettifyDate} from "../../../utils/utils";
import DeleteIcon from '@mui/icons-material/Delete';
import ModalWrapper from "../../../shared/Modal/Modal";
import DeviceInfoModal from "../../../shared/Modal/DeviceInfoModal/DeviceInfoModal";
import Box from "@mui/material/Box";
import DeleteCallModal from "../../../shared/Modal/DeleteCallModal/DeleteCallModal";
import {toJS} from "mobx";

const getCallType = (type) => {
    const types = {
        1: "Входящий",
        2: "Исходящий",
        3: "Пропущенный",
        4: "Голосовая почта",
        5: "Сброшенный",
        6: "Заблокированный",
        7: "Отвечен на другом устройстве",
    }

    return types[type];
}

const getCallTypeIcon = (type) => {
    const types = {
        1: <CallReceivedIcon color={'success'}/>,
        2: <CallMadeIcon color={"info"}/>,
        3: <CallMissedIcon color={'warning'}/>,
        4: <VoicemailIcon sx={{color: 'purple'}}/>,
        5: <PhoneDisabledIcon color={'error'}/>,
        6: <RemoveCircleOutlineIcon sx={{color: 'orangered'}}/>,
        7: <CallSplitIcon sx={{color: 'lightseagreen'}}/>,
    }

    return types[type];
}


const CallsGrid = () => {
    const [deleteCallModalOpened, setDeleteCallModalOpened] = useState<boolean>(false);
    const [currentCall, setCurrentCall] = useState(null);

    const onDeleteButtonClickHandler = (currentCall) => {
        setCurrentCall(currentCall);
        setDeleteCallModalOpened(true)
    }

    const columns = [
        {
            field: 'type', headerName: 'Тип звонка', width: 40,
            renderCell: (cellValue: any) => {
                return (
                    <Tooltip title={getCallType(cellValue.row.type)} placement='right'>
                        <Typography variant='p'
                                    component='p'>{getCallTypeIcon(cellValue.row.type)}</Typography>
                    </Tooltip>

                )
            },
        },
        {
            field: 'name', headerName: 'Имя контакта', flex: 1, minWidth: 100,
        },
        {
            field: 'address', headerName: 'Телефон', flex: 1, minWidth: 100,
        },
        {
            field: 'duration', headerName: 'Длительность', flex: 1, minWidth: 70, renderCell: (cellValue: any) => {
                return (
                    <Typography variant='p'
                                component='p'>{Math.floor(cellValue.row.duration / 60)}:{cellValue.row.duration % 60}</Typography>
                )
            },
        },
        {
            field: 'deleted', headerName: 'Удален', flex: 1, minWidth: 70,
            renderCell: (cellValue: any) => {
                return (
                    <Typography variant='p' component='p'>{cellValue.row.deleted ? "Да" : "Нет"}</Typography>
                )
            },
        },
        {
            field: 'date', headerName: 'Дата звонка', flex: 1, minWidth: 100,
            renderCell: (cellValue: any) => {
                return (
                    <Typography variant='p'
                                component='p'>{prettifyDate(cellValue.row.date)}</Typography>
                )
            },
        },
        {
            field: 'delete', headerName: 'Удалить', width: 50,
            renderCell: (cellValue: any) => {
                return (
                    <Tooltip title='Удалить запись' placement='right'>
                        <DeleteIcon color={'info'} onClick={() => onDeleteButtonClickHandler(cellValue.row)}/>
                    </Tooltip>

                )
            },
        },];

    const {
        mutateAsync: getCalls,
        error: getCallsError,
        isLoading: getCallsLoading,
    } = useMutation({
        mutationFn: CallsService.getCalls,
        retry: (err: unknown) => {
            if (err.response?.status === 400) {
                return false;
            }
        },
        onSuccess: (data: unknown) => {
            callsStore.setCalls(data.data);
        },
        onError: (data: unknown) => {
            snackbarStore.setSnackbarSettings({
                label: data.data.detail,
                severity: Severity.error,
                opened: true
            });
        }
    });

    useEffect(() => {
        //@ts-ignore
        if (deviceStore.currentDevice) getCalls({device_id: deviceStore.currentDeviceIndex});
    }, []);

    return (
        <>
            <DataGridPro
                rowHeight={50}
                rows={callsStore.calls}
                columns={columns}
                // disableColumnResize={true}
                pageSize={10}
                rowsPerPageOptions={[10]}
                density='compact'
                sx={{
                    fontSize: '12px',
                    maxHeight: 'calc(100vh - 64px)',
                    minHeight: 'calc(100vh - 64px)',
                    backgroundColor: 'white'
                }}
                // disableColumnSelector
                // disableColumnMenu
                getRowId={(row) => row.call_id}
                loading={getCallsLoading}
                onRowClick={(row) => callsStore.setSelectedCallsIndex(row.call_id as number)}
                NoRowsOverlay={() => (
                    <GridNoRowBlock label="Журнал звонков пустой"/>
                )}
                noResultsOverlay={() => (
                    <GridNoResultsOverlay text="Звонков по вашему запросу не найдено"/>
                )}
            />
            <ModalWrapper open={deleteCallModalOpened} setOpen={setDeleteCallModalOpened}
                          modalTitle='Удалить вызов'>
                <DeleteCallModal handleClose={setDeleteCallModalOpened} currentCall={currentCall}/>
            </ModalWrapper>
        </>

    )
        ;
};

export default observer(CallsGrid);
