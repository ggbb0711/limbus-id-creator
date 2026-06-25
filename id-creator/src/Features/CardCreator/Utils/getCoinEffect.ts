export type CoinEffect =
    | { type: "normal" }
    | { type: "unbreakable" }
    | { type: "excision" }
    | {
        type: "custom",
        name: string,
        color: string,
        imageSrc: string,
    }

function hasCoinEffect(skillEffect: string, value: string): boolean {
    return skillEffect.includes(`data-custom-coin-effect="${value}"`)
        || skillEffect.includes(`data-custom-coin-effect='${value}'`)
}

function getCustomCoinEffect(skillEffect: string, coinNo: number): CoinEffect | null {
    if (typeof DOMParser === "undefined") return null

    const parser = new DOMParser()
    const doc = parser.parseFromString(skillEffect, "text/html")
    const customCoinElement = doc.querySelector(`[data-custom-coin-effect^="coin-effect-${coinNo}-custom-"]`)

    if (!customCoinElement) return null

    const image = customCoinElement.querySelector("img.status-icon")
    return {
        type: "custom",
        name: customCoinElement.textContent ?? "",
        color: (customCoinElement as HTMLElement).style.color,
        imageSrc: image?.getAttribute("src") ?? "",
    }
}

export function getCoinEffect(skillEffect: string, coinNo: number): CoinEffect {
    if (hasCoinEffect(skillEffect, `coin-effect-${coinNo}-unbreakable`)) return { type: "unbreakable" }
    if (hasCoinEffect(skillEffect, `coin-effect-${coinNo}-excision`)) return { type: "excision" }

    return getCustomCoinEffect(skillEffect, coinNo) ?? { type: "normal" }
}
