import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IIdInfo, createIdInfo } from 'features/cardCreator/types/IIdInfo'
import { SkillDetail } from 'features/cardCreator/types/SkillDetail'
import { migrateSkill } from 'features/cardCreator/skills/skillData'

interface IdInfoState {
    value: IIdInfo
}

function hydrateSkills(info: IIdInfo): IIdInfo {
    return { ...info, skillDetails: info.skillDetails.map(migrateSkill) }
}

function hydrateTraits(info: IIdInfo): IIdInfo {
    if (!Array.isArray(info.traits)) {
        return { ...info, traits: [] }
    }
    return info
}

function fixBackwardCompatPaths(info: IIdInfo): IIdInfo {
    const fixed = { ...info }
    const oldSinnerIconPath = fixed.sinnerIcon.startsWith("Images")
    const oldSinnerRarityPath = fixed.rarity.startsWith("Images")
    const sinnerIconPng = (fixed.sinnerIcon.startsWith("Images") || fixed.sinnerIcon.startsWith("/Images")) && fixed.sinnerIcon.endsWith(".png")
    const rarityPng = (fixed.rarity.startsWith("Images") || fixed.rarity.startsWith("/Images")) && fixed.rarity.endsWith(".png")

    if (oldSinnerIconPath) fixed.sinnerIcon = "/" + fixed.sinnerIcon
    if (oldSinnerRarityPath) fixed.rarity = "/" + fixed.rarity
    if (sinnerIconPng) fixed.sinnerIcon = fixed.sinnerIcon.replace(/\.png$/, ".webp")
    if (rarityPng) fixed.rarity = fixed.rarity.replace(/\.png$/, ".webp")

    return fixed
}

const initialState: IdInfoState = {
    value: createIdInfo(),
}

const IdInfoSlice = createSlice({
    name: 'idInfo',
    initialState,
    reducers: {
        setIdInfo(state, action: PayloadAction<IIdInfo>) {
            state.value = fixBackwardCompatPaths(hydrateTraits(hydrateSkills(action.payload)))
        },
        updateIdInfoField(state, action: PayloadAction<{ field: string, value: any }>) {
            (state.value as any)[action.payload.field] = action.payload.value
        },
        resetIdInfo(state) {
            state.value = createIdInfo()
        },
        setIdInfoSkillDetails(state, action: PayloadAction<IIdInfo['skillDetails']>) {
            state.value.skillDetails = action.payload
        },
        addIdInfoSkill(state, action: PayloadAction<SkillDetail>) {
            if (state.value.skillDetails.length < 40)
                state.value.skillDetails.push(action.payload)
        },
        deleteIdInfoSkill(state, action: PayloadAction<string>) {
            state.value.skillDetails = state.value.skillDetails.filter(s => s.inputId !== action.payload)
        },
        updateIdInfoSkill(state, action: PayloadAction<{ index: number, skill: SkillDetail }>) {
            state.value.skillDetails[action.payload.index] = action.payload.skill
        },
        changeIdInfoSkillType(state, action: PayloadAction<{ index: number, skill: SkillDetail }>) {
            state.value.skillDetails[action.payload.index] = action.payload.skill
        },
    },
})

export const {
    setIdInfo,
    updateIdInfoField,
    resetIdInfo,
    setIdInfoSkillDetails,
    addIdInfoSkill,
    deleteIdInfoSkill,
    updateIdInfoSkill,
    changeIdInfoSkillType,
} = IdInfoSlice.actions

export const IdInfoReducer = IdInfoSlice.reducer
