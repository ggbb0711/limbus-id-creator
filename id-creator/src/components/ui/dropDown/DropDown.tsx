'use client'
import React, { CSSProperties, KeyboardEvent, ReactElement, useEffect, useId, useRef, useState } from "react";
import "./DropDown.css"
import ArrowDownIcon from "assets/icons/ArrowDownIcon";

export interface DropDownOption<T> {
    value: T
    el: ReactElement
    style?: CSSProperties
}

interface DropDownProps<T> {
    options: readonly DropDownOption<T>[]
    value?: T
    onChange: (value: T) => void
    disabled?: boolean
    label?: string
}

export default function DropDown<T = string>({ options, value, onChange, disabled = false, label }: DropDownProps<T>): ReactElement {
    const listId = useId()
    const containerRef = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)
    const selectedIndex = Math.max(0, options.findIndex(option => option.value === value))
    const [activeIndex, setActiveIndex] = useState(selectedIndex)
    const selected = options[selectedIndex]

    useEffect(() => {
        if (!isOpen) return
        function onPointerDown(event: MouseEvent) {
            if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
        }
        document.addEventListener("mousedown", onPointerDown)
        return () => document.removeEventListener("mousedown", onPointerDown)
    }, [isOpen])

    function open() {
        setActiveIndex(selectedIndex)
        setIsOpen(true)
    }

    function choose(index: number) {
        const option = options[index]
        if (option) onChange(option.value)
        setIsOpen(false)
    }

    function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
        if (disabled) return
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault()
                if (!isOpen) open()
                else setActiveIndex(index => Math.min(options.length - 1, index + 1))
                break
            case "ArrowUp":
                event.preventDefault()
                if (!isOpen) open()
                else setActiveIndex(index => Math.max(0, index - 1))
                break
            case "Enter":
            case " ":
                event.preventDefault()
                if (isOpen) choose(activeIndex)
                else open()
                break
            case "Escape":
                if (isOpen) {
                    event.preventDefault()
                    event.stopPropagation()
                    setIsOpen(false)
                }
                break
        }
    }

    return (
        <div className="drop-down-container" ref={containerRef}>
            {disabled && <div className="disabled-block"></div>}
            <button type="button" className="curr-el" disabled={disabled} aria-label={label} aria-haspopup="listbox" aria-expanded={isOpen} aria-controls={listId}
                aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
                onClick={() => isOpen ? setIsOpen(false) : open()} onKeyDown={onKeyDown}>
                {selected?.el}
                <span className="arrow-down">
                    <ArrowDownIcon/>
                </span>
            </button>
            {isOpen &&
                <ul className="drop-down active" role="listbox" id={listId}>
                    {options.map((option, i) =>
                        <li key={i} id={`${listId}-${i}`} role="option" aria-selected={i === selectedIndex}
                            className={`drop-down-el ${i === activeIndex ? "focused" : ""}`} style={option.style}
                            onMouseEnter={() => setActiveIndex(i)} onClick={() => choose(i)}>
                            {option.el}
                        </li>
                    )}
                </ul>
            }
        </div>
    )
}
