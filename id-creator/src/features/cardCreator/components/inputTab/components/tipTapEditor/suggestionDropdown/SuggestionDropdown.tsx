import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import "./SuggestionDropdown.css"

export interface SuggestionItem {
    keyword: string
    html: string
}

export interface SuggestionDropdownRef {
    onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

interface SuggestionDropdownProps {
    items: SuggestionItem[]
    command: (item: SuggestionItem) => void
}

const SuggestionDropdown = forwardRef<SuggestionDropdownRef, SuggestionDropdownProps>(
    ({ items, command }, ref) => {
        const [selectedIndex, setSelectedIndex] = useState(0)

        useEffect(() => {
            setSelectedIndex(0)
        }, [items])

        useImperativeHandle(ref, () => ({
            onKeyDown: ({ event }) => {
                if (event.key === "ArrowUp") {
                    setSelectedIndex((prev) => (prev - 1 < 0 ? items.length - 1 : prev - 1))
                    return true
                }
                if (event.key === "ArrowDown") {
                    setSelectedIndex((prev) => (prev + 1 > items.length - 1 ? 0 : prev + 1))
                    return true
                }
                if (event.key === "Tab") {
                    setSelectedIndex((prev) => (prev + 1 > items.length - 1 ? 0 : prev + 1))
                    return true
                }
                if (event.key === "Enter") {
                    if (items[selectedIndex]) {
                        command(items[selectedIndex])
                    }
                    return true
                }
                return false
            },
        }))

        if (items.length === 0) return null

        return (
            <div className="suggest-box">
                {items.map((item, i) => (
                    <div
                        className={`textcomplete-item ${i === selectedIndex ? "active" : ""}`}
                        key={item.keyword}
                        onClick={() => command(item)}
                    >
                        <div dangerouslySetInnerHTML={{ __html: item.html }} />
                    </div>
                ))}
            </div>
        )
    }
)
SuggestionDropdown.displayName = "SuggestionDropdown"
export default SuggestionDropdown
