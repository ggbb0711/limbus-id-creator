import { SINNER_DEFINITIONS, SinnerKey, sinnerIconSrc } from "features/cardCreator"

export interface ITag{
    icon:string,
    tagName:string
}

const SINNER_TAGS = Object.fromEntries(
    SINNER_DEFINITIONS.map(({ key, tagName }) => [key, { icon: sinnerIconSrc(key), tagName }])
) as Record<SinnerKey, ITag>

export const TagList={
    ...SINNER_TAGS,
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
