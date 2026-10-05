export const assetPaths = {
    skillFrame: (affinity: string, frame: string) =>
        affinity === "None" ? "/Images/skill-frame/NoneFrame.webp" : `/Images/skill-frame/${affinity}${frame}.webp`,
    affinityBig: (affinity: string) => `/Images/sin-affinity/affinity_${affinity}_big.webp`,
    coin: {
        normal: "/Images/Coin.webp",
        unbreakable: "/Images/Unbreakable_Coin.webp",
        excision: "/Images/Excision_Coin.webp",
    },
} as const
