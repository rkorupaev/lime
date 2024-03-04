import {useState, useEffect, RefObject} from 'react'

function useScrollEnd(containerRef: RefObject<HTMLDivElement>): boolean {
    const [isScrollEnd, setScrollEnd] = useState<boolean>(false)

    useEffect(() => {
        function handleScroll() {
            const container = containerRef.current

            if (container) {
                const currentScroll: number = container.scrollTop
                const containerHeight: number = container.clientHeight
                const contentHeight: number = container.scrollHeight
                const remainingHeight: number = contentHeight - (currentScroll + containerHeight)
                setScrollEnd(remainingHeight <= 1)
            }
        }

        const container = containerRef.current
        if (container) {
            container.addEventListener('scroll', handleScroll)
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll)
            }
        }
    }, [containerRef])

    return isScrollEnd
}

export default useScrollEnd
