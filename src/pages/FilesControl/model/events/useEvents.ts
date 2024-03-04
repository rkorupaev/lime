import SocketStore from '../../../../stores/socketStore'
import deviceStore from '../../../../stores/deviceStore'
import {Events} from '../types/filesTypes'
import {v4 as uuidv4} from 'uuid'

export const UseEvents = () => {
    const socket = SocketStore.webSocket

    const getRootDirs = () => {
        if (socket) {
            socket.emit('event_command', {
                device_id: deviceStore.currentDeviceIndex!,
                command_type: Events.GET_ROOT_DIRS,
                ack: uuidv4(),
                content: {},
            })
        }
    }

    const lsFiles = (pwd: string) => {
        if (socket) {
            socket.emit('event_command', {
                device_id: deviceStore.currentDeviceIndex!,
                command_type: Events.LS_FILES,
                ack: uuidv4(),
                content: {pwd},
            })
        }
    }

    const moveFiles = (file: string, move_to: string) => {
        if (socket) {
            socket.emit('event_command', {
                device_id: deviceStore.currentDeviceIndex!,
                command_type: Events.MOVE_FILES,
                ack: uuidv4(),
                content: {file, move_to},
            })
        }
    }

    const copyFiles = (file: string, copy_to: string) => {
        if (socket) {
            socket.emit('event_command', {
                device_id: deviceStore.currentDeviceIndex!,
                command_type: Events.COPY_FILES,
                ack: uuidv4(),
                content: {file, copy_to},
            })
        }
    }

    const hideFiles = (file: string) => {
        if (socket) {
            socket.emit('event_command', {
                device_id: deviceStore.currentDeviceIndex!,
                command_type: Events.HIDE_FILES,
                ack: uuidv4(),
                content: {file},
            })
        }
    }

    const encryptFiles = (file: string, key: string) => {
        if (socket) {
            socket.emit('event_command', {
                device_id: deviceStore.currentDeviceIndex!,
                command_type: Events.ENCRYPT_FILES,
                ack: uuidv4(),
                content: {file, key, alg: 'aes'},
            })
        }
    }

    const decryptFiles = (file: string, key: string) => {
        if (socket) {
            socket.emit('event_command', {
                device_id: deviceStore.currentDeviceIndex!,
                command_type: Events.DECRYPT_FILES,
                ack: uuidv4(),
                content: {file, key, alg: 'aes'},
            })
        }
    }

    const renameFiles = (file: string, filename: string) => {
        if (socket) {
            socket.emit('event_command', {
                device_id: deviceStore.currentDeviceIndex!,
                command_type: Events.RENAME_FILES,
                ack: uuidv4(),
                content: {file, filename},
            })
        }
    }

    const deleteFiles = (file: string) => {
        if (socket) {
            socket.emit('event_command', {
                device_id: deviceStore.currentDeviceIndex!,
                command_type: Events.DEL_FILES,
                ack: uuidv4(),
                content: {file},
            })
        }
    }

    return {getRootDirs, lsFiles, moveFiles, copyFiles, hideFiles, decryptFiles, encryptFiles, renameFiles, deleteFiles}
}
