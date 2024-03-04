import {ReactNode} from 'react'
import {createPortal} from 'react-dom'

interface PortalProps {
    // то, что монтируем в портал
    children: ReactNode
    // то, куда монтируем портал
    element?: HTMLElement
}
export const Portal = ({children, element = document.body}: PortalProps) => {
    const app = document.querySelector('.root')
    if (app) return createPortal(children, app)
    else return createPortal(children, element)
}
