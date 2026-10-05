import { useEffect, useCallback } from 'react'
import { useForm, UseFormReturn, Path, UseFormRegisterReturn, FieldErrors } from 'react-hook-form'
import { useAppDispatch } from 'stores/AppStore'
import { useStatusEffect } from './useStatusEffect'
import { useCardActions, useCardSelector } from './useCardInfo'
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
    const dispatch = useAppDispatch()
    const { updateSkill, deleteSkill: deleteSkillAction } = useCardActions()

    const skill = useCardSelector(info => info.skillDetails[index]) as T

    const keyWordList = useStatusEffect()

    const form = useForm<T>({ defaultValues: structuredClone(skill) as any, mode: "onChange" })

    useEffect(() => { form.reset(structuredClone(skill) as any) }, [skill.inputId])

    useEffect(() => {
        const sub = form.watch((values) => {
            dispatch(updateSkill({ index, skill: structuredClone(values) as SkillDetail }))
        })
        return () => sub.unsubscribe()
    }, [form.watch, index, updateSkill, dispatch])

    const deleteSkill = () => dispatch(deleteSkillAction(skill.inputId))

    const changeSkillType = (newType: SkillType) => {
        dispatch(updateSkill({ index, skill: getSkillData(newType).create() }))
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
