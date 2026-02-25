import React, { useEffect, useRef, useState } from "react"

declare global {
    interface Window {
        adsbygoogle: any[]
    }
}

export default function DisplayAd() {
    const initialized = useRef(false)
    const insRef = useRef<HTMLModElement>(null)
    const [insHeight, setInsHeight] = useState(0)

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({})
            } catch (err) { console.log(err) }
        }
        if (!insRef.current) return
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                setInsHeight(entry.contentRect.height)
            }
        })
        observer.observe(insRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <div style={{position: "relative", width: "100%", maxWidth: "100%", minHeight: insHeight}}>
            <ins
                ref={insRef}
                className="adsbygoogle"
                style={{display: "block", position: "absolute", width: "inherit", maxWidth: "inherit"}}
                data-ad-client="ca-pub-2161757435040376"
                data-ad-slot="7945609324"
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    )
}
