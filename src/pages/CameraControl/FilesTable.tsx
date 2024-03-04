import {memo, useCallback, useMemo, useState} from 'react'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import {saveAs} from 'file-saver'
import {ColumnDef, flexRender, getCoreRowModel, useReactTable} from '@tanstack/react-table'
import Pagination from '@mui/material/Pagination'
import clsx from 'clsx'
import CommandService, {GetCameraFilesResponse} from '../../services/CommandService'
import Button from '@mui/material/Button'
import SnackbarStore, {Severity} from '../../stores/snackbarStore'
import {SortingColumn} from '../../shared/types/sharedTypes'
import deviceStore from '../../stores/deviceStore'
import {dateToLocalString} from '../../utils/utils'

const limit = 10

export const FilesTable = memo(() => {
    FilesTable.displayName = 'FilesTable'
    const [sortingColumn, setSortingColumn] = useState<SortingColumn | null>({name: 'log_time', order: 'desc'})
    const [page, setPage] = useState(1)
    const queryClient = useQueryClient()

    const {
        data: getCameraFilesData,
        isLoading,
        isFetching,
    } = useQuery({
        queryFn: () =>
            CommandService.getCameraFiles({
                device_id: deviceStore.currentDeviceIndex!,
                sort_by: sortingColumn,
                limit,
                page,
            }),
        queryKey: ['cameraFiles', sortingColumn, page],
        placeholderData: (previousData) => previousData,
    })

    const {mutate: downloadCameraFileMutate} = useMutation({
        mutationFn: CommandService.downloadCameraFile,
        mutationKey: ['downloadCameraFile'],
        onSuccess: async (data) => {
            const blob = new Blob([data.data], {type: 'image/jpeg'})
            saveAs(blob, 'image.jpeg')
        },
        onError: () => {
            SnackbarStore.setSnackbarSettings({
                label: 'Не удалось скачать файл',
                opened: true,
                severity: Severity.error,
            })
        },
    })

    const {mutate: deleteCameraFileMutate} = useMutation({
        mutationFn: CommandService.deleteCameraFile,
        mutationKey: ['deleteCameraFile'],
        onSuccess: async () => {
            SnackbarStore.setSnackbarSettings({
                label: 'Файл удалён',
                opened: true,
                severity: Severity.warning,
            })
            queryClient.invalidateQueries({queryKey: ['deviceSettings']})
        },
        onError: () => {
            SnackbarStore.setSnackbarSettings({
                label: 'Не удалось удалить файл',
                opened: true,
                severity: Severity.error,
            })
        },
    })

    const handleDownload = useCallback(
        (Id: number) => {
            downloadCameraFileMutate(Id)
        },
        [downloadCameraFileMutate]
    )

    const handleDelete = useCallback(
        (ids: number) => {
            deleteCameraFileMutate(ids)
        },
        [deleteCameraFileMutate]
    )

    const columns = useMemo<ColumnDef<GetCameraFilesResponse>[]>(
        () => [
            {
                accessorKey: 'camera_id',
                header: 'Камера',
                cell: (info) => (info.getValue() === 0 ? 'Основная' : 'Фронтальная'),
            },
            {
                accessorKey: 'source_path',
                header: 'Путь файла',
                cell: (info) => info.getValue(),
            },

            {
                accessorKey: 'log_time',
                header: 'Время записи',
                cell: (info) => dateToLocalString({dateUTC: info.getValue() as string}),
            },
            {
                accessorKey: 'download',
                header: () => 'Скачивание',
                cell: (info) => (
                    <Button className={'mx-auto'} onClick={() => handleDownload(info.row.original.id)}>
                        Скачать
                    </Button>
                ),
            },
            {
                accessorKey: 'delete',
                header: () => 'Удаление',
                cell: (info) => (
                    <Button className={'mx-auto'} color={'error'} onClick={() => handleDelete(info.row.original.id)}>
                        Удалить
                    </Button>
                ),
            },
        ],
        [handleDelete, handleDownload]
    )

    const data = useMemo(() => getCameraFilesData?.apiResponse, [getCameraFilesData?.apiResponse])

    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const sortingColumns = useMemo(() => ['log_time'], [])

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
                <CircularProgress size={80} />
            </div>
        )
    } else if (getCameraFilesData?.apiResponse) {
        return (
            <div className={'mt-5 flex flex-col w-full mx-auto relative overflow-auto shadow-lg rounded-lg'}>
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
                                                {/*{header.id === 'app_name' && (*/}
                                                {/*    <DebounceInput*/}
                                                {/*        debounceTimeout={1000}*/}
                                                {/*        placeholder={'Поиск по имени'}*/}
                                                {/*        value={searchValue}*/}
                                                {/*        onChange={handleSearch}*/}
                                                {/*        className='block font-medium rounded-md border border-gray-300 p-2 text-sm disabled:cursor-not-allowed disabled:opacity-50'*/}
                                                {/*    />*/}
                                                {/*)}*/}
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
                                                'truncate text-center overflow-hidden px-3 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg'
                                                // cell.column.id !== 'app_name' && 'text-center',
                                                // cell.column.id === 'app_name' &&
                                                //     'max-w-[300px] min-w-[300px] w-[300px]',
                                                // cell.column.id === 'version_name' &&
                                                //     'max-w-[150px] min-w-[150px] w-[150px]',
                                                // cell.column.id === 'log_time' &&
                                                //     'max-w-[175px] min-w-[175px] w-[175px]',
                                                // cell.column.id === 'version_code' &&
                                                //     'max-w-[130px] min-w-[130px] w-[130px]'
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
                                    'w-20 px-3 py-2  group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg'
                                }
                            >
                                <Pagination
                                    count={Math.ceil(getCameraFilesData.count / limit)}
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
                        <CircularProgress size={20} />
                    </div>
                )}
            </div>
        )
    } else
        return (
            <div className={'flex justify-center'}>
                <Typography sx={{mt: '30px'}} variant={'h5'}>
                    Нет данных о файлах
                </Typography>
            </div>
        )
})
