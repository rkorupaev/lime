import FilesStore from './store/filesStore'
import Button from '@mui/material/Button'
import {UseEvents} from './model/events/useEvents'
import {observer} from 'mobx-react-lite'
import {Portal} from '../../shared/Portal/index'
import {FormEvent} from 'react'

interface ModalProps {
    onDelete: () => void
}

export const Modal = observer((props: ModalProps) => {
    Modal.displayName = 'Modal'
    const {decryptFiles, encryptFiles, renameFiles} = UseEvents()
    const {onDelete} = props
    const {modalType} = FilesStore

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (modalType === 'encrypt') {
            encryptFiles(FilesStore.currentFilePath, FilesStore.modalInput)
        }
        if (modalType === 'decrypt') {
            decryptFiles(FilesStore.currentFilePath, FilesStore.modalInput)
        }
        if (modalType === 'rename') {
            renameFiles(FilesStore.currentFilePath, `${FilesStore.currentFolderPath}/${FilesStore.modalInput}`)
        }
        if (modalType === 'delete') {
            onDelete()
            // deleteFiles(FilesStore.currentFilePath)
        }
        FilesStore.setIsDialogOpen(false)
        FilesStore.setModalInput('')
        FilesStore.setCurrentFilePath('')
    }

    return (
        <Portal>
            <div
                className={'fixed z-[9999] inset-0 bg-slate-800/40 flex justify-center items-center'}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        FilesStore.setIsDialogOpen(false)
                        FilesStore.setModalInput('')
                    }
                }}
            >
                <div className={'p-8 flex flex-col gap-4 bg-white rounded-lg'}>
                    {(modalType === 'encrypt' || modalType === 'decrypt') && (
                        <p className={'text-lg text-center'}>Ключ шифрования</p>
                    )}
                    {modalType === 'rename' && <p className={'text-lg text-center'}>Имя файла</p>}
                    {modalType === 'delete' && (
                        <p className={'text-lg text-center'}>Вы уверены, что хотите удалить файл?</p>
                    )}
                    <form onSubmit={onSubmit} className={'px-8 pb-4'}>
                        {modalType !== 'delete' && (
                            <input
                                autoFocus
                                type='text'
                                className={
                                    'bg-gray-50 w-96 border border-gray-300 h-10 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:text-gray-400'
                                }
                                value={FilesStore.modalInput}
                                onChange={(e) => FilesStore.setModalInput(e.target.value)}
                            />
                        )}

                        {(modalType === 'encrypt' || modalType === 'decrypt') && (
                            <p className={'text-red-400 mt-2 ml-2'}>* Строка от 10-ти символов</p>
                        )}
                        {modalType === 'encrypt' && (
                            <Button
                                type={'submit'}
                                sx={{mt: '15px', width: '100%'}}
                                variant={'contained'}
                                disabled={FilesStore.modalInput.length < 10}
                            >
                                Зашифровать
                            </Button>
                        )}
                        {modalType === 'decrypt' && (
                            <Button
                                sx={{mt: '15px', width: '100%'}}
                                variant={'contained'}
                                disabled={FilesStore.modalInput.length < 10}
                            >
                                Расшифровать
                            </Button>
                        )}
                        {modalType === 'rename' && (
                            <Button
                                type={'submit'}
                                sx={{mt: '25px', width: '100%'}}
                                variant={'contained'}
                                disabled={FilesStore.modalInput.length < 1}
                            >
                                Переименовать
                            </Button>
                        )}
                        {modalType === 'delete' && (
                            <div className={'flex justify-around mt-4'}>
                                <Button
                                    variant={'contained'}
                                    color={'info'}
                                    onClick={() => FilesStore.setIsDialogOpen(false)}
                                >
                                    Отмена
                                </Button>
                                <Button type={'submit'} color={'error'} variant={'contained'}>
                                    Удалить
                                </Button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </Portal>
    )
})
