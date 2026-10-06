'use client'
import React, { ReactElement, ReactNode, useRef } from "react"
import { useDialog } from "./useDialog"

interface DialogProps {
    open?: boolean
    onClose: () => void
    label: string
    role?: "dialog" | "alertdialog"
    className: string
    backdropClassName: string
    contentClassName: string
    children: ReactNode
}

export default function Dialog({ open = true, onClose, label, role = "dialog", className, backdropClassName, contentClassName, children }: DialogProps): ReactElement | null {
    const contentRef = useRef<HTMLDivElement>(null)
    useDialog(open, onClose, contentRef)

    if (!open) return null
    return <div className={className}>
        <div className={backdropClassName} onClick={onClose} aria-hidden="true"></div>
        <div ref={contentRef} className={contentClassName} role={role} aria-modal="true" aria-label={label} tabIndex={-1}>
            {children}
        </div>
    </div>
}
