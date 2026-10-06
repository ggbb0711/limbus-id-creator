'use client'
import React, { ReactElement, useEffect, useState } from "react";

export default function CopyButton({ text, label }: { text: string, label: string }): ReactElement {
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!copied) return
        const timeout = setTimeout(() => setCopied(false), 2000)
        return () => clearTimeout(timeout)
    }, [copied])

    async function copy() {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
        } catch {
            setCopied(false)
        }
    }

    return <button type="button" className="main-button copy-button" onClick={copy} aria-label={copied ? `${label} copied` : label}>
        {copied ? "Copied" : "Copy"}
    </button>
}
