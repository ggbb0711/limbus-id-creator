'use client'
import React, { useEffect, useRef, useSyncExternalStore } from "react";
import { ADCASH_BANNER_ZONES, AdcashBannerSize, bannerDimensions } from "config/adcashZones";
import "./AdcashBanner.css";

export interface AdcashBannerVariant {
    minWidth: number
    size: AdcashBannerSize
}

interface AdcashBannerProps {
    variants: readonly AdcashBannerVariant[]
    className?: string
}

function pickVariant(variants: readonly AdcashBannerVariant[]): AdcashBannerSize | null {
    if (!("aclib" in window)) return null
    const match = variants.find(({ minWidth }) => window.matchMedia(`(min-width: ${minWidth}px)`).matches)
    return match?.size ?? null
}

const subscribeNever = () => () => {}

export default function AdcashBanner({ variants, className = "" }: AdcashBannerProps) {
    const size = useSyncExternalStore(subscribeNever, () => pickVariant(variants), () => null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!size || !container) return
        const script = document.createElement("script")
        script.type = "text/javascript"
        script.text = `aclib.runBanner({ zoneId: '${ADCASH_BANNER_ZONES[size]}' });`
        container.appendChild(script)
        return () => { container.replaceChildren() }
    }, [size])

    if (!size) return null

    const { width, height } = bannerDimensions(size)
    return (
        <aside className={`ad-slot ${className}`} aria-label="Advertisement">
            <span className="ad-slot-label">Advertisement</span>
            <div ref={containerRef} className="ad-slot-container" data-size={size} style={{ width, height }}/>
        </aside>
    )
}
