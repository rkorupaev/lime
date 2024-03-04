import {observer} from 'mobx-react-lite'
import {useCallback, useMemo, useState} from 'react'
import {SortingColumn} from '../../shared/types/sharedTypes'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import deviceStore from '../../stores/deviceStore'
import {ColumnDef, flexRender, getCoreRowModel, useReactTable} from '@tanstack/react-table'
import {dateToLocalString, getFilenameFromContentDisposition} from '../../utils/utils'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import clsx from 'clsx'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'
import FilesService, {GetFilesResponse} from '../../services/FilesService'
import SnackbarStore, {Severity} from '../../stores/snackbarStore'
import FilesStore from './store/filesStore'
import {Modal} from './Modal'

const limit = 10

export const FilesControlTab = observer(() => {
    FilesControlTab.displayName = 'FilesControlTab'
    const [sortingColumn, setSortingColumn] = useState<SortingColumn | null>({name: 'log_time', order: 'desc'})
    const [deletingFileId, setDeletingFileId] = useState<number | null>(null)
    const [page, setPage] = useState(1)
    const queryClient = useQueryClient()

    const {
        data: getFilesData,
        isLoading,
        isFetching,
    } = useQuery({
        queryFn: () =>
            FilesService.getFiles({
                device_id: deviceStore.currentDeviceIndex!,
                sort_by: sortingColumn,
                limit,
                page,
            }),
        queryKey: ['files', sortingColumn, page],
        placeholderData: (previousData) => previousData,
    })

    const {mutate: deleteFileMutate} = useMutation({
        mutationFn: FilesService.deleteFile,
        mutationKey: ['deleteFile'],
        onSuccess: async () => {
            SnackbarStore.setSnackbarSettings({
                label: 'Файл удалён',
                opened: true,
                severity: Severity.warning,
            })
            queryClient.invalidateQueries({queryKey: ['files']})
        },
        onError: () => {
            SnackbarStore.setSnackbarSettings({
                label: 'Не удалось удалить файл',
                opened: true,
                severity: Severity.error,
            })
        },
    })

    const {mutate: downloadFileMutate} = useMutation({
        mutationFn: FilesService.downloadFile,
        mutationKey: ['downloadFile'],
        onSuccess: async (data) => {
            const url = URL.createObjectURL(data.data)
            const link = document.createElement('a')
            link.href = url
            link.download = getFilenameFromContentDisposition(data.headers.get('content-disposition'))
            document.body.appendChild(link)
            link.click()
            URL.revokeObjectURL(url)
        },
        onError: () => {
            SnackbarStore.setSnackbarSettings({
                label: 'Не удалось скачать файл',
                opened: true,
                severity: Severity.error,
            })
        },
    })

    const handleDelete = useCallback(
        (ids: number) => {
            deleteFileMutate(ids)
        },
        [deleteFileMutate]
    )

    const handleDownload = useCallback(
        (static_path: string) => {
            downloadFileMutate(static_path)
        },
        [downloadFileMutate]
    )

    const columns = useMemo<ColumnDef<GetFilesResponse>[]>(
        () => [
            {
                accessorKey: 'source_path',
                header: 'Файл',
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: 'from_device',
                header: 'С устройства',
                cell: (info) => (info.getValue() ? 'Да' : 'Нет'),
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
                    <Button className={'mx-auto'} onClick={() => handleDownload(info.row.original.static_path)}>
                        Скачать
                    </Button>
                ),
            },
            {
                accessorKey: 'delete',
                header: () => 'Удаление',
                cell: (info) => (
                    <Button
                        className={'mx-auto'}
                        color={'error'}
                        onClick={() => {
                            setDeletingFileId(info.row.original.id)
                            FilesStore.setModalType('delete')
                            FilesStore.setIsDialogOpen(true)
                        }}
                    >
                        Удалить
                    </Button>
                ),
            },
        ],
        [handleDownload]
    )

    const data = useMemo(() => getFilesData?.apiResponse, [getFilesData?.apiResponse])

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
    } else if (getFilesData?.apiResponse) {
        return (
            <div className={'px-6'}>
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
                                                        : flexRender(
                                                              header.column.columnDef.header,
                                                              header.getContext()
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
                                        count={Math.ceil(getFilesData.count / limit)}
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
                {FilesStore.isDialogOpen && (
                    <Modal
                        onDelete={() => {
                            deletingFileId && handleDelete(deletingFileId)
                        }}
                    />
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
