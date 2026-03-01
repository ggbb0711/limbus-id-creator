import React, { useEffect, useRef, useState } from "react"

export default function InFeedAd() {
    const initialized = useRef(false)
    const insRef = useRef<HTMLModElement>(null)
    const [insHeight, setInsHeight] = useState(0)

    useEffect(() => {
        if (!insRef.current) return
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect
                if (!initialized.current && width > 0) {
                    initialized.current = true
                    try {
                        (window.adsbygoogle = window.adsbygoogle || []).push({})
                    } catch (err) { console.log(err) }
                }
                setInsHeight(height)
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
                style={{ display: "block", textAlign: "center", width: "100%" }}
                data-ad-layout="in-article"
                data-ad-format="fluid"
                data-ad-client="ca-pub-2161757435040376"
                data-ad-slot="7048903589"
            />
        </div>
    )
}