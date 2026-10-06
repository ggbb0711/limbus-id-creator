import { PayloadAction, UnknownAction } from "@reduxjs/toolkit"
import { ICardInfoBase } from "features/cardCreator/types/ICardInfoBase"
import { SkillDetail } from "features/cardCreator/types/SkillDetail"
import { reorderSkills } from "features/cardCreator/utils/card/reorderSkills"

export interface CardState<T> {
    value: T
    loadId: number
}

export interface CardLimits {
    maxSkills: number
}

export type CardField<T> = Exclude<keyof T, "skillDetails">

export interface FieldUpdate<T> {
    field: CardField<T>
    value: T[CardField<T>]
}

export const createCardState = <T>(value: T): CardState<T> => ({ value, loadId: 0 })

export interface SkillActions {
    addSkill(skill: SkillDetail): UnknownAction
    updateSkill(payload: { index: number, skill: SkillDetail }): UnknownAction
    deleteSkill(inputId: string): UnknownAction
    moveSkill(payload: { fromId: string, toId: string }): UnknownAction
}

export interface CardSliceActions<T> extends SkillActions {
    loadInfo(info: T): UnknownAction
    setInfo(info: T): UnknownAction
    resetInfo(): UnknownAction
    updateField<K extends CardField<T>>(field: K, value: T[K]): UnknownAction
}

export function createCardReducers<T extends ICardInfoBase>(createDefault: () => T, { maxSkills }: CardLimits) {
    return {
        loadInfo(state: CardState<T>, action: PayloadAction<T>) {
            state.value = action.payload
            state.loadId += 1
        },
        setInfo(state: CardState<T>, action: PayloadAction<T>) {
            state.value = action.payload
        },
        resetInfo(state: CardState<T>) {
            state.value = createDefault()
            state.loadId += 1
        },
        updateField: {
            reducer(state: CardState<T>, action: PayloadAction<FieldUpdate<T>>) {
                state.value[action.payload.field] = action.payload.value
            },
            prepare<K extends CardField<T>>(field: K, value: T[K]) {
                return { payload: { field, value } as FieldUpdate<T> }
            },
        },
        addSkill(state: CardState<T>, action: PayloadAction<SkillDetail>) {
            if (state.value.skillDetails.length < maxSkills) state.value.skillDetails.push(action.payload)
        },
        updateSkill(state: CardState<T>, action: PayloadAction<{ index: number; skill: SkillDetail }>) {
            state.value.skillDetails[action.payload.index] = action.payload.skill
        },
        deleteSkill(state: CardState<T>, action: PayloadAction<string>) {
            state.value.skillDetails = state.value.skillDetails.filter(skill => skill.inputId !== action.payload)
        },
        moveSkill(state: CardState<T>, action: PayloadAction<{ fromId: string; toId: string }>) {
            const result = reorderSkills(state.value.skillDetails, action.payload.fromId, action.payload.toId)
            if (result) state.value.skillDetails = result.list
        },
    }
}
