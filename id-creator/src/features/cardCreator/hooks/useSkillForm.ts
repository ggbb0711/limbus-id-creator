import { useEffect, useCallback } from 'react'
import { useForm, UseFormReturn, Path, UseFormRegisterReturn, FieldErrors } from 'react-hook-form'
import { useCardMode } from 'features/cardCreator/contexts/CardModeContext'
import { useAppDispatch, useAppSelector } from 'stores/AppStore'
import { useStatusEffect } from './useStatusEffect'
import { deleteIdInfoSkill, updateIdInfoSkill, changeIdInfoSkillType } from 'features/cardCreator/stores/IdInfoSlice'
import { deleteEgoInfoSkill, updateEgoInfoSkill, changeEgoInfoSkillType } from 'features/cardCreator/stores/EgoInfoSlice'
import { SkillDetail } from 'features/cardCreator/types/SkillDetail'
import { SkillType } from 'features/cardCreator/types/SkillTypes'
import { getSkillData } from 'features/cardCreator/skills/skillData'

interface UseSkillFormReturn<T extends SkillDetail> extends UseFormReturn<T> {
    deleteSkill: () => void
    changeSkillType: (newType: SkillType) => void
    registerNumber: (name: Path<T>) => UseFormRegisterReturn
    errors: FieldErrors<T>
    skill: T
    keyWordList: { [key: string]: string }
}

export function useSkillForm<T extends SkillDetail>(index: number): UseSkillFormReturn<T> {
    const mode = useCardMode()
    const dispatch = useAppDispatch()

    const skill = useAppSelector(state =>
        mode === "id" ? state.idInfo.value.skillDetails[index] : state.egoInfo.value.skillDetails[index]
    ) as T

    const keyWordList = useStatusEffect()

    const form = useForm<T>({ defaultValues: structuredClone(skill) as any, mode: "onChange" })

    useEffect(() => { form.reset(structuredClone(skill) as any) }, [skill.inputId])

    useEffect(() => {
        const sub = form.watch((values) => {
            const action = mode === "id" ? updateIdInfoSkill : updateEgoInfoSkill
            dispatch(action({ index, skill: structuredClone(values) as SkillDetail }))
        })
        return () => sub.unsubscribe()
    }, [form.watch, index, mode])

    const deleteSkill = () => dispatch(
        mode === "id" ? deleteIdInfoSkill(skill.inputId) : deleteEgoInfoSkill(skill.inputId)
    )

    const changeSkillType = (newType: SkillType) => {
        const newSkill = getSkillData(newType).create()
        dispatch(
            mode === "id"
                ? changeIdInfoSkillType({ index, skill: newSkill })
                : changeEgoInfoSkillType({ index, skill: newSkill })
        )
    }

    const registerNumber = useCallback((name: Path<T>) => {
        const reg = form.register(name, {
            valueAsNumber: true,
        } as any)
        return {
            ...reg,
            onBlur: async (e: any) => {
                await reg.onBlur(e)
                if (isNaN(e.target.valueAsNumber) || e.target.value === '') {
                    form.setValue(name, 0 as any)
                }
            }
        }
    }, [form.register, form.setValue])

    const { errors } = form.formState

    return { ...form, deleteSkill, changeSkillType, registerNumber, errors, skill, keyWordList }
}
