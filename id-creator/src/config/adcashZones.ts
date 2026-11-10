export const ADCASH_BANNER_ZONES = {
    "728x90": "12429506",
    "468x60": "12431854",
    "300x100": "12431862",
    "300x250": "12431822",
    "336x280": "12431830",
    "250x250": "12431814",
    "160x600": "12431846",
    "120x600": "12431838",
} as const

export type AdcashBannerSize = keyof typeof ADCASH_BANNER_ZONES

export function bannerDimensions(size: AdcashBannerSize): { width: number, height: number } {
    const [width, height] = size.split("x").map(Number)
    return { width, height }
}
