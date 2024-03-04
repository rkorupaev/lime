import {makeAutoObservable} from 'mobx'
import dayjs from 'dayjs'
import {LocalStorageIcon} from '../shared/types/sharedTypes'
import {LocalStorageKeys} from '../config'


class IconsStore {
	constructor() {
		makeAutoObservable(this)
	}

	appIcons: LocalStorageIcon = {}


	addAppIcon(iconSrc: string, packageName: string) {
		const previous = this.appIcons
		const localItems = localStorage.getItem(LocalStorageKeys.APP_ICONS_KEY)
		if (localItems && !JSON.parse(localItems)[packageName]) {
			localStorage.setItem(
				LocalStorageKeys.APP_ICONS_KEY,
				JSON.stringify({
					...JSON.parse(localItems),
					[packageName]: {iconSrc, updateDate: dayjs().toISOString()},
				})
			)
			this.appIcons = Object.assign(previous, {[packageName]: {iconSrc, updateDate: dayjs().toISOString()}})
		} else if (!localItems) {
			localStorage.setItem(
				LocalStorageKeys.APP_ICONS_KEY,
				JSON.stringify({
					[packageName]: {iconSrc, updateDate: dayjs().toISOString()},
				})
			)
			this.appIcons = Object.assign(previous, {[packageName]: {iconSrc, updateDate: dayjs().toISOString()}})
		}
	}
}

export default new IconsStore()
