export interface ColorPreset {
    label:string,
    cssVar:string
}

export interface ColorPresetGroup {
    title:string,
    presets:ColorPreset[]
}

export const SINNER_COLOR_GROUP:ColorPresetGroup = {
    title:"Sinner colors",
    presets:[
        {label:"Yi Sang",cssVar:"--Yi-Sang-color"},
        {label:"Faust",cssVar:"--Faust-color"},
        {label:"Don Quixote",cssVar:"--Don-color"},
        {label:"Ryōshū",cssVar:"--Ryōshū-color"},
        {label:"Meursault",cssVar:"--Meursault-color"},
        {label:"Hong Lu",cssVar:"--Hong-Lu-color"},
        {label:"Heathcliff",cssVar:"--Heathcliff-color"},
        {label:"Ishmael",cssVar:"--Ishmael-color"},
        {label:"Rodion",cssVar:"--Rodya-color"},
        {label:"Sinclair",cssVar:"--Sinclair-color"},
        {label:"Outis",cssVar:"--Outis-color"},
        {label:"Gregor",cssVar:"--Gregor-color"},
    ],
}

export const SIN_COLOR_GROUP:ColorPresetGroup = {
    title:"Sin colors",
    presets:[
        {label:"Wrath",cssVar:"--Wrath"},
        {label:"Lust",cssVar:"--Lust"},
        {label:"Sloth",cssVar:"--Sloth"},
        {label:"Gluttony",cssVar:"--Gluttony"},
        {label:"Gloom",cssVar:"--Gloom"},
        {label:"Envy",cssVar:"--Envy"},
        {label:"Pride",cssVar:"--Pride"},
    ],
}

export const KEYWORD_COLOR_GROUP:ColorPresetGroup = {
    title:"Keyword colors",
    presets:[
        {label:"Neutral",cssVar:"--Neutral-color"},
        {label:"Buff",cssVar:"--Buff-color"},
        {label:"Debuff",cssVar:"--Debuff-color"},
    ],
}

export const STAT_PAGE_COLOR_GROUPS:ColorPresetGroup[] = [SINNER_COLOR_GROUP,SIN_COLOR_GROUP]

export const CUSTOM_EFFECT_COLOR_GROUPS:ColorPresetGroup[] = [KEYWORD_COLOR_GROUP]
