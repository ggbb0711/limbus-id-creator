import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IEgoInfo, EgoInfo } from 'Features/CardCreator/Types/IEgoInfo'
import { PassiveSkill } from 'Features/CardCreator/Types/Skills/PassiveSkill/IPassiveSkill'
import { SkillDetail } from 'Features/CardCreator/Types/SkillDetail'

interface EgoInfoState {
    value: IEgoInfo
}

function hydratePassiveSkills(info: IEgoInfo): IEgoInfo {
    const hydrated = { ...info }
    hydrated.skillDetails = hydrated.skillDetails.map(skill => {
        if (skill.type === "PassiveSkill") {
            return { ...new PassiveSkill(), ...skill }
        }
        return skill
    })
    return hydrated
}

function hydrateSkillFrames(info: IEgoInfo): IEgoInfo {
    const hydrated = { ...info }
    hydrated.skillDetails = hydrated.skillDetails.map(skill => {
        if ((skill.type === "OffenseSkill" || skill.type === "DefenseSkill") && !('skillFrame' in skill && skill.skillFrame)) {
            return { ...skill, skillFrame: "1" }
        }
        return skill
    })
    return hydrated
}

function fixBackwardCompatPaths(info: IEgoInfo): IEgoInfo {
    const fixed = { ...info }
    const oldSinnerIconPath = fixed.sinnerIcon.startsWith("Images")
    const sinnerIconPng = (fixed.sinnerIcon.startsWith("Images") || fixed.sinnerIcon.startsWith("/Images")) && fixed.sinnerIcon.endsWith(".png")

    if (oldSinnerIconPath) fixed.sinnerIcon = "/" + fixed.sinnerIcon
    if (sinnerIconPng) fixed.sinnerIcon = fixed.sinnerIcon.replace(/\.png$/, ".webp")

    return fixed
}

function toPlain(info: IEgoInfo): IEgoInfo {
    return JSON.parse(JSON.stringify(info))
}

const initialState: EgoInfoState = {
    value: toPlain(new EgoInfo()),
}

const EgoInfoSlice = createSlice({
    name: 'egoInfo',
    initialState,
    reducers: {
        setEgoInfo(state, action: PayloadAction<IEgoInfo>) {
            state.value = fixBackwardCompatPaths(hydrateSkillFrames(hydratePassiveSkills(action.payload)))
        },
        updateEgoInfoField(state, action: PayloadAction<{ field: string, value: any }>) {
            (state.value as any)[action.payload.field] = action.payload.value
        },
        resetEgoInfo(state) {
            state.value = toPlain(new EgoInfo())
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
