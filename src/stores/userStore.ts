import {makeAutoObservable} from 'mobx'
import {CurrentUser} from 'services/UserService'

class UserStore {
    password: string = ''
    isAuth: boolean = true
    refresh_token: string | null = null
    user: CurrentUser | null = null

    constructor() {
        makeAutoObservable(this)
    }

    setUser(user: CurrentUser) {
        this.user = user
    }

    setPassword(password: string) {
        this.password = password
    }

    setIsAuth(isAuth: boolean) {
        this.isAuth = isAuth
    }

    setRefreshToken(token: string) {
        this.refresh_token = token
    }
}

export default new UserStore()
