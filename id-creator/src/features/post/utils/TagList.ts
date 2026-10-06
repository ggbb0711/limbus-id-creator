
export interface ITag{
    icon:string,
    tagName:string
}

export const TagList={
    "Yi_Sang":{
        icon:"/Images/sinner-icon/Yi_Sang_Icon.webp",
        tagName:"Yi Sang"
    },
    "Faust":{
        icon:"/Images/sinner-icon/Faust_Icon.webp",
        tagName:"Faust"
    },
    "Don_Quixote":{
        icon:"/Images/sinner-icon/Don_Quixote_Icon.webp",
        tagName:"Don Quixote"
    },
    "Ryoshu":{
        icon:"/Images/sinner-icon/Ryoshu_Icon.webp",
        tagName:"Ryoshu"
    },
    "Meursault":{
        icon:"/Images/sinner-icon/Meursault_Icon.webp",
        tagName:"Meursault"
    },
    "Hong_Lu":{
        icon:"/Images/sinner-icon/Hong_Lu_Icon.webp",
        tagName:"Hong Lu"
    },
    "Heathcliff":{
        icon:"/Images/sinner-icon/Heathcliff_Icon.webp",
        tagName:"Heathcliff"
    },
    "Ishmael":{
        icon:"/Images/sinner-icon/Ishmael_Icon.webp",
        tagName:"Ishmael"
    },
    "Sinclair":{
        icon:"/Images/sinner-icon/Sinclair_Icon.webp",
        tagName:"Sinclair"
    },
    "Rodion":{
        icon:"/Images/sinner-icon/Rodion_Icon.webp",
        tagName:"Rodion"
    },
    "Outis":{
        icon:"/Images/sinner-icon/Outis_Icon.webp",
        tagName:"Outis"
    },
    "Gregor":{
        icon:"/Images/sinner-icon/Gregor_Icon.webp",
        tagName:"Gregor"
    },
    "Charge":{
        icon:"/Images/status-effect/Charge.webp",
        tagName:"Charge"
    },
    "Bleed":{
        icon:"/Images/status-effect/Bleed.webp",
        tagName:"Bleed"
    },
    "Burn":{
        icon:"/Images/status-effect/Burn.webp",
        tagName:"Burn"
    },
    "Tremor":{
        icon:"/Images/status-effect/Tremor.webp",
        tagName:"Tremor"
    },
    "Sinking":{
        icon:"/Images/status-effect/Sinking.webp",
        tagName:"Sinking"
    },
    "Rupture":{
        icon:"/Images/status-effect/Rupture.webp",
        tagName:"Rupture"
    },
    "Poise":{
        icon:"/Images/status-effect/Poise.webp",
        tagName:"Poise"
    },
    "Identity":{
        icon: "",
        tagName: "Identity"
    },
    "Ego":{
        icon:"",
        tagName: "Ego"
    }
} as const satisfies Record<string, ITag>

export type TagKey = keyof typeof TagList

export const TAG_KEYS = Object.keys(TagList) as TagKey[]

export const isTagKey = (key: unknown): key is TagKey => typeof key === "string" && Object.hasOwn(TagList, key)

export const getTag = (key: string): ITag | undefined => (isTagKey(key) ? TagList[key] : undefined)

export const tagKeyOf = (tag: ITag | undefined): TagKey | undefined =>
    tag ? TAG_KEYS.find(key => TagList[key].tagName === tag.tagName) : undefined

export const filterTags = (text: string): ITag[] => {
    const search = text.trim().replaceAll(" ", "_").toLowerCase()
    return TAG_KEYS.filter(key => key.toLowerCase().includes(search)).map(key => TagList[key])
}
