import { Dispatch, SetStateAction, useCallback } from "react"
import { useAppDispatch } from "stores/AppStore"
import { reorderSkills } from "features/cardCreator/utils/card/reorderSkills"
import { useCardActions, useCardSelector } from "./useCardInfo"

export function useMoveSkill(changeActiveTab: Dispatch<SetStateAction<number>>) {
    const dispatch = useAppDispatch()
    const skillDetails = useCardSelector(info => info.skillDetails)
    const { moveSkill } = useCardActions()

    return useCallback((fromId: string, toId: string) => {
        const result = reorderSkills(skillDetails, fromId, toId)
        if (!result) return
        changeActiveTab(i => i > -2 ? result.newIndex : i)
        dispatch(moveSkill({ fromId, toId }))
    }, [skillDetails, changeActiveTab, dispatch, moveSkill])
}
