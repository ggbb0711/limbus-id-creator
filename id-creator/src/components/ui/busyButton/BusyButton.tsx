import React, { ButtonHTMLAttributes, ReactElement, ReactNode } from "react"

interface BusyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    busy: boolean
    busyText?: ReactNode
}

export default function BusyButton({ busy, busyText, className = "main-button", type = "button", disabled, children, ...props }: BusyButtonProps): ReactElement {
    return <button {...props} type={type} className={`${className} ${busy ? "active" : ""}`} disabled={busy || disabled} aria-busy={busy}>
        {busy && busyText !== undefined ? busyText : children}
    </button>
}
