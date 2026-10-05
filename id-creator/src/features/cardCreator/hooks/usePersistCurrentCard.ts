import { useEffect, useState } from "react"
import { appConfig } from "config/env.client"
import { CardMode, toSaveMode } from "features/cardCreator/contexts/CardModeContext"
import { selectCard } from "features/cardCreator/hooks/useCardInfo"
import { loadCard } from "features/cardCreator/stores/cardActions"
import { setSettingMenuSaveMode } from "features/cardCreator/stores/SettingMenuSlice"
import { CURRENT_CARD_KEY, currentCardTable } from "features/cardCreator/utils/save/indexDB"
import { safeDb } from "features/cardCreator/utils/save/safeDb"
import { useAppDispatch, useAppSelector } from "stores/AppStore"

export function usePersistCurrentCard(mode: CardMode): boolean {
    const dispatch = useAppDispatch()
    const value = useAppSelector(state => selectCard(state, mode))
    const saveMode = toSaveMode(mode)
    const [isRestored, setIsRestored] = useState(false)

    useEffect(() => {
        let cancelled = false
        setIsRestored(false)
        safeDb(() => currentCardTable(saveMode).get(CURRENT_CARD_KEY), "restoreCurrentCard").then(result => {
            if (cancelled) return
            if (result.ok && result.data) dispatch(loadCard(mode, result.data))
            dispatch(setSettingMenuSaveMode(saveMode))
            setIsRestored(true)
        })
        return () => {
            cancelled = true
        }
    }, [dispatch, mode, saveMode])

    useEffect(() => {
        if (!isRestored) return
        const timer = setTimeout(() => {
            safeDb(() => currentCardTable(saveMode).put({ ...value, localSaveId: CURRENT_CARD_KEY }), "autosaveCurrentCard")
        }, appConfig.timing.autosaveDebounceMs)
        return () => clearTimeout(timer)
    }, [isRestored, value, saveMode])

    return isRestored
}
