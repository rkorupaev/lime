import {ChangeEvent, memo, useCallback, useMemo, useState} from 'react'
import {useQuery} from '@tanstack/react-query'
import AppService, {GetAppsResponse} from '../../../services/AppService'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import {dateToLocalString} from '../../../utils/utils'
import {ColumnDef, flexRender, getCoreRowModel, useReactTable} from '@tanstack/react-table'
import Pagination from '@mui/material/Pagination'
import clsx from 'clsx'
import deviceStore from '../../../stores/deviceStore'
import {SortingColumn} from '../../../shared/types/sharedTypes'
import {DebounceInput} from 'react-debounce-input'
import Button from "@mui/material/Button";
import * as React from "react";
import ModalWrapper from "../../../shared/Modal/Modal";
import DeleteAppModal from "../../../shared/Modal/DeleteAppModal/DeleteAppModal";

const limit = 10

export const AppTable = memo(() => {
    AppTable.displayName = 'AppTable'
    const [sortingColumn, setSortingColumn] = useState<SortingColumn | null>({name: 'package_name', order: 'asc'})
    const [page, setPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [confirmDeleteModalOpened, setConfirmDeleteModalOpened] = useState<boolean>(false);
    const [currentPackage, setCurrentPackage] = useState<GetAppsResponse | null>(null);

    const {
        data: appsData,
        isLoading,
        isFetching,
    } = useQuery({
        queryFn: () =>
            AppService.getApps({
                device_id: deviceStore.currentDeviceIndex!,
                sort_by: sortingColumn,
                limit,
                page,
                app_name__like: searchValue,
            }),
        queryKey: ['appsData', sortingColumn, page, searchValue],
        enabled: !!deviceStore.currentDeviceIndex,
        placeholderData: (previousData) => previousData,
    })

    const handleDelete = (currentPackage: GetAppsResponse) => {
        setCurrentPackage(currentPackage);
        setConfirmDeleteModalOpened(true);
    }

    const columns = useMemo<ColumnDef<GetAppsResponse>[]>(
        () => [
            {
                accessorKey: 'app_name',
                header: 'Имя приложения',
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: 'version_name',
                header: 'Название версии',
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: 'log_time',
                header: () => 'Дата синхронизации',
                cell: (info) => dateToLocalString({dateUTC: info.getValue() as string}),
            },
            {
                accessorKey: 'version_code',
                header: 'Версия',
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: 'package_name',
                header: 'Имя пакета',
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: 'delete',
                header: () => 'Удаление',
                cell: (info) => (
                    <Button
                        className={'mx-auto'}
                        color={'error'}
                        onClick={() => handleDelete(info.row.original)}
                    >
                        Удалить
                    </Button>
                ),
            },
        ],
        []
    )

    const data = useMemo(() => appsData?.apiResponse, [appsData?.apiResponse])

    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setPage(1)
        setSearchValue(e.target.value)
    }

    const sortingColumns = useMemo(() => ['log_time', 'date', 'package_name'], [])

    const handleSort = (headerId: string) => {
        if (sortingColumns.includes(headerId)) {
            if (sortingColumn && sortingColumn.name === headerId) {
                sortingColumn.order === 'asc'
                    ? setSortingColumn({name: headerId, order: 'desc'})
                    : setSortingColumn(null)
            } else setSortingColumn({name: headerId, order: 'asc'})
        }
    }

    if (isLoading) {
        return (
            <div className={'flex justify-center items-center h-60'}>
                <CircularProgress size={80}/>
            </div>
        )
    } else if (appsData?.apiResponse) {
        return (
            <div className={'mt-5 flex flex-col w-full mx-auto relative shadow-lg rounded-lg'}>
                <table className={'w-full text-left text-sm text-gray-500'}>
                    <thead className={'group/head text-xs uppercase text-gray-700'}>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    className={clsx(
                                        'relative bg-blue-200 h-14 px-3 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg'
                                    )}
                                    key={header.id}
                                >
                                    <div
                                        className={clsx(
                                            'flex items-center justify-center gap-3 relative',
                                            sortingColumns.includes(header.getContext().header.id) &&
                                            'cursor-pointer'
                                        )}
                                        onClick={() => handleSort(header.getContext().header.id)}
                                    >
                                        <div className={clsx('flex flex-col items-center gap-2')}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.id === 'app_name' && (
                                                <DebounceInput
                                                    debounceTimeout={1000}
                                                    placeholder={'Поиск по имени'}
                                                    value={searchValue}
                                                    onChange={handleSearch}
                                                    className='block font-medium rounded-md border border-gray-300 p-2 text-sm disabled:cursor-not-allowed disabled:opacity-50'
                                                />
                                            )}
                                        </div>
                                        {sortingColumns.includes(header.getContext().header.id) && (
                                            <>
                                                {sortingColumn &&
                                                sortingColumn.name === header.getContext().header.id &&
                                                sortingColumn.order === 'desc' && (
                                                    <ArrowDownwardIcon
                                                        className={
                                                            'h-4 w-3 text-blue-500 absolute right-2 top-auto'
                                                        }
                                                    />
                                                )}
                                                {sortingColumn &&
                                                sortingColumn.name === header.getContext().header.id &&
                                                sortingColumn.order === 'asc' && (
                                                    <ArrowUpwardIcon
                                                        className={
                                                            'h-4 w-3 text-blue-500 absolute right-2 top-auto'
                                                        }
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody className={'group/body mt-10 divide-y'}>
                    {table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                            <tr className={'group/row bg-white hover:bg-gray-100'} key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        className={clsx(
                                            'truncate overflow-hidden px-3 py-4 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg',
                                            cell.column.id !== 'app_name' && 'text-center',
                                            cell.column.id === 'app_name' &&
                                            'max-w-[300px] min-w-[300px] w-[300px]',
                                            cell.column.id === 'version_name' &&
                                            'max-w-[150px] min-w-[150px] w-[150px]',
                                            cell.column.id === 'log_time' &&
                                            'max-w-[175px] min-w-[175px] w-[175px]',
                                            cell.column.id === 'version_code' &&
                                            'max-w-[130px] min-w-[130px] w-[130px]'
                                        )}
                                        key={cell.id}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr className={'group/row bg-white hover:bg-gray-100'}>
                            <td colSpan={table.getAllColumns().length}>
                                <div className={'flex items-center justify-center h-60'}>
                                    <p className={'text-3xl'}>Нет результатов для данного запроса</p>
                                </div>
                            </td>
                        </tr>
                    )}
                    <tr className={'group/row bg-white'}>
                        <td
                            colSpan={table.getAllColumns().length}
                            className={
                                'w-20 px-3 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg'
                            }
                        >
                            <Pagination
                                count={Math.ceil(appsData.count / limit)}
                                onChange={(_, page) => setPage(page)}
                                page={page}
                                showFirstButton
                                showLastButton
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
                {isFetching && (
                    <div className={'absolute inset-0 rounded-md flex items-center justify-center bg-gray-400/20'}>
                        <CircularProgress size={20}/>
                    </div>
                )}
                <ModalWrapper open={confirmDeleteModalOpened} setOpen={setConfirmDeleteModalOpened}
                              modalTitle='Удалить приложение'>
                    <DeleteAppModal handleClose={setConfirmDeleteModalOpened} currentPackage={currentPackage}/>
                </ModalWrapper>
            </div>
        )
    } else
        return (
            <div className={'flex justify-center'}>
                <Typography sx={{mt: '30px'}} variant={'h5'}>
                    Нет данных о приложениях
                </Typography>
            </div>
        )
})
