import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IEgoInfo, createEgoInfo } from 'features/cardCreator/types/IEgoInfo'
import { createPassiveSkill } from 'features/cardCreator/types/skills/passiveSkill/IPassiveSkill'
import { SkillDetail } from 'features/cardCreator/types/SkillDetail'
import { createCustomEffect } from 'features/cardCreator/types/skills/customEffect/ICustomEffect'
import { createDefenseSkill } from 'features/cardCreator/types/skills/defenseSkill/IDefenseSkill'

interface EgoInfoState {
    value: IEgoInfo
}

function hydratePassiveSkills(info: IEgoInfo): IEgoInfo {
    const hydrated = { ...info }
    hydrated.skillDetails = hydrated.skillDetails.map(skill => {
        if (skill.type === "PassiveSkill") {
            return { ...createPassiveSkill(), ...skill }
        }
        return skill
    })
    return hydrated
}

function hydrateCustomEffects(info: IEgoInfo): IEgoInfo {
    const hydrated = { ...info }
    hydrated.skillDetails = hydrated.skillDetails.map(skill => {
        if (skill.type === "CustomEffect") {
            return { ...createCustomEffect(), ...skill }
        }
        return skill
    })
    return hydrated
}

function hydrateDefenseSkills(info: IEgoInfo): IEgoInfo {
    const hydrated = { ...info }
    hydrated.skillDetails = hydrated.skillDetails.map(skill => {
        if (skill.type === "DefenseSkill") {
            return { ...createDefenseSkill(), ...skill }
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

const initialState: EgoInfoState = {
    value: createEgoInfo(),
}

const EgoInfoSlice = createSlice({
    name: 'egoInfo',
    initialState,
    reducers: {
        setEgoInfo(state, action: PayloadAction<IEgoInfo>) {
            state.value = fixBackwardCompatPaths(hydrateSkillFrames(hydrateDefenseSkills(hydrateCustomEffects(hydratePassiveSkills(action.payload)))))
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
