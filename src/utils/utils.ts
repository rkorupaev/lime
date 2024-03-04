// @ts-nocheck
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
dayjs.extend(timezone)

export const dateToLocalString = (params: {dateUTC: string; full?: boolean; withSeconds?: boolean}) => {
    const {dateUTC, withSeconds, full} = params
    if (full) {
        return dayjs.utc(dateUTC).tz(dayjs.tz.guess()).format('DD.MM.YYYY HH:mm:ss:SSS')
    } else if (withSeconds) {
        return dayjs.utc(dateUTC).tz(dayjs.tz.guess()).format('DD.MM.YYYY HH:mm:ss')
    } else return dayjs.utc(dateUTC).tz(dayjs.tz.guess()).format('DD.MM.YYYY HH:mm')
}

export const dateToUTCISOString = (date: dayjs): da => {
    return date.tz(dayjs.tz.guess()).utc().toISOString()
}

export const getLocales4DataGrid = () => {
    return {
        footerTotalRows: 'Всего строк:',
        columnMenuSortAsc: 'Сортировать по возрастанию',
        columnMenuUnsort: 'Сбросить сортировку',
        columnMenuSortDesc: 'Сортировать по убыванию',
        pinToLeft: 'Закрепить слева',
        pinToRight: 'Закрепить справа',
        unpin: 'Сбросить закрепление',
        columnMenuFilter: 'Фильтрация',
        filterPanelColumns: 'Столбцы',
        filterPanelOperator: 'Оператор',
        filterPanelInputLabel: 'Значение',
        filterPanelAddFilter: 'Добавить фильтр',
        filterPanelRemoveAll: 'Удалить все',
        filterPanelInputPlaceholder: 'Значение фильтра',
        filterOperatorContains: 'содержит',
        filterOperatorEquals: 'равен',
        filterOperatorStartsWith: 'начинается с',
        filterOperatorEndsWith: 'заканчивается на',
        filterOperatorIsEmpty: 'пустой',
        filterOperatorIsNotEmpty: 'не пустой',
        filterOperatorIsAnyOf: 'один из',
        columnMenuHideColumn: 'Скрыть столбец',
        columnMenuManageColumns: 'Управление столбцами',
        columnsPanelTextFieldLabel: 'Найти столбец',
        columnsPanelTextFieldPlaceholder: 'Заголовок столбца',
        columnsPanelShowAllButton: 'Показать все',
        columnsPanelHideAllButton: 'Скрыть все',
    }
}

const dateToISOLikeButLocal = (date) => {
    if (date) {
        date = new Date(date)
        const offsetMs = date.getTimezoneOffset() * 60 * 1000
        const msLocal = date.getTime() - offsetMs
        const dateLocal = new Date(msLocal)
        const iso = dateLocal.toISOString()
        const isoLocal = iso.replace('Z', '')
        return isoLocal
    }
    return date
}

const prettifyDate = (data) => {
    if (data) {
        if (data.at(-1) !== 'Z') data = data.split('.')[0] + 'Z'
        return dayjs(data).format('HH:mm:ss / DD.MM.YYYY')
    } else return ''
}

const checkDateIsValid = (field, value, data) => {
    if (field === 'validUntil') {
        return data.validFrom <= dateToISOLikeButLocal(value)
    } else if (field === 'validFrom') {
        return dateToISOLikeButLocal(value) <= data.validUntil
    }
    return true
}

export function getFilenameFromContentDisposition(contentDisposition) {
    const regex = /filename=["']?([^"']+)/
    const match = contentDisposition.match(regex)
    if (match && match[1]) {
        return match[1]
    }
    return null
}

export {dateToISOLikeButLocal, prettifyDate, checkDateIsValid}
