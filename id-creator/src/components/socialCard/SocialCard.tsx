import React, { ReactElement, ReactNode } from "react"
import { SOCIAL_CARD_COLORS, SOCIAL_CARD_SIZE } from "./socialCardUtils"

const colors = SOCIAL_CARD_COLORS

export function SocialCardFrame({ siteIcon, children }: { siteIcon: string | null, children: ReactNode }): ReactElement {
    return <div style={{
        width: SOCIAL_CARD_SIZE.width,
        height: SOCIAL_CARD_SIZE.height,
        display: "flex",
        flexDirection: "column",
        background: colors.background,
        color: colors.text,
        border: `12px solid ${colors.panel}`,
        padding: 40,
        fontSize: 32,
    }}>
        <div style={{ display: "flex", flex: 1, gap: 40 }}>
            {children}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24, color: colors.muted, fontSize: 28 }}>
            {siteIcon && <img src={siteIcon} width={48} height={48} alt="" />}
            <span>Limbus ID Creator</span>
        </div>
    </div>
}

export function SocialCardImage({ src, width, height, round = false }: { src: string, width: number, height: number, round?: boolean }): ReactElement {
    return <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width,
        height,
        background: colors.panel,
        border: `4px solid ${colors.border}`,
        borderRadius: round ? width : 8,
        overflow: "hidden",
    }}>
        <img src={src} width={width} height={height} alt="" style={{ objectFit: round ? "cover" : "contain" }} />
    </div>
}

export function SocialCardChips({ items }: { items: string[] }): ReactElement | null {
    if (items.length === 0) return null
    return <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {items.map(item => <span key={item} style={{
            display: "flex",
            padding: "6px 16px",
            border: `2px solid ${colors.border}`,
            borderRadius: 999,
            fontSize: 24,
        }}>{item}</span>)}
    </div>
}
