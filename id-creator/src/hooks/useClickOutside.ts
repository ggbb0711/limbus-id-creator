import { RefObject, useEffect, useRef } from "react"

export function useClickOutside(refs: readonly RefObject<HTMLElement | null>[], active: boolean, onOutside: () => void) {
    const latest = useRef({ refs, onOutside })

    useEffect(() => {
        latest.current = { refs, onOutside }
    })

    useEffect(() => {
        if (!active) return
        function onPointerDown(event: MouseEvent) {
            const target = event.target as Node
            if (latest.current.refs.some(ref => ref.current?.contains(target))) return
            latest.current.onOutside()
        }
        document.addEventListener("mousedown", onPointerDown)
        return () => document.removeEventListener("mousedown", onPointerDown)
    }, [active])
}
