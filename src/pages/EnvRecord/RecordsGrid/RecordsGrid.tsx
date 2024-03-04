// @ts-nocheck
import React, {useEffect, useState} from 'react';
import {DataGridPro} from "@mui/x-data-grid-pro";
import {observer} from "mobx-react-lite";
import {useMutation} from "@tanstack/react-query";
import deviceStore from "../../../stores/deviceStore";
import snackbarStore, {Severity} from "../../../stores/snackbarStore";
import GridNoRowBlock from "../../../shared/GridNoRowBlock/GridNoRowBlock";
import GridNoResultsOverlay from "../../../shared/GridNoResultsOverlay/GridNoResultsOverlay";
import Typography from "@mui/material/Typography";
import {prettifyDate} from "../../../utils/utils";
import microStore from "../../../stores/microStore";
import MicroFilesService from "../../../services/MicroFilesService";
import Tooltip from "@mui/material/Tooltip";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import RecordPlayer from "./RecordPlayer/RecordPlayer";
import DeleteRecordModal from "../../../shared/Modal/DeleteRecordModal/DeleteRecordModal";
import ModalWrapper from "../../../shared/Modal/Modal";
import {toJS} from "mobx";
import {Button} from "@mui/material";

const RecordsGrid = () => {
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [waveWidth, setWaveWidth] = useState<number>(null);

    const columns = [
        {
            field: 'log_time', headerName: 'Дата записи', width: 200,
            renderCell: (cellValue: any) => {
                return (
                    <Typography variant='p'
                                component='p'>{prettifyDate(cellValue.row.log_time)}</Typography>
                )
            },
        },
        {
            field: 'play', headerName: 'Прослушать', minWidth: 280, flex: 1,
            renderCell: (cellValue: any) => {
                const audio = microStore.getFileFromStore(cellValue.row.id);
                if (!audio) return (
                    <Tooltip title={"Загрузить запись"} placement='right'>
                        <PlayCircleIcon color={'info'} onClick={() => microStore.getRecordFile({id: cellValue.row.id})}/>
                    </Tooltip>
                )

                return (
                    <RecordPlayer height={100}
                                  waveColor="rgb(200, 0, 200)"
                                  progressColor="rgb(100, 0, 100)"
                                  url={microStore.getFileFromStore(cellValue.row.id)}
                                  width={waveWidth || cellValue.colDef.computedWidth - 70}
                        // plugins={[Timeline.create()]}
                    />
                )
            },
            sortable: false,
            menu: false,
        },
        {
            field: 'download', headerName: 'Скачать', minWidth: 70,
            renderCell: (cellValue: any) => {
                return (
                    <Tooltip title={"Скачать запись"} placement='right'>
                        <DownloadIcon onClick={() => microStore.downloadFile({id: cellValue.row.id, name: cellValue.row.source_path})} color={'info'}/>
                    </Tooltip>

                )
            },
        }, {
            field: 'delete', headerName: 'Удалить', minWidth: 70,
            renderCell: (cellValue: any) => {
                return (
                    <Tooltip title={"Скачать запись"} placement='right'>
                        <DeleteIcon color={'info'} onClick={() => deleteButtonHandler(cellValue.row.id)}/>
                    </Tooltip>

                )
            },
        },
    ];

    const {
        mutateAsync: getMicroFiles,
        error: getMicroFilesError,
        isLoading: getMicroFilesLoading,
    } = useMutation({
        mutationFn: MicroFilesService.getMicroFiles,
        retry: (err: unknown) => {
            if (err.response?.status === 400) {
                return false;
            }
        },
        onMutate: () => {
            microStore.setIsLoading(true);
        },
        onSuccess: (data: unknown) => {
            microStore.setRecords(data.data);
        },
        onError: (data: unknown) => {
            // snackbarStore.setSnackbarSettings({
            //     label: data.data.detail,
            //     severity: Severity.error,
            //     opened: true
            // });
        },
        onSettled: () => {
            microStore.setIsLoading(false);
        }
    });

    useEffect(() => {
        //@ts-ignore
        if (deviceStore.currentDevice) getMicroFiles({device_id: deviceStore.currentDeviceIndex});
    }, []);

    const deleteButtonHandler = (id) => {
        setOpenDeleteModal(true);
        setCurrentRecord(id)
    }

    const testFunc = () => {
        microStore.waveforms.forEach(wave => {
            wave.pause();
        })
    }

    return (
        <>
            <DataGridPro
                rowHeight={50}
                rows={microStore.records}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                density='compact'
                sx={{
                    fontSize: '12px',
                    maxHeight: 'calc(100vh - 168px)',
                    minHeight: 'calc(100vh - 168px)',
                    backgroundColor: 'white'
                }}
                getRowId={(row) => row.id}
                loading={microStore.isLoading}
                NoRowsOverlay={() => (
                    <GridNoRowBlock label="Журнал записей пустой"/>
                )}
                noResultsOverlay={() => (
                    <GridNoResultsOverlay text="Записей по вашему запросу не найдено"/>
                )}
                onColumnResize={(e) => {
                    if (e.colDef.field === 'play') {
                      setWaveWidth(e.width - 70);
                    }
                }}
            />
            <ModalWrapper
                open={openDeleteModal}
                setOpen={setOpenDeleteModal}
                modalTitle='Удалить запись?'
            >
                <DeleteRecordModal handleClose={setOpenDeleteModal} currentRecord={currentRecord}/>
            </ModalWrapper>
        </>

    )
        ;
};

export default observer(RecordsGrid);
