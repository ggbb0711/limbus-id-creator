import React, { useEffect, useRef } from "react"

export default function InFeedAd() {
    const initialized = useRef(false)

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch (err) { console.log(err) }
    }, [])

    return (
        <ins
            className="adsbygoogle"
            style={{ display: "block", textAlign: "center" }}
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-client="ca-pub-2161757435040376"
            data-ad-slot="7048903589"
        />
    )
}
