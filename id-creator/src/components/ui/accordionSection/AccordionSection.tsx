import React, { useRef, useState } from "react";
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

    return <div className="accordion-section">
        <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
            <p className="accordion-title">{title}</p>
            <span className={`accordion-arrow ${isOpen ? "accordion-arrow-open" : ""}`}>
                <ArrowDownIcon />
            </span>
        </div>
        <div
            ref={contentRef}
            className={`accordion-content-wrapper ${isOpen ? "accordion-content-open" : "accordion-content-closed"}`}
        >
            <div className="accordion-content">
                {children}
            </div>
        </div>
    </div>
}
