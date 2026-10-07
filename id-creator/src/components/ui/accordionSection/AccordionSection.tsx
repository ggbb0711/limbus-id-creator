import React, { useId, useRef, useState } from "react";
import { ReactElement } from "react";
import ArrowDownIcon from "assets/icons/ArrowDownIcon";
import "./AccordionSection.css"

interface AccordionSectionProps {
    title: string
    defaultOpen?: boolean
    children: React.ReactNode
}

export default function AccordionSection({ title, defaultOpen = true, children }: AccordionSectionProps): ReactElement {
    const [isOpen, setIsOpen] = useState(defaultOpen)
    const contentRef = useRef<HTMLDivElement>(null)
    const contentId = useId()

    return <div className="accordion-section">
        <button type="button" className="accordion-header" aria-expanded={isOpen} aria-controls={contentId} onClick={() => setIsOpen(!isOpen)}>
            <span className="accordion-title">{title}</span>
            <span className={`accordion-arrow ${isOpen ? "accordion-arrow-open" : ""}`} aria-hidden="true">
                <ArrowDownIcon />
            </span>
        </button>
        <div
            id={contentId}
            inert={!isOpen}
            ref={contentRef}
            className={`accordion-content-wrapper ${isOpen ? "accordion-content-open" : "accordion-content-closed"}`}
        >
            <div className="accordion-content">
                {children}
            </div>
        </div>
    </div>
}
