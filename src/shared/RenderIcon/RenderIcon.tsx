import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import {GetAppsStatsDayResponse} from '../../services/AppService'
import {LocalStorageKeys} from '../../config'
import {observer} from 'mobx-react-lite'
import IconsStore from '../../stores/iconsStore'

export const RenderIcon = observer(
    ({data, package_name}: {data?: GetAppsStatsDayResponse; package_name: string | null}) => {
        const {appIcons} = IconsStore
        RenderIcon.displayName = 'RenderIcon'

        const storage = localStorage.getItem(LocalStorageKeys.APP_ICONS_KEY)

        if (data?.app_info?.google_play_info?.icon) {
            return (
                <img
                    className={'w-5 h-5'}
                    src={data.app_info?.google_play_info?.icon}
                    alt={data.app_info?.google_play_info.title || 'Иконка приложения'}
                />
            )
        } else if (data?.app_info?.apk_pure_info?.icon) {
            return (
                <img
                    className={'w-5 h-5'}
                    src={data.app_info?.apk_pure_info?.icon}
                    alt={data.app_info?.apk_pure_info.title || 'Иконка приложения'}
                />
            )
        } else if (
            storage &&
            package_name &&
            JSON.parse(storage)[package_name] &&
            JSON.parse(storage)[package_name].iconSrc !== 'error'
        ) {
            return <img className={'w-5 h-5'} src={JSON.parse(storage)[package_name].iconSrc} alt={package_name} />
        } else if (
            storage &&
            package_name &&
            JSON.parse(storage)[package_name] &&
            JSON.parse(storage)[package_name].iconSrc === 'error'
        ) {
            return <ImageNotSupportedIcon color={'disabled'} />
        } else if (package_name && appIcons?.[package_name]) {
            return <img className={'w-5 h-5'} src={appIcons[package_name].iconSrc} alt={package_name} />
        } else return <ImageNotSupportedIcon color={'disabled'} />
    }
)
