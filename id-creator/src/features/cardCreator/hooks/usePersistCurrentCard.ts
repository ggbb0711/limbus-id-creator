import { useEffect, useState } from "react"
import { appConfig } from "config/env.client"
import { CardEditorDefinition } from "features/cardCreator/editors/CardEditorDefinition"
import { setSettingMenuSaveMode } from "features/cardCreator/stores/SettingMenuSlice"
import { CURRENT_CARD_KEY, currentCardTable } from "features/cardCreator/utils/save/indexDB"
import { safeDb } from "features/cardCreator/utils/save/safeDb"
import { useAppDispatch, useAppSelector } from "stores/AppStore"

export function usePersistCurrentCard(editor: CardEditorDefinition): boolean {
    const dispatch = useAppDispatch()
    const value = useAppSelector(editor.selectInfo)
    const { saveMode } = editor
    const [isRestored, setIsRestored] = useState(false)

    useEffect(() => {
        let cancelled = false
        setIsRestored(false)
        safeDb(() => currentCardTable(saveMode).get(CURRENT_CARD_KEY), "restoreCurrentCard").then(result => {
            if (cancelled) return
            if (result.ok && result.data) dispatch(editor.load(result.data))
            dispatch(setSettingMenuSaveMode(saveMode))
            setIsRestored(true)
        })
        return () => {
            cancelled = true
        }
    }, [dispatch, editor, saveMode])

    useEffect(() => {
        if (!isRestored) return
        const timer = setTimeout(() => {
            safeDb(() => currentCardTable(saveMode).put({ ...value, localSaveId: CURRENT_CARD_KEY }), "autosaveCurrentCard")
        }, appConfig.timing.autosaveDebounceMs)
        return () => clearTimeout(timer)
    }, [isRestored, value, saveMode])

    return isRestored
}
