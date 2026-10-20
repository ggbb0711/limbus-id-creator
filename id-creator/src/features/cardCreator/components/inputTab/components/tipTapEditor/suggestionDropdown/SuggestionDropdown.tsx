import React, { forwardRef, ReactElement, useEffect, useImperativeHandle, useRef, useState } from "react"
import "./SuggestionDropdown.css"
import { sanitizeCardHtml } from "utils/htmlUtils"

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
        const suggestionRefs = useRef<HTMLDivElement[]>([]);
        
        
        function addToRefs(el: HTMLDivElement){
            if (el && !suggestionRefs.current.includes(el)) {
                suggestionRefs.current.push(el)
            }
        }


        useEffect(() => {
            setSelectedIndex(0)
            suggestionRefs.current = []
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

        useEffect(()=>{
            suggestionRefs.current[selectedIndex]?.scrollIntoView({
                block: "end",
                inline: "nearest",
                behavior: "smooth"
            });
        },[selectedIndex])

        if (items.length === 0) return null

        return (
            <div className="suggest-box">
                {items.map((item, i) => (
                    <div
                        className={`textcomplete-item ${i === selectedIndex ? "active" : ""}`}
                        key={item.keyword}
                        onClick={() => command(item)}
                        ref={addToRefs}
                    >
                        <div dangerouslySetInnerHTML={{ __html: sanitizeCardHtml(item.html) }} />
                    </div>
                ))}
            </div>
        )
    }
)
SuggestionDropdown.displayName = "SuggestionDropdown"
export default SuggestionDropdown
