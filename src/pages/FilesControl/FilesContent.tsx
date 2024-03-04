import {observer} from 'mobx-react-lite'
import {Fragment, useEffect, useMemo, useState} from 'react'
import {Events, LsFilesBody, LsTypes, RootDirItem} from './model/types/filesTypes'
import SocketStore from '../../stores/socketStore'
import SnackbarStore, {Severity} from '../../stores/snackbarStore'
import deviceStore from '../../stores/deviceStore'
import FilesStore from './store/filesStore'
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import NoEncryptionIcon from '@mui/icons-material/NoEncryption'
import DeleteIcon from '@mui/icons-material/Delete'
import HomeIcon from '@mui/icons-material/Home'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import DownloadIcon from '@mui/icons-material/Download'
import FolderIcon from '@mui/icons-material/Folder'
import {dateToLocalString} from '../../utils/utils'
import prettyBytes from 'pretty-bytes'
import {Menu, Transition} from '@headlessui/react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {Portal} from '../../shared/Portal/index'
import {UseEvents} from './model/events/useEvents'
import {Modal} from './Modal'
import {RenderIcon} from './RenderIcon'
import {useMutation} from '@tanstack/react-query'
import CommandService, {CommandTypes} from '../../services/CommandService'

export const FilesContent = observer(() => {
    FilesContent.displayName = 'FilesContent'

    const {lsFiles, hideFiles, moveFiles, copyFiles, getRootDirs, deleteFiles} = UseEvents()

    const [currentFileItems, setCurrentFileItems] = useState<RootDirItem[] | LsFilesBody | null>(null)
    const [rootDirs, setRootDirs] = useState<RootDirItem[] | null>(null)

    const socket = SocketStore.webSocket

    useEffect(() => {
        if (socket) {
            socket.on('event', (e) => {
                const command = JSON.parse(e)
                // if ([28, 29, 30, 31, 32, 33, 34, 37, 39].includes(command.command_type)) {
                //     console.log(command)
                // }
                if (command.status === 4) {
                    SnackbarStore.setSnackbarSettings({
                        label: `Не удалось отправить команду. ${command.body.status}`,
                        opened: true,
                        severity: Severity.error,
                    })
                }
                if (command.command_type === Events.GET_ROOT_DIRS && command.status === 3) {
                    setRootDirs(command.body.items)
                    setCurrentFileItems(command.body.items)
                }
                if (command.command_type === Events.LS_FILES && command.status === 3) {
                    setCurrentFileItems(command.body)
                }
                if (command.command_type === Events.MOVE_FILES && command.status === 3) {
                    SnackbarStore.setSnackbarSettings({
                        label: `Файл перенесён`,
                        opened: true,
                        severity: Severity.success,
                    })
                    lsFiles(FilesStore.movedFilePath.match(/.*\//)![0])
                    FilesStore.setMovedFilePath('')
                }
                if (command.command_type === Events.COPY_FILES && command.status === 3) {
                    FilesStore.setCopiedFilePath('')
                    SnackbarStore.setSnackbarSettings({
                        label: `Файл скопирован`,
                        opened: true,
                        severity: Severity.success,
                    })
                }
                if (command.command_type === Events.HIDE_FILES && command.status === 3) {
                    SnackbarStore.setSnackbarSettings({
                        label: `Файл скрыт`,
                        opened: true,
                        severity: Severity.success,
                    })
                    lsFiles(FilesStore.currentFolderPath)
                }

                if (command.command_type === Events.ENCRYPT_FILES && command.status === 3) {
                    SnackbarStore.setSnackbarSettings({
                        label: `Файл зашифрован`,
                        opened: true,
                        severity: Severity.success,
                    })
                    lsFiles(FilesStore.currentFolderPath)
                }
                if (command.command_type === Events.DECRYPT_FILES && command.status === 3) {
                    SnackbarStore.setSnackbarSettings({
                        label: `Файл расшифрован`,
                        opened: true,
                        severity: Severity.success,
                    })
                    lsFiles(FilesStore.currentFolderPath)
                }
                if (command.command_type === Events.RENAME_FILES && command.status === 3) {
                    SnackbarStore.setSnackbarSettings({
                        label: `Файл переименован`,
                        opened: true,
                        severity: Severity.success,
                    })
                    lsFiles(FilesStore.currentFolderPath)
                }
                if (command.command_type === Events.DEL_FILES && command.status === 3) {
                    SnackbarStore.setSnackbarSettings({
                        label: `Файл удалён`,
                        opened: true,
                        severity: Severity.success,
                    })
                    lsFiles(FilesStore.currentFolderPath)
                }
            })
        }
    }, [socket])

    const {mutate: createCommandMutate} = useMutation({
        mutationFn: CommandService.createCommand,
        mutationKey: ['fileDownloadCommand'],
        onSuccess: () => {
            SnackbarStore.setSnackbarSettings({
                label: 'Команда отправлена',
                opened: true,
                severity: Severity.success,
            })
        },
        onError: () => {
            SnackbarStore.setSnackbarSettings({
                label: 'Не удалось отправить команду',
                opened: true,
                severity: Severity.error,
            })
        },
    })

    useEffect(() => {
        if (FilesStore.connectedDeviceId || FilesStore.activeDevices.includes(deviceStore.currentDeviceIndex!)) {
            getRootDirs()
        }
    }, [FilesStore.connectedDeviceId, FilesStore.activeDevices])

    const getRoot = (pwd: string, root: RootDirItem[] | null) => {
        if (root) {
            const item = root.reduce((previousValue, currentValue) => {
                if (pwd.startsWith(currentValue.path)) {
                    if (!('path' in previousValue)) {
                        previousValue = currentValue
                    } else {
                        if (currentValue.path.length < currentValue.path.length) {
                            previousValue = currentValue
                        }
                    }
                }
                return previousValue
            }, {} as RootDirItem)
            return item
        }
    }

    const menuItems = useMemo(
        () => [
            {
                icon: <DriveFileMoveIcon sx={{width: '20px'}} />,
                name: 'Переместить',
                onClick: (path: string) => {
                    SnackbarStore.setSnackbarSettings({
                        label: `Путь скопирован`,
                        opened: true,
                        severity: Severity.success,
                    })
                    FilesStore.setMovedFilePath(path)
                },
            },
            {
                icon: <FileCopyIcon sx={{width: '20px'}} />,
                name: 'Скопировать',
                onClick: (path: string) => {
                    SnackbarStore.setSnackbarSettings({
                        label: `Путь скопирован`,
                        opened: true,
                        severity: Severity.success,
                    })
                    FilesStore.setCopiedFilePath(path)
                },
            },
            {
                icon: <VisibilityOffIcon sx={{width: '20px'}} />,
                name: 'Скрыть',
                onClick: (path: string) => {
                    hideFiles(path)
                },
            },
            {
                icon: <DownloadIcon sx={{width: '20px'}} />,
                name: 'Скачать',
                onClick: (file: string) => {
                    createCommandMutate({
                        device_id: deviceStore.currentDeviceIndex!,
                        body: {command_type: CommandTypes.DOWNLOAD_FILES, content: {file}},
                    })
                },
            },
            {
                icon: <DriveFileRenameOutlineIcon sx={{width: '20px'}} />,
                name: 'Переименовать',
                onClick: (path: string) => {
                    FilesStore.setModalType('rename')
                    FilesStore.setCurrentFilePath(path)
                    FilesStore.setIsDialogOpen(true)
                },
            },
            {
                icon: <DeleteIcon sx={{width: '20px'}} />,
                name: 'Удалить',
                onClick: (path: string) => {
                    FilesStore.setModalType('delete')
                    FilesStore.setCurrentFilePath(path)
                    FilesStore.setIsDialogOpen(true)
                },
            },
        ],
        []
    )

    return (
        <div className={'flex flex-col relative w-full grow text-slate-600 p-5 bg-gray-50'}>
            {/*<p className={'text-3xl mb-5 text-center'}>Файлы на телефоне</p>*/}
            <div className={'w-10/12 mx-auto'}>
                <div className={'flex items-center gap-1 ml-4'}>
                    <HomeIcon onClick={getRootDirs} className={'text-blue-300 w-44 cursor-pointer'} />
                    {currentFileItems &&
                        !Array.isArray(currentFileItems) &&
                        rootDirs &&
                        `${getRoot(currentFileItems.pwd, rootDirs)!.name}/${currentFileItems.pwd.slice(
                            getRoot(currentFileItems.pwd, rootDirs)!.path.length
                        )}`
                            .split('/')
                            .map(
                                (item) =>
                                    item && (
                                        <div key={item} className={'flex items-center last:text-blue-500'}>
                                            <ArrowForwardIosIcon sx={{height: '12px'}} className={'text-slate-700'} />
                                            <p
                                                onClick={() => {
                                                    if (item === getRoot(currentFileItems.pwd, rootDirs)!.name) {
                                                        lsFiles(getRoot(currentFileItems.pwd, rootDirs)!.path)
                                                    } else {
                                                        const endIndex =
                                                            currentFileItems.pwd.indexOf(item) + item.length
                                                        const substring = currentFileItems.pwd.substring(0, endIndex)
                                                        lsFiles(substring)
                                                    }
                                                }}
                                                className={'hover:text-blue-700 cursor-pointer'}
                                            >
                                                {item}
                                            </p>
                                        </div>
                                    )
                            )}
                </div>
                <ul className={'bg-white mt-4 rounded-lg shadow-md max-h-filesContent overflow-auto'}>
                    {currentFileItems && Array.isArray(currentFileItems) ? (
                        currentFileItems.map((item) => {
                            return (
                                <li
                                    key={item.name}
                                    className={'px-2 py-1 cursor-pointer border-b border-slate-200 last:border-b-0'}
                                    onDoubleClick={() => lsFiles(item.path)}
                                >
                                    <div className={'flex gap-4 items-center'}>
                                        <FolderIcon className={'text-yellow-200 h-5 w-5'} />
                                        <p className={'text-lg'}>{item.name}</p>
                                    </div>
                                </li>
                            )
                        })
                    ) : currentFileItems && currentFileItems.items.length > 0 ? (
                        currentFileItems.items.map((lSitem) => {
                            return (
                                <li
                                    key={lSitem.name}
                                    className={'px-2 py-1 cursor-pointer border-b border-slate-200 last:border-b-0'}
                                    onDoubleClick={() =>
                                        lSitem.type === LsTypes.FOLDER &&
                                        lsFiles(`${currentFileItems.pwd}/${lSitem.name}`)
                                    }
                                >
                                    <div className={'flex gap-4 items-center'}>
                                        {lSitem.type === LsTypes.FILE ? (
                                            <RenderIcon filename={lSitem.name} />
                                        ) : (
                                            // <InsertDriveFileIcon className={'text-slate-300 w-4'} />
                                            <FolderIcon className={'text-yellow-200 h-5 w-5'} />
                                        )}
                                        <p className={'grow-0 break-all'}>
                                            {lSitem.name.split('/').at(-1) || lSitem.name.split('/').at(-2)}
                                        </p>
                                        <p className={'ml-auto shrink-0'}>
                                            {dateToLocalString({dateUTC: lSitem.date, withSeconds: true})}
                                        </p>
                                        <p className={'w-16 text-right shrink-0'}>
                                            {prettyBytes(lSitem.size, {locale: 'ru'})}
                                        </p>
                                        {lSitem.type === LsTypes.FILE ? (
                                            <Menu as='div' className='relative inline-block text-left'>
                                                <Menu.Button
                                                    onClick={(event) =>
                                                        FilesStore.setClickMenuCoords({
                                                            clientX: event.clientX,
                                                            clientY: event.clientY,
                                                        })
                                                    }
                                                    className={
                                                        'flex items-center justify-center px-3 py-1 hover:bg-gray-50'
                                                    }
                                                >
                                                    <MoreVertIcon />
                                                </Menu.Button>
                                                <Portal>
                                                    <Transition
                                                        as={Fragment}
                                                        enter='transition ease-out duration-100'
                                                        enterFrom='transform opacity-0 scale-95'
                                                        enterTo='transform opacity-100 scale-100'
                                                        leave='transition ease-in duration-75'
                                                        leaveFrom='transform opacity-100 scale-100'
                                                        leaveTo='transform opacity-0 scale-95'
                                                    >
                                                        <Menu.Items
                                                            style={{
                                                                top:
                                                                    FilesStore.clickMenuCoords.clientY + 265 >
                                                                    window.screen.height
                                                                        ? `${
                                                                              FilesStore.clickMenuCoords.clientY - 265
                                                                          }px`
                                                                        : `${
                                                                              FilesStore.clickMenuCoords.clientY + 20
                                                                          }px`,
                                                                left: `${FilesStore.clickMenuCoords.clientX - 196}px`,
                                                            }}
                                                            className='absolute text-sm z-10 w-44 origin-top-right rounded-md overflow-hidden bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                                                        >
                                                            <>
                                                                {menuItems.map((item) => (
                                                                    <Menu.Item
                                                                        key={item.name}
                                                                        as={'button'}
                                                                        className={
                                                                            'flex gap-2 py-2 pl-3 text-md items-center hover:bg-gray-100 hover:text-blue-400 w-full'
                                                                        }
                                                                        onClick={() => {
                                                                            FilesStore.setCurrentFolderPath(
                                                                                currentFileItems.pwd
                                                                            )
                                                                            item.onClick(
                                                                                `${currentFileItems.pwd}/${lSitem.name}`
                                                                            )
                                                                        }}
                                                                    >
                                                                        {item.icon}
                                                                        <p>{item.name}</p>
                                                                    </Menu.Item>
                                                                ))}
                                                                {lSitem.name.endsWith('.enc') ? (
                                                                    <Menu.Item
                                                                        as={'button'}
                                                                        className={
                                                                            'flex gap-2 py-2 pl-3 text-md items-center hover:bg-gray-100 hover:text-blue-400 w-full'
                                                                        }
                                                                        onClick={() => {
                                                                            FilesStore.setCurrentFolderPath(
                                                                                currentFileItems.pwd
                                                                            )
                                                                            FilesStore.setModalType('decrypt')
                                                                            FilesStore.setIsDialogOpen(true)
                                                                            FilesStore.setCurrentFilePath(
                                                                                `${currentFileItems.pwd}/${lSitem.name}`
                                                                            )
                                                                        }}
                                                                    >
                                                                        <NoEncryptionIcon sx={{width: '20px'}} />
                                                                        <p>Расшифровать</p>
                                                                    </Menu.Item>
                                                                ) : (
                                                                    <Menu.Item
                                                                        as={'button'}
                                                                        className={
                                                                            'flex gap-2 py-2 pl-3 text-md items-center hover:bg-gray-100 hover:text-blue-400 w-full'
                                                                        }
                                                                        onClick={() => {
                                                                            FilesStore.setCurrentFolderPath(
                                                                                currentFileItems.pwd
                                                                            )
                                                                            FilesStore.setModalType('encrypt')
                                                                            FilesStore.setIsDialogOpen(true)
                                                                            FilesStore.setCurrentFilePath(
                                                                                `${currentFileItems.pwd}/${lSitem.name}`
                                                                            )
                                                                        }}
                                                                    >
                                                                        <EnhancedEncryptionIcon sx={{width: '20px'}} />
                                                                        <p>Зашифровать</p>
                                                                    </Menu.Item>
                                                                )}
                                                            </>
                                                        </Menu.Items>
                                                    </Transition>
                                                </Portal>
                                            </Menu>
                                        ) : (
                                            <Menu as='div' className='relative inline-block text-left'>
                                                <Menu.Button
                                                    onClick={(event) =>
                                                        FilesStore.setClickMenuCoords({
                                                            clientX: event.clientX,
                                                            clientY: event.clientY,
                                                        })
                                                    }
                                                    className={
                                                        'flex items-center justify-center px-3 py-1 hover:bg-gray-50'
                                                    }
                                                >
                                                    <MoreVertIcon />
                                                </Menu.Button>
                                                <Portal>
                                                    <Transition
                                                        as={Fragment}
                                                        enter='transition ease-out duration-100'
                                                        enterFrom='transform opacity-0 scale-95'
                                                        enterTo='transform opacity-100 scale-100'
                                                        leave='transition ease-in duration-75'
                                                        leaveFrom='transform opacity-100 scale-100'
                                                        leaveTo='transform opacity-0 scale-95'
                                                    >
                                                        <Menu.Items
                                                            style={{
                                                                top:
                                                                    FilesStore.clickMenuCoords.clientY + 40 >
                                                                    window.screen.height
                                                                        ? `${FilesStore.clickMenuCoords.clientY - 40}px`
                                                                        : `${
                                                                              FilesStore.clickMenuCoords.clientY + 20
                                                                          }px`,
                                                                left: `${FilesStore.clickMenuCoords.clientX - 196}px`,
                                                            }}
                                                            className='absolute text-sm z-10 w-44 origin-top-right rounded-md overflow-hidden bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                                                        >
                                                            {(FilesStore.copiedFilePath ||
                                                                FilesStore.movedFilePath) && (
                                                                <Menu.Item
                                                                    as={'button'}
                                                                    className={
                                                                        'flex gap-2 py-2 pl-3 text-md items-center hover:bg-gray-100 hover:text-blue-400 w-full'
                                                                    }
                                                                    onClick={() => {
                                                                        FilesStore.movedFilePath
                                                                            ? moveFiles(
                                                                                  FilesStore.movedFilePath,
                                                                                  `${currentFileItems.pwd}/${
                                                                                      lSitem.name
                                                                                  }/${FilesStore.movedFilePath
                                                                                      .split('/')
                                                                                      .at(-1)}`
                                                                              )
                                                                            : copyFiles(
                                                                                  FilesStore.copiedFilePath,
                                                                                  `${currentFileItems.pwd}/${
                                                                                      lSitem.name
                                                                                  }/${FilesStore.copiedFilePath
                                                                                      .split('/')
                                                                                      .at(-1)}`
                                                                              )
                                                                    }}
                                                                >
                                                                    <ContentPasteIcon sx={{width: '20px'}} />
                                                                    <p>Вставить</p>
                                                                </Menu.Item>
                                                            )}
                                                        </Menu.Items>
                                                    </Transition>
                                                </Portal>
                                            </Menu>
                                        )}
                                    </div>
                                </li>
                            )
                        })
                    ) : (
                        <li className={'px-4 py-2 cursor-pointer border-b border-slate-200 last:border-b-0'}>
                            Нет файлов для отображения
                        </li>
                    )}
                </ul>
            </div>
            {FilesStore.isDialogOpen && <Modal onDelete={() => deleteFiles(FilesStore.currentFilePath)} />}
        </div>
    )
})
