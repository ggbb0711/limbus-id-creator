import { useCallback, useEffect, useMemo, useState } from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { CardEditorDefinition } from "features/cardCreator/editors/CardEditorDefinition"
import { CardInfo } from "features/cardCreator/types/CardInfo"
import { ISaveFile } from "features/cardCreator/types/ISaveFile"
import { savesTable } from "features/cardCreator/utils/save/indexDB"
import { migrateSaveFile } from "features/cardCreator/utils/save/migrateCardInfo"
import { safeDb } from "features/cardCreator/utils/save/safeDb"
import { useAddAlert } from "hooks/useAddAlert";

export type LocalSave = ISaveFile<CardInfo>

export default function useSaveLocal(editor: CardEditorDefinition) {
    const { saveMode } = editor
    const table = useMemo(() => savesTable(saveMode), [saveMode])
    const [pendingOperations, setPendingOperations] = useState(0)
    const addAlert = useAddAlert()
    const migrate = useCallback(
        (raw: unknown): LocalSave => migrateSaveFile(raw, editor.migrate),
        [editor]
    )

    const run = useCallback(async <T,>(operation: () => Promise<T>, context: string, failureMessage: string) => {
        setPendingOperations(count => count + 1)
        const result = await safeDb(operation, context)
        setPendingOperations(count => count - 1)
        if (!result.ok) addAlert("Failure", failureMessage)
        return result
    }, [addAlert])

    const stored = useLiveQuery(() => safeDb(() => table.toArray(), "loadLocalSaves"), [table])
    const saveData = useMemo(() => (stored?.ok ? stored.data.map(migrate) : []), [stored, migrate])
    const isLoading = stored === undefined || pendingOperations > 0

    useEffect(() => {
        if (stored && !stored.ok) addAlert("Failure", "Could not read your local saves")
    }, [stored, addAlert])

    const createSave = useCallback(async (save: LocalSave) => {
        return (await run(() => table.add(save), "createLocalSave", "Could not create the save")).ok
    }, [run, table])

    const deleteSave = useCallback(async (id: string) => {
        return (await run(() => table.delete(id), "deleteLocalSave", "Could not delete the save")).ok
    }, [run, table])

    const changeSaveName = useCallback(async (id: string, name: string) => {
        const updateTime = new Date().toISOString()
        return (await run(() => table.update(id, { name, updateTime }), "renameLocalSave", "Could not rename the save")).ok
    }, [run, table])

    const overwriteSave = useCallback(async (id: string, saveInfo: CardInfo) => {
        const updateTime = new Date().toISOString()
        return (await run(() => table.update(id, { saveInfo, updateTime }), "overwriteLocalSave", "Could not overwrite the save")).ok
    }, [run, table])

    const loadSave = useCallback(async (id: string): Promise<LocalSave | null> => {
        const result = await run(() => table.get(id), "loadLocalSave", "Could not load the save")
        return result.ok && result.data ? migrate(result.data) : null
    }, [run, table, migrate])

    return { saveData, isLoading, createSave, deleteSave, changeSaveName, overwriteSave, loadSave }
}
