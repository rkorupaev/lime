// @ts-nocheck
import {useCallback, useMemo, useState} from 'react'
import deviceStore from '../../../stores/deviceStore'
import * as React from 'react'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import CommandService, {GetCommandsResponse} from '../../../services/CommandService'
import {SortingColumn} from '../../../shared/types/sharedTypes'
import SnackbarStore, {Severity} from '../../../stores/snackbarStore'
import {observer} from 'mobx-react-lite'
import {ColumnDef, flexRender, getCoreRowModel, useReactTable} from '@tanstack/react-table'
import {dateToLocalString} from '../../../utils/utils'
import CircularProgress from '@mui/material/CircularProgress'
import clsx from 'clsx'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const limit = 10

export const CommandHistory = observer(() => {
    CommandHistory.displayName = 'CommandHistory'
    const [sortingColumn, setSortingColumn] = useState<SortingColumn | null>({name: 'id', order: 'desc'})
    const [page, setPage] = useState(1)
    const queryClient = useQueryClient()

    if (!deviceStore.currentDeviceIndex) {
        return (
            <div className={'flex w-full mt-headerHeight h-contentHeight justify-center'}>
                <p className={'text-xl text-slate-600 text-center mt-10'}>Девайс не выбран</p>
            </div>
        )
    } else {
        const {
            data: getCommandsData,
            isLoading,
            isFetching,
        } = useQuery({
            queryFn: () =>
                CommandService.getCommands({
                    device_id: deviceStore.currentDeviceIndex!,
                    sort_by: sortingColumn,
                    limit,
                    page,
                }),
            queryKey: ['getCommands', sortingColumn, page],
            placeholderData: (previousData) => previousData,
        })

        const {mutate: deleteCommandMutate} = useMutation({
            mutationFn: CommandService.deleteCommand,
            mutationKey: ['deleteCommand'],
            onSuccess: async () => {
                SnackbarStore.setSnackbarSettings({
                    label: 'Команда удалена',
                    opened: true,
                    severity: Severity.warning,
                })
                queryClient.invalidateQueries({queryKey: ['getCommands']})
            },
            onError: () => {
                SnackbarStore.setSnackbarSettings({
                    label: 'Не удалось удалить команду',
                    opened: true,
                    severity: Severity.error,
                })
            },
        })

        const handleDelete = useCallback(
            (device_id: string, ids: number) => {
                deleteCommandMutate({device_id, ids})
            },
            [deleteCommandMutate]
        )

        const getCommandName = (command_type: number) => {
            switch (command_type) {
                case 7:
                    return 'Камера'
                case 9:
                    return 'Микрофон'
                case 1:
                    return 'Добавить контакт'
                case 2:
                    return 'Удалить контакт'
                case 3:
                    return 'Отправить СМС'
                case 13:
                    return 'Открыть URL'
                case 23:
                    return 'Отправить уведомление'
                case 24:
                    return 'Удалить приложение с телефона'
                case 22:
                    return 'Удалить вызов'
                case 17:
                    return 'Удалить приложение'
                case 4:
                    return 'Произвести вызов'
                default:
                    return 'Неизвестно'
            }
        }

        const getStatusName = (status: number) => {
            switch (status) {
                case 1:
                    return 'Не отправлена'
                case 2:
                    return 'Отправлена'
                case 3:
                    return 'Выполнена'
                case 4:
                    return 'Ошибка выполнения'
                case 6:
                    return 'Выполняется'
                default:
                    return 'Неизвестно'
            }
        }

        const prettifyParams = (params: unknown): string => {
            let result = ''
            for (const key in params) {
                if (params.hasOwnProperty(key)) {
                    result += `${key}: ${params[key]} | `
                }
            }
            result = result.slice(0, -2)
            return result
        }

        const columns = useMemo<ColumnDef<GetCommandsResponse>[]>(
            () => [
                {
                    accessorKey: 'id',
                    header: 'ID',
                    cell: (info) => info.getValue(),
                },
                {
                    accessorKey: 'command_type',
                    header: 'Тип команды',
                    cell: (info) => getCommandName(info.getValue() as number),
                },
                {
                    accessorKey: 'log_time',
                    header: 'Время отправки',
                    cell: (info) => dateToLocalString({dateUTC: info.getValue() as string}),
                },

                {
                    accessorKey: 'status',
                    header: 'Статус',
                    cell: (info) => getStatusName(info.getValue() as number),
                },
                {
                    accessorKey: 'content',
                    header: 'Параметры команды',
                    cell: (info) => prettifyParams(info.getValue()),
                },
                {
                    accessorKey: 'delete',
                    header: () => 'Удаление',
                    cell: (info) => (
                        <Button
                            disabled={info.row.original.status !== 1}
                            className={'mx-auto'}
                            color={'error'}
                            onClick={() => handleDelete(deviceStore.currentDeviceIndex!, info.row.original.id)}
                        >
                            Удалить
                        </Button>
                    ),
                },
            ],
            [getCommandName, getStatusName, handleDelete]
        )

        const data = useMemo(() => getCommandsData?.apiResponse, [getCommandsData?.apiResponse])

        const table = useReactTable({
            data: data || [],
            columns,
            getCoreRowModel: getCoreRowModel(),
        })

        const sortingColumns = useMemo(() => ['id'], [])

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
        } else if (getCommandsData?.apiResponse) {
            return (
                <div className={'flex flex-col w-full mt-4 h-contentHeight text-slate-600 p-5 bg-gray-50'}>
                    <p className={'text-center text-3xl'}>История команд</p>
                    <div className={'mt-5 flex flex-col w-full mx-auto relative overflow-auto shadow-lg rounded-lg'}>
                        <table className={'w-full text-left text-sm text-gray-500'}>
                            <thead className={'group/head text-xs uppercase text-gray-700'}>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                className={clsx(
                                                    'relative bg-blue-200 h-14 px-3 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg',
                                                    header.id === 'id' && 'w-28'
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
                                                        'break-all text-center overflow-hidden px-3 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg',
                                                        cell.column.id === 'content' && 'max-w-[200px]'
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
                                            count={Math.ceil(getCommandsData.count / limit)}
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
                            <div
                                className={
                                    'absolute inset-0 rounded-md flex items-center justify-center bg-gray-400/20'
                                }
                            >
                                <CircularProgress size={20} />
                            </div>
                        )}
                    </div>
                </div>
            )
        } else
            return (
                <div className={'flex justify-center'}>
                    <Typography sx={{mt: '30px'}} variant={'h5'}>
                        Нет данных о командах
                    </Typography>
                </div>
            )
    }
})
