import { useMemo } from "react"
import { useAppDispatch } from "stores/AppStore"
import { reorderSkills } from "features/cardCreator/utils/card/reorderSkills"
import { getSkillData } from "features/cardCreator/skills/skillData"
import { SkillDetail } from "features/cardCreator/types/SkillDetail"
import { SkillType } from "features/cardCreator/types/SkillTypes"
import { MoveDirection, SkillActionsProps } from "features/cardCreator/types/SkillActions"
import { useSetActiveTab } from "features/cardCreator/contexts/ActiveTabContext"
import { useCardActions, useCardSelector } from "./useCardInfo"

export interface SkillActions {
    moveSkill: (fromId: string, toId: string) => void
    moveSkillBy: (id: string, direction: MoveDirection) => void
    deleteSkill: (id: string) => void
    changeSkillType: (id: string, type: SkillType) => void
    actionsFor: (index: number) => SkillActionsProps
}

export function useSkillActions(): SkillActions {
    const dispatch = useAppDispatch()
    const setActiveTab = useSetActiveTab()
    const skillDetails = useCardSelector(info => info.skillDetails)
    const { moveSkill: moveAction, deleteSkill: deleteAction, updateSkill } = useCardActions()

    return useMemo(() => {
        const followOpenSkill = (next: readonly SkillDetail[]) => setActiveTab(current => {
            const openId = skillDetails[current]?.inputId
            if (openId === undefined) return current
            const index = next.findIndex(skill => skill.inputId === openId)
            return index >= 0 ? index : Math.min(current, next.length - 1)
        })

        const moveSkill = (fromId: string, toId: string) => {
            const result = reorderSkills(skillDetails, fromId, toId)
            if (!result) return
            followOpenSkill(result.list)
            dispatch(moveAction({ fromId, toId }))
        }

        const moveSkillBy = (id: string, direction: MoveDirection) => {
            const index = skillDetails.findIndex(skill => skill.inputId === id)
            const neighbor = index < 0 ? undefined : skillDetails[index + direction]
            if (neighbor) moveSkill(id, neighbor.inputId)
        }

        const deleteSkill = (id: string) => {
            const next = skillDetails.filter(skill => skill.inputId !== id)
            if (next.length === skillDetails.length) return
            followOpenSkill(next)
            dispatch(deleteAction(id))
        }

        const changeSkillType = (id: string, type: SkillType) => {
            const index = skillDetails.findIndex(skill => skill.inputId === id)
            if (index >= 0) dispatch(updateSkill({ index, skill: getSkillData(type).create() }))
        }

        const actionsFor = (index: number): SkillActionsProps => {
            const id = skillDetails[index].inputId
            return {
                type: skillDetails[index].type,
                canMoveUp: index > 0,
                canMoveDown: index < skillDetails.length - 1,
                onChangeType: type => changeSkillType(id, type),
                onMove: direction => moveSkillBy(id, direction),
                onDelete: () => deleteSkill(id),
            }
        }

        return { moveSkill, moveSkillBy, deleteSkill, changeSkillType, actionsFor }
    }, [skillDetails, setActiveTab, dispatch, moveAction, deleteAction, updateSkill])
}
