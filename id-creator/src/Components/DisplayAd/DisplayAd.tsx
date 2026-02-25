import React, { useEffect, useRef } from "react"
import "./DisplayAd.css"

declare global {
    interface Window {
        adsbygoogle: any[]
    }
}

export default function DisplayAd() {
    const initialized = useRef(false)

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch (err) { console.log(err) }
    }, [])

    return (
        <div className="display-ad">
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-2161757435040376"
                data-ad-slot="7945609324"
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    )
}
