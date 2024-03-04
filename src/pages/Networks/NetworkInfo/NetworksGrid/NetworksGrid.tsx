// @ts-nocheck
import React from 'react';
import {DataGridPro} from "@mui/x-data-grid-pro";
import {observer} from "mobx-react-lite";
import GridNoRowBlock from "../../../../shared/GridNoRowBlock/GridNoRowBlock";
import GridNoResultsOverlay from "../../../../shared/GridNoResultsOverlay/GridNoResultsOverlay";
import {Typography} from "@mui/material";
import {prettifyDate} from "../../../../utils/utils";
import networksStore from "../../../../stores/networksStore";

const columns = [
    {
        field: 'ssid', headerName: 'Название сети', flex: 1, minWidth: 100,
    },
    {
        field: 'bssid', headerName: 'BSSID', flex: 1, minWidth: 100,
    },
    {
        field: 'date', headerName: 'Дата подключения', flex: 1, minWidth: 100,
        renderCell: (cellValue: any) => {
            return (
                <Typography variant='p'
                            component='p'>{prettifyDate(cellValue.row.log_time)}</Typography>
            )
        },
    }];

const NetworksGrid = () => {
    return (
        <>
            <DataGridPro
                rowHeight={50}
                rows={networksStore.currentNetworkData?.items || []}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                density='compact'
                sx={{
                    fontSize: '12px',
                    maxHeight: 'calc(100vh - 353px)',
                    minHeight: 'calc(100vh - 353px)',
                    backgroundColor: 'white'
                }}
                // disableColumnSelector
                // disableColumnMenu
                getRowId={(row) => row.id}
                loading={networksStore.isLoading}
                // onRowClick={(row) => callsStore.setSelectedCallsIndex(row.call_id as number)}
                NoRowsOverlay={() => (
                    <GridNoRowBlock label="Журнал сетей пустой"/>
                )}
                noResultsOverlay={() => (
                    <GridNoResultsOverlay text="Сетей по вашему запросу не найдено"/>
                )}
            />
        </>

    )
        ;
};

export default observer(NetworksGrid);
