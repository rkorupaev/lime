export interface FilesRequest {
    command_type: number
    device_id: string
    ack: string
    content: {[T: string]: string} | object
}

export interface FilesResponse {
    status: number
    command_type: number
    ack: string
}

export type RootDirItem = {
    name: string
    path: string
}

export interface GetRootDirResponse extends FilesResponse {
    body: {items: RootDirItem[]}
}

export enum LsTypes {
    'FILE',
    'FOLDER',
}

export type LsItem = {
    name: string
    date: string
    size: number
    type: LsTypes
}

export type LsFilesBody = {
    pwd: string
    items: LsItem[]
}

export interface LsFilesResponse extends FilesResponse {
    body: LsFilesBody
}

export type HideFilesBody = {
    file: string
}

export interface HideFilesResponse extends FilesResponse {
    body: HideFilesBody
}

export interface CommonFilesResponse extends FilesResponse {
    body: object
}

export enum Events {
    'GET_ROOT_DIRS' = 39,
    'MOVE_FILES' = 28,
    'COPY_FILES' = 29,
    'RENAME_FILES' = 30,
    'HIDE_FILES' = 31,
    'ENCRYPT_FILES' = 32,
    'DECRYPT_FILES' = 33,
    'DEL_FILES' = 34,
    'LS_FILES' = 37,
}

export interface Coords {
    clientX: number
    clientY: number
}

export type ModalType = 'rename' | 'encrypt' | 'decrypt' | 'delete'
