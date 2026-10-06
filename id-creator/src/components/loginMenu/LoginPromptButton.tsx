'use client'
import React, { ReactElement, ReactNode } from "react"
import { useLoginMenu } from "hooks/useLoginMenu"

export default function LoginPromptButton({ children = "Login", className = "main-button", onClick }: { children?: ReactNode, className?: string, onClick?: () => void }): ReactElement {
    const { setIsLoginMenuActive } = useLoginMenu()
    return <button className={className} onClick={() => { setIsLoginMenuActive(true); onClick?.() }}>{children}</button>
}
