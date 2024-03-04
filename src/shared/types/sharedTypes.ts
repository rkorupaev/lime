export interface ApiResponseWithCount<T> {
    apiResponse: T
    count: number
}

export interface ApiResponseWithCountAndDate<T> {
    apiResponse: T
    count: number
    'x-max-date-till': string
    'x-min-date-from': string
}

export interface SortingColumn {
    name: string
    order: 'asc' | 'desc'
}

export interface LocalStorageIcon {
    [key: string]: {
        iconSrc: string
        updateDate: string
    }
}

export type ObjectWithPackageName = {
    package_name: string | null
    [key: string]: any
}
