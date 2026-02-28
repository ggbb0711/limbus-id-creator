import React, { useEffect, useRef } from "react"

export default function InFeedAd() {
    const insRef = useRef<HTMLModElement>(null)
    const initialized = useRef(false)

    useEffect(() => {
        if (!insRef.current) return
        const el = insRef.current
        const observer = new ResizeObserver(() => {
            if (initialized.current || el.offsetWidth === 0) return
            initialized.current = true
            observer.disconnect()
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({})
            } catch (err) { console.log(err) }
        })
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <ins
            ref={insRef}
            className="adsbygoogle"
            style={{ display: "block", textAlign: "center" }}
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-client="ca-pub-2161757435040376"
            data-ad-slot="7048903589"
        />
    )
}
