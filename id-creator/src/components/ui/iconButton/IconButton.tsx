import React, { ButtonHTMLAttributes, ReactElement } from "react"

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
    label: string
}

export default function IconButton({ label, className = "", type = "button", children, ...props }: IconButtonProps): ReactElement {
    return <button {...props} type={type} aria-label={label} title={props.title ?? label} className={`icon-button ${className}`}>
        {children}
    </button>
}
