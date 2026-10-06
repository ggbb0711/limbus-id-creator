import { useEffect } from 'react'
import { useForm, UseFormReturn, FieldErrors, DefaultValues } from 'react-hook-form'
import { useAppDispatch } from 'stores/AppStore'
import { useStatusEffect } from './useStatusEffect'
import { useCardActions, useCardSelector } from './useCardInfo'
import { RegisterNumber, useNumberRegister } from './useNumberRegister'
import { SkillDetail } from 'features/cardCreator/types/SkillDetail'
import { SkillType } from 'features/cardCreator/types/SkillTypes'
import { getSkillData } from 'features/cardCreator/skills/skillData'

interface UseSkillFormReturn<T extends SkillDetail> extends UseFormReturn<T> {
    deleteSkill: () => void
    changeSkillType: (newType: SkillType) => void
    registerNumber: RegisterNumber<T>
    errors: FieldErrors<T>
    skill: T
    keyWordList: { [key: string]: string }
}

export function useSkillForm<T extends SkillDetail>(index: number): UseSkillFormReturn<T> {
    const dispatch = useAppDispatch()
    const { updateSkill, deleteSkill: deleteSkillAction } = useCardActions()

    const skill = useCardSelector(info => info.skillDetails[index]) as T

    const keyWordList = useStatusEffect()

    const form = useForm<T>({ defaultValues: structuredClone(skill) as DefaultValues<T>, mode: "onChange" })

    useEffect(() => { form.reset(structuredClone(skill) as DefaultValues<T>) }, [skill.inputId])

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

    const registerNumber = useNumberRegister(form)

    const { errors } = form.formState

    return { ...form, deleteSkill, changeSkillType, registerNumber, errors, skill, keyWordList }
}
