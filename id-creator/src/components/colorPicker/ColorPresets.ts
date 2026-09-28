export interface ColorPreset {
    label:string,
    cssVar:string
}

export const SINNER_COLOR_PRESETS:ColorPreset[] = [
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
]

export const STATUS_EFFECT_COLOR_PRESETS:ColorPreset[] = [
    {label:"Neutral",cssVar:"--Neutral-color"},
    {label:"Buff",cssVar:"--Buff-color"},
    {label:"Debuff",cssVar:"--Debuff-color"},
]
