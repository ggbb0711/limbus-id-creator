import { RefObject, useEffect, useRef } from "react"

const openDialogs: HTMLElement[] = []

function topDialog(): HTMLElement | undefined {
    const innermost = openDialogs.filter(dialog => !openDialogs.some(other => other !== dialog && dialog.contains(other)))
    return innermost[innermost.length - 1]
}

export function useDialog(open: boolean, onClose: () => void, ref: RefObject<HTMLElement | null>) {
    const onCloseRef = useRef(onClose)

    useEffect(() => {
        onCloseRef.current = onClose
    })

    useEffect(() => {
        const element = ref.current
        if (!open || !element) return
        const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
        openDialogs.push(element)
        element.focus()

        function onKeyDown(event: KeyboardEvent) {
            if (event.key !== "Escape" || topDialog() !== element) return
            event.preventDefault()
            onCloseRef.current()
        }

        document.addEventListener("keydown", onKeyDown)
        return () => {
            document.removeEventListener("keydown", onKeyDown)
            openDialogs.splice(openDialogs.indexOf(element), 1)
            trigger?.focus()
        }
    }, [open, ref])
}
