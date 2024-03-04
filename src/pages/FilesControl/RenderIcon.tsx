import PngIcon from '../../assets/PNG.svg?react'
import JpgIcon from '../../assets/JPG.svg?react'
import JpegIcon from '../../assets/JPEG.svg?react'
import PdfIcon from '../../assets/PDF.svg?react'
import AVIIcon from '../../assets/AVI.svg?react'
import CSVIcon from '../../assets/CSV.svg?react'
import GIFIcon from '../../assets/GIF.svg?react'
import DOCXIcon from '../../assets/Microsoft DOCX.svg?react'
import WordIcon from '../../assets/Microsoft Word.svg?react'
import MKVIcon from '../../assets/MKV.svg?react'
import MP3Icon from '../../assets/MP3.svg?react'
import MP4Icon from '../../assets/MP4.svg?react'
import SVGIcon from '../../assets/SVG File.svg?react'
import TXTIcon from '../../assets/TXT.svg?react'
import VCFIcon from '../../assets/VCF File.svg?react'
import WAVIcon from '../../assets/WAV.svg?react'
import XLSIcon from '../../assets/XLS.svg?react'
import XLSMIcon from '../../assets/XLSM.svg?react'
import XLSXIcon from '../../assets/XLSX.svg?react'
import XMLIcon from '../../assets/XML.svg?react'
import EPUBIcon from '../../assets/EPUB.svg?react'
import ApkIcon from '../../assets/apk-file.svg?react'
import RARIcon from '../../assets/RAR.svg?react'
import MOVIcon from '../../assets/MOV.svg?react'
import ZIPIcon from '../../assets/ZIP.svg?react'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'

export const RenderIcon = ({filename}: {filename: string}) => {
    if (filename.toLowerCase().endsWith('.png')) {
        return <PngIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.jpg')) {
        return <JpgIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.jpeg')) {
        return <JpegIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.pdf')) {
        return <PdfIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.avi')) {
        return <AVIIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.csv')) {
        return <CSVIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.gif')) {
        return <GIFIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.docx')) {
        return <DOCXIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.doc')) {
        return <WordIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.mkv')) {
        return <MKVIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.mp3')) {
        return <MP3Icon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.mp4')) {
        return <MP4Icon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.svg')) {
        return <SVGIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.txt')) {
        return <TXTIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.vcf')) {
        return <VCFIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.wav')) {
        return <WAVIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.xls')) {
        return <XLSIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.xlsm')) {
        return <XLSMIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.xlsx')) {
        return <XLSXIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.xml')) {
        return <XMLIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.apk')) {
        return <ApkIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.epub')) {
        return <EPUBIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.rar')) {
        return <RARIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.zip')) {
        return <ZIPIcon className={'w-6 h-6'} />
    } else if (filename.toLowerCase().endsWith('.mov')) {
        return <MOVIcon className={'w-6 h-6'} />
    } else return <InsertDriveFileIcon className={'w-6 h-6'} />
}
