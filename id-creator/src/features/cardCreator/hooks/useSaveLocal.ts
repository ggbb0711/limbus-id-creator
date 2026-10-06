import { useCallback, useEffect, useMemo, useState } from "react"
import { CardEditorDefinition } from "features/cardCreator/editors/CardEditorDefinition"
import { CardInfo } from "features/cardCreator/types/CardInfo"
import { ISaveFile } from "features/cardCreator/types/ISaveFile"
import { savesTable } from "features/cardCreator/utils/save/indexDB"
import { migrateSaveFile } from "features/cardCreator/utils/save/migrateCardInfo"
import formatDateForBackend from "features/cardCreator/utils/save/formatDateForBackend"
import { safeDb } from "features/cardCreator/utils/save/safeDb"
import { useAddAlert } from "hooks/useAddAlert";

export type LocalSave = ISaveFile<CardInfo>

export default function useSaveLocal(editor: CardEditorDefinition) {
    const { saveMode } = editor
    const table = useMemo(() => savesTable(saveMode), [saveMode])
    const [saveData, setSaveData] = useState<LocalSave[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const addAlert = useAddAlert()
    const migrate = useCallback(
        (raw: unknown): LocalSave => migrateSaveFile(raw, editor.migrate),
        [editor]
    )

    const run = useCallback(async <T,>(operation: () => Promise<T>, context: string, failureMessage: string) => {
        setIsLoading(true)
        const result = await safeDb(operation, context)
        setIsLoading(false)
        if (!result.ok) addAlert("Failure", failureMessage)
        return result
    }, [addAlert])

    useEffect(() => {
        let cancelled = false
        safeDb(() => table.toArray(), "loadLocalSaves").then(result => {
            if (cancelled) return
            if (result.ok) setSaveData(result.data.map(migrate))
            else addAlert("Failure", "Could not read your local saves")
        })
        return () => {
            cancelled = true
        }
    }, [table, migrate, addAlert])

    const createSave = useCallback(async (save: LocalSave) => {
        const result = await run(() => table.add(save), "createLocalSave", "Could not create the save")
        if (result.ok) setSaveData(previous => [save, ...previous])
        return result.ok
    }, [run, table])

    const deleteSave = useCallback(async (id: string) => {
        const result = await run(() => table.delete(id), "deleteLocalSave", "Could not delete the save")
        if (result.ok) setSaveData(previous => previous.filter(save => save.id !== id))
        return result.ok
    }, [run, table])

    const changeSaveName = useCallback(async (id: string, name: string) => {
        const updateTime = formatDateForBackend(new Date())
        const result = await run(() => table.update(id, { name, updateTime }), "renameLocalSave", "Could not rename the save")
        if (result.ok) setSaveData(previous => previous.map(save => (save.id === id ? { ...save, name, updateTime } : save)))
        return result.ok
    }, [run, table])

    const overwriteSave = useCallback(async (id: string, saveInfo: CardInfo) => {
        const updateTime = formatDateForBackend(new Date())
        const result = await run(() => table.update(id, { saveInfo, updateTime }), "overwriteLocalSave", "Could not overwrite the save")
        if (result.ok) setSaveData(previous => previous.map(save => (save.id === id ? { ...save, saveInfo, updateTime } : save)))
        return result.ok
    }, [run, table])

    const loadSave = useCallback(async (id: string): Promise<LocalSave | null> => {
        const result = await run(() => table.get(id), "loadLocalSave", "Could not load the save")
        return result.ok && result.data ? migrate(result.data) : null
    }, [run, table, migrate])

    return { saveData, isLoading, createSave, deleteSave, changeSaveName, overwriteSave, loadSave }
}
