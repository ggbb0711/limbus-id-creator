import { KeyboardEvent, MouseEvent, RefObject, useEffect, useId, useState } from "react"

export function cycleIndex(index: number, length: number, direction: 1 | -1): number {
    if (length <= 0) return 0
    return (((index + direction) % length) + length) % length
}

interface UseComboboxOptions<T> {
    items: readonly T[]
    onSelect: (item: T) => void
    containerRef: RefObject<HTMLElement | null>
}

export function useCombobox<T>({ items, onSelect, containerRef }: UseComboboxOptions<T>) {
    const listId = useId()
    const [isOpen, setIsOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    const currentIndex = Math.min(activeIndex, Math.max(0, items.length - 1))
    const optionId = (index: number) => `${listId}-option-${index}`
    const showList = isOpen && items.length > 0

    useEffect(() => {
        if (!isOpen) return
        function onPointerDown(event: globalThis.MouseEvent) {
            if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
        }
        document.addEventListener("mousedown", onPointerDown)
        return () => document.removeEventListener("mousedown", onPointerDown)
    }, [isOpen, containerRef])

    useEffect(() => {
        if (!showList) return
        document.getElementById(`${listId}-option-${currentIndex}`)?.scrollIntoView?.({ block: "nearest", inline: "start" })
    }, [showList, currentIndex, listId])

    function open() {
        setActiveIndex(0)
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }

    function select(item: T | undefined) {
        if (item === undefined) return
        onSelect(item)
        setActiveIndex(0)
        setIsOpen(false)
    }

    function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        switch (event.key) {
            case "ArrowDown":
            case "ArrowUp": {
                event.preventDefault()
                if (!isOpen) {
                    open()
                    return
                }
                setActiveIndex(cycleIndex(currentIndex, items.length, event.key === "ArrowDown" ? 1 : -1))
                return
            }
            case "Enter":
                if (!showList) return
                event.preventDefault()
                select(items[currentIndex])
                return
            case "Escape":
                if (!isOpen) return
                event.preventDefault()
                close()
                return
            case "Tab":
                close()
                return
        }
    }

    return {
        isOpen: showList,
        activeIndex: currentIndex,
        open,
        close,
        select,
        inputProps: {
            role: "combobox" as const,
            "aria-expanded": showList,
            "aria-controls": listId,
            "aria-autocomplete": "list" as const,
            "aria-activedescendant": showList ? optionId(currentIndex) : undefined,
            onKeyDown,
            onFocus: () => setIsOpen(true),
        },
        listProps: {
            id: listId,
            role: "listbox" as const,
        },
        getOptionProps: (index: number) => ({
            id: optionId(index),
            role: "option" as const,
            "aria-selected": index === currentIndex,
            onMouseDown: (event: MouseEvent) => event.preventDefault(),
            onMouseEnter: () => setActiveIndex(index),
            onClick: () => select(items[index]),
        }),
    }
}
