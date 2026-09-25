import { useEffect, useCallback } from 'react'
import { useForm, UseFormReturn, Path, UseFormRegisterReturn, FieldErrors } from 'react-hook-form'
import { useCardMode } from 'features/cardCreator/contexts/CardModeContext'
import { useAppDispatch, useAppSelector } from 'stores/AppStore'
import { useStatusEffect } from './useStatusEffect'
import { deleteIdInfoSkill, updateIdInfoSkill, changeIdInfoSkillType } from 'features/cardCreator/stores/IdInfoSlice'
import { deleteEgoInfoSkill, updateEgoInfoSkill, changeEgoInfoSkillType } from 'features/cardCreator/stores/EgoInfoSlice'
import { SkillDetail } from 'features/cardCreator/types/SkillDetail'
import { OffenseSkill } from 'features/cardCreator/types/skills/offenseSkill/IOffenseSkill'
import { DefenseSkill } from 'features/cardCreator/types/skills/defenseSkill/IDefenseSkill'
import { PassiveSkill } from 'features/cardCreator/types/skills/passiveSkill/IPassiveSkill'
import { CustomEffect } from 'features/cardCreator/types/skills/customEffect/ICustomEffect'
import { MentalEffect } from 'features/cardCreator/types/skills/mentalEffect/IMentalEffect'

function createSkillByType(newType: string): SkillDetail {
    switch (newType) {
        case "OffenseSkill": return new OffenseSkill()
        case "DefenseSkill": return new DefenseSkill()
        case "PassiveSkill": return new PassiveSkill()
        case "CustomEffect": return new CustomEffect()
        case "MentalEffect": return new MentalEffect()
        default: return new OffenseSkill()
    }
}

interface UseSkillFormReturn<T extends SkillDetail> extends UseFormReturn<T> {
    deleteSkill: () => void
    changeSkillType: (newType: string) => void
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

    const changeSkillType = (newType: string) => {
        const newSkill = createSkillByType(newType)
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
