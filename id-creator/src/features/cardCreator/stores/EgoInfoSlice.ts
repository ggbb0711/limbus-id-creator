import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IEgoInfo, createEgoInfo } from 'features/cardCreator/types/IEgoInfo'
import { SkillDetail } from 'features/cardCreator/types/SkillDetail'
import { migrateSkill } from 'features/cardCreator/skills/skillData'

interface EgoInfoState {
    value: IEgoInfo
}

function hydrateSkills(info: IEgoInfo): IEgoInfo {
    return { ...info, skillDetails: info.skillDetails.map(migrateSkill) }
}

function fixBackwardCompatPaths(info: IEgoInfo): IEgoInfo {
    const fixed = { ...info }
    const oldSinnerIconPath = fixed.sinnerIcon.startsWith("Images")
    const sinnerIconPng = (fixed.sinnerIcon.startsWith("Images") || fixed.sinnerIcon.startsWith("/Images")) && fixed.sinnerIcon.endsWith(".png")

    if (oldSinnerIconPath) fixed.sinnerIcon = "/" + fixed.sinnerIcon
    if (sinnerIconPng) fixed.sinnerIcon = fixed.sinnerIcon.replace(/\.png$/, ".webp")

    return fixed
}

const initialState: EgoInfoState = {
    value: createEgoInfo(),
}

const EgoInfoSlice = createSlice({
    name: 'egoInfo',
    initialState,
    reducers: {
        setEgoInfo(state, action: PayloadAction<IEgoInfo>) {
            state.value = fixBackwardCompatPaths(hydrateSkills(action.payload))
        },
        updateEgoInfoField(state, action: PayloadAction<{ field: string, value: any }>) {
            (state.value as any)[action.payload.field] = action.payload.value
        },
        resetEgoInfo(state) {
            state.value = createEgoInfo()
        },
        setEgoInfoSkillDetails(state, action: PayloadAction<IEgoInfo['skillDetails']>) {
            state.value.skillDetails = action.payload
        },
        addEgoInfoSkill(state, action: PayloadAction<SkillDetail>) {
            if (state.value.skillDetails.length < 40)
                state.value.skillDetails.push(action.payload)
        },
        deleteEgoInfoSkill(state, action: PayloadAction<string>) {
            state.value.skillDetails = state.value.skillDetails.filter(s => s.inputId !== action.payload)
        },
        updateEgoInfoSkill(state, action: PayloadAction<{ index: number, skill: SkillDetail }>) {
            state.value.skillDetails[action.payload.index] = action.payload.skill
        },
        changeEgoInfoSkillType(state, action: PayloadAction<{ index: number, skill: SkillDetail }>) {
            state.value.skillDetails[action.payload.index] = action.payload.skill
        },
    },
})

export const {
    setEgoInfo,
    updateEgoInfoField,
    resetEgoInfo,
    setEgoInfoSkillDetails,
    addEgoInfoSkill,
    deleteEgoInfoSkill,
    updateEgoInfoSkill,
    changeEgoInfoSkillType,
} = EgoInfoSlice.actions

export const EgoInfoReducer = EgoInfoSlice.reducer
