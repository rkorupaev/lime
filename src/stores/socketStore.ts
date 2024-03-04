import {makeAutoObservable} from 'mobx'
import {Socket} from 'socket.io-client'

class SocketStore {
    constructor() {
        makeAutoObservable(this)
    }

    webSocket: Socket | null = null

    setWebSocket(data: Socket) {
        this.webSocket = data
    }
}

export default new SocketStore()
