import { useEffect } from 'react'
import { useForm, UseFormReturn, FieldErrors, DefaultValues } from 'react-hook-form'
import { useAppDispatch } from 'stores/AppStore'
import { useStatusEffect } from './useStatusEffect'
import { useCardActions, useCardSelector } from './useCardInfo'
import { RegisterNumber, useNumberRegister } from './useNumberRegister'
import { SkillDetail } from 'features/cardCreator/types/SkillDetail'
import { SkillActionsProps } from 'features/cardCreator/types/SkillActions'
import { useSkillActions } from './useSkillActions'

interface UseSkillFormReturn<T extends SkillDetail> extends UseFormReturn<T> {
    actions: SkillActionsProps
    registerNumber: RegisterNumber<T>
    errors: FieldErrors<T>
    skill: T
    keyWordList: { [key: string]: string }
}

export function useSkillForm<T extends SkillDetail>(index: number): UseSkillFormReturn<T> {
    const dispatch = useAppDispatch()
    const { updateSkill } = useCardActions()
    const { actionsFor } = useSkillActions()

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

    const actions = actionsFor(index)

    const registerNumber = useNumberRegister(form)

    const { errors } = form.formState

    return { ...form, actions, registerNumber, errors, skill, keyWordList }
}
